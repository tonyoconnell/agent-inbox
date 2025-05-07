---
title: Convex Queries Reference
description: Developer guide to Convex queries for the ONE agent/human system
order: 5
---

# Convex Queries: Developer Reference

> See also: [Schema](./schema.md) | [Ontology](./ontology.md) | [Agents](./agents.md) | [Workflow](./workflow.md) | [Actions](./actions.md) | [Mutations](./mutations.md)

Convex queries are server-side functions for fetching and aggregating data. Use queries for all read-only operations, including listing, searching, and analytics. Queries are composable, reactive, and can be used from the frontend or other server-side logic.

## Best Practices
- Use queries for all read-only data access.
- Validate all arguments using Convex validators (`v.string()`, `v.id()`, etc.).
- Use indexes as defined in the [schema](./schema.md) for performance.
- Keep queries focused and efficient; avoid unnecessary data loading.
- Use `meta` fields and extensible patterns for future-proofing.

## Common Query Patterns

### 1. List All Agents
```ts
export const listAgents = query({
  handler: async (ctx) => {
    return await ctx.db.query("agents").order("desc").collect();
  },
});
```

### 2. Get Flow With Progress
```ts
export const getFlowWithProgress = query({
  args: { flowId: v.id("flows"), userId: v.optional(v.id("users")) },
  handler: async (ctx, { flowId, userId }) => {
    const flow = await ctx.db.get(flowId);
    if (!flow) throw new Error("Flow not found");
    const progress = userId
      ? await ctx.db
          .query("flowProgress")
          .withIndex("by_flowId", (q) => q.eq("flowId", flowId))
          .filter((q) => q.eq(q.field("userId"), userId))
          .collect()
      : [];
    return { flow, progress };
  },
});
```

### 3. Get Agent Thread Messages
```ts
export const getAgentThreadMessages = query({
  args: { threadId: v.id("agentThreads") },
  handler: async (ctx, { threadId }) => {
    return await ctx.db
      .query("agentMessages")
      .withIndex("by_threadId", (q) => q.eq("threadId", threadId))
      .order("asc")
      .collect();
  },
});
```

### 4. Search Knowledge By Tag
```ts
export const searchKnowledgeByTag = query({
  args: { tag: v.string() },
  handler: async (ctx, { tag }) => {
    return await ctx.db
      .query("knowledge")
      .filter((q) => q.contains(q.field("tags"), tag))
      .collect();
  },
});
```

## When to Use Queries vs Actions
- **Queries:** Use for all read-only data access, including listing, searching, and analytics.
- **Actions:** Use for orchestrating workflows, side effects, or multi-step logic that may include queries and mutations.

## Extensibility
- All queries should support `meta` fields for custom data where appropriate.
- Use indexes and validators as defined in the [schema](./schema.md) for performance and integrity.

## See Also
- [Schema](./schema.md)
- [Ontology](./ontology.md)
- [Agents](./agents.md)
- [Workflow](./workflow.md)
- [Actions](./actions.md)
- [Mutations](./mutations.md)
