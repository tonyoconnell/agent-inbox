---
title: ONE Schema
order: 1
description: Succinct, optimized schema for agent/human collaboration, knowledge, and analytics
---

# ONE Schema: Core Data Model for AI-Human Collaboration

This schema is the foundation for a scalable, secure, and high-performance agent/human swarm. It enables:
- Agents and humans to send messages, create knowledge, and infer new insights
- Rich, extensible agent/team modeling
- Fast, secure storage and retrieval (including vector search for knowledge/assets)
- Analytics, CRM, and extensibility for future growth

## Core Entities (Summary Table)

| Table                | Purpose                                 | Key Fields/Indexes                       |
|----------------------|-----------------------------------------|------------------------------------------|
| users                | Human users                             | email, name, createdAt                   |
| agents               | AI/user agents, config, team structure  | name, kind, personality, tools, tags     |
| tools                | Capabilities for agents                 | name, config, createdBy                  |
| prompts              | Reusable templates for agents/tasks     | title, template, step, tags, status      |
| conversations        | Group chats (users + agents)            | title, groupId, lastMessageTime          |
| conversationParticipants | Users/agents in conversations        | kind, userId/agentId, status             |
| conversationMessages | Messages in conversations               | content, author, type, step, tags, vector|
| agentTools           | Agent-tool join/config table            | agentId, toolId, config                  |
| attachments          | Attach prompts/assets to agents/groups  | ownerType, ownerId, promptId             |
| knowledge            | Vectorized knowledge for search/RAG     | ownerType, ownerId, vector, content      |
| tags                 | Tagging for search, filtering, teams    | name, color, createdBy                   |

---

# Full Convex Schema (TypeScript)

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// 1. Steps Enum/Validator
export const steps = [
  "Foundation",
  "Hook",
  "Gift",
  "Identify",
  "Engage",
  "Sell",
  "Nurture",
  "Upsell",
  "Educate",
  "Share"
] as const;
export type Step = typeof steps[number];
const stepValidator = v.union(
  v.literal("Foundation"),
  v.literal("Hook"),
  v.literal("Gift"),
  v.literal("Identify"),
  v.literal("Engage"),
  v.literal("Sell"),
  v.literal("Nurture"),
  v.literal("Upsell"),
  v.literal("Educate"),
  v.literal("Share")
);

