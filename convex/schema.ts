import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { agentsSchemaValidator } from "./agents/schema";
import { conversationParticipantsTable } from "./conversationParticipants/schema";
import { conversationMessagesTable } from "./conversationMessages/schema";

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

  agents: defineTable(agentsSchemaValidator)
    .index("by_creator", ["createdBy"])
    .index("by_name", ["name"])
    .index("by_system_agent_kind", ["systemAgentKind"]),

  conversationParticipants: conversationParticipantsTable,
  conversationMessages: conversationMessagesTable,
});
