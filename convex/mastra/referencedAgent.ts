"use node";
import { ActionCtx } from "../_generated/server";
import { internal } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";
import { storage, memory } from "./mastra";
import { Mastra } from "@mastra/core/mastra";
import { createTools } from "./tools";
import { z } from "zod";
import {
  createMastraAgentFromAgent,
  getAgentAndEnsureItIsJoinedToConversation,
} from "./agents";

export const invokeAgent = async (
  ctx: ActionCtx,
  args: {
    message: Doc<"conversationMessages">;
    reference: { kind: "agent"; agentId: Id<"agents"> };
  },
) => {
  const { agent, participantId } =
    await getAgentAndEnsureItIsJoinedToConversation(ctx, {
      agentId: args.reference.agentId,
      conversationId: args.message.conversationId,
    });

  // Set the agent's status to thinking
  await ctx.runMutation(
    internal.conversationParticipants.private.updateParticipantStatus,
    {
      participantId,
      status: "thinking",
    },
  );

  try {
    const allTools = createTools(ctx);

    const messageHistory = await ctx.runQuery(
      internal.conversationMessages.private
        .listMessagesHistoryForAgentGeneration,
      { conversationId: args.message.conversationId, count: 10 },
    );

    const referencedAgent = createMastraAgentFromAgent({
      agent,
      participantId,
      messageHistory,
    });

    const mastra = new Mastra({
      agents: { referencedAgent },
      storage,
    });

    const result = await mastra.getAgent("referencedAgent").generate(
      [
        {
          role: "user",
          content: args.message.content,
        },
      ],
      {
        maxRetries: 1,
        output: z.object({
          messageContent: z.string(),
        }),
      },
    );

    console.log(`Referenced agent result:`, result);

    await ctx.runMutation(internal.conversationMessages.private.sendFromAgent, {
      conversationId: args.message.conversationId,
      agentId: agent._id,
      content: result.object.messageContent,
      author: participantId,
    });
  } catch (error: unknown) {
    console.error("Error in referenced agent:", error);
    // Send error message to conversation
    await ctx.runMutation(
      internal.conversationMessages.private.sendSystemMessage,
      {
        conversationId: args.message.conversationId,
        content: `Sorry, I encountered an error while processing your message: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
    );
  } finally {
    // No longer thinking
    await ctx.runMutation(
      internal.conversationParticipants.private.updateParticipantStatus,
      {
        participantId,
        status: "inactive",
      },
    );
  }
};
