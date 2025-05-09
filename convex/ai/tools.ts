"use node";
import { ActionCtx } from "../_generated/server";
import { internal, api } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";
import { tool } from "ai";
import { sendSystemMessageToConversation } from "./utils";
import Exa from "exa-js";
import { pick } from "convex-helpers";
import { Resend } from "resend";
import {
  toolDefinitions,
  AgentToolName,
  alwaysIncludedTools,
} from "../../shared/tools";
import { v } from "convex/values";

const exa = new Exa(process.env.EXA_API_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

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
      // Fetch the conversation title using the correct API path
      const conv = await ctx.runQuery(api.conversations.queries.getConversationById, { conversationId: conversationId as Id<'conversations'> });
      const convTitle = conv?.title ?? "Unknown Conversation";
      await sendSystemMessageToConversation(ctx, {
        content: `${agent.name} is listing participants in the conversation ${convTitle}`,
        conversationId: conversation._id,
        meta: {
          toolName: "listConversationParticipants",
          agentName: agent.name,
        },
        authorParticipantId: agentParticipant._id,
      });
      const participants = await ctx.runQuery(
        internal.conversationParticipants.internalQueries
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
            ...pick(p.agent, [
              "_id",
              "name",
              "description",
              "tools",
            ]),
          };

        if (p.user)
          return {
            kind: "user",
            ...pick(p.user, ["_id", "name", "email"]),
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

      // Use getUserById for user name
      const user = await ctx.runQuery(api.users.queries.getUserById, { userId: userId as Id<'users'> });
      const userName = user?.name ?? "Unknown User";

      await sendSystemMessageToConversation(ctx, {
        content: `${agent.name} is listing the agents for user ${userName}`,
        conversationId: conversation._id,
        meta: { toolName: "listAgents", userId, agentName: agent.name },
        authorParticipantId: agentParticipant._id,
      });

      return await ctx.runQuery(
        internal.agents.internalQueries.listAgentsForUser,
        {
          userId: userId as Id<"users">,
        },
      );
    },
  }),

  [toolDefinitions.messageAnotherAgent.name]: tool({
    description: toolDefinitions.messageAnotherAgent.description,
    parameters: toolDefinitions.messageAnotherAgent.parameters,
    execute: async ({ target, content }) => {
      return await ctx.runMutation(
        internal.conversationMessages.internalMutations.sendFromAgent,
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
        meta: { toolName: "webSearch", query, agentName: agent.name },
        authorParticipantId: agentParticipant._id,
      });
      const result = await exa.answer(query, { text: true });
      console.log(`webSearch result:`, result);
      return pick(result, ["answer", "citations"]);
    },
  }),

  [toolDefinitions.updateConversationTitle.name]: tool({
    description: toolDefinitions.updateConversationTitle.description,
    parameters: toolDefinitions.updateConversationTitle.parameters,
    execute: async ({ title }) => {
      await ctx.runMutation(internal.conversations.internalMutations.update, {
        conversationId: conversation._id,
        title,
      });

      await sendSystemMessageToConversation(ctx, {
        content: `${agent.name} updated the conversation title to "${title}"`,
        conversationId: conversation._id,
        meta: {
          toolName: "updateConversationTitle",
          newTitle: title,
          agentName: agent.name,
        },
        authorParticipantId: agentParticipant._id,
      });

      return {
        result: "title_updated",
        newTitle: title,
      };
    },
  }),

  [toolDefinitions.scheduleTask.name]: tool({
    description: toolDefinitions.scheduleTask.description,
    parameters: toolDefinitions.scheduleTask.parameters,
    execute: async ({ content, secondsFromNow, target, title }) => {
      await sendSystemMessageToConversation(ctx, {
        content: `${agent.name} scheduled a task "${title}" to be sent in ${secondsFromNow} seconds`,
        conversationId: conversation._id,
        meta: {
          toolName: "scheduleTask",
          title,
          secondsFromNow,
          target,
          content,
          agentName: agent.name,
        },
        authorParticipantId: agentParticipant._id,
      });

      const scheduledMessageId = await ctx.scheduler.runAfter(
        secondsFromNow * 1000,
        internal.conversationMessages.internalMutations.sendFromAgent,
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

  [toolDefinitions.sendEmail.name]: tool({
    description: toolDefinitions.sendEmail.description,
    parameters: toolDefinitions.sendEmail.parameters,
    execute: async ({ to, subject, content, from }) => {
      await sendSystemMessageToConversation(ctx, {
        content: `${agent.name} is sending an email to "${to}" with the subject "${subject}"`,
        conversationId: conversation._id,
        meta: {
          toolName: "sendEmail",
          to,
          subject,
          content,
          from,
          agentName: agent.name,
        },
        authorParticipantId: agentParticipant._id,
      });

      try {
        const response = await resend.emails.send({
          to,
          subject,
          html: content,
          from: "tony@one.ie",
        });

        if (response.error)
          throw new Error(`Failed to send email: ${response.error.message}`);

        return {
          result: "email_sent",
        };
      } catch (error: any) {
        console.error("Failed to send email:", error);
        throw new Error(
          `Failed to send email: ${error?.message ?? "Unknown error"}`,
        );
      }
    },
  }),

  [toolDefinitions.addParticipantToConversation.name]: tool({
    description: toolDefinitions.addParticipantToConversation.description,
    parameters: toolDefinitions.addParticipantToConversation.parameters,
    execute: async ({ agentId }) => {
      // Fetch the agent's name
      const targetAgent = await ctx.runQuery(internal.agents.internalQueries.find, { agentId: agentId as Id<'agents'> });
      const targetAgentName = targetAgent?.name ?? "Unknown Agent";
      try {
        await sendSystemMessageToConversation(ctx, {
          content: `${agent.name} is adding agent ${targetAgentName} to the conversation`,
          conversationId: conversation._id,
          meta: {
            toolName: "addParticipantToConversation",
            agentId,
            agentName: agent.name,
          },
          authorParticipantId: agentParticipant._id,
        });

        const participant = await ctx.runMutation(
          internal.conversationParticipants.internalMutations
            .addAgentIfNotAlreadyJoined,
          {
            conversationId: conversation._id,
            agentId: agentId as Id<"agents">,
          },
        );

        return {
          result: "participant_added",
          participantId: participant,
          type: "agent",
        };
      } catch (error: any) {
        console.error("Failed to add agent:", error);
        throw new Error(
          `Failed to add agent: ${error?.message ?? "Unknown error"}`,
        );
      }
    },
  }),
});

// Helper to map tool IDs to names
async function getToolNamesByIds(ctx: ActionCtx, toolIds: Id<"tools">[] = []): Promise<AgentToolName[]> {
  const names: AgentToolName[] = [];
  for (const id of toolIds) {
    const tool = await ctx.runQuery(internal.tools.queries.getToolById, { toolId: id });
    if (tool && tool.name in toolDefinitions) {
      names.push(tool.name as AgentToolName);
    }
  }
  return names;
}

export const createToolsForAgent = async ({
  ctx,
  agent,
  conversation,
  agentParticipant,
}: {
  ctx: ActionCtx;
  agent: Doc<"agents">;
  agentParticipant: Doc<"conversationParticipants">;
  conversation: Doc<"conversations">;
}) => {
  const allTools = createTools({ ctx, agent, conversation, agentParticipant });
  const toolIds = (agent.tools ?? []).filter(
    (t): t is Id<"tools"> => typeof t !== "string"
  );
  const agentToolNames = await getToolNamesByIds(ctx, toolIds);
  return pick(allTools, [
    ...(Object.keys(alwaysIncludedTools) as AgentToolName[]),
    ...agentToolNames,
  ]);
};
