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

Absolutely! Here’s a synthesis of how **Novu’s integrations and tools** work, and how you can model and extend this in your unified ONE schema to support robust third-party connectivity for notifications, automations, and agent actions.
 
---

## 1. **What Novu Provides for Integrations**

From the [Novu Docs](https://docs.novu.co/platform/overview):

- **Integrations** are first-class: Novu supports connecting to third-party providers for email, SMS, chat, push, and more (e.g., SendGrid, Twilio, Slack, Discord, WhatsApp, etc.).
- **Integration Management**: Each integration is configured per environment/organisation, with credentials, settings, and status.
- **Channels** are mapped to integrations: When you send a notification via a channel, Novu routes it through the appropriate integration.
- **API/SDKs**: Novu provides APIs and SDKs to trigger notifications, manage subscribers, and handle preferences.
- **Workflows**: You can build notification/automation workflows that use integrations as steps (e.g., send email, then SMS, then Slack).
- **Multi-tenancy**: Integrations can be scoped per organisation/environment.

---

## 2. **How to Model This in Your Unified Schema**

### **A. Add an `integration` Table**

```typescript
integration: defineTable({
  organisationId: v.id("organisation"),
  provider: v.string(), // e.g., "sendgrid", "twilio", "slack"
  channelType: v.string(), // "email", "sms", "chat", "push", etc.
  credentials: v.any(), // Encrypted config/keys
  settings: v.optional(v.any()),
  status: v.optional(v.string()), // "active", "inactive", "error"
  createdAt: v.number(),
  updatedAt: v.optional(v.number()),
  meta: v.optional(v.any()),
}),
```

- **organisationId**: Multi-tenant support.
- **provider**: The third-party service (SendGrid, Twilio, etc.).
- **channelType**: What kind of messages this integration handles.
- **credentials/settings**: Securely store API keys, tokens, and config.
- **status**: Track if the integration is working.

### **B. Link Integrations to Channels/Workflows**

- Each **channel** (chat, email, SMS, etc.) can reference an integration.
- **Workflows** can use integrations as steps (e.g., “send via Slack”).
- **Tools** for agents can include integration actions (e.g., “sendEmail”, “sendSMS”, “postToSlack”).

### **C. Example: Tool Table for Agent Actions**

```typescript
tool: defineTable({
  name: v.string(),
  description: v.optional(v.string()),
  integrationId: v.optional(v.id("integration")), // If this tool uses a third-party integration
  action: v.string(), // e.g., "sendEmail", "sendSMS", "postToSlack"
  config: v.optional(v.any()),
  meta: v.optional(v.any()),
}),
```

- **integrationId**: Connects the tool to a specific integration.
- **action**: What the tool does (send email, post to chat, etc.).

---

## 3. **How Agents/Users Use Integrations**

- **Agents** can be granted tools that use integrations (e.g., “send an SMS via Twilio”).
- **Users** can connect their own integrations (e.g., link their Slack workspace, Google Drive, Notion, etc.).
- **Permissions**: Control who can use which integrations/tools (private by default, shareable with groups/users).

---

## 4. **Extending to Other Third-Party Services**

- **Beyond notifications**: You can use the same pattern for any third-party API (CRM, calendar, storage, payments, etc.).
- **Knowledge integrations**: Connect to Google Drive, Notion, OneDrive, etc., and store connection info in the `integration` table.
- **Agent actions**: Define tools that let agents use these integrations (e.g., “search Google Drive”, “create Notion page”).

---

## 5. **Summary Table Example**

| Table         | Purpose                                 | Key Fields/Relationships                |
|---------------|-----------------------------------------|-----------------------------------------|
| integration   | Third-party provider config             | organisationId, provider, channelType, credentials, status |
| tool          | Agent/user action, may use integration  | integrationId, action, config           |
| channel       | Communication channel                   | integrationId (optional)                |
| workflow      | Automation/notification flow            | steps reference integrations/tools       |

---

## 6. **References**

- [Novu Integrations Docs](https://docs.novu.co/platform/overview)
- [Novu API Reference](https://docs.novu.co/api-reference/)
- [Novu Providers List](https://docs.novu.co/channels/overview/)

---

**Ready for code?**  
If you want, I can:
- Add the `integration` and extended `tool` tables to your schema.
- Provide example agent actions for using integrations.
- Show how to manage integration credentials and permissions.

Let me know which part you want to implement or see next!

