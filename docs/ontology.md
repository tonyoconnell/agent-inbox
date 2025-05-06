# ONE Ontology

## Introduction
This ontology defines the core entities, relationships, and concepts powering the ONE agent/human swarm. It is designed for clarity, extensibility, and high-performance collaboration, knowledge creation, analytics, social interaction, and scheduling. All field names and relationships are aligned with the latest schema.

## Core Entities (Summary Table)
| Entity                  | Description                                 | Key Relationships                       |
|-------------------------|---------------------------------------------|-----------------------------------------|
| User                    | Human user of the system                    | Owns agents, participates in conversations, events, reminders |
| Agent                   | AI or user-created agent                    | Delegates to agents, uses tools, joins conversations, events, reminders |
| Tool                    | Capability for agents                       | Assigned to agents via agentTools        |
| Prompt                  | Reusable template for agents/tasks          | Attached to agents/groups, used in messages |
| Conversation            | Group chat (users + agents)                 | Has participants, contains messages      |
| ConversationParticipant | User or agent in a conversation             | Links user/agent to conversation         |
| ConversationMessage     | Message in a conversation                   | Authored by participant, vectorized, can be reacted to, commented on |
| AgentTool               | Join table for agent-tool config            | Links agent and tool                     |
| Attachment              | Prompt/asset attached to agent/group        | Links prompt to owner                    |
| Knowledge               | Vectorized knowledge for search/inference   | Owned by agent/user, tagged              |
| Tag                     | Tag for search, filtering, teams            | Linked to agents, messages, knowledge    |
| Reaction                | Social reaction to a message                | Linked to message, user/agent            |
| Comment                 | Comment on a message                        | Linked to message, author                |
| Follow                  | Social follow (user/agent)                  | Links follower and followee              |
| Event                   | Scheduled meeting/event                     | Has participants (users/agents)          |
| Reminder                | Reminder for user/agent                     | Linked to user/agent, message/event      |

---

## Entity Details

### User
- Fields: _id, name, email, image, createdAt, ...
- Relationships: Owns agents, participates in conversations, events, reminders, creates prompts, tags, knowledge, can react, comment, follow

### Agent
- Fields: _id, name, description, personality, kind (system_agent/user_agent), avatarUrl, goal, systemPrompt, instructions, delegatesTo, tools, tags, model, knowledge, memories, attachedPrompts, createdBy, createdAt, updatedAt, updatedBy
- Relationships: Delegates to other agents, uses tools, joins conversations, events, reminders, owns knowledge, tagged, can react, comment, follow

### Tool
- Fields: _id, name, description, config, createdBy
- Relationships: Assigned to agents via agentTools

### Prompt
- Fields: _id, title, template, step, description, requiredContext, outputType, tags, status, createdBy, createdAt
- Relationships: Attached to agents/groups, used in messages

### Conversation
- Fields: _id, title, groupId, createdBy, lastMessageTime
- Relationships: Has participants (users/agents), contains messages

### ConversationParticipant
- Fields: _id, conversationId, kind (user/agent), userId/agentId, status, isRemoved, addedAt
- Relationships: Links user/agent to conversation

### ConversationMessage
- Fields: _id, conversationId, authorParticipantId, kind (participant/system), type, step, status, tags, content, attachments, createdAt, vector, meta
- Relationships: Authored by participant, vectorized for search/inference, tagged, can be reacted to, commented on

### AgentTool
- Fields: _id, agentId, toolId, config, createdAt
- Relationships: Links agent and tool, configures permissions

### Attachment
- Fields: _id, ownerType (agent/group), ownerId, promptId, createdAt
- Relationships: Links prompt to agent or group

### Knowledge
- Fields: _id, ownerType (agent/user), ownerId, content, vector, tags, createdAt
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

---

## Relationships & Vector Search
- Agents, users, and conversations are linked via participants and messages.
- Knowledge is stored as vector embeddings for fast semantic search (RAG, agent memory, user docs, etc.).
- Tags and attachments enable flexible organization and retrieval.
- AgentTools and prompts allow for dynamic, extensible agent capabilities.
- Social features (reactions, comments, follows) and scheduling (events, reminders) enable rich, real-time collaboration and coordination.

---

## Mentions, Collaboration, and Growth
- Mentions: `@[Name](kind:ID)` syntax for referencing users/agents in messages.
- Mentioning an agent/user adds them to the conversation if not present.
- Agents and humans can both create, infer, and grow knowledge through messaging, collaboration, social feedback, and scheduled events.
- Follows, reactions, and comments foster community, trust, and learning.
- Events and reminders enable seamless coordination and productivity.

---

## Permissions & Visibility
- Agents can be public (any user can add/mention) or private (only creator and invited users).
- Only the creator can edit/delete their agent or change its visibility.
- Anyone can view a public agent's profile.
- Users can add agents (public or their own private) to conversations and events.
- Social and scheduling features respect user/agent privacy and permissions.

---

## Developer Checklist: ONE Ontology
- [ ] All entities and relationships match the latest schema, including social and scheduling
- [ ] Field names are modern, minimal, and justified
- [ ] Vector search, tagging, social, and scheduling are first-class concepts
- [ ] Ontology is clear, beautiful, and Turing-complete for extensible agent/human collaboration

---

# See Also
- [Schema](./schema.md) for table/field definitions
- [Plan](./plan.md) for project steps and priorities
