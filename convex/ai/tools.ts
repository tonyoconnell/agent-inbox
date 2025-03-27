"use node";
import { z } from "zod";
import { ActionCtx } from "../_generated/server";
import { internal } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";
import { tool } from "ai";

export const createTools = ({
  ctx,
  agent,
  agentParticipantId,
}: {
  ctx: ActionCtx;
  agent: Doc<"agents">;
  agentParticipantId: Id<"conversationParticipants">;
}) => ({
  sendMessageToConversation: tool({
    description: `Allows sending of a message to a conversation. You can reference another agent by using the @[AGENT_NAME](agent:AGENT_ID) syntax for for example: "Hey @[AGENT_NAME](agent:abc123) can you take a look at this?" would reference agent with id abc123`,
    parameters: z.object({
      conversationId: z
        .string()
        .describe("The ID of the conversation to send the message to"),
      content: z.string().describe("The content of the message to send"),
    }),
    execute: async ({ conversationId, content }) => {
      console.log(`using tool: sendMessageToConversation`, {
        conversationId,
        content,
      });

      const messageId = await ctx.runMutation(
        internal.conversationMessages.private.sendFromAgent,
        {
          conversationId: conversationId as Id<"conversations">,
          content,
          agentId: agent._id,
          author: agentParticipantId,
        },
      );

      return {
        result: "message_sent",
        messageId,
      };
    },
  }),

  listAgents: tool({
    description: "Allows listing of all of a user's agents",
    parameters: z.object({
      conversationId: z.string().describe("The ID of the conversation"),
      userId: z.string().describe("The ID of the user whose agents to list"),
    }),
    execute: async ({ conversationId, userId }) => {
      console.log(`using tool: listAgents`, { conversationId, userId });

      const messageId = await ctx.runMutation(
        internal.conversationMessages.private.sendSystemMessage,
        {
          conversationId: conversationId as Id<"conversations">,
          content: `${agent.name} is searching for agents...`,
        },
      );

      const agents = await ctx.runQuery(
        internal.agents.private.listAgentsForUser,
        { userId: userId as Id<"users"> },
      );

      return {
        agents,
      };
    },
  }),
});
