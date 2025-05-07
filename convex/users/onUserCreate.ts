import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

export default internalMutation({
  args: {
    user: v.object({
      name: v.string(),
      email: v.string(),
      image: v.optional(v.string()),
      // Add other fields as needed
    }),
  },
  handler: async (ctx, { user }) => {
    await ctx.db.insert("users", {
      ...user,
      createdAt: Date.now(),
    });
  },
}); 