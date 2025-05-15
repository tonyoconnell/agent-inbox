# ONE Ontology (Novu + ONE Unified)

## Introduction
This ontology defines the core entities, relationships, and concepts powering the ONE agent/human network, fully aligned with the latest Novu + ONE schema. It is designed for clarity, extensibility, multi-tenancy, and high-performance collaboration, notifications, knowledge, analytics, social interaction, and automation.

## Core Entities (Summary Table)
| Entity                  | Description                                 | Key Relationships                       |
|-------------------------|---------------------------------------------|-----------------------------------------|
| Organisation            | Multi-tenant root entity                    | Has environments, users, agents, integrations, branding |
| Environment             | Dev/prod/test separation per org            | Belongs to organisation, used by all other entities |
| Subscriber              | Human, agent, or system user                | Belongs to org/env, owns agents, participates in channels, workflows |
| Agent                   | AI or user-created agent                    | Belongs to org/env, owned by subscriber, uses tools, joins channels, workflows |
| Group                   | Team or sharing group                       | Belongs to org/env, contains subscribers |
| Tool                    | Capability/action for agents                | May use integration, assigned to agents  |
| Integration             | Third-party provider config                 | Belongs to org/env, used by tools/channels |
| Channel                 | Communication (chat, email, SMS, etc.)      | Belongs to org/env, uses integration, contains messages |
| NotificationTemplate    | Reusable, multi-channel message template     | Belongs to org/env, used by workflows/messages |
| Workflow                | Multi-step notification/automation flow      | Belongs to org/env, has steps, triggers, jobs |
| Message                 | Notification event/message                  | Belongs to org/env, channel, template, workflow |
| Topic                   | Targeting/segmentation for notifications    | Belongs to org/env, used by workflows    |
| Preference              | Per-subscriber, per-channel notification settings | Belongs to org/env, subscriber          |
| Trigger                 | API/webhook endpoint to start workflow      | Belongs to org/env, workflow            |
| Job                     | Workflow/job step execution                 | Belongs to org/env, workflow, has executionDetails |
| ExecutionDetail         | Delivery status, errors, logs for jobs      | Belongs to job                          |
| ApiKey                  | Secure, scoped access for integrations/users| Belongs to org/env, created by subscriber|
| Branding                | Org-level theming/customization             | Belongs to org/env                      |
| AuditLog                | Security, compliance, debugging             | Belongs to org/env, actor, target       |
| Limit                   | Usage tracking and enforcement              | Belongs to org/env                      |
| Knowledge               | RAG, search, agent/user knowledge           | Belongs to org/env, owned by agent/user |
| OnboardingFlow          | Tracks onboarding, personal agent creation  | Belongs to org/env, subscriber, agent   |
| Event, Reminder, Task, Product, Broadcast, Analytics, Tag, Comment, Reaction, Follow, etc. | All other ONE/Novu tables | Standard fields + org/env + meta |

## Entity Details

### Organisation
- Fields: _id, name, meta
- Relationships: Has environments, subscribers, agents, integrations, branding, etc.

### Environment
- Fields: _id, organisationId, name, apiKey, createdAt, meta
- Relationships: Belongs to organisation; all other entities reference environmentId

### Subscriber
- Fields: _id, organisationId, environmentId, kind (human/agent/system), email, phone, isHuman, agentId?, fullContactInfo, meta
- Relationships: Belongs to org/env, owns agents, participates in channels, workflows, groups, etc.

### Agent
- Fields: _id, organisationId, environmentId, ownerId, kind (system/user/personal), name, description, tools, knowledge, model, avatarUrl, createdAt, updatedAt, meta
- Relationships: Owned by subscriber, uses tools, joins channels, workflows, groups, owns knowledge

### Group
- Fields: _id, organisationId, environmentId, name, members, meta
- Relationships: Contains subscribers, used for sharing/permissions

### Tool
- Fields: _id, name, description, integrationId?, action, config, meta
- Relationships: May use integration, assigned to agents

### Integration
- Fields: _id, organisationId, environmentId, provider, channelType, credentials, settings, status, createdAt, updatedAt, meta
- Relationships: Used by tools, channels, workflows

### Channel
- Fields: _id, organisationId, environmentId, type, title, integrationId?, createdBy, createdAt, updatedAt, tags, meta
- Relationships: Contains messages, uses integration, referenced by workflows

### NotificationTemplate
- Fields: _id, organisationId, environmentId, name, channels, content, variables, createdAt, updatedAt, meta
- Relationships: Used by workflows, messages

### Workflow
- Fields: _id, organisationId, environmentId, name, steps, createdBy, createdAt, updatedAt, meta
- Relationships: Has steps, triggers, jobs, referenced by triggers, jobs, messages

### Message
- Fields: _id, organisationId, environmentId, channelId, authorId, content, templateId?, workflowId?, createdAt, attachments, meta
- Relationships: Belongs to channel, may use template/workflow

### Topic
- Fields: _id, organisationId, environmentId, name, description, createdAt, meta
- Relationships: Used for targeting/segmentation in workflows

### Preference
- Fields: _id, organisationId, environmentId, subscriberId, channelType, enabled, meta
- Relationships: Per-subscriber, per-channel notification settings

### Trigger
- Fields: _id, organisationId, environmentId, workflowId, type, endpoint, meta
- Relationships: Starts workflows via API/webhook

### Job
- Fields: _id, organisationId, environmentId, workflowId, status, startedAt, finishedAt, logs, meta
- Relationships: Workflow/job step execution, has executionDetails

### ExecutionDetail
- Fields: _id, jobId, status, error, log, createdAt, meta
- Relationships: Belongs to job, tracks delivery/errors/logs

### ApiKey
- Fields: _id, organisationId, environmentId, key, createdBy, createdAt, meta
- Relationships: Secure access for integrations/users

### Branding
- Fields: _id, organisationId, environmentId, theme, logoUrl, meta
- Relationships: Org-level theming/customization

### AuditLog
- Fields: _id, organisationId, environmentId, action, actorId, targetId?, details, createdAt, meta
- Relationships: Security, compliance, debugging

### Limit
- Fields: _id, organisationId, environmentId, type, value, period, meta
- Relationships: Usage tracking and enforcement

### Knowledge
- Fields: _id, organisationId, environmentId, ownerType (agent/user), ownerId, content, vector, tags, meta
- Relationships: Owned by agent/user, used for RAG/search

### OnboardingFlow
- Fields: _id, organisationId, environmentId, subscriberId, status, personalAgentId?, kycStatus?, meta
- Relationships: Tracks onboarding, personal agent creation, Director handoff

### Event, Reminder, Task, Product, Broadcast, Analytics, Tag, Comment, Reaction, Follow, etc.
- Fields: Standard fields + organisationId + environmentId + meta
- Relationships: As per previous ontology/schema

## Extensibility, Multi-Tenancy, and Environment Support
- All tables have `organisationId` and most have `environmentId` for robust multi-tenancy and environment separation (dev/prod/test).
- All tables have a `meta` field for extensibility and custom data.
- All relationships are explicit and indexed for performance.
- Permissions and sharing are explicit, private by default, and can be shared with users/groups.
- All agent, tool, and integration logic is extensible and future-proof.

## See Also
- [Schema](./schema.md) for full table/field definitions
- [Workflow](./workflow.md) for roles/permissions
- [Agents](./agents.md) for agent roles and orchestration
- [Plan](./plan.md) for project steps and priorities
