import { getAuthUserId } from "@convex-dev/auth/server";
import { MutationCtx, QueryCtx, query } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import * as Users from "./users";

export const findMainDocumentForUser = async (
  ctx: QueryCtx,
  args: { userId: Id<"users"> },
) => {
  const doc = await ctx.db
    .query("documents")
    .withIndex("by_owningUserId", (q) => q.eq("owningUserId", args.userId))
    .unique();

  return doc;
};

export const findMyMainDocument = async (ctx: QueryCtx) => {
  return findMainDocumentForUser(ctx, {
    userId: await Users.getMyId(ctx),
  });
};

export const createMyMainDocument = async (ctx: MutationCtx) => {
  const existingDoc = await findMyMainDocument(ctx);
  if (existingDoc) throw new Error("Main document already exists");
  return await ctx.db.insert("documents", {
    owningUserId: await Users.getMyId(ctx),
  });
};
