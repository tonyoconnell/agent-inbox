import { MutationCtx, QueryCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import * as Users from "./users";

export const createThread = async (
  ctx: MutationCtx,
  { title }: { title: string },
) => {
  const userId = await Users.getMyId(ctx);
  return await ctx.db.insert("threads", {
    title,
    createdBy: userId,
    lastMessageTime: Date.now(),
  });
};

export const listMine = async (ctx: QueryCtx) => {
  const userId = await Users.getMyId(ctx);

  return await ctx.db
    .query("threads")
    .withIndex("by_user_and_time", (q) => q.eq("createdBy", userId))
    .order("desc")
    .collect();
};

export const findMine = async (
  ctx: QueryCtx,
  { threadId }: { threadId: Id<"threads"> },
) => {
  const userId = await Users.getMyId(ctx);
  const thread = await ctx.db.get(threadId);
  if (thread && thread.createdBy !== userId) throw new Error("Access denied");
  return thread;
};

export const getMine = async (
  ctx: QueryCtx,
  { threadId }: { threadId: Id<"threads"> },
) => {
  const thread = await findMine(ctx, { threadId });
  if (!thread) throw new Error("Thread not found");
  return thread;
};

export const updateMine = async (
  ctx: MutationCtx,
  { threadId, title }: { threadId: Id<"threads">; title: string },
) => {
  const userId = await Users.getMyId(ctx);
  const thread = await ctx.db.get(threadId);

  if (!thread) throw new Error("Thread not found");
  if (thread.createdBy !== userId) throw new Error("Access denied");

  return await ctx.db.patch(threadId, { title });
};

export const deleteMine = async (
  ctx: MutationCtx,
  { threadId }: { threadId: Id<"threads"> },
) => {
  const userId = await Users.getMyId(ctx);
  const thread = await ctx.db.get(threadId);

  if (!thread) throw new Error("Thread not found");
  if (thread.createdBy !== userId) throw new Error("Access denied");

  await ctx.db.delete(threadId);
};
