---
title: ONE Schema
order: 1
description: Succinct, optimized schema for agent/human collaboration, knowledge, and analytics
---

# ONE Schema: Core Data Model for AI-Human Collaboration

remember agentTools is just called tools now

This schema is the foundation for a scalable, secure, and high-performance agent/human swarm. It enables:
- Agents and humans to send messages, create knowledge, and infer new insights
- Rich, extensible agent/team modeling
- Fast, secure storage and retrieval (including vector search for knowledge/assets)
- Analytics, CRM, and extensibility for future growth

## Core Entities (Summary Table)

| Table                | Purpose                                 | Key Fields/Indexes                       |
|----------------------|-----------------------------------------|------------------------------------------|
| users                | Human users with full contact info          | name, email, image, phoneNumbers, addresses, organization, jobTitle, birthday, notes, photoUrl, createdAt |
| agents               | AI/user agents, config, team structure  | name, kind, prompt, tools, tags     |
| tools                | Capabilities for agents                 | name, config, createdBy                  |
| prompts              | Reusable templates for agents/tasks     | title, template, step, tags, status, learningFlowId |
| conversations        | Group chats (users + agents)            | title, groupId, lastMessageTime          |
| conversationParticipants | Users/agents in conversations        | kind, userId/agentId, status             |
| conversationMessages | Messages in conversations               | content, author, type, step, tags, vector|
| agentTools           | Agent-tool join/config table            | agentId, toolId, config                  |
| attachments          | Attach prompts/assets to agents/groups  | ownerType, ownerId, promptId             |
| knowledge            | Vectorized knowledge for search/RAG     | ownerType, ownerId, vector, content      |
| tags                 | Tagging for search, filtering, teams    | name, color, createdBy                   |
| reactions            | Social reactions to messages            | messageId, userId/agentId, type, createdAt|
| comments             | Comments on messages                    | messageId, authorParticipantId, content, createdAt|
| follows              | Social follows (user/agent)             | followerId, followeeId, kind, createdAt  |
| events               | Scheduled meetings/events               | title, startTime, endTime, participants  |
| reminders            | Reminders for users/agents              | userId/agentId, message, remindAt, relatedEntity |
| learningFlows        | Structured learning/project sequences   | title, description, steps (ordered array of promptIds) |
| assignments          | Assigns users/agents to steps/flows     | learningFlowId, step, userId/agentId, role |
| progress             | Tracks step/flow completion status      | learningFlowId, step, userId/agentId, status, completedAt |
| products             | Shopify-compatible product information     | id, title, handle, description, descriptionHtml, vendor, productType, tags, status, publishedAt, createdAt, updatedAt, options, variants, images, featuredMedia, priceRange, compareAtPriceRange, totalInventory, tracksInventory, available, seo, onlineStoreUrl, collections, category, metafields |
| broadcasts           | Scheduled social media posts                | platform, content, scheduledTime, status, result, createdBy, groupId |
| inferenceUsage       | Tracks AI generation usage and cost         | userId, agentId, conversationId, messageId, tokensUsed, cost, currency, model, createdAt |
| evals                | Tracks AI evaluation runs (convex.dev evals) | id, userId, agentId, model, input, expectedOutput, actualOutput, score, status, error, createdAt, updatedAt, meta |
| courses              | Shopify-compatible product information     | id, title, handle, description, descriptionHtml, vendor, productType, tags, status, publishedAt, createdAt, updatedAt, options, variants, images, featuredMedia, priceRange, compareAtPriceRange, totalInventory, tracksInventory, available, seo, onlineStoreUrl, collections, category, metafields |
| lessons              | LMS course lessons                          | id, courseId, title, content, order, createdAt, updatedAt |
| enrollments          | LMS course enrollments                      | id, courseId, userId, enrolledAt, progress, status |
| tasks                | Task/todo manager                           | id, title, description, status, dueDate, assignedToUserId, assignedToAgentId, createdBy, createdAt, updatedAt, completedAt, priority, tags |

---

# Social Media Scheduling

To support scheduling and tracking of social media posts, the schema includes a `broadcasts` table. This table allows users, agents, or groups to schedule posts to various platforms (e.g., Twitter, Facebook, LinkedIn), track their status (scheduled, posted, failed), and store results or errors from the posting process. Each post is linked to its creator and optionally to a group for access control.

---

# Shopify-Compatible Product Schema

The `products` table is now aligned with Shopify's product schema, supporting all major fields required for e-commerce, SEO, and integration. This includes support for variants, options, images, inventory, SEO, and metafields, as well as compatibility with Shopify's naming conventions and data structure.

---

# AI Inference Usage & Cost Tracking (Stripe-Style Billing)

