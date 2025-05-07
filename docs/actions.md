---
title: Convex Actions Reference
description: Developer guide to Convex actions for the ONE agent/human system
order: 3
---

# Convex Actions: Developer Reference

> See also: [Schema](./schema.md) | [Ontology](./ontology.md) | [Agents](./agents.md) | [Workflow](./workflow.md)

Convex actions are server-side functions that orchestrate business logic, agent workflows, chat, and collaboration in the ONE system. Actions can be called from the frontend, other actions, or workflows, and are the primary way to mutate state, trigger agent behavior, and coordinate flows.

## Best Practices
- Use actions for any operation that changes state, triggers agent logic, or coordinates multiple tables/entities.
- Keep actions composable and focused; use helper functions for complex logic.
- Always validate arguments using Convex validators (`v.string()`, `v.id()`, etc.).
- Use `meta` fields and extensible patterns for future-proofing.
- Catch and handle errors gracefully; use the functional approach for error handling as described in [project rules](./schema.md).

## Common Action Patterns

### 1. Create an Agent
```ts
export const createAgent = action({
  args: {
    name: v.string(),
    description: v.string(),
    kind: v.union(v.literal("system_agent"), v.literal("user_agent")),
    createdBy: v.optional(v.id("users")),
    prompt: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    delegatesTo: v.optional(v.array(v.id("agents"))),
    tools: v.optional(v.array(v.id("tools"))),
    tags: v.optional(v.array(v.string())),
    model: v.optional(v.string()),
    attachedPrompts: v.optional(v.array(v.id("prompts"))),
  },
  handler: async (ctx, args) => {
    const agentId = await ctx.db.insert("agents", {
      ...args,
      createdAt: Date.now(),
    });
    return agentId;
  },
});
```

### 2. Assign a Lesson (Flow or LMS)
```ts
export const assignLesson = action({
  args: {
    flowId: v.optional(v.id("flows")),
    courseId: v.optional(v.id("courses")),
    stepName: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    agentId: v.optional(v.id("agents")),
    role: v.optional(v.string()),
    assignedBy: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("lessons", {
      ...args,
      assignedAt: Date.now(),
      createdAt: Date.now(),
    });
  },
});
```

### 3. Send an Agent Message (Chat/Workflow)
```ts
export const sendAgentMessage = action({
  args: {
    threadId: v.id("agentThreads"),
    authorId: v.optional(v.id("users")),
    kind: v.union(v.literal("user"), v.literal("agent"), v.literal("system")),
    content: v.string(),
    toolCall: v.optional(v.any()),
    result: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("agentMessages", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
```

### 4. Update Flow Progress
```ts
export const updateFlowProgress = action({
  args: {
    flowId: v.id("flows"),
    stepName: v.string(),
    userId: v.optional(v.id("users")),
    agentId: v.optional(v.id("agents")),
    status: v.union(
      v.literal("Not Started"),
      v.literal("In Progress"),
      v.literal("Completed"),
      v.literal("Blocked"),
      v.literal("Skipped")
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("flowProgress", {
      ...args,
      updatedAt: Date.now(),
    });
  },
});
```

## Extensibility
- All actions should support `meta` fields for custom data.
- Use indexes and validators as defined in the [schema](./schema.md) for performance and integrity.
- Actions can be composed in workflows for durable, long-running operations (see [workflow.md](./workflow.md)).

## See Also
- [Schema](./schema.md)
- [Ontology](./ontology.md)
- [Agents](./agents.md)
- [Workflow](./workflow.md)
