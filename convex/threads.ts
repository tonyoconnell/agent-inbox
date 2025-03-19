import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import * as Threads from "./model/threads";

export const create = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => Threads.createThread(args, ctx),
});

export const list = query({
  args: {},
  handler: async (ctx) => Threads.getMyThreads(ctx),
});
