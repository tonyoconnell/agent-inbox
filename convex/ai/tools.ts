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
import { toolDefinitions } from "../../shared/tools";

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
  [toolDefinitions.listConversationParticipants.name]: tool({
    description: toolDefinitions.listConversationParticipants.description,
    parameters: toolDefinitions.listConversationParticipants.parameters,
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

  [toolDefinitions.listAgents.name]: tool({
    description: toolDefinitions.listAgents.description,
    parameters: toolDefinitions.listAgents.parameters,
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

  [toolDefinitions.messageAnotherAgent.name]: tool({
    description: toolDefinitions.messageAnotherAgent.description,
    parameters: toolDefinitions.messageAnotherAgent.parameters,
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

  [toolDefinitions.noOutput.name]: tool({
    description: toolDefinitions.noOutput.description,
    parameters: toolDefinitions.noOutput.parameters,
  }),

  [toolDefinitions.webSearch.name]: tool({
    description: toolDefinitions.webSearch.description,
    parameters: toolDefinitions.webSearch.parameters,
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

  [toolDefinitions.scheduleTask.name]: tool({
    description: toolDefinitions.scheduleTask.description,
    parameters: toolDefinitions.scheduleTask.parameters,
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
