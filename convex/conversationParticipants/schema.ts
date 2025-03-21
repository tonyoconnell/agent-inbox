import { v } from "convex/values";
import { defineTable } from "convex/server";

const common = {
  conversationId: v.id("conversations"),
  addedAt: v.number(),
  status: v.union(v.literal("none"), v.literal("thinking")),
};

export const conversationParticipantsSchemaValidator = v.union(
  v.object({
    kind: v.literal("agent"),
    agentId: v.id("agents"),
    ...common,
  }),
  v.object({
    kind: v.literal("user"),
    userId: v.id("users"),
    ...common,
  }),
);

export const conversationParticipantsSchema = defineTable(
  conversationParticipantsSchemaValidator,
)
  .index("by_conversationId", ["conversationId"])
  .index("by_userId", ["userId"])
  .index("by_conversationId_kind_agentId", [
    "conversationId",
    "kind",
    "agentId",
  ])
  .index("by_conversationId_kind_userId", ["conversationId", "kind", "userId"])
  .index("by_conversationId_status", ["conversationId", "status"]);
