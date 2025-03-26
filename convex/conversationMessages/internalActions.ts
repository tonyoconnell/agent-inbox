"use node";
import { internalAction } from "../_generated/server";
import schema from "../schema";
import { triageMessage } from "../mastra/triage";
import { doc } from "convex-helpers/validators";
import * as ConversationMessagesModel from "./model";
import { invokeAgent } from "../mastra/referencedAgent";
import { v } from "convex/values";

export const processMessage = internalAction({
  args: {
    message: doc(schema, "conversationMessages"),
    conversation: doc(schema, "conversations"),
    disableTriage: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Dont handle system
    if (args.message.kind == "system") return;

    // If there are no references then we should invoke the "triage agent" which will    decide what to do with the message

    console.log(`Processing Message..`, args.message);

    const references =
      ConversationMessagesModel.parseReferencesFromMessageContent(
        args.message.content,
      );

    console.log(`Detected references`, references);

    if (references.length == 0) {
      if (args.disableTriage) {
        console.log(`Triage disabled, skipping triage`);
        return;
      }
      await triageMessage(ctx, {
        message: args.message,
        conversation: args.conversation,
      });
    }

    // Otherwise we should invoke each agent with the message
    for (const reference of references)
      if (reference.kind == "agent")
        await invokeAgent(ctx, { message: args.message, reference, });
  },
});
