# Ontology

## Core Entities

### User
- **Fields:** `_id`, `name`, `email`, `image`, etc.
- **Description:** Represents a human user of the system.
- **Relationships:**
  - Can create, own, and manage Agents.
  - Can participate in Conversations.
  - Can mention other Users and Agents in messages.

### Agent
- **Fields:** `_id`, `name`, `description`, `personality`, `tools`, `createdBy`, `kind` (`user_agent` or `system_agent`), `avatarUrl`, `lastActiveTime`, `systemAgentKind?`, `public?`, `private?`
- **Description:** Represents an AI agent, either user-created or system-defined (e.g., Triage Agent).
- **Relationships:**
  - Owned by a User (`createdBy`).
  - Can be added to Conversations as participants.
  - Can be mentioned in messages.
  - Responds to mentions according to its logic and available tools.

### Conversation
- **Fields:** `_id`, `title`, `createdBy`, `lastMessageTime`
- **Description:** Represents a chat or thread where Users and Agents interact.
- **Relationships:**
  - Has many Participants (Users and/or Agents).
  - Contains Messages.

### ConversationParticipant
- **Fields:** `_id`, `conversationId`, `kind` (`user` or `agent`), `userId?`, `agentId?`, `addedAt`, `status` (`inactive` or `thinking`), `isRemoved`
- **Description:** Represents a User or Agent's membership in a Conversation.
- **Relationships:**
  - Links a User or Agent to a Conversation.
  - Tracks status and removal.

### ConversationMessage
- **Fields:** `_id`, `conversationId`, `content`, `kind` (`participant` or `system`), `authorParticipantId?`, `meta?`
- **Description:** Represents a message in a Conversation, sent by a User, Agent, or the system.
- **Relationships:**
  - Belongs to a Conversation.
  - Authored by a ConversationParticipant.

## Mentions

- **Syntax:** `@[Name](kind:ID)` (e.g., `@[Alice](user:ALICE_ID)`, `@[AgentA](agent:AGENT_ID)`)
- **Parsing:** Mentions are extracted from message content and used to route messages or highlight participants.
- **Rendering:** Mentions are rendered as interactive UI elements (badges with avatars, etc.).
- **Suggestions:** When typing `@`, the UI suggests users and agents in the conversation.

## Permissions & Visibility

- **Agent Visibility:**
  - **Public Agents:** Any user can add/mention these agents in their conversations.
  - **Private Agents:** Only the creator (and optionally, invited users) can add/mention these agents.
  - **Default:** New agents are public unless marked private.
- **Agent Usage:**
  - Any user can mention any public agent in a conversation they participate in.
  - Mentioning an agent adds them to the conversation if not already present.
- **Agent Management:**
  - Only the creator can edit or delete their agent.
  - Only the creator can change an agent's visibility (public/private).
  - Anyone can view a public agent's profile.
- **User Mentions:**
  - Any user in a conversation can mention any other participant (user or agent).
  - Mentioning a user not in the conversation could trigger an invite (future feature).
- **Conversation Participation:**
  - Users can add agents (public or their own private) to conversations.
  - Agents can be removed from conversations (except system agents), unless restricted by the agent's owner.

## System Agents

- **Triage Agent:** A special system agent that routes unmentioned messages to the appropriate agent(s).
- **System Agent Kind:** Used to distinguish system agents (e.g., `triage`).

## Example Scenarios

- Alice creates AgentA (public). Bob can add AgentA to his conversation and mention it; AgentA will respond.
- Alice creates AgentB (private). Only Alice can add/mention AgentB unless she shares it.
- Bob mentions Alice in a message: `@[Alice](user:ALICE_ID)` — Alice is notified or highlighted.

---

**This ontology is derived from the codebase and the design doc, and should be kept up to date as the system evolves.**
