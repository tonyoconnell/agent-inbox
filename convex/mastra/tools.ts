"use node";
import { createTool } from "@mastra/core";
import { z } from "zod";
import { ActionCtx } from "../_generated/server";
import { internal } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";

export const createTools = ({
  ctx,
  agent,
  agentParticipantId,
}: {
  ctx: ActionCtx;
  agent: Doc<"agents">;
  agentParticipantId: Id<"conversationParticipants">;
}) => {
  const sendMessageToConversation = createTool({
    id: "send-message-to-conversation",
    description: `Allows sending of a message to a conversation, You can reference another agent by using the @[AGENT_NAME](agent:AGENT_ID) syntax for for example: "Hey @[AGENT_NAME](agent:abc123) can you take a look at this?" would reference agent with id abc123`,
    inputSchema: z.object({
      conversationId: z.string(),
      content: z.string(),
    }),
    outputSchema: z.object({}),
    execute: async ({ context }) => {
      console.log(`using tool: sendMessageToConversation`, context);

      const messageId = await ctx.runMutation(
        internal.conversationMessages.private.sendFromAgent,
        {
          conversationId: context.conversationId as Id<"conversations">,
          content: context.content,
          agentId: agent._id,
          author: agentParticipantId,
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
          content: `${agent.name} is searching for agents...`,
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
