import { mutation } from "../_generated/server";
import { toolDefinitions } from "../../shared/tools";

export const seedTools = mutation({
  args: {},
  handler: async (ctx) => {
    for (const [key, def] of Object.entries(toolDefinitions)) {
      // Check if tool already exists by name
      const existing = await ctx.db
        .query("tools")
        .filter((q) => q.eq(q.field("name"), def.name))
        .first();
      if (!existing) {
        await ctx.db.insert("tools", {
          name: def.name,
          description: def.description,
        });
      }
    }
    return "Seeded tools";
  },
}); 