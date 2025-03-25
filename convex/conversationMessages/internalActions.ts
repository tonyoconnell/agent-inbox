"use node";
import { internalAction } from "../_generated/server";
import schema from "../schema";
import { triageMessage } from "../mastra/triage";
import { doc } from "convex-helpers/validators";

export const processMessage = internalAction({
  args: {
    message: doc(schema, "conversationMessages"),
    conversation: doc(schema, "conversations"),
  },
  handler: async (ctx, args) => {
    // Dont handle system
    if (args.message.kind == "system") return;

    // TEMP for now dont handle other agent messages
    if (args.message.author == "system") return;

    // If there are no references then we should invoke the "triage agent" which will    decide what to do with the message
    if (args.message.references.length == 0)
      await triageMessage(ctx, {
        message: args.message,
        conversation: args.conversation,
      });
    // Otherwise we should invoke each agent with the message
    // for (const reference of args.message.references)
    //   if (reference.kind == "agent")
    //     await Mastra.invokeAgent(ctx, { message: args.message, reference });
  },
});
