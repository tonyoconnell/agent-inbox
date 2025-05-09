import { mutation } from "../_generated/server";
import { predefinedAgents } from "../../shared/predefinedAgents";
import { createAgentAvatarUrl } from "./model";

export const seedAgents = mutation({
  args: {},
  handler: async (ctx) => {
    for (const agent of predefinedAgents) {
      // Check if agent already exists by name
      const existing = await ctx.db
        .query("agents")
        .filter((q) => q.eq(q.field("name"), agent.name))
        .first();
      if (!existing) {
        await ctx.db.insert("agents", {
          name: agent.name,
          description: agent.description,
          prompt: agent.prompt,
          tools: agent.tools,
          createdBy: undefined, // No user, since these are seeded
          createdAt: Date.now(),
          avatarUrl: createAgentAvatarUrl(agent.name),
          kind: "user_agent",
        });
      }
    }
    return "Seeded agents";
  },
}); 