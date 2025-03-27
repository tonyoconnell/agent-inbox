import { v } from "convex/values";
import { query } from "../_generated/server";
import * as Users from "./model";
import { pick } from "convex-helpers";

export const getMe = query({
  args: {},
  handler: async (ctx) => Users.getMe(ctx),
});

export const getForMention = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");
    return pick(user, ["name", "_id", "image"]);
  },
});
