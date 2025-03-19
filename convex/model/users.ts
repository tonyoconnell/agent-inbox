import { getAuthUserId } from "@convex-dev/auth/server";
import { QueryCtx } from "../_generated/server";

export const getMyId = async (ctx: QueryCtx) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  return userId;
};

export const getMe = async (ctx: QueryCtx) => {
  const userId = await getMyId(ctx);
  const user = await ctx.db.get(userId);
  if (!user) throw new Error("User not found");
  return user;
};
