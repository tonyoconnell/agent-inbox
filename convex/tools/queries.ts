import { query, internalQuery } from "../_generated/server";
import { v } from "convex/values";

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tools").collect();
  },
});

export const getToolById = internalQuery({
  args: { toolId: v.id("tools") },
  handler: async (ctx, { toolId }) => {
    return await ctx.db.get(toolId);
  },
}); 