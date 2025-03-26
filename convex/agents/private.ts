import { internalMutation, internalQuery } from "../_generated/server";
import { systemAgentKindValidator, systemAgentValidator } from "./schema";
import * as Agents from "./model";
import { v } from "convex/values";
import { listForUser } from "./model";

export const findSystemAgentByKind = internalQuery({
  args: {
    systemAgentKind: systemAgentKindValidator,
  },
  handler: async (ctx, args) => {
    return await Agents.findSystemAgentByKind(ctx.db, args);
  },
});

export const createSystemAgent = internalMutation({
  args: systemAgentValidator,
  handler: async (ctx, args) => {
    const existringAgent = await Agents.findSystemAgentByKind(ctx.db, {
      systemAgentKind: args.systemAgentKind,
    });
    if (existringAgent) return existringAgent;
    await Agents.createSystemAgent(ctx, args);
    return Agents.getSystemAgentByKind(ctx.db, {
      systemAgentKind: args.systemAgentKind,
    });
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

export const listAgentsForUser = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await Agents.listForUser(ctx.db, { userId: args.userId });
  },
});
