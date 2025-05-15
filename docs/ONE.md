 **ONE Network** schema and onboarding flow, using the Nuvo (Novu) multi-tenant notification schema as your foundation, and layering in our unique agent, tool, and permission-sharing logic. ONE is a robust, extensible, and elegant system for connecting humans and AI agents, with seamless onboarding and collaboration.

---

## 1. **Schema Design: Nuvo Foundation + ONE Extensions**

### **A. Core Nuvo/Novu Entities**
- **Subscribers**: Every user (human or agent) is a subscriber.
- **Organisations**: Multi-tenant support; each org can have its own users, agents, groups, channels, etc.
- **Groups**: Collections of subscribers (users/agents) for sharing and collaboration.
- **Channels**: Communication channels (chat, email, SMS, etc.).
- **Workflows**: Notification and automation flows.
- **Topics**: For notification targeting and segmentation.

### **B. ONE Extensions**
- **Agents**: AI agents (system, user-created, personal assistants).
- **Tools**: Capabilities that can be granted to agents (web search, email, calendar, etc.).
- **Permissions/Sharing**: Everything is private by default. Users can make things public or share with individuals/groups.
- **Personal AI Assistant**: Each user can generate their own agent, which is linked to their subscriber/user record.
- **Knowledge**: Connect external knowledge sources (Google Drive, Notion, etc.) to users/agents.
- **KYC**: Option to verify identity via a Know Your Customer agent.

### **C. Example Schema Outline**
```typescript
// Pseudocode/TypeScript-style
organisation {
  _id
  name
  // ...
}

subscriber {
  _id
  organisationId
  email
  phone
  isHuman: boolean
  agentId?: string // If this is a personal AI assistant
  // ...
}

agent {
  _id
  organisationId
  ownerId // subscriberId of the human owner
  kind: "system" | "user" | "personal"
  name
  description
  tools: [toolId]
  knowledge: [knowledgeId]
  // ...
}

group {
  _id
  organisationId
  name
  members: [subscriberId]
  // ...
}

tool {
  _id
  name
  description
  // ...
}

channel {
  _id
  organisationId
  type: "chat" | "email" | "sms" | ...
  // ...
}

permission {
  _id
  resourceType
  resourceId
  ownerId
  isPublic: boolean
  sharedWith: [subscriberId | groupId]
  // ...
}
```
- **Everything starts private.** Users can make resources public or share with individuals/groups.
- **Director agent** is a system agent present in every org, responsible for triage, onboarding, and team formation.

---

## 2. **Onboarding Flow (as described in your prompt)**

### **A. Steps**
1. **User joins:** Create a new subscriber and (optionally) organisation.
2. **Start onboarding conversation:** Create a new channel/conversation, add the user and system agents (Director, etc.).
3. **System welcome message:** Sent by the system, introducing the network, Anthony, and the AI assistant.
4. **Director agent takes over:** Explains the team, capabilities, and offers to create a personal AI assistant.
5. **Personal AI assistant creation:** If accepted, collect info (email, website, description, docs), generate agent, and add to conversation.
6. **KYC option:** Offer video call with KYC agent.
7. **Tool/knowledge integration:** Explain how to grant tools and connect knowledge sources.
8. **Task management:** Personal assistant helps user create tasks, which Director can triage and assign to teams.
9. **Collaboration:** Users can @mention anyone (human or agent), invite by email/phone, and form groups for projects, customers, etc.
10. **Permission/sharing:** All resources (agents, knowledge, tools, groups) are private by default, can be made public or shared.

### **B. Example Onboarding Action (Convex/TypeScript)**
```typescript
export const onboardNewUser = action({
  args: { userId: v.id("subscribers") },
  handler: async (ctx, { userId }) => {
    // 1. Create onboarding conversation
    const conversationId = await ctx.runMutation(internal.channels.create, {
      type: "chat",
      title: "Welcome to ONE Network",
      organisationId: /* orgId */,
    });

    // 2. Add user and Director agent as participants
    await ctx.runMutation(internal.channels.addParticipant, { conversationId, subscriberId: userId });
    const directorAgent = await getOrCreateDirectorAgent(ctx, /* orgId */);
    await ctx.runMutation(internal.channels.addParticipant, { conversationId, subscriberId: directorAgent._id });

    // 3. Send system onboarding message
    await sendSystemMessage(ctx, {
      conversationId,
      content: SYSTEM_ONBOARDING_PROMPT,
      authorParticipantId: /* system participant id */,
    });

    // 4. Director agent sends intro and offers to create personal AI assistant
    await sendAgentMessage(ctx, {
      conversationId,
      agentId: directorAgent._id,
      content: DIRECTOR_ONBOARDING_SCRIPT,
    });

    // 5. If user accepts, create personal agent, add to conversation, etc.
    // ... (rest of flow)
  }
});
```

