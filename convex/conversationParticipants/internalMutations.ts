import { internalMutation } from "../_generated/server";
import { v } from "convex/values";
import * as ConversationParticipants from "./model";

export const updateParticipantStatus = internalMutation({
  args: {
    participantId: v.id("conversationParticipants"),
    status: v.union(v.literal("thinking"), v.literal("inactive")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.participantId, {
      status: args.status,
    });
    return null;
  },
});

export const addAgentIfNotAlreadyJoined = internalMutation({
  args: {
    conversationId: v.id("conversations"),
    agentId: v.id("agents"),
  },
  handler: async (ctx, args) => {
    // Validation: ensure agentId exists in agents table
    const agent = await ctx.db.get(args.agentId);
    if (!agent) {
      throw new Error(`addAgentIfNotAlreadyJoined: agentId ${args.agentId} does not exist in agents table.`);
    }

    const participant =
      await ConversationParticipants.findParticipantByConversationIdAndIdentifier(
        ctx.db,
        {
          conversationId: args.conversationId,
          identifier: {
            kind: "agent",
            agentId: args.agentId,
          },
        },
      );

    if (participant && participant.isRemoved == false) return participant;

    const participantId =
      await ConversationParticipants.addAgentAndSendJoinMessage(ctx.db, {
        conversationId: args.conversationId,
        agentId: args.agentId,
      });

    return ConversationParticipants.getParticipant(ctx.db, {
      participantId: participantId,
    });
  },
});

export const addUserIfNotAlreadyJoined = internalMutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Check if the user is already a participant
    const existing = await ctx.db
      .query("conversationParticipants")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    if (existing.some((p) => p.conversationId === args.conversationId && p.kind === "user" && !p.isRemoved)) {
      return null;
    }
    // Add the user as a participant
    await ctx.db.insert("conversationParticipants", {
      conversationId: args.conversationId,
      userId: args.userId,
      kind: "user",
      addedAt: Date.now(),
      status: "inactive",
      isRemoved: false,
    });
    return null;
  },
});
