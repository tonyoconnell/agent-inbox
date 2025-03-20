import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import * as ConversationParticipants from "./model/conversationParticipants";
import { ensureICanAccessConversation } from "./model/conversations";

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
    return ConversationParticipants.addAgent(ctx.db, {
      conversationId,
      agentId,
    });
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
    await ConversationParticipants.removeParticipant(ctx.db, { participantId });
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