export default defineSchema({
  ...authTables,

  // 2. Users (People)
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    createdAt: v.number(),
    // ...other fields as needed
  }),

  // 3. Agents
  agents: defineTable({
    name: v.string(),
    description: v.string(),
    kind: v.union(v.literal("system_agent"), v.literal("user_agent")),
    personality: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    goal: v.optional(v.string()),
    systemPrompt: v.optional(v.string()),
    instructions: v.optional(v.string()),
    delegatesTo: v.optional(v.array(v.id("agents"))),
    tools: v.optional(v.array(v.id("tools"))),
    tags: v.optional(v.array(v.string())),
    model: v.optional(v.string()),
    knowledge: v.optional(v.any()),
    memories: v.optional(v.any()),
    attachedPrompts: v.optional(v.array(v.id("prompts"))),
    createdBy: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    updatedBy: v.optional(v.id("users")),
  }),

  // 4. Tools
  tools: defineTable({
    name: v.string(),
    description: v.string(),
    config: v.optional(v.any()),
    createdBy: v.optional(v.id("users")),
  }),

  // 5. Prompts (with step)
  prompts: defineTable({
    title: v.string(),
    template: v.string(),
    step: stepValidator,
    description: v.optional(v.string()),
    requiredContext: v.optional(v.array(v.string())),
    outputType: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.optional(v.string()),
    createdBy: v.optional(v.id("users")),
    createdAt: v.number(),
  }),

  // 6. Conversations
  conversations: defineTable({
    title: v.string(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    lastMessageTime: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  }),

  // 7. ConversationParticipants
  conversationParticipants: defineTable(
    v.union(
      v.object({
        kind: v.literal("user"),
        conversationId: v.id("conversations"),
        userId: v.id("users"),
        status: v.string(),
        isRemoved: v.boolean(),
        addedAt: v.number(),
      }),
      v.object({
        kind: v.literal("agent"),
        conversationId: v.id("conversations"),
        agentId: v.id("agents"),
        status: v.string(),
        isRemoved: v.boolean(),
        addedAt: v.number(),
      })
    )
  ),

  // 8. ConversationMessages (with step)
  conversationMessages: defineTable({
    conversationId: v.id("conversations"),
    authorParticipantId: v.id("conversationParticipants"),
    kind: v.union(v.literal("participant"), v.literal("system")),
    type: v.optional(v.string()),
    step: v.optional(stepValidator),
    status: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    content: v.string(),
    attachments: v.optional(v.array(v.any())),
    createdAt: v.number(),
    vector: v.optional(v.array(v.number())), // for vector search
    meta: v.optional(v.any()),
  }),

  // 9. AgentTools (join table)
  agentTools: defineTable({
    agentId: v.id("agents"),
    toolId: v.id("tools"),
    config: v.optional(v.any()),
    createdAt: v.number(),
  }),

  // 10. Attachments
  attachments: defineTable({
    ownerType: v.union(v.literal("agent"), v.literal("group")),
    ownerId: v.string(),
    promptId: v.id("prompts"),
    createdAt: v.number(),
    createdBy: v.optional(v.id("users")),
  }),

  // 11. Knowledge (Vector Store)
  knowledge: defineTable({
    ownerType: v.union(v.literal("agent"), v.literal("user")),
    ownerId: v.string(),
    content: v.string(),
    vector: v.optional(v.array(v.number())),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
  }),

  // 12. Tags
  tags: defineTable({
    name: v.string(),
    color: v.optional(v.string()),
    createdBy: v.optional(v.id("users")),
    createdAt: v.number(),
  }),
});
```

---

# Example: Agent Document
```json
{
  "_id": "agentId_123",
  "name": "Director",
  "description": "Lead orchestrator agent.",
  "personality": "Strategic, clear, motivating.",
  "kind": "system_agent",
  "avatarUrl": "/avatars/director.png",
  "goal": "Guide users through the Elevate Framework.",
  "systemPrompt": "You are the Director...",
  "instructions": "Delegate tasks, synthesize info.",
  "delegatesTo": ["agentId_Sage", "agentId_Writer"],
  "tools": ["toolId_webSearch"],
  "tags": ["leadership", "strategy"],
  "model": "gpt-4",
  "knowledge": { "foundationId": "..." },
  "memories": [{ "summary": "User prefers concise answers." }],
  "attachedPrompts": ["promptId_H1"],
  "createdBy": "userId_admin",
  "createdAt": 1710000000000,
  "updatedAt": 1710000001000
}
```

---

# Relationships & Vector Search
- **Agents, users, and conversations** are linked via participants and messages.
- **Knowledge** is stored as vector embeddings for fast semantic search (RAG, agent memory, user docs, etc.).
- **Tags** and **attachments** enable flexible organization and retrieval.
- **AgentTools** and **prompts** allow for dynamic, extensible agent capabilities.

---

# Developer Checklist: ONE Schema
- [ ] All core tables and fields present and named clearly (step, template, etc.)
- [ ] Vector search enabled for knowledge/messages
- [ ] Relationships between agents, users, tools, prompts, and conversations are explicit
- [ ] All fields justified, minimal, and optimized for speed and security
- [ ] Schema supports analytics, CRM, and future extensibility

---

# See Also
- [Ontology](./ontology.md) for entity definitions and relationships
- [Plan](./plan.md) for project steps and priorities

export type User = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: number;
};

export type Agent = {
  _id: string;
  name: string;
  description: string;
  kind: "system_agent" | "user_agent";
  personality?: string;
  avatarUrl?: string;
  goal?: string;
  systemPrompt?: string;
  instructions?: string;
  delegatesTo?: string[];
  tools?: string[];
  tags?: string[];
  model?: string;
  knowledge?: any;
  memories?: any;
  attachedPrompts?: string[];
  createdBy?: string;
  createdAt: number;
  updatedAt?: number;
  updatedBy?: string;
};

export type Conversation = {
  _id: string;
  title: string;
  createdBy: string;
  createdAt: number;
  lastMessageTime?: number;
  tags?: string[];
};

export type ConversationMessage = {
  _id: string;
  conversationId: string;
  authorParticipantId: string;
  kind: "participant" | "system";
  type?: string;
  step?: Step;
  status?: string;
  tags?: string[];
  content: string;
  attachments?: any[];
  createdAt: number;
  vector?: number[];
  meta?: any;
};
