import { internalMutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";
import * as ConversationParticipants from "./model";
import { conversationParticipantStatusSchemaValidator } from "./schema";

export const updateParticipantStatus = internalMutation({
  args: {
    participantId: v.id("conversationParticipants"),
    status: conversationParticipantStatusSchemaValidator,
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

export const listNonSystemAgentParticipants = internalQuery({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    return await ConversationParticipants.findNonSystemAgentParticipants(
      ctx.db,
      args,
    );
  },
});
