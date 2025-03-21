import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import * as ConversationParticipants from "./model";
import { ensureICanAccessConversation } from "../conversations/model";
import * as ConversationMessages from "../conversationMessages/model";
import * as Agents from "../agents/model";

export const list = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    await ensureICanAccessConversation(ctx, { conversationId });
    return ConversationParticipants.getParticipants(ctx.db, {
      conversationId,
    });
  },
});

export const listAvatars = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    await ensureICanAccessConversation(ctx, { conversationId });
    const participants = await ConversationParticipants.getParticipants(
      ctx.db,
      {
        conversationId,
      },
    );

    const participantPromises = participants.map(async (p) => {
      if (p.kind === "agent") {
        const agent = await ctx.db.get(p.agentId);
        if (agent) return agent.avatarUrl;
        return null;
      } else {
        const user = await ctx.db.get(p.userId);
        if (!user) return null;
        return (
          user.image ??
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user._id}`
        );
      }
    });

    const avatars = (await Promise.all(participantPromises)).filter(
      (r) => r != null,
    );
    return avatars;
  },
});

export const addAgent = mutation({
  args: {
    conversationId: v.id("conversations"),
    agentId: v.id("agents"),
  },
  handler: async (ctx, { conversationId, agentId }) => {
    await ensureICanAccessConversation(ctx, { conversationId });
    const agent = await Agents.getMine(ctx, { agentId });
    const participantId = await ConversationParticipants.addAgent(ctx.db, {
      conversationId,
      agentId,
    });
    await ConversationMessages.createParticipantJoinedConversationMessage(
      ctx.db,
      {
        conversationId,
        agentOrUser: agent,
      },
    );
    return participantId;
  },
});

export const addUser = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, { conversationId, userId }) => {
    await ensureICanAccessConversation(ctx, { conversationId });
    return ConversationParticipants.addUser(ctx.db, { conversationId, userId });
  },
});

export const removeParticipant = mutation({
  args: {
    conversationId: v.id("conversations"),
    participantId: v.id("conversationParticipants"),
  },
  handler: async (ctx, { conversationId, participantId }) => {
    await ensureICanAccessConversation(ctx, { conversationId });

    const participant =
      await ConversationParticipants.getParticipantUserOrAgent(ctx.db, {
        participantId,
      });

    if (participant.kind == "agent" && participant.agent.kind == "system_agent")
      throw new Error("Cannot remove system agent from conversation");

    await ConversationParticipants.removeParticipant(ctx.db, { participantId });

    await ConversationMessages.createParticipantLeftConversationMessage(
      ctx.db,
      {
        conversationId,
        participant,
      },
    );

    return null;
  },
});

export const listDetails = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    const conversation = await ensureICanAccessConversation(ctx, {
      conversationId,
    });
    const participants = await ConversationParticipants.getParticipants(
      ctx.db,
      {
        conversationId,
      },
    );

    const details = await Promise.all(
      participants.map(async (p) => {
        const isCreator =
          p.kind === "user" && p.userId === conversation.createdBy;
        if (p.kind === "agent") {
          const agent = await ctx.db.get(p.agentId);
          if (!agent) return null;
          return {
            id: p._id,
            name: agent.name,
            description: agent.description,
            avatarUrl: agent.avatarUrl,
            kind: "agent" as const,
            isCreator: false,
            isSystem: agent.kind === "system_agent",
          };
        } else {
          const user = await ctx.db.get(p.userId);
          if (!user) return null;
          return {
            id: p._id,
            name: user.name ?? "Unknown User",
            avatarUrl:
              user.image ??
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${user._id}`,
            kind: "user" as const,
            isCreator,
          };
        }
      }),
    );

    return details.filter((d): d is NonNullable<typeof d> => d !== null);
  },
});
