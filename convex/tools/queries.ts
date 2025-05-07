import { query } from "../_generated/server";

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tools").collect();
  },
}); 