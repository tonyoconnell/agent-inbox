import { action, internalAction, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import * as Messages from "./model/messages";
import schema from "./schema";
import * as Mastra from "./mastra/mastraMock";

export const send = mutation({
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
  handler: async (ctx, args) =>
    Messages.addMessageToConversationFromMe(ctx, args),
});

export const list = query({
  args: {
    conversationId: v.id("conversations"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => Messages.listMessages(ctx, args),
});

export const processMessage = internalAction({
  args: {
    message: schema.tables.conversationMessages.validator,
  },
  handler: async (ctx, args) => {
    // If there are no references then we should invoke the "triage agent" which will
    // decide what to do with the message
    if (args.message.references.length == 0)
      await Mastra.triageMessage(ctx, { message: args.message });

    // Otherwise we should invoke each agent with the message
    for (const reference of args.message.references)
      if (reference.kind == "agent")
        await Mastra.invokeAgent(ctx, { message: args.message, reference });
  },
});
