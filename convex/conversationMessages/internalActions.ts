"use node";
import { internalAction } from "../_generated/server";
import schema from "../schema";
import { triageMessage } from "../ai/triage";
import { doc } from "convex-helpers/validators";
import * as ConversationMessagesModel from "./model";
import { invokeAgent } from "../ai/agents";
import { v } from "convex/values";
import { internal } from "../_generated/api";

export const processMessage = internalAction({
  args: {
    message: doc(schema, "conversationMessages"),
    conversation: doc(schema, "conversations"),
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
      const author = await ctx.runQuery(
        internal.conversationParticipants.private.getParticipantUserOrAgent,
        { participantId: args.message.author },
      );

      if (author.kind != "user") {
        console.log(`Not triaging agent messages`);
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
        await invokeAgent(ctx, { message: args.message, reference });
  },
});
