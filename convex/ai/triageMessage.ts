"use node";
import { ActionCtx } from "../_generated/server";
import { internal } from "../_generated/api";
import { Doc } from "../_generated/dataModel";
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

export const triageMessage = async (
  ctx: ActionCtx,
  args: {
    message: Doc<"conversationMessages">;
    messageAuthor: ParticipantUserOrAgent;
    conversation: Doc<"conversations">;
  },
) => {
  const userId = args.messageAuthor.kind === "user" ? args.messageAuthor.user._id : undefined;
  const { agent, participant } =
    await getTriageAgentAndEnsureItIsJoinedToConversation(
      ctx,
      args.conversation._id,
      userId,
    );

  if (!agent) throw new Error("Triage agent not found");

  if (participant.kind !== "agent")
    throw new Error(
      `Participant of id '${(participant as any)._id}' is not an agent, but is of kind '${(participant as any).kind}'`,
    );

  await runAgentAIGeneration(ctx, {
    agent: agent,
    participant,
    conversation: args.conversation,
    generateAIResponse: async () => {
      const result = await generateText({
        model: openai("gpt-4o"),
        tools: await createToolsForAgent({
          ctx,
          agent: agent,
          agentParticipant: participant,
          conversation: args.conversation,
        }),
        maxSteps: 20,
        messages: await gatherMessages(ctx, {
          systemMessage: constructTriageInstructions({
            conversation: args.conversation,
            messageAuthor: args.messageAuthor,
            agent: agent,
          }),
          conversation: args.conversation,
          message: args.message,
          messageAuthor: args.messageAuthor,
        }),
      });

      await processAgentAIResult(ctx, {
        result,
        agent: agent,
        conversation: args.conversation,
        participant,
        sendMessage: async (text) => {
          await ctx.runMutation(
            internal.conversationMessages.internalMutations.sendFromTriageAgent,
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
