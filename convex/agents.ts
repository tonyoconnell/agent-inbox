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

export const updateAgent = mutation({
  args: {
    id: v.id("agents"),
    name: v.string(),
    personality: v.string(),
    avatar: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await Users.getCurrentUserId(ctx);

    // Get the agent
    const agent = await ctx.db.get(args.id);

    // Verify agent exists and belongs to user
    if (!agent || agent.owningUserId !== userId)
      throw new Error("Agent not found or unauthorized");

    // Update the agent
    await ctx.db.patch(args.id, {
      name: args.name,
      personality: args.personality,
      avatar: args.avatar,
    });

    return null;
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
