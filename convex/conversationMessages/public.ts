import {
  action,
  internalAction,
  internalMutation,
  mutation,
  query,
} from "../_generated/server";
import { v } from "convex/values";
import * as Messages from "./model";
import * as Conversations from "../conversations/model";

export const sendFromMe = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
    references: v.array(
      v.object({
        kind: v.literal("agent"),
        agentId: v.id("agents"),
        startIndex: v.number(),
        endIndex: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    await Conversations.ensureICanAccessConversation(ctx, {
      conversationId: args.conversationId,
    });
    return Messages.addMessageToConversationFromMe(ctx, args);
  },
});

export const listFromMe = query({
  args: {
    conversationId: v.id("conversations"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await Conversations.ensureICanAccessConversation(ctx, {
      conversationId: args.conversationId,
    });
    return Messages.listMessages(ctx, args);
  },
});
