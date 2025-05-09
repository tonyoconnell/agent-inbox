import { query } from "../_generated/server";
import { v } from "convex/values";
import * as Conversations from "./model";

export const listMine = query({
  args: {},
  handler: async (ctx) => Conversations.listMine(ctx),
});

export const getMine = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => Conversations.getMine(ctx, args),
});

export const findMine = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => Conversations.findMine(ctx, args),
});

export const getConversationById = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.conversationId);
  },
});

export const listForUser = query({
  args: {},
  handler: async (ctx) => Conversations.listForUser(ctx),
});

export const getForParticipant = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    return await Conversations.ensureICanAccessConversation(ctx, { conversationId });
  },
});
