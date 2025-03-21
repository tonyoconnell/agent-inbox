import { ActionCtx } from "../_generated/server";
import schema from "../schema";

export const triageMessage = (
  ctx: ActionCtx,
  {
    message,
  }: {
    message: typeof schema.tables.conversationMessages.validator.type;
  },
) => {};
