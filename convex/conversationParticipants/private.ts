import { internalMutation } from "../_generated/server";
import { v } from "convex/values";
import * as ConversationParticipants from "./model";

export const updateParticipantStatus = internalMutation({
  args: {
    participantId: v.id("conversationParticipants"),
    status: v.union(v.literal("none"), v.literal("thinking")),
  },
  handler: async (ctx, { participantId, status }) => {
    const participant = await ConversationParticipants.getParticipant(ctx.db, {
      participantId,
    });
    if (!participant)
      throw new Error(`Participant '${participantId}' not found`);

    await ctx.db.patch(participantId, { status });
    return null;
  },
});