---

## 3. **Permissions & Sharing**

- **Everything is private by default.**
- **Make public:** User can toggle a resource to public.
- **Share:** User can share with specific subscribers or groups.
- **Director agent** can help manage permissions, e.g., "Would you like to share this agent with your team?"

---

## 4. **Team/Group Creation & Collaboration**

- **Groups** are first-class: for friends, customers, staff, investors, etc.
- **Director agent** can create groups, add members, and assign tasks.
- **@mention** to add anyone (human or agent) to a conversation.
- **Invite by email/phone** if not already in the network.

---

## 5. **Knowledge & Tool Integration**

- **Connect knowledge sources:** Google Drive, Notion, CMS, etc.
- **Grant tools:** Web browsing, messaging, email, calendar, etc.
- **Personal AI assistant** can use these to help the user.

---

## 6. **Summary**

- **ONE Network** = Nuvo/Novu multi-tenant schema + agents, tools, and elegant permission sharing.
- **Onboarding** is seamless, with Director agent guiding the user, creating personal assistants, and forming collaborative teams.
- **Everything is private by default,** with simple controls to make public or share.
- **Director agent** is the orchestrator, triage, and team builder.

---

**Ready for code?**  
If you want, I can generate:
- A full Convex schema file (TypeScript) for this model.
- The onboarding action/mutation.
- Director agent logic for triage and team creation.
- Permission and sharing utilities.

