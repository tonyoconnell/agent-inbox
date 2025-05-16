permission: defineTable({
  resourceType: v.string(), // e.g. "conversation", "knowledge", "agent"
  resourceId: v.string(),   // the _id of the resource
  groupId: v.id("group"),
  level: v.union(
    v.literal("read"),
    v.literal("write"),
    v.literal("admin")
  ),
  meta: v.optional(v.any()),
}),
