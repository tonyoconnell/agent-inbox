"use node";
import { createTool } from "@mastra/core";
import { z } from "zod";
import { ActionCtx } from "../_generated/server";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { sendSystemMessage } from "../conversationMessages/private";
import { listAgentsForUser } from "../agents/private";

export const createTools = (ctx: ActionCtx) => {
  const sendMessageToConversation = createTool({
    id: "send-message-to-conversation",
    description: "Allows sending of a message to a conversation",
    inputSchema: z.object({
      conversationId: z.string(),
      content: z.string(),
    }),
    outputSchema: z.object({}),
    execute: async ({ context }) => {
      console.log(`using tool: sendMessageToConversation`, context);

      const messageId = await ctx.runMutation(
        internal.conversationMessages.private.sendFromTriageAgent,
        {
          conversationId: context.conversationId as Id<"conversations">,
          content: context.content,
        },
      );

      return {
        result: "message_sent",
        messageId,
      };
    },
  });

  const listAgents = createTool({
    id: "list-agents",
    description: "Allows listing of all of a user's agents",
    inputSchema: z.object({
      conversationId: z.string(),
      userId: z.string(),
    }),
    outputSchema: z.object({
      agents: z.array(
        z.object({
          _id: z.string(),
          name: z.string(),
          description: z.string(),
          personality: z.string(),
          tools: z.array(z.string()),
        }),
      ),
    }),
    execute: async ({ context }) => {
      console.log(`using tool: listAgents`, context);

      const messageId = await ctx.runMutation(
        internal.conversationMessages.private.sendSystemMessage,
        {
          conversationId: context.conversationId as Id<"conversations">,
          content: `Searching for agents...`,
        },
      );

      const agents = await ctx.runQuery(
        internal.agents.private.listAgentsForUser,
        { userId: context.userId as Id<"users"> },
      );

      return {
        agents,
      };
    },
  });

  return {
    sendMessageToConversation,
    listAgents,
  };
};
