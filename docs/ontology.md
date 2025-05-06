# ONE Ontology

## Introduction
This ontology defines the core entities, relationships, and concepts powering the ONE agent/human swarm. It is designed for clarity, extensibility, and high-performance collaboration, knowledge creation, and analytics. All field names and relationships are aligned with the latest schema.

## Core Entities (Summary Table)
| Entity                  | Description                                 | Key Relationships                       |
|-------------------------|---------------------------------------------|-----------------------------------------|
| User                    | Human user of the system                    | Owns agents, participates in conversations |
| Agent                   | AI or user-created agent                    | Delegates to agents, uses tools, joins conversations |
| Tool                    | Capability for agents                       | Assigned to agents via agentTools        |
| Prompt                  | Reusable template for agents/tasks          | Attached to agents/groups, used in messages |
| Conversation            | Group chat (users + agents)                 | Has participants, contains messages      |
| ConversationParticipant | User or agent in a conversation             | Links user/agent to conversation         |
| ConversationMessage     | Message in a conversation                   | Authored by participant, vectorized      |
| AgentTool               | Join table for agent-tool config            | Links agent and tool                     |
| Attachment              | Prompt/asset attached to agent/group        | Links prompt to owner                    |
| Knowledge               | Vectorized knowledge for search/inference   | Owned by agent/user, tagged              |
| Tag                     | Tag for search, filtering, teams            | Linked to agents, messages, knowledge    |

---

## Entity Details

### User
- Fields: _id, name, email, image, createdAt, ...
- Relationships: Owns agents, participates in conversations, creates prompts, tags, knowledge

### Agent
- Fields: _id, name, description, personality, kind (system_agent/user_agent), avatarUrl, goal, systemPrompt, instructions, delegatesTo, tools, tags, model, knowledge, memories, attachedPrompts, createdBy, createdAt, updatedAt, updatedBy
- Relationships: Delegates to other agents, uses tools, joins conversations, owns knowledge, tagged

### Tool
- Fields: _id, name, description, config, createdBy
- Relationships: Assigned to agents via agentTools

### Prompt
- Fields: _id, title, template, description, requiredContext, outputType, tags, status, createdBy, createdAt
- Relationships: Attached to agents/groups, used in messages

### Conversation
- Fields: _id, title, groupId, createdBy, lastMessageTime
- Relationships: Has participants (users/agents), contains messages

### ConversationParticipant
- Fields: _id, conversationId, kind (user/agent), userId/agentId, status, isRemoved, addedAt
- Relationships: Links user/agent to conversation

### ConversationMessage
- Fields: _id, conversationId, authorParticipantId, kind (participant/system), type, status, tags, content, attachments, createdAt, vector, meta
- Relationships: Authored by participant, vectorized for search/inference, tagged

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

---

## Relationships & Vector Search
- Agents, users, and conversations are linked via participants and messages.
- Knowledge is stored as vector embeddings for fast semantic search (RAG, agent memory, user docs, etc.).
- Tags and attachments enable flexible organization and retrieval.
- AgentTools and prompts allow for dynamic, extensible agent capabilities.

---

## Mentions & Collaboration
- Mentions: `@[Name](kind:ID)` syntax for referencing users/agents in messages.
- Mentioning an agent/user adds them to the conversation if not present.
- Agents and humans can both create, infer, and grow knowledge through messaging and collaboration.

---

## Permissions & Visibility
- Agents can be public (any user can add/mention) or private (only creator and invited users).
- Only the creator can edit/delete their agent or change its visibility.
- Anyone can view a public agent's profile.
- Users can add agents (public or their own private) to conversations.

---

## Developer Checklist: ONE Ontology
- [ ] All entities and relationships match the latest schema
- [ ] Field names are modern, minimal, and justified
- [ ] Vector search and tagging are first-class concepts
- [ ] Ontology is clear, beautiful, and easy to extend

---

# See Also
- [Schema](./schema.md) for table/field definitions
- [Plan](./plan.md) for project steps and priorities
