"use node";
import { ActionCtx } from "../_generated/server";
import { internal } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";
import { openai } from "@ai-sdk/openai";
import { createToolsForAgent } from "./tools";
import { generateText } from "ai";
import { ParticipantUserOrAgent } from "../conversationParticipants/model";
import { constructTriageInstructions } from "./instructions";
import {
  getTriageAgentAndEnsureItIsJoinedToConversation,
  runAgentAIGeneration,
  processAgentAIResult,
} from "./utils";
import { gatherMessages } from "./messages";
import { omit } from "convex-helpers";

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

  if (participant.kind !== "agent") {
    throw new Error(
      `Participant of id '${participant._id}' is not an agent, but is of kind '${participant.kind}'`,
    );
  }

  await runAgentAIGeneration(ctx, {
    agent,
    participant,
    conversation: args.conversation,
    generateAIResponse: async () => {
      const result = await generateText({
        model: openai("gpt-4o-mini"),
        tools: omit(
          createToolsForAgent({
            ctx,
            agent,
            agentParticipant: participant,
            conversation: args.conversation,
          }),
          ["messageAnotherAgent"], // I want the triage agent to reply to the text rather than use the tool
        ),
        maxSteps: 5,
        messages: await gatherMessages(ctx, {
          systemMessage: constructTriageInstructions({
            conversation: args.conversation,
            message: args.message,
            messageAuthor: args.messageAuthor,
            agent,
            participant,
          }),
          conversation: args.conversation,
          message: args.message,
          messageAuthor: args.messageAuthor,
        }),
      });

      await processAgentAIResult(ctx, {
        result,
        agent,
        conversation: args.conversation,
        participant,
        sendMessage: async (text) => {
          await ctx.runMutation(
            internal.conversationMessages.private.sendFromTriageAgent,
            {
              conversationId: args.conversation._id,
              content: text,
            },
          );
        },
      });

      return result;
    },
  });
};
