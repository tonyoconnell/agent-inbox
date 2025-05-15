---
title: ONE Network Unified Schema (Novu + ONE)
order: 1
description: Complete, production-grade schema for multi-tenant, multi-channel, agent-augmented notifications and collaboration
---

# ONE Network Unified Schema (Novu + ONE)

> This schema is a comprehensive, production-grade foundation for the ONE Network, merging all core Novu notification platform entities with ONE-specific extensions (agents, tools, onboarding, knowledge, permissions, etc.).

## Schema Overview

- **Multi-tenancy:** Every table has `organisationId`, and most have `environmentId` for dev/prod separation.
- **Environments:** Support for multiple environments per organisation.
- **Integrations:** Robust third-party provider support (email, SMS, chat, push, storage, etc.).
- **Channels:** Multi-channel messaging (chat, email, SMS, push, in-app, etc.).
- **Templates/Workflows:** Reusable, multi-step notification and automation flows.
- **Subscribers:** All users (humans, agents, systems).
- **Agents:** AI agents as first-class subscribers, with tools, knowledge, and actions.
- **Groups/Teams:** For sharing, permissions, and collaboration.
- **Permissions:** Explicit, flexible, private-by-default, with public/share controls.
- **Preferences:** Per-subscriber, per-channel notification settings.
- **Triggers:** API/webhook endpoints to start workflows.
- **Jobs/Execution:** Track workflow/job status, logs, errors, delivery.
- **API Keys:** Secure, scoped access for integrations and users.
- **Branding/Theming:** Org-level customization.
- **Audit Logs:** Security, compliance, debugging.
- **Limits/Quotas:** Usage tracking and enforcement.
- **Meta/Extensibility:** All tables support `meta` fields for future-proofing.

---

## Table Definitions

### organisation
- **Purpose:** Multi-tenant root entity.
- **Fields:** `_id`, `name`, `meta`

### environment
- **Purpose:** Dev/prod/test separation per org.
- **Fields:** `_id`, `organisationId`, `name`, `apiKey`, `createdAt`, `meta`

### subscriber
- **Purpose:** All users (humans, agents, systems).
- **Fields:** `_id`, `organisationId`, `environmentId`, `kind`, `email`, `phone`, `isHuman`, `agentId?`, `fullContactInfo`, `meta`

### agent
- **Purpose:** AI agents (system, user, personal).
- **Fields:** `_id`, `organisationId`, `environmentId`, `ownerId`, `kind`, `name`, `description`, `tools`, `knowledge`, `model`, `avatarUrl`, `createdAt`, `updatedAt`, `meta`

### group
- **Purpose:** Teams, sharing, permissions.
- **Fields:** `_id`, `organisationId`, `environmentId`, `name`, `members`, `meta`

### tool
- **Purpose:** Capabilities for agents (may use integrations).
- **Fields:** `_id`, `name`, `description`, `integrationId?`, `action`, `config`, `meta`

### integration
- **Purpose:** Third-party provider config (email, SMS, chat, storage, etc.).
- **Fields:** `_id`, `organisationId`, `environmentId`, `provider`, `channelType`, `credentials`, `settings`, `status`, `createdAt`, `updatedAt`, `meta`

### channel
- **Purpose:** Communication (chat, email, SMS, push, etc.).
- **Fields:** `_id`, `organisationId`, `environmentId`, `type`, `title`, `integrationId?`, `createdBy`, `createdAt`, `updatedAt`, `tags`, `meta`

### notificationTemplate
- **Purpose:** Reusable, multi-channel message templates.
- **Fields:** `_id`, `organisationId`, `environmentId`, `name`, `channels`, `content`, `variables`, `createdAt`, `updatedAt`, `meta`

### workflow
- **Purpose:** Multi-step notification/automation flows.
- **Fields:** `_id`, `organisationId`, `environmentId`, `name`, `steps`, `createdBy`, `createdAt`, `updatedAt`, `meta`

### message
- **Purpose:** Individual notification events/messages.
- **Fields:** `_id`, `organisationId`, `environmentId`, `channelId`, `authorId`, `content`, `templateId?`, `workflowId?`, `createdAt`, `attachments`, `meta`

