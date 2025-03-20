import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import * as Conversations from "./model/conversations";

export const create = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => Conversations.createConversation(ctx, args),
});

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

export const updateMine = mutation({
  args: {
    conversationId: v.id("conversations"),
    title: v.string(),
  },
  handler: async (ctx, args) => Conversations.updateMine(ctx, args),
});

export const removeMine = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => Conversations.removeMine(ctx, args),
});
