import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import * as ThreadParticipants from "./model/threadParticipants";
import { validateCanAccessThread } from "./model/threads";
import { ensureFP } from "../shared/ensure";

export const list = query({
  args: { threadId: v.id("threads") },
  handler: async (ctx, { threadId }) => {
    await validateCanAccessThread(ctx, { threadId });
    return ThreadParticipants.getParticipants(ctx.db, {
      threadId,
    });
  },
});

export const listAvatars = query({
  args: { threadId: v.id("threads") },
  handler: async (ctx, { threadId }) => {
    await validateCanAccessThread(ctx, { threadId });
    const participants = await ThreadParticipants.getParticipants(ctx.db, {
      threadId,
    });

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
    threadId: v.id("threads"),
    agentId: v.id("agents"),
  },
  handler: async (ctx, { threadId, agentId }) => {
    await validateCanAccessThread(ctx, { threadId });
    return ThreadParticipants.addAgent(ctx.db, { threadId, agentId });
  },
});

export const addUser = mutation({
  args: {
    threadId: v.id("threads"),
    userId: v.id("users"),
  },
  handler: async (ctx, { threadId, userId }) => {
    await validateCanAccessThread(ctx, { threadId });
    return ThreadParticipants.addUser(ctx.db, { threadId, userId });
  },
});

export const removeParticipant = mutation({
  args: {
    threadId: v.id("threads"),
    participantId: v.id("threadParticipants"),
  },
  handler: async (ctx, { threadId, participantId }) => {
    await validateCanAccessThread(ctx, { threadId });
    await ThreadParticipants.removeParticipant(ctx.db, { participantId });
    return null;
  },
});
