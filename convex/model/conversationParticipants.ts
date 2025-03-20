import { DatabaseReader, DatabaseWriter } from "../_generated/server";
import { Id } from "../_generated/dataModel";

export const getParticipants = async (
  db: DatabaseReader,
  { conversationId }: { conversationId: Id<"conversations"> },
) => {
  const participants = await db
    .query("conversationParticipants")
    .withIndex("by_conversation", (q) => q.eq("conversationId", conversationId))
    .collect();

  return participants;
};

export const addAgent = async (
  db: DatabaseWriter,
  {
    conversationId,
    agentId,
  }: { conversationId: Id<"conversations">; agentId: Id<"agents"> },
) => {
  const existing = await db
    .query("conversationParticipants")
    .withIndex("by_conversation_and_agent", (q) =>
      q
        .eq("conversationId", conversationId)
        .eq("kind", "agent")
        .eq("agentId", agentId),
    )
    .first();

  if (existing) return existing._id;

  return db.insert("conversationParticipants", {
    conversationId,
    agentId,
    kind: "agent",
    addedAt: Date.now(),
  });
};

export const addUser = async (
  db: DatabaseWriter,
  {
    conversationId,
    userId,
  }: { conversationId: Id<"conversations">; userId: Id<"users"> },
) => {
  const existing = await db
    .query("conversationParticipants")
    .withIndex("by_conversation_and_user", (q) =>
      q
        .eq("conversationId", conversationId)
        .eq("kind", "user")
        .eq("userId", userId),
    )
    .first();

  if (existing) return existing._id;

  return db.insert("conversationParticipants", {
    conversationId,
    userId,
    kind: "user",
    addedAt: Date.now(),
  });
};

export const removeParticipant = async (
  db: DatabaseWriter,
  { participantId }: { participantId: Id<"conversationParticipants"> },
) => {
  await db.delete(participantId);
};
