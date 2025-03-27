"use node";
import { ActionCtx } from "../_generated/server";
import * as Agents from "../agents/model";
import { internal } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";
import { openai } from "@ai-sdk/openai";
import { createTools } from "./tools";
import { z } from "zod";
import { omit, pick } from "convex-helpers";
import { CoreMessage, generateText } from "ai";
import { isNotNullOrUndefined } from "../../shared/filter";
import { ParticipantUserOrAgent } from "../conversationParticipants/model";
import { constructTriageInstructions } from "./instructions";
import { getMessageHistory } from "./history";
import { getTriageAgentAndEnsureItIsJoinedToConversation } from "./utils";

export const triageMessage = async (
  ctx: ActionCtx,
  args: {
    message: Doc<"conversationMessages">;
    messageAuthor: ParticipantUserOrAgent;
    conversation: Doc<"conversations">;
  },
) => {
  const { agent, participant } =
    await getTriageAgentAndEnsureItIsJoinedToConversation(
      ctx,
      args.conversation._id,
    );

  // Set the triage agent's status to thinking
  await ctx.runMutation(
    internal.conversationParticipants.private.updateParticipantStatus,
    {
      participantId: participant._id,
      status: "thinking",
    },
  );

  try {
    const messageHistory = await getMessageHistory(ctx, {
      conversationId: args.conversation._id,
      messageId: args.message._id,
      count: 10,
    });

    const tools = pick(
      createTools({
        ctx,
        agent,
        agentParticipant: participant,
        conversation: args.conversation,
      }),
      ["listAgents", "listConversationParticipants"],
    );

    const messages: CoreMessage[] = [
      {
        role: "system",
        content: constructTriageInstructions({
          conversation: args.conversation,
          message: args.message,
          messageAuthor: args.messageAuthor,
          agent,
          participant,
        }),
      },
      ...messageHistory,
    ];

    console.log(`Triage agent messages:`, messages);

    const result = await generateText({
      model: openai("gpt-4o"),
      tools,
      maxSteps: 3,
      messages,
    });

    console.log(`Triage agent result:`, result);

    await ctx.runMutation(
      internal.conversationMessages.private.sendFromTriageAgent,
      {
        conversationId: args.conversation._id,
        content: result.text,
      },
    );
  } catch (error) {
    console.error("When triaging message:", error);
    // Send error message to conversation
    await ctx.runMutation(
      internal.conversationMessages.private.sendSystemMessage,
      {
        conversationId: args.conversation._id,
        content: `Error occured while triaging message: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
    );
  } finally {
    // No longer thinking
    await ctx.runMutation(
      internal.conversationParticipants.private.updateParticipantStatus,
      {
        participantId: participant._id,
        status: "inactive",
      },
    );
  }
};
