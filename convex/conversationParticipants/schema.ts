import { v } from "convex/values";

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
