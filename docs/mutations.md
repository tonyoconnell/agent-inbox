---
title: Convex Mutations Reference
description: Developer guide to Convex mutations for the ONE agent/human system
order: 4
---

# Convex Mutations: Developer Reference

> See also: [Schema](./schema.md) | [Ontology](./ontology.md) | [Agents](./agents.md) | [Workflow](./workflow.md) | [Actions](./actions.md)

Convex mutations are server-side functions for direct, atomic updates to the database. Use mutations for CRUD operations (create, read, update, delete) on single tables/entities, and for simple business logic that does not require orchestration or side effects. For more complex workflows, use [actions](./actions.md).

## Best Practices
- Use mutations for direct, transactional updates to a single table/entity.
- Validate all arguments using Convex validators (`v.string()`, `v.id()`, etc.).
- Keep mutations focused and minimal; use actions for multi-step or cross-entity logic.
- Use `meta` fields for extensibility.
- Prefer the functional approach for error handling (see [project rules](./schema.md)).

## Common Mutation Patterns

### 1. Update an Agent
```ts
export const updateAgent = mutation({
  args: {
    agentId: v.id("agents"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    prompt: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    updatedBy: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.agentId, {
      ...args,
      updatedAt: Date.now(),
    });
  },
});
```

### 2. Delete a Lesson
```ts
export const deleteLesson = mutation({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.lessonId);
  },
});
```

### 3. Update a Flow Step
```ts
export const updateFlowStep = mutation({
  args: {
    flowId: v.id("flows"),
    stepName: v.string(),
    instructions: v.optional(v.string()),
    prerequisites: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const flow = await ctx.db.get(args.flowId);
    if (!flow) throw new Error("Flow not found");
    const steps = flow.steps.map((step) =>
      step.name === args.stepName
        ? { ...step, ...args }
        : step
    );
    await ctx.db.patch(args.flowId, { steps, updatedAt: Date.now() });
  },
});
```

### 4. Add a Conversation Message
```ts
export const addConversationMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    authorParticipantId: v.id("conversationParticipants"),
    content: v.string(),
    kind: v.optional(v.union(v.literal("participant"), v.literal("system"))),
    type: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("conversationMessages", {
      conversationId: args.conversationId,
      authorParticipantId: args.authorParticipantId,
      kind: args.kind ?? "participant",
      type: args.type,
      tags: args.tags,
      content: args.content,
      createdAt: Date.now(),
    });
  },
});
```

## When to Use Mutations vs Actions
- **Mutations:** Use for direct, atomic updates to a single table/entity, or simple CRUD logic.
- **Actions:** Use for orchestrating multiple mutations, side effects, agent workflows, or cross-entity logic.

## Extensibility
- All mutations should support `meta` fields for custom data where appropriate.
- Use indexes and validators as defined in the [schema](./schema.md) for performance and integrity.

## See Also
- [Schema](./schema.md)
- [Ontology](./ontology.md)
- [Agents](./agents.md)
- [Workflow](./workflow.md)
- [Actions](./actions.md)
