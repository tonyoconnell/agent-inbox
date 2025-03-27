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
import {pick} from 'convex-helpers';

export const sendFromMe = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await Conversations.ensureICanAccessConversation(ctx, {
      conversationId: args.conversationId,
    });
    return Messages.addMessageToConversationFromMe(ctx, args);
  },
});

export const listForMe = query({
  args: {
    conversationId: v.id("conversations"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await Conversations.ensureICanAccessConversation(ctx, {
      conversationId: args.conversationId,
    });
    return Messages.listMessages(ctx.db, args);
  },
});

