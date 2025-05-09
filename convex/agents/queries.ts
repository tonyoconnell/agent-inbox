import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { pick } from "convex-helpers";
import { Id } from "../_generated/dataModel";
import * as Agents from "./model";
import * as Users from "../users/model";

export const listMine = query({
  args: {},
  handler: async (ctx) => Agents.listMine(ctx),
});

export const getMine = query({
  args: {
    agentId: v.id("agents"),
  },
  handler: async (ctx, args) => Agents.getMine(ctx, args),
});

export const findMine = query({
  args: {
    agentId: v.id("agents"),
  },
  handler: async (ctx, args) => Agents.findMine(ctx, args),
});

export const findMention = query({
  args: {
    agentId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const agent = await ctx.db.get(args.agentId as Id<"agents">);
      if (!agent) return null;
      return pick(agent, ["name", "_id", "avatarUrl"]);
    } catch (error) {
      // Return null if ID is invalid or any other error occurs
      return null;
    }
  },
});

export const listAll = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    return await ctx.db.query("agents").collect();
  },
});

export const find = query({
  args: { agentId: v.id("agents") },
  returns: v.any(),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.agentId);
  },
});

export const findAny = query({
  args: { agentId: v.id("agents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.agentId);
  },
});

export const update = mutation({
  args: { agentId: v.id("agents"), data: v.any() },
  returns: v.any(),
  handler: async (ctx, args) => {
    const agent = await ctx.db.get(args.agentId);
    if (!agent) throw new Error("Agent not found");
    const userId = await Users.getMyId(ctx);
    if (agent.createdBy !== userId) throw new Error("Access denied");
    return await ctx.db.patch(args.agentId, args.data);
  },
});

export const remove = mutation({
  args: { agentId: v.id("agents") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const agent = await ctx.db.get(args.agentId);
    if (!agent) throw new Error("Agent not found");
    const userId = await Users.getMyId(ctx);
    if (agent.createdBy !== userId) throw new Error("Access denied");
    await ctx.db.delete(args.agentId);
    return null;
  },
});
