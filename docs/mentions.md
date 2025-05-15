# Mentions in ONE: Syntax, Permissions, and Collaboration

## Summary Table: Mention Types & Permissions
| Mention Type | Syntax Example                        | Who Can Mention?         | Who Can Be Mentioned?         | Permissions/Notes                         |
|--------------|--------------------------------------|--------------------------|-------------------------------|-------------------------------------------|
| User         | @[Alice](user:ALICE_ID)              | Any participant          | Any participant               | Notifies/highlights user in conversation  |
| Agent        | @[Writer Agent](agent:AGENT_ID)      | Any participant          | Public agents, own private    | Adds agent if not present, triggers logic |
| Group        | @[Growth Team](group:GROUP_ID)       | Any participant          | Any group in org/convo        | Mentions all group members                |

---

## 1. Mention Syntax
- Users: `@[Name](user:USER_ID)`
- Agents: `@[Agent Name](agent:AGENT_ID)`
- Groups: `@[Group Name](group:GROUP_ID)`
- Parsed and rendered as clickable badges (with avatars, etc.) in the UI.

## 2. Parsing and Rendering
- Parsing: `parseMentionsFromMessageContent` (see shared/mentions.ts) extracts all mentions, returning type, ID, and display name.
- Rendering: Components like `AgentMention`, `UserMention`, and `GroupMention` render these as interactive UI elements.
- Suggestions: Typing `@` triggers a popup with users, agents, and groups in the conversation/org.

## 3. Mention-Driven Actions
- **Adding Participants:** Mentioning an agent or group adds them to the conversation if not already present.
- **Invites:** Mentioning a user not in the conversation can trigger an invite (future/optional).
- **Agent Responses:** Agents respond to mentions according to their logic/tools.
- **Moderation:** Users with appropriate tools/permissions can remove or block participants (see permissions schema).

## 4. Permissions & Visibility
- **Agent Visibility:**
  - Public agents: Any user can add/mention in any conversation.
  - Private agents: Only the creator (and optionally, invited users) can add/mention.
  - Default: New agents are public unless marked private.
- **Agent Usage:**
  - Any user can mention any public agent in a conversation they participate in.
  - Mentioning an agent adds them to the conversation (if not already present).
- **Agent Management:**
  - Only the creator can edit/delete/make public/private their agent.
  - Anyone can view a public agent's profile, tools, etc.
- **User Mentions:**
  - Any participant can mention any other participant (user or agent).
  - Mentioning a user not in the conversation could trigger an invite.
- **Group Mentions:**
  - Any participant can mention a group to notify all members.
- **Moderation:**
  - Users with tools/permissions can remove/block participants or agents from conversations.

## 5. Example Scenarios
- **Public Agent:**
  - Alice creates AgentA (public). Bob can add/mention AgentA in his conversation; AgentA responds as designed.
- **Private Agent:**
  - Alice creates AgentB (private). Only Alice (or invited users) can add/mention AgentB.
- **Group Mention:**
  - Bob mentions @[Growth Team](group:GROUP_ID); all group members are notified.
- **User Mention:**
  - Bob mentions @[Alice](user:ALICE_ID); Alice is notified/highlighted.
- **Moderation:**
  - Carol (with moderation tools) removes/block AgentA from a conversation.

## 6. Cross-References
- See [schema.md](./schema.md) for table/field details (agent, group, permissions).
- See [agents.md](./agents.md) for agent/team logic and permissions.

---

Mentions are a core part of collaboration in ONE, enabling seamless interaction between users, agents, and groups, all governed by a robust, permission-aware schema. 