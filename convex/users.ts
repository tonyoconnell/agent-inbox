import { query } from "./_generated/server";
import * as Users from "./model/users";

export const getMe = query({
  args: {},
  handler: async (ctx) => Users.getMe(ctx),
});