The schema now supports detailed tracking of AI generation (inference) costs and usage, inspired by Stripe's usage-based billing model ([Stripe Docs](https://docs.stripe.com/billing/subscriptions/usage-based/implementation-guide)). Each AI generation event is recorded with token usage, cost, and metadata, enabling accurate billing, analytics, and optimization. Message records also include direct cost and token usage fields for granular reporting.

---

# AI Evaluation Tracking (convex.dev evals)

The schema now includes an `evals` table for tracking automated or manual evaluations of AI generations, inspired by [convex.dev evals](https://docs.convex.dev/ai/evals). Each evaluation run records the input, expected and actual outputs, score, status, and metadata, enabling robust quality monitoring and model improvement workflows.

---

# Simple LMS & Task/Todo Manager

The schema now includes a minimal Learning Management System (LMS) for managing courses, lessons, and enrollments, as well as a flexible task/todo manager for users and agents. These additions enable basic e-learning and productivity workflows alongside the core agent and collaboration features.

---

# Full Contact Info & Google People Integration

The `users` table now supports full contact information, including multiple phone numbers, emails, addresses, organization, job title, birthday, notes, and photo URL. This enables seamless integration with Google People and address book imports.

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

  // 2. Users (People, with full contact info)
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    phoneNumbers: v.optional(v.array(v.string())),
    emails: v.optional(v.array(v.string())),
    addresses: v.optional(v.array(v.object({
      street: v.optional(v.string()),
      city: v.optional(v.string()),
      region: v.optional(v.string()),
      postalCode: v.optional(v.string()),
      country: v.optional(v.string()),
    }))),
    organization: v.optional(v.string()),
    jobTitle: v.optional(v.string()),
    birthday: v.optional(v.string()), // ISO date string
    notes: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    createdAt: v.number(),
    // ...other fields as needed
  }),

  // 3. Agents
  agents: defineTable({
    name: v.string(),
    description: v.string(),
    kind: v.union(v.literal("system_agent"), v.literal("user_agent")),
    prompt: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
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
    canGuideSteps: v.optional(v.array(stepValidator)),
  }),

  // 4. Tools
  tools: defineTable({
    name: v.string(),
    description: v.string(),
    config: v.optional(v.any()),
    createdBy: v.optional(v.id("users")),
  }),

  // 5. Prompts (with step and learningFlowId)
  prompts: defineTable({
    title: v.string(),
    template: v.string(),
    step: stepValidator,
    learningFlowId: v.optional(v.id("learningFlows")),
    orderInFlow: v.optional(v.number()),
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

  // 8. ConversationMessages (with step, cost, and tokensUsed)
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
    vector: v.optional(v.array(v.number())),
    meta: v.optional(v.any()),
    cost: v.optional(v.number()), // Cost of this message's AI generation (if any)
    tokensUsed: v.optional(v.number()), // Token count for this message (if any)
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

  // 13. Social: Reactions (likes, emojis, etc.)
  reactions: defineTable({
    messageId: v.id("conversationMessages"),
    userId: v.optional(v.id("users")),
    agentId: v.optional(v.id("agents")),
    type: v.string(), // e.g., "like", "love", "laugh", "custom_emoji"
    createdAt: v.number(),
  }),

  // 14. Social: Comments (threaded replies to messages)
  comments: defineTable({
    messageId: v.id("conversationMessages"),
    authorParticipantId: v.id("conversationParticipants"),
    content: v.string(),
    createdAt: v.number(),
  }),

  // 15. Social: Follows (user/agent follows another user/agent)
  follows: defineTable({
    followerId: v.string(), // userId or agentId as string
    followeeId: v.string(), // userId or agentId as string
    kind: v.union(v.literal("user"), v.literal("agent")),
    createdAt: v.number(),
  }),

  // 16. Scheduling: Events (meetings, calls, etc.)
  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    createdBy: v.string(), // userId or agentId as string
    participants: v.optional(v.array(v.string())), // userIds/agentIds as strings
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
  }),

  // 17. Scheduling: Reminders
  reminders: defineTable({
    userId: v.optional(v.id("users")),
    agentId: v.optional(v.id("agents")),
    message: v.string(),
    remindAt: v.number(),
    relatedEntity: v.optional(v.string()), // e.g., messageId, eventId, etc.
    createdAt: v.number(),
  }),

  // 18. Learning & Projects: LearningFlows
  learningFlows: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    steps: v.array(v.object({
      promptId: v.optional(v.id("prompts")),
      stepName: stepValidator,
      instructions: v.optional(v.string()),
      order: v.number(),
    })),
    createdBy: v.optional(v.id("users")),
    createdAt: v.number(),
  }),

  // 19. Learning & Projects: Assignments
  assignments: defineTable({
    learningFlowId: v.id("learningFlows"),
    step: stepValidator,
    userId: v.optional(v.id("users")),
    agentId: v.optional(v.id("agents")),
    role: v.optional(v.string()),
    assignedAt: v.number(),
    assignedBy: v.optional(v.id("users")),
  })
    .index("by_learningFlow_and_step", ["learningFlowId", "step"])
    .index("by_user", ["userId"])
    .index("by_agent", ["agentId"]),

  // 20. Learning & Projects: Progress
  progress: defineTable({
    learningFlowId: v.id("learningFlows"),
    step: stepValidator,
    userId: v.optional(v.id("users")),
    agentId: v.optional(v.id("agents")),
    status: v.union(
      v.literal("Not Started"),
      v.literal("In Progress"),
      v.literal("Completed"),
      v.literal("Blocked"),
      v.literal("Skipped")
    ),
    notes: v.optional(v.string()),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_learningFlow_and_step", ["learningFlowId", "step"])
    .index("by_user_and_flow", ["userId", "learningFlowId"])
    .index("by_agent_and_flow", ["agentId", "learningFlowId"]),

  // 21. Products (Shopify-Compatible)
  products: defineTable({
    id: v.optional(v.string()), // Shopify product ID (if syncing)
    title: v.string(),
    handle: v.string(),
    description: v.optional(v.string()),
    descriptionHtml: v.optional(v.string()),
    vendor: v.optional(v.string()),
    productType: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.optional(v.string()), // e.g., 'active', 'draft', 'archived'
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    options: v.optional(v.array(v.object({
      id: v.optional(v.string()),
      name: v.string(),
      values: v.array(v.string()),
    }))),
    variants: v.optional(v.array(v.object({
      id: v.optional(v.string()),
      title: v.optional(v.string()),
      sku: v.optional(v.string()),
      price: v.optional(v.number()),
      compareAtPrice: v.optional(v.number()),
      inventoryQuantity: v.optional(v.number()),
      available: v.optional(v.boolean()),
      selectedOptions: v.optional(v.array(v.object({
        name: v.string(),
        value: v.string(),
      }))),
      imageId: v.optional(v.string()),
      weight: v.optional(v.number()),
      weightUnit: v.optional(v.string()),
      barcode: v.optional(v.string()),
      taxable: v.optional(v.boolean()),
      requiresShipping: v.optional(v.boolean()),
      createdAt: v.optional(v.number()),
      updatedAt: v.optional(v.number()),
    }))),
    images: v.optional(v.array(v.object({
      id: v.optional(v.string()),
      src: v.string(),
      alt: v.optional(v.string()),
      position: v.optional(v.number()),
      createdAt: v.optional(v.number()),
      updatedAt: v.optional(v.number()),
    }))),
    featuredMedia: v.optional(v.any()), // Can be image/video object
    priceRange: v.optional(v.object({
      min: v.number(),
      max: v.number(),
      currencyCode: v.optional(v.string()),
    })),
    compareAtPriceRange: v.optional(v.object({
      min: v.number(),
      max: v.number(),
      currencyCode: v.optional(v.string()),
    })),
    totalInventory: v.optional(v.number()),
    tracksInventory: v.optional(v.boolean()),
    available: v.optional(v.boolean()),
    seo: v.optional(v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
    })),
    onlineStoreUrl: v.optional(v.string()),
    collections: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
    metafields: v.optional(v.array(v.object({
      namespace: v.string(),
      key: v.string(),
      value: v.any(),
      type: v.optional(v.string()),
    }))),
  }),

  // 22. Social Media Scheduling: Broadcasts
  broadcasts: defineTable({
    platform: v.string(), // e.g., 'twitter', 'facebook', 'linkedin'
    content: v.string(),
    scheduledTime: v.number(), // timestamp
    status: v.union(
      v.literal('scheduled'),
      v.literal('posted'),
      v.literal('failed'),
      v.literal('cancelled')
    ),
    result: v.optional(v.string()), // e.g., post ID, error message
    createdBy: v.id('users'),
    agentId: v.optional(v.id('agents')),
    groupId: v.optional(v.id('groups')),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    meta: v.optional(v.any()), // for platform-specific metadata
  }),

  // 23. AI Inference Usage Tracking
  inferenceUsage: defineTable({
    userId: v.optional(v.id("users")),
    agentId: v.optional(v.id("agents")),
    conversationId: v.optional(v.id("conversations")),
    messageId: v.optional(v.id("conversationMessages")),
    tokensUsed: v.number(),
    cost: v.number(),
    currency: v.optional(v.string()), // e.g., 'USD'
    model: v.optional(v.string()), // e.g., 'gpt-4', 'gemini-1.5'
    createdAt: v.number(),
    meta: v.optional(v.any()),
  }),

  // 24. AI Evaluation Tracking (convex.dev evals)
  evals: defineTable({
    id: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    agentId: v.optional(v.id("agents")),
    model: v.optional(v.string()),
    input: v.any(),
    expectedOutput: v.optional(v.any()),
    actualOutput: v.optional(v.any()),
    score: v.optional(v.number()),
    status: v.optional(v.string()), // e.g., 'pending', 'completed', 'failed'
    error: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    meta: v.optional(v.any()),
  }),

  // 25. Simple LMS
  courses: defineTable({
    id: v.optional(v.string()),
    title: v.string(),
    description: v.optional(v.string()),
    createdBy: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }),
  lessons: defineTable({
    id: v.optional(v.string()),
    courseId: v.id("courses"),
    title: v.string(),
    content: v.optional(v.string()),
    order: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }),
  enrollments: defineTable({
    id: v.optional(v.string()),
    courseId: v.id("courses"),
    userId: v.id("users"),
    enrolledAt: v.number(),
    progress: v.optional(v.number()), // percent or step
    status: v.optional(v.string()), // e.g., 'active', 'completed', 'dropped'
  }),

  // 26. Task/Todo Manager
  tasks: defineTable({
    id: v.optional(v.string()),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.optional(v.string()), // e.g., 'todo', 'in_progress', 'done', 'archived'
    dueDate: v.optional(v.number()),
    assignedToUserId: v.optional(v.id("users")),
    assignedToAgentId: v.optional(v.id("agents")),
    createdBy: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    priority: v.optional(v.string()), // e.g., 'low', 'medium', 'high'
    tags: v.optional(v.array(v.string())),
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
  "kind": "system_agent",
  "avatarUrl": "/avatars/director.png",
  "prompt": "You are the Director...",
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
- [ ] Social, Scheduling, LearningFlows, Assignments, and Progress tables are fully defined
- [ ] All fields justified, minimal, and optimized for speed and security
- [ ] Schema supports analytics, CRM, and future extensibility, enabling Turing-complete operations

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
  avatarUrl?: string;
  prompt: string;
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

export const addParticipant = mutation({
  args: {
    conversationId: v.id("conversations"),
    kind: v.union(v.literal("user"), v.literal("agent")),
    userId: v.optional(v.id("users")),
    agentId: v.optional(v.id("agents")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("conversationParticipants", {
      kind: args.kind,
      conversationId: args.conversationId,
      userId: args.userId,
      agentId: args.agentId,
      status: "active",
      isRemoved: false,
      addedAt: Date.now(),
    });
  },
});

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    authorParticipantId: v.id("conversationParticipants"),
    content: v.string(),
    step: v.optional(stepValidator),
    kind: v.optional(v.union(v.literal("participant"), v.literal("system"))),
    type: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("conversationMessages", {
      conversationId: args.conversationId,
      authorParticipantId: args.authorParticipantId,
      kind: args.kind ?? "participant",
      type: args.type,
      step: args.step,
      status: "sent",
      tags: args.tags,
      content: args.content,
      createdAt: Date.now(),
    });
  },
});

