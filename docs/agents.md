---
title: Getting Started with ONE
description: Learn how to set up and start building with the ONE framework
date: 2024-02-02
tags:
  - agents
order: 1
---

**ONE Agent System**

**1. Introduction & System Overview**

- **Purpose:** This document outlines the architecture, functionality, and workflow of the ONE Agent System. This system leverages a team of specialized AI agents, guided by the **Elevate Framework** to assist users (e.g., Ecom Owners, Marketers, Students) in navigating the customer journey and executing marketing/growth strategies.
- **Core Concept:** Instead of a single general AI, the system employs a collaborative team of distinct AI agents, each with a specific role and expertise. These agents interact with the user and potentially each other, orchestrated by a lead agent (**Director**), to provide guidance and generate assets aligned with the Elevate Framework.
- **Technology Stack:** Built using [React, Shadcn UI, Convex backend, OpenAI/Gemini/Anthropic APIs].
- **Deployment:** Successfully tested in local development environments and deployed via Vercel.

**2. System Architecture**

- **Frontend (`/src`):**
  - **UI Components (`/src/components/ui`):** Reusable Shadcn UI components for the interface.
  - **Authenticated Views:** Chat, sidebar, agent profiles, conversation management, all powered by Convex queries/mutations.
  - **Routing:** Handled by `type-route` (`/src/routes.ts`).
- **Backend (`/convex`):**
  - **Database Schema (`/convex/schema.ts`):** Defines tables for users, conversations, agents, participants, messages, flows, lessons, agentThreads, agentMessages, etc. (see [schema.md](./schema.md)).
  - **Authentication:** Managed via `@convex-dev/auth`.
  - **Core Logic:** Mutations and queries organized by feature, enforcing referential integrity and permissions.
  - **AI Agent Logic:** Internal actions for message processing, tool usage, history, and agent orchestration. Agent chat and workflow powered by agentThreads and agentMessages.
  - **HTTP Endpoints:** For webhooks and external API integrations.
- **Shared Utilities:** Common functions/types for mentions, tools, etc.

**2.1. Agent Data Model & Schema Alignment (2024 Update)**

The ONE Agent System is fully powered by a robust, extensible schema (see [ontology.md](./ontology.md)), supporting all requirements for agent roles, configuration, orchestration, and future growth. The agent data model includes:

- `name`, `description`, `prompt`, `tools`, `knowledge`, `memories`, `model`, `kind`, `createdBy`, `createdAt`, `updatedAt`, `updatedBy`, `delegatesTo`, `tags`, `avatarUrl`
- **Extensibility:** All agents support a `meta` field for future-proofing.
- **Agent collaboration:** Agents can be orchestrated via flows, lessons, and agentThreads/agentMessages for chat and workflow.

**Example Agent Document:**

```json
{
  "_id": "agentId_123",
  "name": "Writer",
  "description": "Generates marketing copy and creative assets.",
  "prompt": "You are the Writer agent...",
  "tools": ["toolId_webSearch", "toolId_summarizer"],
  "knowledge": { "foundationId": "..." },
  "memories": [{ "summary": "User prefers short headlines." }],
  "model": "gpt-4",
  "kind": "system_agent",
  "createdBy": "userId_admin",
  "createdAt": 1710000000000,
  "updatedAt": 1710000001000,
  "tags": ["copywriting", "content"],
  "avatarUrl": "/avatars/writer.png",
  "meta": { "custom": true }
}
```

**Agent Configuration & Orchestration:**

- Agents are orchestrated by the Director or by user @mentions, with explicit delegation/team structure modeled in the schema.
- Each agent's configuration, personality, and toolset are first-class, queryable data.
- Agents participate in flows (project/learning), lessons (assignments), and agentThreads (chat/workflow), with all relationships enforced by referential integrity.
- Permissions and visibility are enforced as described in [workflow.md](./workflow.md).

**Agent Collaboration & Chat:**

- **agentThreads:** Each thread links a user/agent to a chat context, with `threadType` and `context` for analytics and filtering.
- **agentMessages:** Store all messages, tool calls, and results, supporting RAG and advanced orchestration.
- **flows/lessons:** Agents can be assigned to steps in flows, with progress tracked in flowProgress.

**Extensibility:**
- All agent-related tables support a `meta` field for custom data.
- New agent types, roles, and orchestration patterns can be added without breaking existing logic.

**Cross-References:**
- See [ontology.md](./ontology.md) for entity relationships and field definitions.
- See [schema.md](./schema.md) for table/field details.
- See [workflow.md](./workflow.md) for roles, permissions, and orchestration patterns.

**3. The Agent Team Architecture**

The core innovation is the replacement of a generic "triage" agent with a sophisticated team structure, led by a **Director**. Specialist agents (Sage, Teacher, Writer, etc.) are orchestrated via flows, lessons, and chat threads, with all actions and assignments tracked in the schema.

- **Director:** Orchestrates workflow, delegates tasks, tracks progress.
- **Sage:** Knowledge base and context provider.
- **Teacher:** Explains concepts and framework steps.
- **Writer:** Generates marketing assets and content.
- **Marketer, Seller, Media Buyer, Advocate, Guide, etc.:** Each with a focused domain of expertise.

