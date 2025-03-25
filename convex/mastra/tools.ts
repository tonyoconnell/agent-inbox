"use node";
import { createTool } from "@mastra/core";
import { z } from "zod";
import { ActionCtx } from "../_generated/server";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";

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
      console.log(`EXECUTING TOOL`, context);

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

  return {
    sendMessageToConversation,
  };
};
