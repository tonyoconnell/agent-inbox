import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import * as Users from "./model/users";

export const createAgent = mutation({
  args: {
    name: v.string(),
    personality: v.string(),
    avatar: v.optional(v.string()),
  },
  returns: v.id("agents"),
  handler: async (ctx, args) => {
    const userId = await Users.getCurrentUserId(ctx);

    return await ctx.db.insert("agents", {
      name: args.name,
      personality: args.personality,
      avatar: args.avatar,
      owningUserId: userId,
      isRaisingHand: false,
    });
  },
});

export const listAgents = query({
  args: {},
  handler: async (ctx) => {
    const userId = await Users.getCurrentUserId(ctx);

    return await ctx.db
      .query("agents")
      .withIndex("by_owningUserId", (q) => q.eq("owningUserId", userId))
      .collect();
  },
});
