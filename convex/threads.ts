import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import * as Threads from "./model/threads";

export const create = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => Threads.createThread(ctx, args),
});

export const listMine = query({
  args: {},
  handler: async (ctx) => Threads.listMine(ctx),
});

export const getMine = query({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => Threads.getMine(ctx, args),
});

export const findMine = query({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => Threads.findMine(ctx, args),
});

export const updateMine = mutation({
  args: {
    threadId: v.id("threads"),
    title: v.string(),
  },
  handler: async (ctx, args) => Threads.updateMine(ctx, args),
});

export const removeMine = mutation({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => Threads.deleteMine(ctx, args),
});
