import { internalAction, internalMutation } from "../_generated/server";
import { v } from "convex/values";
import * as Messages from "./model";
import * as Agents from "../agents/model";

export const sendFromTriageAgent = internalMutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const triageAgent = await Agents.getTriageAgent(ctx.db);
    await Messages.addMessageToConversationFromAgent(ctx, {
      conversationId: args.conversationId,
      content: args.content,
      references: [],
      agentId: triageAgent._id,
    });
  },
});