import { query } from "./_generated/server";

export const listMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("conversationMessages")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
      .order("asc")
      .collect();
  },
});

import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createAgent = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    kind: v.union(v.literal("system_agent"), v.literal("user_agent")),
    createdBy: v.optional(v.id("users")),
    prompt: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    delegatesTo: v.optional(v.array(v.id("agents"))),
    tools: v.optional(v.array(v.id("tools"))),
    tags: v.optional(v.array(v.string())),
    model: v.optional(v.string()),
    attachedPrompts: v.optional(v.array(v.id("prompts"))),
  },
  handler: async (ctx, args) => {
    const agentId = await ctx.db.insert("agents", {
      ...args,
      createdAt: Date.now(),
    });
    return agentId;
  },
});

export const addKnowledge = mutation({
  args: {
    ownerType: v.union(v.literal("agent"), v.literal("user")),
    ownerId: v.string(),
    content: v.string(),
    vector: v.optional(v.array(v.number())),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const knowledgeId = await ctx.db.insert("knowledge", {
      ...args,
      createdAt: Date.now(),
    });
    return knowledgeId;
  },
});

import { query } from "./_generated/server";

export const searchKnowledgeByTag = query({
  args: { tag: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("knowledge")
      .filter((q) => q.contains(q.field("tags"), args.tag))
      .collect();
  },
});

