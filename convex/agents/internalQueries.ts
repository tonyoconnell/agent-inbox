import { internalQuery } from "../_generated/server";
import { v } from "convex/values";
import * as Agents from "./model";
import { listForUser } from "./model";

// If needed, define locally or import from main schema
const systemAgentKindValidator = v.union(v.literal("triage"));

export const listAgentsForUser = internalQuery({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    if (!args.userId) return [];
    return await Agents.listForUser(ctx.db, { userId: args.userId });
  },
});

export const find = internalQuery({
  args: {
    agentId: v.id("agents"),
  },
  handler: async (ctx, args) => {
    return await Agents.find(ctx.db, args);
  },
});
