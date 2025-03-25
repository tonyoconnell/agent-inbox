import { internalMutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";
import * as ConversationParticipants from "./model";
import {
  conversationParticipantStatusSchemaValidator,
  conversationParticipantIdentifierSchemaValidator,
} from "./schema";

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

export const findParticipantByConversationIdAndIdentifier = internalQuery({
  args: {
    conversationId: v.id("conversations"),
    identifier: conversationParticipantIdentifierSchemaValidator,
  },
  handler: async (ctx, args) => {
    return await ConversationParticipants.findParticipantByConversationIdAndIdentifier(
      ctx.db,
      args,
    );
  },
});
