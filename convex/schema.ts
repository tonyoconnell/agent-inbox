import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,

  documents: defineTable({
    owningUserId: v.id("users"),
  }).index("by_owningUserId", ["owningUserId"]),

  agents: defineTable({
    name: v.string(),
    owningUserId: v.id("users"),
    personality: v.string(),
    isRaisingHand: v.boolean(),
    avatar: v.optional(v.string()),
  }).index("by_owningUserId", ["owningUserId"]),
});
