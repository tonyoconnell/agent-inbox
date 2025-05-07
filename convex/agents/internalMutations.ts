import { internalMutation } from "../_generated/server";
import { systemAgentValidator } from "./schema";
import * as Agents from "./model";

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
