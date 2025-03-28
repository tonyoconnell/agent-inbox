import { internalMutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";
import * as ConversationParticipants from "./model";
import { conversationParticipantIdentifierSchemaValidator } from "./schema";

export const updateParticipantStatus = internalMutation({
  args: {
    participantId: v.id("conversationParticipants"),
    status: v.union(v.literal("thinking"), v.literal("inactive")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.participantId, {
      status: args.status,
    });
    return null;
  },
});

export const listNonSystemAgentParticipants = internalQuery({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    return await ConversationParticipants.listNonSystemAgentParticipants(
      ctx.db,
      args,
    );
  },
});

export const listNonSystemAgentParticipantsWithJoinedDetails = internalQuery({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const participants =
      await ConversationParticipants.listParticipantsWithJoinedDetails(
        ctx.db,
        args,
      );

    return participants
      .filter((p) => {
        if (p.agent && p.agent.kind == "system_agent") return null;
        return p;
      })
      .filter((p) => p !== null);
  },
});

export const findParticipantByConversationIdAndIdentifier = internalQuery({
  args: {
    conversationId: v.id("conversations"),
    identifier: conversationParticipantIdentifierSchemaValidator,
  },
  handler: async (ctx, args) => {
    return await ConversationParticipants.findParticipantByConversationIdAndIdentifier(
      ctx.db,
      args,
    );
  },
});

export const addAgent = internalMutation({
  args: {
    conversationId: v.id("conversations"),
    agentId: v.id("agents"),
  },
  returns: v.id("conversationParticipants"),
  handler: async (ctx, args) => {
    return ConversationParticipants.addAgentAndSendJoinMessage(ctx.db, {
      conversationId: args.conversationId,
      agentId: args.agentId,
    });
  },
});

export const addAgentIfNotAlreadyJoined = internalMutation({
  args: {
    conversationId: v.id("conversations"),
    agentId: v.id("agents"),
  },
  handler: async (ctx, args) => {
    const participant =
      await ConversationParticipants.findParticipantByConversationIdAndIdentifier(
        ctx.db,
        {
          conversationId: args.conversationId,
          identifier: {
            kind: "agent",
            agentId: args.agentId,
          },
        },
      );

    if (participant && participant.isRemoved == false) return participant;

    const participantId =
      await ConversationParticipants.addAgentAndSendJoinMessage(ctx.db, {
        conversationId: args.conversationId,
        agentId: args.agentId,
      });

    return ConversationParticipants.getParticipant(ctx.db, {
      participantId: participantId,
    });
  },
});

export const getParticipantUserOrAgent = internalQuery({
  args: {
    participantId: v.id("conversationParticipants"),
  },
  handler: async (ctx, args) => {
    return await ConversationParticipants.getParticipantUserOrAgent(ctx.db, {
      participantId: args.participantId,
    });
  },
});
