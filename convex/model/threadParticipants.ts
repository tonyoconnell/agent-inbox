import { DatabaseReader, DatabaseWriter } from "../_generated/server";
import { Id } from "../_generated/dataModel";

export const getParticipants = async (
  db: DatabaseReader,
  { threadId }: { threadId: Id<"threads"> },
) => {
  const participants = await db
    .query("threadParticipants")
    .withIndex("by_thread", (q) => q.eq("threadId", threadId))
    .collect();

  return participants;
};

export const addAgent = async (
  db: DatabaseWriter,
  { threadId, agentId }: { threadId: Id<"threads">; agentId: Id<"agents"> },
) => {
  const existing = await db
    .query("threadParticipants")
    .withIndex("by_thread_and_agent", (q) =>
      q.eq("threadId", threadId).eq("kind", "agent").eq("agentId", agentId),
    )
    .first();

  if (existing) return existing._id;

  return db.insert("threadParticipants", {
    threadId,
    agentId,
    kind: "agent",
    addedAt: Date.now(),
  });
};

export const addUser = async (
  db: DatabaseWriter,
  { threadId, userId }: { threadId: Id<"threads">; userId: Id<"users"> },
) => {
  const existing = await db
    .query("threadParticipants")
    .withIndex("by_thread_and_user", (q) =>
      q.eq("threadId", threadId).eq("kind", "user").eq("userId", userId),
    )
    .first();

  if (existing) return existing._id;

  return db.insert("threadParticipants", {
    threadId,
    userId,
    kind: "user",
    addedAt: Date.now(),
  });
};

export const removeParticipant = async (
  db: DatabaseWriter,
  { participantId }: { participantId: Id<"threadParticipants"> },
) => {
  await db.delete(participantId);
};