### topic
- **Purpose:** Targeting/segmentation for notifications.
- **Fields:** `_id`, `organisationId`, `environmentId`, `name`, `description`, `createdAt`, `meta`

### preference
- **Purpose:** Per-subscriber, per-channel notification settings.
- **Fields:** `_id`, `organisationId`, `environmentId`, `subscriberId`, `channelType`, `enabled`, `meta`

### trigger
- **Purpose:** API/webhook endpoints to start workflows.
- **Fields:** `_id`, `organisationId`, `environmentId`, `workflowId`, `type`, `endpoint`, `meta`

### job
- **Purpose:** Workflow/job step execution, status, logs.
- **Fields:** `_id`, `organisationId`, `environmentId`, `workflowId`, `status`, `startedAt`, `finishedAt`, `logs`, `meta`

### executionDetail
- **Purpose:** Delivery status, errors, logs for jobs.
- **Fields:** `_id`, `jobId`, `status`, `error`, `log`, `createdAt`, `meta`

### apiKey
- **Purpose:** Secure, scoped access for integrations and users.
- **Fields:** `_id`, `organisationId`, `environmentId`, `key`, `createdBy`, `createdAt`, `meta`

### branding
- **Purpose:** Org-level theming and customization.
- **Fields:** `_id`, `organisationId`, `environmentId`, `theme`, `logoUrl`, `meta`

### auditLog
- **Purpose:** Security, compliance, debugging.
- **Fields:** `_id`, `organisationId`, `environmentId`, `action`, `actorId`, `targetId?`, `details`, `createdAt`, `meta`

### limit
- **Purpose:** Usage tracking and enforcement.
- **Fields:** `_id`, `organisationId`, `environmentId`, `type`, `value`, `period`, `meta`

### knowledge
- **Purpose:** RAG, search, agent/user knowledge.
- **Fields:** `_id`, `organisationId`, `environmentId`, `ownerType`, `ownerId`, `content`, `vector`, `tags`, `meta`

### onboardingFlow
- **Purpose:** Tracks onboarding state, personal agent creation, Director handoff.
- **Fields:** `_id`, `organisationId`, `environmentId`, `subscriberId`, `status`, `personalAgentId?`, `kycStatus?`, `meta`

### event, reminder, task, product, broadcast, analytics, tag, comment, reaction, follow, etc.
- **Purpose:** All other ONE/Novu tables (see previous schema for full details).
- **Fields:** Standard fields + `organisationId` + `environmentId` + `meta`

---

# Full Convex Schema (TypeScript)

