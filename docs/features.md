---
title: Features
order: 1
description: Learn about the robust, multi-tenant, agent-augmented features of the ONE Network (Novu + ONE schema)
---

# Features

## Summary Table
| Feature                | Purpose/Description                                      |
|------------------------|---------------------------------------------------------|
| Environments           | Multi-tenant, dev/prod/test separation                  |
| Integrations           | Third-party provider support (email, SMS, chat, etc.)   |
| Notification Templates | Reusable, multi-channel message templates               |
| Workflows              | Multi-step notification/automation flows                |
| Topics                 | Targeting/segmentation for notifications                |
| Preferences            | Per-subscriber, per-channel notification settings       |
| Triggers               | API/webhook endpoints to start workflows                |
| Jobs & Execution       | Workflow/job step execution, status, logs               |
| API Keys               | Secure, scoped access for integrations and users        |
| Branding               | Org-level theming and customization                     |
| Audit Logs             | Security, compliance, debugging                         |
| Limits/Quotas          | Usage tracking and enforcement                          |
| Agents                 | AI agents as first-class subscribers                    |
| Tools                  | Capabilities/actions for agents, may use integrations   |
| Knowledge              | RAG, search, agent/user knowledge                       |
| Onboarding             | Tracks onboarding, personal agent creation, permissions |
| Permissions            | Explicit, flexible, private-by-default sharing          |
| ...                    | ...                                                     |

---

## 1. Environments
- **Definition:** Logical separation for dev/prod/test per organisation.
- **Schema:** `environment` table, referenced by all major entities.
- **Purpose:** Isolate data, integrations, and workflows by environment.
- **Legacy Mapping:** Previously, most tables only had `organisationId`. Now, add `environmentId` everywhere. Old code referencing only `organisationId` will still work, but new code should always use both for full isolation.
- **Example:**
```typescript
// New structure
const envId = ...;
const channels = await db.query("channel").filter(q => q.eq(q.field("environmentId"), envId)).collect();
// Old structure (still works, but less precise)
const orgId = ...;
const agents = await db.query("agent").filter(q => q.eq(q.field("organisationId"), orgId)).collect();
```

## 2. Integrations
- **Definition:** Third-party provider configuration (email, SMS, chat, storage, etc.).
- **Schema:** `integration` table, linked to tools, channels, workflows.
- **Purpose:** Enable agents and workflows to interact with external services.
- **Legacy Mapping:** Previously, integrations were often hardcoded or handled in code. Now, they are first-class, configurable, and multi-tenant.
- **Example:**
```typescript
// New: Assign a tool to an agent that uses a specific integration
await db.insert("tool", { name: "sendEmail", integrationId, action: "sendEmail", ... });
```

## 3. Notification Templates
- **Definition:** Reusable, multi-channel message templates.
- **Schema:** `notificationTemplate` table.
- **Purpose:** Standardize and reuse notification content across workflows.
- **Legacy Mapping:** Previously, templates were often embedded in code or UI. Now, they are stored and versioned in the database.

## 4. Workflows
- **Definition:** Multi-step notification/automation flows.
- **Schema:** `workflow` table, with steps, triggers, jobs.
- **Purpose:** Automate complex notification and agent actions.
- **Legacy Mapping:** Old code may have used ad-hoc actions or scripts. Now, workflows are declarative and database-driven.

## 5. Topics
- **Definition:** Targeting/segmentation for notifications.
- **Schema:** `topic` table.
- **Purpose:** Group subscribers for targeted messaging.
- **Legacy Mapping:** Previously, targeting was often manual or based on tags. Now, topics are first-class and indexed.

## 6. Preferences
- **Definition:** Per-subscriber, per-channel notification settings.
- **Schema:** `preference` table.
- **Purpose:** Allow users/agents to control notification delivery.
- **Legacy Mapping:** Notification preferences were often global or per-user. Now, they are per-subscriber, per-channel, and extensible.

## 7. Triggers
- **Definition:** API/webhook endpoints to start workflows.
- **Schema:** `trigger` table.
- **Purpose:** Integrate external systems and automate workflows.
- **Legacy Mapping:** Previously, triggers were handled by custom endpoints. Now, they are declarative and linked to workflows.

## 8. Jobs & Execution Details
- **Definition:** Workflow/job step execution, status, logs.
- **Schema:** `job`, `executionDetail` tables.
- **Purpose:** Track workflow progress, errors, and delivery.
- **Legacy Mapping:** Job status and logs were often ad-hoc or in memory. Now, they are persistent and queryable.

## 9. API Keys
- **Definition:** Secure, scoped access for integrations and users.
- **Schema:** `apiKey` table.
- **Purpose:** Control and audit access to APIs and integrations.
- **Legacy Mapping:** API keys were often managed outside the DB. Now, they are first-class and auditable.

## 10. Branding
- **Definition:** Org-level theming and customization.
- **Schema:** `branding` table.
- **Purpose:** Custom look and feel per organisation/environment.

## 11. Audit Logs
- **Definition:** Security, compliance, debugging.
- **Schema:** `auditLog` table.
- **Purpose:** Track all critical actions and changes.

## 12. Limits/Quotas
- **Definition:** Usage tracking and enforcement.
- **Schema:** `limit` table.
- **Purpose:** Enforce plan limits, prevent abuse.

## 13. Agents, Tools, Knowledge, Onboarding, Permissions
- **Agents:** AI agents as first-class subscribers, with tools, knowledge, and actions. Now linked to environments and organisations.
- **Tools:** Capabilities/actions for agents, may use integrations. Tools are now first-class and can be assigned dynamically.
- **Knowledge:** RAG, search, agent/user knowledge. Knowledge is now multi-tenant and environment-aware.
- **Onboarding:** Tracks onboarding, personal agent creation, permissions. Onboarding flows are now explicit and queryable.
- **Permissions:** Explicit, flexible, private-by-default, shareable with users/groups. Permissions are now stored in the DB and can be managed via UI or API.

## 14. Extensibility, Multi-Tenancy, and Environment Support
- All tables have `organisationId` and most have `environmentId` for robust multi-tenancy and environment separation (dev/prod/test).
- All tables have a `meta` field for extensibility and custom data.
- Permissions and sharing are explicit and flexible.
- See [schema.md](./schema.md) and [ontology.md](./ontology.md) for full details.

---

## Migration & Compatibility Notes
- **Old code** that only uses `organisationId` will still work, but new features (environments, integrations, workflows, etc.) require using both `organisationId` and `environmentId`.
- **Legacy features** (conversations, agents, participants, messages, mentions, AI logic, tools, authentication) are all still supported, but are now mapped to the new schema as follows:
  - **Conversations** → `channel` (type: "chat")
  - **Agents** → `agent` (with environment/org linkage)
  - **Participants** → `group` or `channel.members`
  - **Messages** → `message` (with channelId, authorId)
  - **Mentions** → Still supported in message content, but now can reference any subscriber
  - **AI Logic/Tools** → Now use `tool`, `integration`, and `workflow` tables for extensibility
- **Example:**
```typescript
// Old: Add a user to a conversation
await db.insert("conversationParticipants", { conversationId, userId, ... });
// New: Add a subscriber to a group or channel
await db.patch("channel", channelId, { members: [...members, subscriberId] });
```

---

## References
- [Schema](./schema.md) for full table/field definitions
- [Ontology](./ontology.md) for entity/relationship details
- [Workflow](./workflow.md) for roles/permissions
- [Agents](./agents.md) for agent roles and orchestration

---
