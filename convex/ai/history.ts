import { internal } from "../_generated/api";
import { isNotNullOrUndefined } from "../../shared/filter";
import { Id } from "../_generated/dataModel";
import { ActionCtx, QueryCtx } from "../_generated/server";
import { pick } from "convex-helpers";
import { iife } from "../../shared/misc";

export const getMessageHistory = async (
  ctx: ActionCtx,
  args: {
    conversationId: Id<"conversations">;
    messageId: Id<"conversationMessages">;
    count: number;
  },
) => {
  return await ctx
    .runQuery(
      internal.conversationMessages.private
        .listMessagesHistoryForAgentGeneration,
      { conversationId: args.conversationId, count: args.count },
    )
    .then((messages) =>
      messages
        .filter((m) => (m.message._id == args.messageId ? null : m)) // exclude the message we are looking at
        .filter(isNotNullOrUndefined),
    );
};

export type MessageHistory = Awaited<
  ReturnType<typeof getMessageHistory>
>[number];