**Agent Roles, Permissions, and Orchestration:**
- See [workflow.md](./workflow.md) for the full permissions model and orchestration scenarios.
- All agent actions, assignments, and chat are tracked in the schema for auditability and analytics.

**4. Future Enhancements**
- Visual progress tracking through the framework (flows/lessons/flowProgress).
- Direct integration with Ecom platforms/analytics for data retrieval/analysis.
- More sophisticated inter-agent collaboration protocols.
- User-customizable agent personalities and toolsets.

**5. Conclusion**

The ONE Agent Team architecture transforms the application from a simple chatbot into a collaborative, multi-expert AI system designed to guide users systematically through the Elevate Ecommerce Framework. Led by the strategic Director and supported by specialists like the Sage, Teacher, and Writer, this system provides profound insights and accelerates the implementation of proven growth strategies.

**See Also:**
- [Ontology](./ontology.md)
- [Schema](./schema.md)
- [Workflow](./workflow.md)

# ONE Agent Team: Roles, Schema, and Orchestration

## Agent Roles & Summary Table

| Agent Role   | Purpose/Expertise                | Key Schema Fields                |
|--------------|----------------------------------|----------------------------------|
| Director     | Orchestrates, delegates, triages | kind, delegatesTo, team, assignments |
| Sage         | Knowledge base, context provider | knowledge, tools, meta           |
| Teacher      | Explains, guides learning        | flows, lessons, progress         |
| Writer       | Generates content/assets         | tools, knowledge, tags           |
| Marketer     | Campaigns, hooks, gifts          | tools, flows, assignments        |
| Seller       | Sales, conversion optimization   | tools, flows, assignments        |
| Media Buyer  | Paid media, analytics            | tools, analytics                 |
| Advocate     | Reviews, referrals, advocacy     | flows, assignments               |
| Guide        | Onboarding, customer journey     | flows, progress, assignments     |

## Agent Configuration & Schema Mapping

Each agent is defined in the `agent` table (see schema.md):
- `name`, `description`, `kind`, `tools`, `knowledge`, `delegatesTo`, `meta`, `createdBy`, `createdAt`, `updatedAt`, `tags`, `avatarUrl`
- Agents are assigned to flows, lessons, and chat threads via `assignments`, `progress`, `agentThreads`, `agentMessages`.

**Example: Writer Agent JSON**
```json
{
  "_id": "agentId_writer",
  "name": "Writer",
  "description": "Generates marketing copy and creative assets.",
  "kind": "system",
  "tools": ["toolId_webSearch", "toolId_summarizer"],
  "knowledge": ["knowledgeId_foundation"],
  "tags": ["copywriting", "content"],
  "createdBy": "userId_admin",
  "createdAt": 1710000000000,
  "avatarUrl": "/avatars/writer.png",
  "meta": { "custom": true }
}
```

## Agent Orchestration & Team Formation

- The **Director** agent forms teams, delegates tasks, and tracks assignments/progress in the schema (`assignments`, `progress`).
- Teams are dynamically created for projects, onboarding, or campaigns.
- Example: Director assigns Writer and Marketer to a "Gift" step in a flow, tracked in `assignments` and `progress`.

**Example: Team Assignment Mutation (TypeScript/Convex)**
```typescript
export const assignAgentsToStep = mutation(async ({ db }, { flowId, step, agentIds }) => {
  for (const agentId of agentIds) {
    await db.insert("assignments", {
      flowId,
      step,
      agentId,
      assignedAt: Date.now(),
      status: "assigned"
    });
  }
});
```

## Permissions, Visibility, and Analytics

- Agent actions, assignments, and collaborations are tracked for analytics (see analytics.md).
- Permissions and visibility are enforced via the `permissions` table.
- Example: Only certain agents can access specific flows or knowledge, as defined in `permissions`.

## Concrete Examples

### Agent Creation
```typescript
export const createAgent = mutation(async ({ db }, { name, kind, tools, knowledge, createdBy }) => {
  return db.insert("agent", {
    name,
    kind,
    tools,
    knowledge,
    createdBy,
    createdAt: Date.now(),
    meta: {}
  });
});
```

### Team Formation
- Director creates a team for a campaign, adds agents via `assignments`.

### Assignment to Flows/Lessons
- Assign agents to steps, tracked in `assignments` and `progress`.

### Agent-to-Agent Collaboration
- Agents collaborate in a chat thread (`agentThreads`, `agentMessages`).

## Cross-References
- See [schema.md](./schema.md) for table/field details.
- See [ontology.md](./ontology.md) for relationships.
- See [analytics.md](./analytics.md) for measuring agent/team impact.

## Extensibility
- Add new agent types, roles, or orchestration patterns using `meta` fields and extensible schema.
- Schema supports future growth without breaking existing logic.

The ONE Agent Team architecture transforms the application from a simple chatbot into a collaborative, multi-expert AI system designed to guide users systematically through the Elevate Framework and beyond.
