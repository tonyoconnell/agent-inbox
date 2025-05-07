import { internalMutation } from "../_generated/server";
import { v } from "convex/values";
import * as Agents from "./model";

// If needed, define locally or import from main schema
const systemAgentValidator = v.object({
  name: v.string(),
  description: v.string(),
  personality: v.string(),
  avatarUrl: v.string(),
  tools: v.array(v.id("tools")),
  lastActiveTime: v.number(),
  kind: v.literal("system_agent"),
  systemAgentKind: v.union(v.literal("triage")),
});

export const createSystemAgent = internalMutation({
  args: systemAgentValidator,
  handler: async (ctx, args) => {
    // Find by name and kind (system_agent)
    const existingAgent = await ctx.db
      .query("agents")
      .filter((q) => q.eq(q.field("kind"), "system_agent"))
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();
    if (existingAgent) return existingAgent;
    await Agents.createSystemAgent(ctx, args);
    // Return the newly created agent
    return await ctx.db
      .query("agents")
      .filter((q) => q.eq(q.field("kind"), "system_agent"))
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();
  },
});
