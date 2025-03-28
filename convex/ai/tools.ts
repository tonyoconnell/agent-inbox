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
import { AVAILABLE_TOOLS } from "../../shared/misc";

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
  [AVAILABLE_TOOLS.listConversationParticipants.name]: tool({
    description: AVAILABLE_TOOLS.listConversationParticipants.description,
    parameters: z.object({
      conversationId: z.string(),
    }),
    execute: async ({ conversationId }) => {
      await sendSystemMessageToConversation(ctx, {
        content: `${agent.name} is listing participants in the conversation ${conversation._id}`,
        conversationId: conversation._id,
      });
      const participants = await ctx.runQuery(
        internal.conversationParticipants.private
          .listNonSystemAgentParticipantsWithJoinedDetails,
        {
          conversationId: conversationId as Id<"conversations">,
        },
      );

      // Lets turn them into the mention format which I hope is more AI compatible
      return participants.map((p) => {
        if (p.agent)
          return {
            kind: "agent",
            agentId: p.agent._id,
            name: p.agent.name,
          };

        if (p.user)
          return {
            kind: "user",
            userId: p.user._id,
            name: p.user.name,
          };

        return null;
      });
    },
  }),

  [AVAILABLE_TOOLS.listAgents.name]: tool({
    description: AVAILABLE_TOOLS.listAgents.description,
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

  [AVAILABLE_TOOLS.messageAnotherAgent.name]: tool({
    description: AVAILABLE_TOOLS.messageAnotherAgent.description,
    parameters: z.object({
      target: z.object({
        agentId: z.string(),
        agentName: z.string(),
      }),
      content: z.string(),
    }),
    execute: async ({ target, content }) => {
      return await ctx.runMutation(
        internal.conversationMessages.private.sendFromAgent,
        {
          conversationId: conversation._id,
          content: `@[${target.agentName}](agent:${target.agentId}) ${content}`,
          agentId: agent._id,
          authorParticipantId: agentParticipant._id,
        },
      );
    },
  }),

  [AVAILABLE_TOOLS.noOutput.name]: tool({
    description: AVAILABLE_TOOLS.noOutput.description,
    parameters: z.object({
      reasoning: z.string(),
    }),
  }),

  [AVAILABLE_TOOLS.webSearch.name]: tool({
    description: AVAILABLE_TOOLS.webSearch.description,
    parameters: z.object({
      query: z.string(),
    }),
    execute: async ({ query }) => {
      await sendSystemMessageToConversation(ctx, {
        content: `${agent.name} is searching the web for "${query}"`,
        conversationId: conversation._id,
      });
      const result = await exa.answer(query, { text: true });
      console.log(`webSearch result:`, result);
      return pick(result, ["answer", "citations"]);
    },
  }),

  [AVAILABLE_TOOLS.scheduleTask.name]: tool({
    description: AVAILABLE_TOOLS.scheduleTask.description,
    parameters: z.object({
      target: z.object({
        agentId: z.string(),
        agentName: z.string(),
      }),
      title: z.string(),
      content: z.string(),
      secondsFromNow: z.number(),
    }),
    execute: async ({ content, secondsFromNow, target, title }) => {
      await sendSystemMessageToConversation(ctx, {
        content: `${agent.name} scheduled a task "${title}" to be sent in ${secondsFromNow} seconds`,
        conversationId: conversation._id,
      });

      const scheduledMessageId = await ctx.scheduler.runAfter(
        secondsFromNow * 1000,
        internal.conversationMessages.private.sendFromAgent,
        {
          conversationId: conversation._id,
          content: `@[${target.agentName}](agent:${target.agentId}) ${content}`,
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
