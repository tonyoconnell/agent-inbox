import { internalQuery } from "../_generated/server";
import { systemAgentKindValidator } from "./schema";
import * as Agents from "./model";
import { v } from "convex/values";
import { listForUser } from "./model";

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
