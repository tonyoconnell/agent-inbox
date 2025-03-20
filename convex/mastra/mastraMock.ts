import { Doc } from "../_generated/dataModel";
import { ActionCtx, MutationCtx } from "../_generated/server";
import schema from "../schema";

export const triageMessage = (
  ctx: ActionCtx,
  {
    message,
  }: {
    message: typeof schema.tables.conversationMessages.validator.type;
  },
) => {};

export const invokeAgent = (
  ctx: ActionCtx,
  {
    message,
    reference,
  }: {
    message: typeof schema.tables.conversationMessages.validator.type;
    reference: Doc<"conversationMessages">["references"][number];
  },
) => {};