```typescript
// convex/schema.ts - Complete Novu + ONE Unified Schema
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  organisation: defineTable({
    name: v.string(),
    meta: v.optional(v.any()),
  }),
  environment: defineTable({
    organisationId: v.id("organisation"),
    name: v.string(),
    apiKey: v.string(),
    createdAt: v.number(),
    meta: v.optional(v.any()),
  }),
  subscriber: defineTable({
    organisationId: v.id("organisation"),
    environmentId: v.id("environment"),
    kind: v.union(v.literal("human"), v.literal("agent"), v.literal("system")),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    isHuman: v.boolean(),
    agentId: v.optional(v.id("agent")),
    fullContactInfo: v.optional(v.any()),
    meta: v.optional(v.any()),
  }),
  agent: defineTable({
    organisationId: v.id("organisation"),
    environmentId: v.id("environment"),
    ownerId: v.optional(v.id("subscriber")),
    kind: v.union(v.literal("system"), v.literal("user"), v.literal("personal")),
    name: v.string(),
    description: v.optional(v.string()),
    tools: v.optional(v.array(v.id("tool"))),
    knowledge: v.optional(v.array(v.id("knowledge"))),
    model: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    meta: v.optional(v.any()),
  }),
  group: defineTable({
    organisationId: v.id("organisation"),
    environmentId: v.id("environment"),
    name: v.string(),
    members: v.array(v.id("subscriber")),
    meta: v.optional(v.any()),
  }),
  tool: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    integrationId: v.optional(v.id("integration")),
    action: v.string(),
    config: v.optional(v.any()),
    meta: v.optional(v.any()),
  }),
  integration: defineTable({
    organisationId: v.id("organisation"),
    environmentId: v.id("environment"),
    provider: v.string(),
    channelType: v.string(),
    credentials: v.any(),
    settings: v.optional(v.any()),
    status: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    meta: v.optional(v.any()),
  }),
  channel: defineTable({
    organisationId: v.id("organisation"),
    environmentId: v.id("environment"),
    type: v.string(),
    title: v.optional(v.string()),
    integrationId: v.optional(v.id("integration")),
    createdBy: v.id("subscriber"),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    meta: v.optional(v.any()),
  }),
  notificationTemplate: defineTable({
    organisationId: v.id("organisation"),
    environmentId: v.id("environment"),
    name: v.string(),
    channels: v.array(v.string()),
    content: v.any(),
    variables: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    meta: v.optional(v.any()),
  }),
  workflow: defineTable({
    organisationId: v.id("organisation"),
    environmentId: v.id("environment"),
    name: v.string(),
    steps: v.optional(v.array(v.any())),
    createdBy: v.id("subscriber"),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    meta: v.optional(v.any()),
  }),
  message: defineTable({
    organisationId: v.id("organisation"),
    environmentId: v.id("environment"),
    channelId: v.id("channel"),
    authorId: v.id("subscriber"),
    content: v.string(),
    templateId: v.optional(v.id("notificationTemplate")),
    workflowId: v.optional(v.id("workflow")),
    createdAt: v.number(),
    attachments: v.optional(v.array(v.any())),
    meta: v.optional(v.any()),
  }),
  topic: defineTable({
    organisationId: v.id("organisation"),
    environmentId: v.id("environment"),
    name: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
    meta: v.optional(v.any()),
  }),
  preference: defineTable({
    organisationId: v.id("organisation"),
    environmentId: v.id("environment"),
    subscriberId: v.id("subscriber"),
    channelType: v.string(),
    enabled: v.boolean(),
    meta: v.optional(v.any()),
  }),
  trigger: defineTable({
    organisationId: v.id("organisation"),
    environmentId: v.id("environment"),
    workflowId: v.id("workflow"),
    type: v.string(),
    endpoint: v.string(),
    meta: v.optional(v.any()),
  }),
  job: defineTable({
    organisationId: v.id("organisation"),
    environmentId: v.id("environment"),
    workflowId: v.id("workflow"),
    status: v.string(),
    startedAt: v.number(),
    finishedAt: v.optional(v.number()),
    logs: v.optional(v.array(v.string())),
    meta: v.optional(v.any()),
  }),
  executionDetail: defineTable({
    jobId: v.id("job"),
    status: v.string(),
    error: v.optional(v.string()),
    log: v.optional(v.string()),
    createdAt: v.number(),
    meta: v.optional(v.any()),
  }),
  apiKey: defineTable({
    organisationId: v.id("organisation"),
    environmentId: v.id("environment"),
    key: v.string(),
    createdBy: v.id("subscriber"),
    createdAt: v.number(),
    meta: v.optional(v.any()),
  }),
  branding: defineTable({
    organisationId: v.id("organisation"),
    environmentId: v.id("environment"),
    theme: v.any(),
    logoUrl: v.optional(v.string()),
    meta: v.optional(v.any()),
  }),
  auditLog: defineTable({
    organisationId: v.id("organisation"),
    environmentId: v.id("environment"),
    action: v.string(),
    actorId: v.id("subscriber"),
    targetId: v.optional(v.string()),
    details: v.optional(v.any()),
    createdAt: v.number(),
    meta: v.optional(v.any()),
  }),
  limit: defineTable({
    organisationId: v.id("organisation"),
    environmentId: v.id("environment"),
    type: v.string(),
    value: v.number(),
    period: v.string(),
    meta: v.optional(v.any()),
  }),
  knowledge: defineTable({
    organisationId: v.id("organisation"),
    environmentId: v.id("environment"),
    ownerType: v.union(v.literal("agent"), v.literal("user")),
    ownerId: v.string(),
    content: v.string(),
    vector: v.optional(v.array(v.number())),
    tags: v.optional(v.array(v.string())),
    meta: v.optional(v.any()),
  }),
  onboardingFlow: defineTable({
    organisationId: v.id("organisation"),
    environmentId: v.id("environment"),
    subscriberId: v.id("subscriber"),
    status: v.string(),
    personalAgentId: v.optional(v.id("agent")),
    kycStatus: v.optional(v.string()),
    meta: v.optional(v.any()),
  }),
  // ...add all other ONE/Novu tables as needed (event, reminder, task, product, broadcast, analytics, tag, comment, reaction, follow, etc.)
});
```

