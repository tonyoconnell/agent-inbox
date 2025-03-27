"use node";
import { z } from "zod";
import { ActionCtx } from "../_generated/server";
import { internal } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";
import { tool } from "ai";
import { sendSystemMessageToConversation } from "./utils";
import { openai } from "@ai-sdk/openai";
import Exa from "exa-js";
import { pick } from "convex-helpers";

const exa = new Exa(process.env.EXA_API_KEY);

export const createTools = ({
  ctx,
  agent,
  conversation,
  agentParticipant,
}: {
  ctx: ActionCtx;
  agent: Doc<"agents">;
  agentParticipant: Doc<"conversationParticipants">;
  conversation: Doc<"conversations">;
}) => ({
  listConversationParticipants: tool({
    description: "A tool for listing the participants in a conversation.",
    parameters: z.object({
      conversationId: z.string(),
    }),
    execute: async ({ conversationId }) => {
      console.log(`calling listConversationParticipants tool`, {
        conversationId,
      });
      await sendSystemMessageToConversation(ctx, {
        content: `${agent.name} is listing participants in the conversation ${conversation._id}`,
        conversationId: conversation._id,
      });
      return ctx.runQuery(
        internal.conversationParticipants.private
          .listNonSystemAgentParticipantsWithJoinedDetails,
        {
          conversationId: conversationId as Id<"conversations">,
        },
      );
    },
  }),

  // sendMessageToConversation: tool({
  //   description: `Allows sending of a message to a conversation. You can reference another agent by using the @[AGENT_NAME](agent:AGENT_ID) syntax for for example: "Hey @[AGENT_NAME](agent:abc123) can you take a look at this?" would reference agent with id abc123`,
  //   parameters: z.object({
  //     conversationId: z.string(),
  //     content: z.string(),
  //   }),
  //   execute: async ({ conversationId, content }) => {
  //     console.log(`using tool: sendMessageToConversation`, {
  //       conversationId,
  //       content,
  //     });

  //     const messageId = await ctx.runMutation(
  //       internal.conversationMessages.private.sendFromAgent,
  //       {
  //         conversationId: conversationId as Id<"conversations">,
  //         content,
  //         agentId: agent._id,
  //         author: agentParticipant._id,
  //       },
  //     );

  //     return {
  //       result: "message_sent",
  //       messageId,
  //     };
  //   },
  // }),

  listAgents: tool({
    description: "Allows listing of all of a user's agents",
    parameters: z.object({
      userId: z.string(),
    }),
    execute: async ({ userId }) => {
      console.log(`using tool: listAgents`, { userId });

      await sendSystemMessageToConversation(ctx, {
        content: `${agent.name} is listing the users agents ${conversation._id}`,
        conversationId: conversation._id,
      });

      return await ctx.runQuery(internal.agents.private.listAgentsForUser, {
        userId: userId as Id<"users">,
      });
    },
  }),

  noOutput: tool({
    description: "Use this tool if you dont want to return any output",
    parameters: z.object({
      reasoning: z.string(),
    }),
  }),

  webSearch: tool({
    description: "Use this tool to search the web for information",
    parameters: z.object({
      query: z.string(),
    }),
    execute: async ({ query }) => {
      await sendSystemMessageToConversation(ctx, {
        content: `${agent.name} is searching the web for: ${query}`,
        conversationId: conversation._id,
      });
      const result = await exa.answer(query, { text: true });
      console.log(`webSearch result:`, result);
      return pick(result, ["answer", "citations"]);
    },
  }),

  scheduleMessage: tool({
    description: "Allows scheduling of a message to be sent at a later time.",
    parameters: z.object({
      targetAgentId: z.string(),
      targetAgentName: z.string(),
      content: z.string(),
      secondsFromNow: z.number(),
    }),
    execute: async ({
      content,
      secondsFromNow,
      targetAgentName,
      targetAgentId,
    }) => {
      await sendSystemMessageToConversation(ctx, {
        content: `${agent.name} scheduled a message to be sent in ${secondsFromNow} seconds`,
        conversationId: conversation._id,
      });

      const scheduledMessageId = await ctx.scheduler.runAfter(
        secondsFromNow * 1000,
        internal.conversationMessages.private.sendFromAgent,
        {
          conversationId: conversation._id,
          content: `@[${targetAgentName}](agent:${targetAgentId}) ${content}`,
          agentId: agent._id,
          authorParticipantId: agentParticipant._id,
        },
      );

      return {
        result: "message_sent",
        scheduledMessageId,
      };
    },
  }),
});