Let me know which part you want to see implemented first!  
(And for more on Novu’s notification concepts, see [Novu Docs](https://docs.novu.co/platform/overview))

Here’s a detailed plan and analysis for **merging your current ONE schema (from `@schema.md` and `@schema.ts`) with the Nuvo/Novu schema** (from their docs and repo), ensuring all your requirements—agents, tools, permissions, onboarding, and collaboration—are preserved and elegantly integrated.

---

## 1. **Schema Comparison: ONE vs. Nuvo/Novu**

### **A. Nuvo/Novu Core Entities**
From [Novu Docs](https://docs.novu.co/platform/overview) and typical open-source notification infra:
- **Organisations**: Multi-tenant root entity.
- **Subscribers**: Users (humans, systems, or agents) who receive notifications.
- **Groups**: Collections of subscribers for targeting/sharing.
- **Channels**: Communication channels (chat, email, SMS, push, etc.).
- **Topics**: For notification targeting/segmentation.
- **Workflows**: Notification/automation flows.
- **Integrations**: External service connections.
- **Environments**: For multi-stage deployments.

### **B. ONE Schema (from `schema.md`/`schema.ts`)**
- **users**: Human users with full contact info.
- **agents**: AI/user agents, config, team structure.
- **tools**: Capabilities for agents.
- **groups**: (Implied, sometimes called teams).
- **conversations**: Group chats (users + agents).
- **conversationParticipants**: Users/agents in conversations.
- **conversationMessages**: Messages in conversations.
- **attachments, knowledge, tags, reactions, comments, follows, events, reminders, flows, lessons, enrollments, tasks, products, broadcasts, inferenceUsage, evals, courses, subscriptions, agentThreads, agentMessages**: All supporting collaboration, learning, analytics, and extensibility.

---

## 2. **Mapping & Merge Plan**

| ONE Schema Table         | Nuvo/Novu Equivalent/Extension | Merge/Mapping Notes                                                                 |
|-------------------------|-------------------------------|-------------------------------------------------------------------------------------|
| users                   | subscribers                   | Add `isHuman: boolean`, full contact info, and link to personal agent if present    |
| agents                  | subscribers/agents            | Agents are a special type of subscriber; add `kind`, `tools`, `knowledge`, etc.     |
| tools                   | tools                         | Direct mapping; add to schema                                                       |
| groups                  | groups                        | Direct mapping; ensure group membership supports both users and agents               |
| conversations           | channels                      | Use `type: 'chat'`; add support for multi-user/agent conversations                  |
| conversationParticipants| group members/participants    | Map to group/channel participants                                                   |
| conversationMessages    | messages                      | Add to channel schema                                                               |
| attachments             | attachments                   | Direct mapping                                                                      |
| knowledge               | knowledge                     | Add as a first-class table, link to agents/users                                    |
| tags                    | tags                          | Direct mapping                                                                      |
| reactions, comments     | reactions, comments           | Direct mapping                                                                      |
| follows                 | follows                       | Direct mapping                                                                      |
| events, reminders       | events, reminders             | Direct mapping                                                                      |
| flows, lessons, enrollments | workflows, lessons        | Map to notification/automation flows, extend as needed                              |
| tasks                   | tasks                         | Direct mapping                                                                      |
| products, broadcasts    | products, broadcasts          | Direct mapping                                                                      |
| inferenceUsage, evals   | analytics/usage               | Add as analytics tables                                                             |
| courses, subscriptions  | courses, subscriptions        | Direct mapping                                                                      |
| agentThreads, agentMessages | threads, messages         | Map to threaded conversations                                                       |
| permissions             | permissions                   | Add explicit permission table (private by default, share/public controls)           |

---

## 3. **Key Merge Principles**

- **Everything is a subscriber:** Both humans and agents are subscribers. Add a `kind` field (`'human'`, `'agent'`, etc.).
- **Multi-tenancy:** Every table should have an `organisationId`.
- **Groups/Teams:** Groups can contain any subscriber (human or agent).
- **Channels/Conversations:** Channels can be chat, email, SMS, etc. Conversations are a type of channel.
- **Permissions:** Add a `permissions` table for all shareable resources (private by default, can be made public or shared with users/groups).
- **Agents/Tools:** Agents are subscribers with extra fields; tools are a separate table and can be assigned to agents.
- **Knowledge:** First-class table, linked to agents/users, supports RAG and search.
- **Extensibility:** Use `meta` fields for future-proofing.

---

## 4. **Example Unified Schema Outline**

```typescript
organisation {
  _id
  name
  // ...
}

subscriber {
  _id
  organisationId
  kind: "human" | "agent" | "system"
  email
  phone
  isHuman: boolean
  agentId?: string // If this is a personal AI assistant
  // ...full contact info, etc.
}

agent {
  _id
  organisationId
  ownerId // subscriberId of the human owner
  kind: "system" | "user" | "personal"
  name
  description
  tools: [toolId]
  knowledge: [knowledgeId]
  // ...
}

group {
  _id
  organisationId
  name
  members: [subscriberId]
  // ...
}

tool {
  _id
  name
  description
  // ...
}

channel {
  _id
  organisationId
  type: "chat" | "email" | "sms" | ...
  // ...
}

message {
  _id
  channelId
  authorId: subscriberId
  content
  createdAt
  // ...
}

permission {
  _id
  resourceType
  resourceId
  ownerId
  isPublic: boolean
  sharedWith: [subscriberId | groupId]
  // ...
}

knowledge {
  _id
  ownerType: "agent" | "user"
  ownerId
  content
  vector
  tags
  // ...
}

// ...plus all other tables: tags, reactions, comments, follows, events, reminders, flows, lessons, enrollments, tasks, products, broadcasts, analytics, etc.
```

---

## 5. **Action Items**

1. **Create/extend all tables in your Convex schema to match this unified model.**
2. **Ensure all existing data and logic from your current schema is mapped to the new structure.**
3. **Update onboarding, agent creation, and permission logic to use the new tables and relationships.**
4. **Test with both human and agent users, group/team creation, and permission flows.**
5. **Document the schema and relationships for future extensibility.**

---

## 6. **References**

- [Novu Docs: Platform Overview](https://docs.novu.co/platform/overview)
- Your current `schema.md` and `schema.ts` (for all ONE-specific fields and logic)

---

**Ready for code?**  
If you want, I can generate:
- A full unified Convex schema file (TypeScript) for this model. start here. update 
- Migration scripts or mapping helpers.
- Example onboarding and permission logic.

**Let me know if you want to see the full schema implementation or a specific part first!**

