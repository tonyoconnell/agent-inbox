import { defineTable } from "convex/server";
import { v } from "convex/values";

export const conversationMessageReferenceSchemaValidator = v.union(
  v.object({
    kind: v.literal("agent"),
    agentId: v.id("agents"),
    startIndex: v.number(),
    endIndex: v.number(),
  }),
);

export const conversationMessageReferencesSchemaValidator = v.array(
  conversationMessageReferenceSchemaValidator,
);

const common = {
  conversationId: v.id("conversations"),
  content: v.string(),
};

export const conversationMessagesTable = defineTable(
  v.union(
    v.object({
      ...common,
      kind: v.literal("participant"),
      author: v.id("conversationParticipants"),
      references: conversationMessageReferencesSchemaValidator,
    }),
    v.object({
      ...common,
      kind: v.literal("system"),
    }),
  ),
).index("by_conversationId", ["conversationId"]);
