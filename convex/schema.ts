import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  // Any tables used by the example app go here.
  documents: defineTable({
    docId: v.string(),
    content: v.string(),
  })
    .index("docId", ["docId"])
    .searchIndex("search_documents", { searchField: "content" }),
});
