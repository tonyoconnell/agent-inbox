import { internalAction, internalMutation } from "../_generated/server";
import { v } from "convex/values";
import * as Messages from "./model";
import * as Agents from "../agents/model";
import * as ConversationParticipants from "../conversationParticipants/model";

export const sendFromTriageAgent = internalMutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  returns: v.id("conversationMessages"),
  handler: async (ctx, args) => {
    const triageAgent = await Agents.getTriageAgent(ctx.db);
    const triageAgentParticipant =
      await ConversationParticipants.getParticipantByConversationIdAndIdentifier(
        ctx.db,
        {
          conversationId: args.conversationId,
          identifier: {
            kind: "agent",
            agentId: triageAgent._id,
          },
        },
      );
    return await Messages.addMessageToConversationFromAgent(ctx, {
      conversationId: args.conversationId,
      content: args.content,
      agentId: triageAgent._id,
      author: triageAgentParticipant._id,
    });
  },
});
