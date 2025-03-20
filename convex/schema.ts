import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,

  conversations: defineTable({
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

  conversationParticipants: defineTable(
    v.union(
      v.object({
        conversationId: v.id("conversations"),
        kind: v.literal("agent"),
        agentId: v.id("agents"),
        addedAt: v.number(),
      }),
      v.object({
        conversationId: v.id("conversations"),
        kind: v.literal("user"),
        userId: v.id("users"),
        addedAt: v.number(),
      }),
    ),
  )
    .index("by_conversation", ["conversationId"])
    .index("by_agent", ["kind", "agentId"])
    .index("by_user", ["kind", "userId"])
    .index("by_conversation_and_agent", ["conversationId", "kind", "agentId"])
    .index("by_conversation_and_user", ["conversationId", "kind", "userId"]),

  conversationMessages: defineTable({
    conversationId: v.id("conversations"),
    content: v.string(),
    author: v.union(
      v.object({
        kind: v.literal("user"),
        userId: v.id("users"),
      }),
      v.object({
        kind: v.literal("agent"),
        agentId: v.id("agents"),
      }),
    ),
  }).index("by_conversationId", ["conversationId"]),
});
