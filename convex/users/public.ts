import { query } from "../_generated/server";
import * as Users from "./model";

export const getMe = query({
  args: {},
  handler: async (ctx) => Users.getMe(ctx),
});
