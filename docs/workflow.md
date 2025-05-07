---
title: Workflow, Roles & Permissions
order: 2
description: Canonical workflow, roles, and permissions for the ONE agent/human system
---

# ONE Workflow, Roles & Permissions

## Overview of Roles

- **User**: Human user of the system. Can create and manage their own agents, participate in conversations, events, and projects.
- **Agent**: AI entity (either system-defined or user-created) that participates in conversations, executes tasks, and can be assigned roles.
  - **system_agent**: Predefined agents with special roles (e.g., Director, Sage, Teacher, Writer, etc.).
  - **user_agent**: Agents created and managed by users, customizable in personality, tools, and configuration.
- **Specialist Agents**: Each system agent has a defined role (see below) and can be orchestrated by the Director or user @mentions.

### Key Specialist Agent Roles
- **Director**: Orchestrates workflow, delegates tasks, tracks progress.
- **Sage**: Knowledge base and context provider.
- **Teacher**: Explains concepts and framework steps.
- **Writer**: Generates marketing assets and content.
- **Marketer, Seller, Media Buyer, Advocate, Guide, etc.**: Each with a focused domain of expertise (see agents.md for full list).

## Permissions Model

### Agent Visibility & Usage
- **Public Agents**: Any user can add/mention these agents in their conversations.
- **Private Agents**: Only the creator (and optionally, invited users) can add/mention these agents.
- **Default**: New agents are public unless marked private.
- **Agent Usage**: Any user can mention any public agent in a conversation they participate in. Mentioning an agent adds them to the conversation if not already present.
- **Agent Management**: Only the creator can edit/delete their agent or change its visibility. Anyone can view a public agent's profile.

### Conversation Participation
- Users can add agents (public or their own private) to conversations and events.
- Agents can be removed from conversations (except system agents), unless restricted by the agent's owner.
- Any user in a conversation can mention any other participant (user or agent).
- Mentioning a user not in the conversation could trigger an invite (future feature).

### Assignments & Progress Tracking
- **Assignments Table**: Tracks which user/agent is assigned to which step in a learning flow or project, with role and timestamps.
- **Progress Table**: Tracks status (Not Started, In Progress, Completed, Blocked, Skipped) for each step, user/agent, and learning flow.
- **Roles in Assignments**: The `role` field in assignments allows for flexible permissioning (e.g., reviewer, owner, contributor).

## Typical Workflow

1. **User Initiates**: User starts a conversation or project.
2. **Director Engages**: Director agent greets user, clarifies goals, introduces framework step.
3. **Task Delegation**: Director (or user) invokes specialist agents via @mentions for specific tasks.
4. **Information Retrieval**: Sage or other agents provide context/data as needed.
5. **Asset Generation**: Writer and others generate content/assets.
6. **Guidance & Education**: Teacher/Guide agents explain concepts and keep user oriented.
7. **User Feedback**: User reviews outputs, provides feedback, and refines as needed.
8. **Progression**: Director guides user to next step; assignments/progress tables are updated.

## Example Scenarios

- **Adding a Public Agent**: Bob adds public AgentA to his conversation and mentions it. AgentA responds as designed.
- **Private Agent**: Alice creates AgentB (private). Only Alice can add/mention AgentB unless she shares it.
- **Mentioning Users/Agents**: Any participant can mention any other in a conversation. Mentioning adds them if not present.
- **Assignment**: User is assigned as "owner" for a step in a learning flow; progress is tracked in the progress table.

## Roles & Permissions Table

| Role                | Can Create | Can Edit | Can Delete | Can Assign | Can Mention | Can Add to Conversation | Can View | Notes |
|---------------------|------------|----------|------------|------------|-------------|------------------------|----------|-------|
| User                | Agents     | Own      | Own        | Steps      | Anyone      | Public/Own Private     | All      |       |
| system_agent        | -          | -        | -          | -          | By mention  | By mention             | All      | E.g., Director, Sage |
| user_agent          | Creator    | Creator  | Creator    | -          | By mention  | By creator/any user (if public) | All |       |
| Specialist Agent    | -          | -        | -          | -          | By mention  | By mention             | All      | See agents.md |

## References
- [Schema](./schema.md) for table/field definitions
- [Ontology](./ontology.md) for entity relationships
- [Agents](./agents.md) for specialist agent roles
- [Mentions](./mentions.md) for mention syntax and routing
