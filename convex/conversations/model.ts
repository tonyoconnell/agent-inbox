import {
  DatabaseReader,
  DatabaseWriter,
  MutationCtx,
  QueryCtx,
  ActionCtx,
} from "../_generated/server";
import { Id } from "../_generated/dataModel";
import * as Users from "../users/model";
import * as ConversationParticipants from "../conversationParticipants/model";
import * as Agents from "../agents/model";
import { doesHaveTriageAgent } from "../conversationParticipants/model";
import * as ConversationMessages from "../conversationMessages/model";
import { agentReplyToMessage } from "../ai/agentReplyToMessage";

export const ensureICanAccessConversation = async (
  ctx: QueryCtx | MutationCtx,
  { conversationId }: { conversationId: Id<"conversations"> },
) => {
  const userId = await Users.getMyId(ctx);
  const conversation = await ctx.db.get(conversationId);

  if (!conversation) throw new Error("Conversation not found");
  if (conversation.createdBy !== userId) throw new Error("Access denied");

  return conversation;
};

export const createConversation = async (
  ctx: MutationCtx,
  { title }: { title: string },
) => {
  const userId = await Users.getMyId(ctx);
  const conversationId = await ctx.db.insert("conversations", {
    title,
    createdBy: userId,
    createdAt: Date.now(),
    lastMessageTime: Date.now(),
  });

  // Add the creator as a participant
  await ConversationParticipants.addUser(ctx.db, { conversationId, userId });

  return conversationId;
};

export const listMine = async (ctx: QueryCtx) => {
  const userId = await Users.getMyId(ctx);

  return await ctx.db
    .query("conversations")
    .withIndex("by_createdBy", (q) => q.eq("createdBy", userId))
    .order("desc")
    .collect();
};

export const findMine = async (
  ctx: QueryCtx,
  { conversationId }: { conversationId: Id<"conversations"> },
) => {
  const userId = await Users.getMyId(ctx);
  const conversation = await ctx.db.get(conversationId);
  if (conversation && conversation.createdBy !== userId)
    throw new Error("Access denied");
  return conversation;
};

export const getMine = async (
  ctx: QueryCtx,
  { conversationId }: { conversationId: Id<"conversations"> },
) => {
  const conversation = await findMine(ctx, { conversationId });
  if (!conversation) throw new Error("Conversation not found");
  return conversation;
};

export const update = async (
  ctx: MutationCtx,
  {
    conversationId,
    title,
  }: { conversationId: Id<"conversations">; title: string },
) => {
  return await ctx.db.patch(conversationId, { title });
};

export const updateMine = async (
  ctx: MutationCtx,
  {
    conversationId,
    title,
  }: { conversationId: Id<"conversations">; title: string },
) => {
  await ensureICanAccessConversation(ctx, { conversationId });
  return update(ctx, { conversationId, title });
};

export const removeMine = async (
  ctx: MutationCtx,
  { conversationId }: { conversationId: Id<"conversations"> },
) => {
  await ensureICanAccessConversation(ctx, { conversationId });

  // Delete all messages and participants first
  await ConversationMessages.deleteAllMessagesForConversation(ctx.db, {
    conversationId,
  });

  await ConversationParticipants.deleteAllParticipantsForConversation(ctx.db, {
    conversationId,
  });

  // Finally delete the conversation itself
  await ctx.db.delete(conversationId);
};

export const isTriageAgentJoined = async (
  db: DatabaseReader,
  { conversationId }: { conversationId: Id<"conversations"> },
) => {
  return await doesHaveTriageAgent(db, { conversationId });
};

export const joinTriageAgentToConversationIfNotAlreadyJoined = async (
  db: DatabaseWriter,
  { conversationId }: { conversationId: Id<"conversations"> },
) => {
  // Use getTriageAgent to find the triage agent
  const agent = await Agents.getTriageAgent(db);
  const conversation = await db.get(conversationId);
  if (!conversation)
    throw new Error(`Conversation not found ${conversationId}`);

  // If we have the triage agent in the conversation then we can return that
  const triageAgentParticipant =
    await ConversationParticipants.findParticipantByConversationIdAndIdentifier(
      db,
      {
        conversationId,
        identifier: {
          kind: "agent",
          agentId: agent._id,
        },
      },
    );
  if (triageAgentParticipant) return triageAgentParticipant;

  // Otherwise we add the triage agent to the conversation
  const participantId = await ConversationParticipants.addAgentOrReactivate(
    db,
    {
      conversationId,
      agentId: agent._id,
    },
  );

  // We also create a message to notify the user that the triage agent has joined the conversation
  await ConversationMessages.createParticipantJoinedConversationMessage(db, {
    conversationId,
    agentOrUser: agent,
    authorParticipantId: participantId,
  });

  return ConversationParticipants.getParticipant(db, { participantId });
};

export const joinAgentToConversationIfNotAlreadyJoined = async (
  db: DatabaseWriter,
  {
    conversationId,
    agentId,
  }: { conversationId: Id<"conversations">; agentId: Id<"agents"> },
  ctx?: ActionCtx
) => {
  const agent = await db.get(agentId);
  if (!agent) throw new Error(`Agent of id '${agentId}' could not be found`);

  const conversation = await db.get(conversationId);
  if (!conversation)
    throw new Error(
      `Conversation of id '${conversationId}' could not be found`,
    );

  // Check if the agent is already a participant in the conversation
  const existingParticipant =
    await ConversationParticipants.findParticipantByConversationIdAndIdentifier(
      db,
      {
        conversationId,
        identifier: {
          kind: "agent",
          agentId,
        },
      },
    );

  if (existingParticipant) return existingParticipant;

  // Add the agent to the conversation
  const participantId = await ConversationParticipants.addAgentOrReactivate(
    db,
    {
      conversationId,
      agentId,
    },
  );

  // Create a message to notify that the agent has joined the conversation
  await ConversationMessages.createParticipantJoinedConversationMessage(db, {
    conversationId,
    agentOrUser: agent,
    authorParticipantId: participantId,
  });

  // --- Trigger a full AI response from the agent ---
  // NOTE: This requires ActionCtx (ctx) to be passed in. If not available, refactor to call this from an action.
  if (ctx) {
    const syntheticMessage = {
      _id: "synthetic" as any, // or generate a temp ID if needed
      _creationTime: Date.now(),
      conversationId,
      authorParticipantId: participantId,
      kind: "participant" as const,
      content: `@[${agent.name}](agent:${agent._id})`, // Simulate a mention
      createdAt: Date.now(),
    };
    await agentReplyToMessage(ctx, {
      message: syntheticMessage,
      agentId: agent._id,
      conversation: conversation,
      messageAuthor: { kind: "agent", agent },
    });
  }
  // --- End AI trigger ---

  return ConversationParticipants.getParticipant(db, { participantId });
};
