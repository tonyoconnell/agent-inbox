# ONE Ontology

## Introduction
This ontology defines the core entities, relationships, and concepts powering the ONE agent/human swarm. It is designed for clarity, extensibility, and high-performance collaboration, knowledge creation, analytics, social interaction, and scheduling. All field names and relationships are aligned with the latest schema and workflow/agent system.

## Core Entities (Summary Table)
| Entity                  | Description                                 | Key Relationships                       |
|-------------------------|---------------------------------------------|-----------------------------------------|
| User                    | Human user of the system                    | Owns agents, participates in conversations, events, reminders |
| Agent                   | AI or user-created agent                    | Delegates to agents, uses tools, joins conversations, events, reminders |
| Tool                    | Capability for agents                       | Assigned to agents via tools            |
| Prompt                  | Reusable template for agents/tasks          | Attached to agents/groups, used in messages, referenced in flows |
| Conversation            | Group chat (users + agents)                 | Has participants, contains messages      |
| ConversationParticipant | User or agent in a conversation             | Links user/agent to conversation         |
| ConversationMessage     | Message in a conversation                   | Authored by participant, vectorized, can be reacted to, commented on |
| Knowledge               | Vectorized knowledge for search/inference   | Owned by agent/user, tagged              |
| Tag                     | Tag for search, filtering, teams            | Linked to agents, messages, knowledge    |
| Reaction                | Social reaction to a message                | Linked to message, user/agent            |
| Comment                 | Comment on a message                        | Linked to message, author                |
| Follow                  | Social follow (user/agent)                  | Links follower and followee              |
| Event                   | Scheduled meeting/event                     | Has participants (users/agents)          |
| Reminder                | Reminder for user/agent                     | Linked to user/agent, message/event      |
| Flow                    | Structured learning/project sequence        | Has steps (with prerequisites), referenced by lessons and progress |
| Lesson                  | Assignment for a user/agent to a flow step or LMS course | Linked to flows (stepName) or courses, user/agent, supports both LMS and project flows |
| FlowProgress            | Tracks step/flow completion status          | Linked to flows, lessons, user/agent     |
| AgentThread             | AI agent chat thread                        | Linked to user/agent, has messages, supports threadType/context |
| AgentMessage            | Message in an agent thread                  | Linked to thread, user/agent, supports tool calls, vector search |
| Product                 | E-commerce product                          | Referenced by subscriptions              |
| Subscription            | User subscription to a product/plan         | Linked to user, product, supports billing/plan metadata |

## Entity Details

### User
- Fields: _id, name, email, image, createdAt, updatedAt, createdBy, ...
- Relationships: Owns agents, participates in conversations, events, reminders, creates prompts, tags, knowledge, can react, comment, follow

### Agent
- Fields: _id, name, description, kind (system_agent/user_agent), avatarUrl, prompt, delegatesTo, tools, tags, model, knowledge, memories, createdBy, createdAt, updatedAt, updatedBy
- Relationships: Delegates to other agents, uses tools, joins conversations, events, reminders, owns knowledge, tagged, can react, comment, follow

### Tool
- Fields: _id, name, description, config, createdBy
- Relationships: Assigned to agents via tools

### Prompt
- Fields: _id, title, tags, content, createdBy, createdAt
- Relationships: Attached to agents/groups, used in messages, referenced in flows

### Conversation
- Fields: _id, title, groupId, createdBy, lastMessageTime, createdAt, updatedAt, tags
- Relationships: Has participants (users/agents), contains messages

### ConversationParticipant
- Fields: _id, conversationId, kind (user/agent), userId/agentId, status, isRemoved, addedAt
- Relationships: Links user/agent to conversation

### ConversationMessage
- Fields: _id, conversationId, authorParticipantId, kind (participant/system), type, step, status, tags, content, attachments, createdAt, vector, meta
- Relationships: Authored by participant, vectorized for search/inference, tagged, can be reacted to, commented on

### Knowledge
- Fields: _id, ownerType (agent/user), ownerId, content, vector, tags, createdAt, updatedAt, meta
- Relationships: Owned by agent/user, tagged, vectorized for semantic search

### Tag
- Fields: _id, name, color, createdBy, createdAt
- Relationships: Linked to agents, messages, knowledge, teams

### Reaction
- Fields: _id, messageId, userId/agentId, type, createdAt
- Relationships: Linked to message, user/agent

### Comment
- Fields: _id, messageId, authorParticipantId, content, createdAt
- Relationships: Linked to message, author (user/agent)

### Follow
- Fields: _id, followerId, followeeId, kind (user/agent), createdAt
- Relationships: Links follower (user/agent) and followee (user/agent)

### Event
- Fields: _id, title, description, startTime, endTime, createdBy, participants, tags, createdAt
- Relationships: Has participants (users/agents), can be linked to reminders

### Reminder
- Fields: _id, userId/agentId, message, remindAt, relatedEntity, createdAt
- Relationships: Linked to user/agent, can reference message/event

### Flow
- Fields: _id, title, description, steps (array: promptId, name, instructions, order, prerequisites), createdBy, createdAt, updatedAt, meta
- Relationships: Referenced by lessons and flowProgress

### Lesson
- Fields: _id, flowId, courseId, stepName, title, content, userId, agentId, role, assignedAt, assignedBy, createdAt, updatedAt, meta
- Relationships: Linked to flows (stepName) or courses, user/agent, supports both LMS and project flows

### FlowProgress
- Fields: _id, flowId, stepName, userId, agentId, status, notes, startedAt, completedAt, updatedAt, meta
- Relationships: Linked to flows, lessons, user/agent

### AgentThread
- Fields: _id, userId, agentId, title, threadType, context, createdAt, updatedAt, meta
- Relationships: Linked to user/agent, has agentMessages

### AgentMessage
- Fields: _id, threadId, authorId, kind (user/agent/system), content, createdAt, vector, meta, status, toolCall, result
- Relationships: Linked to thread, user/agent, supports tool calls, vector search

### Product
- Fields: _id, ... (see schema)
- Relationships: Referenced by subscriptions

### Subscription
- Fields: _id, userId, productKey, productId, status, currentPeriodStart, currentPeriodEnd, createdAt, updatedAt, meta
- Relationships: Linked to user, product, supports billing/plan metadata

## Indexes & Extensibility
- All major tables have indexes on frequently queried fields (createdAt, userId, flowId, etc.)
- All major tables have a meta field for extensibility
- Lessons table supports both LMS and project flows
- Flows support prerequisites for advanced logic
- AgentThreads support threadType/context for analytics

## Permissions, Roles, and Workflow
- See [workflow.md](./workflow.md) for roles, permissions, and workflow orchestration
- See [agents.md](./agents.md) for agent roles and orchestration

## Developer Checklist: ONE Ontology
- [x] All entities and relationships match the latest schema, including social, scheduling, agent chat, flows, and subscriptions
- [x] Field names are modern, minimal, and justified
- [x] Vector search, tagging, social, and scheduling are first-class concepts
- [x] Ontology is clear, beautiful, and Turing-complete for extensible agent/human collaboration

## See Also
- [Schema](./schema.md) for table/field definitions
- [Workflow](./workflow.md) for roles/permissions
- [Agents](./agents.md) for agent roles and orchestration
- [Plan](./plan.md) for project steps and priorities
