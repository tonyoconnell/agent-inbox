import { query } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("createdBy"), identity.subject as Id<"users">))
      .order("desc")
      .collect();
  },
}); 