# shadcn/ui Component Mapping & Example Code

This section maps major schema entities to shadcn/ui components and provides example code for rendering/managing them in the UI. See [ui.md](./ui.md) for full UI/UX details.

## Summary Table: Schema Entities & shadcn/ui Components
| Schema Entity   | shadcn/ui Components                |
|----------------|-------------------------------------|
| Agent          | Card, Avatar, Badge, Button         |
| Conversation   | Card, Tabs, Badge, List, Button     |
| Message        | Card, Badge, Avatar, Button         |
| Group          | Card, Badge, List, Button           |
| Tool           | Card, Badge, Button                 |
| Assignment     | Badge, List, Button                 |
| Progress       | ProgressBar, Badge, Card            |
| Analytics      | Card, Tabs, Chart (custom), Badge   |

---

## Example: Agent Card
```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AgentCard({ agent }) {
  return (
    <Card>
      <CardHeader className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={agent.avatarUrl} />
          <AvatarFallback>{agent.name[0]}</AvatarFallback>
        </Avatar>
        <CardTitle>{agent.name}</CardTitle>
        <Badge variant="outline">{agent.kind}</Badge>
      </CardHeader>
      <CardContent>
        <p>{agent.description}</p>
        <div className="flex space-x-2 mt-2">
          {agent.tools?.map(tool => <Badge key={tool}>{tool}</Badge>)}
        </div>
        <Button variant="outline" size="sm" className="mt-4">View Profile</Button>
      </CardContent>
    </Card>
  );
}
```

---

## Example: Conversation List Item
```tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ConversationListItem({ conversation }) {
  return (
    <Card className="flex items-center justify-between p-4 mb-2 cursor-pointer">
      <div>
        <h3 className="font-medium">{conversation.title}</h3>
        <p className="text-sm text-gray-500">{conversation.lastMessagePreview}</p>
      </div>
      <Badge variant="outline">{conversation.status}</Badge>
    </Card>
  );
}
```

---

## Example: Message Bubble
```tsx
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function MessageBubble({ message }) {
  return (
    <Card className="flex items-start space-x-3 p-3 mb-2">
      <Avatar>
        <AvatarFallback>{message.authorName[0]}</AvatarFallback>
      </Avatar>
      <div>
        <div className="flex items-center space-x-2">
          <span className="font-medium">{message.authorName}</span>
          {message.tags?.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
        </div>
        <p>{message.content}</p>
      </div>
    </Card>
  );
}
```

---

## Example: Group Badge
```tsx
import { Badge } from "@/components/ui/badge";

export function GroupBadge({ group }) {
  return <Badge variant="default">{group.name}</Badge>;
}
```

---

## Example: Tool Card
```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ToolCard({ tool }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{tool.name}</CardTitle>
        <Badge variant="outline">Tool</Badge>
      </CardHeader>
      <CardContent>
        <p>{tool.description}</p>
      </CardContent>
    </Card>
  );
}
```

---

## Example: Assignment Badge
```tsx
import { Badge } from "@/components/ui/badge";

export function AssignmentBadge({ assignment }) {
  return <Badge variant="secondary">Assigned: {assignment.agentName}</Badge>;
}
```

---

## Example: Progress Bar
```tsx
import { ProgressBar } from "@/components/ui/progress-bar";

export function StepProgress({ progress }) {
  return <ProgressBar value={progress.percent} />;
}
```

---

These examples show how to map schema entities to shadcn/ui components for a modern, extensible, and permission-aware UI. See [ui.md](./ui.md) for more details and full UI/UX patterns.

