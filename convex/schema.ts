import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,

  threads: defineTable({
    title: v.string(),
    createdBy: v.id("users"),
    lastMessageTime: v.number(),
  }).index("by_user_and_time", ["createdBy", "lastMessageTime"]),

  agents: defineTable({
    name: v.string(),
    description: v.string(),
    personality: v.string(),
    avatarUrl: v.string(),
    tools: v.array(v.string()),
    status: v.union(
      v.literal("idle"),
      v.literal("active"),
      v.literal("processing"),
    ),
    createdBy: v.id("users"),
    lastActiveTime: v.number(),
  })
    .index("by_creator", ["createdBy"])
    .index("by_status", ["status"])
    .index("by_name", ["name"]),

  threadParticipants: defineTable(
    v.union(
      v.object({
        threadId: v.id("threads"),
        kind: v.literal("agent"),
        agentId: v.id("agents"),
        addedAt: v.number(),
      }),
      v.object({
        threadId: v.id("threads"),
        kind: v.literal("user"),
        userId: v.id("users"),
        addedAt: v.number(),
      }),
    ),
  )
    .index("by_thread", ["threadId"])
    .index("by_agent", ["kind", "agentId"])
    .index("by_user", ["kind", "userId"])
    .index("by_thread_and_agent", ["threadId", "kind", "agentId"])
    .index("by_thread_and_user", ["threadId", "kind", "userId"]),
});
