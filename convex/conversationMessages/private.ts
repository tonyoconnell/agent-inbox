import { internalAction, internalMutation } from "../_generated/server";
import schema from "../schema";
import { v } from "convex/values";
import * as Messages from "./model";

export const processMessage = internalAction({
  args: {
    message: schema.tables.conversationMessages.validator,
  },
  handler: async (ctx, args) => {
    // If there are no references then we should invoke the "triage agent" which will
    // decide what to do with the message
    // if (args.message.references.length == 0)
    //   await Mastra.triageMessage(ctx, { message: args.message });
    // Otherwise we should invoke each agent with the message
    // for (const reference of args.message.references)
    //   if (reference.kind == "agent")
    //     await Mastra.invokeAgent(ctx, { message: args.message, reference });
  },
});

export const sendFromTriageAgent = internalMutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await Messages.addMessageToConversationFromMe(ctx, {
      conversationId: args.conversationId,
      content: args.content,
      references: [],
    });
  },
});
