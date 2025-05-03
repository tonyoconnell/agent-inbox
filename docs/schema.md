---
title: Analytics
description: Elevate KPIs
date: 2024-02-02
tags:
  - agents
order: 1
---
# Schema

This proposed schema uses Convex `defineTable` and `v` (validators) syntax, assuming a Convex backend, but the principles can be adapted to other database systems. It aims to capture user progress, Foundation data, generated assets, and link them conceptually to Ecom funnel performance (though actual funnel tracking often resides more heavily in Analytics/CRM systems).

**Key Considerations:**

*   **Granularity:** Balancing detail with usability. Too granular is hard to manage; too high-level lacks insight.
*   **Relational Links:** Using Convex `Id` types extensively to link related data (User -> Foundation -> Prompt Execution -> Asset -> Funnel Stage Performance).
*   **Ecom Data Source:** This schema assumes the Ecom funnel data (Leads, Sales, etc.) might be *summarized* or *referenced* here, but the primary source-of-truth for raw transaction/analytics data is likely the Ecom platform (Shopify, etc.) and Analytics tools (GA4). Deep integration would require webhooks or APIs.
*   **Flexibility:** Using `v.any()` for AI outputs or complex objects allows flexibility but reduces type safety. Specific validators (`v.object`, `v.array`) are preferred where structure is known.

---

**Proposed Convex Schema: Elevate Playbook & Ecom Funnel Integration**

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

//Validators reused across tables
const elevateStepValidator = v.union(
  v.literal("Foundation"), // Module 0 is technically Foundation
  v.literal("Hook"),       // Step 1
  v.literal("Gift"),       // Step 2
  v.literal("Identify"),   // Step 3
  v.literal("Engage"),     // Step 4
  v.literal("Sell"),       // Step 5
  v.literal("Nurture"),    // Step 6
  v.literal("Upsell"),     // Step 7
  v.literal("Educate"),    // Step 8
  v.literal("Share")       // Step 9
);

// --- Core Elevate Playbook & Course Structure ---

export const playbookPrompts = defineTable({
  step: elevateStepValidator, // Which framework step it belongs to
  promptCode: v.string(), // e.g., "H1", "G3", "S2"
  title: v.string(),      // User-friendly title
  description: v.string(),// Brief explanation of purpose
  rocketTemplate: v.string(), // The full ROCKET prompt structure w/ placeholders
  requiredContext: v.array(v.string()), // List of Foundation elements needed (e.g., "Customer Pain", "Brand Voice")
  outputType: v.string(), // Expected output format (e.g., "List", "Email Draft", "JSON")
}).index("by_step", ["step"]);

export const courseModules = defineTable({
  moduleNumber: v.union(v.number(), v.literal(0)), // 0 for Foundation, 1-9 for steps
  step: elevateStepValidator,
  title: v.string(),
  objective: v.string(),
  videoUrl: v.optional(v.string()),
  textContent: v.optional(v.string()), // Summary or full text
  gridDefinition: v.optional(v.any()), // Store grid structure/explanation
  checklistItems: v.optional(v.array(v.string())),
  worksheetUrl: v.optional(v.string()), // Link to downloadable worksheet
  exampleImageUrl: v.optional(v.string()),
  exampleText: v.optional(v.string()),
  implementationGuide: v.optional(v.string()),
  status: v.optional(v.string()), // e.g., "now", "top", "todo", "done"
  category: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
  createdAt: v.number(),
  updatedAt: v.optional(v.number()),
  createdBy: v.optional(v.id("users")),
  updatedBy: v.optional(v.id("users")),
}).index("by_moduleNumber", ["moduleNumber"]);

// --- User Specific Data & Progress ---

export const users = defineTable({
  // From Convex Auth - typically includes name, email, picture, etc.
  ...authTables.users.validator.fields,
  // Additional custom user fields if needed
  onboardingStatus: v.optional(v.string()), // e.g., 'Not Started', 'Foundation Complete', 'Course Complete'
  phone: v.optional(v.string()),
  address: v.optional(v.string()),
  company: v.optional(v.string()),
  marketingConsent: v.optional(v.boolean()),
  preferredChannel: v.optional(v.string()),
  communicationPreferences: v.optional(v.any()), // e.g., { email: true, sms: false }
  currentFunnelStage: v.optional(v.string()), // e.g., "Nurture", "Sell"
  lastActiveAt: v.optional(v.number()),
});
// Add Indexes from authTables if necessary for queries
// .index("by_email", ["email"])

export const userFoundations = defineTable({
  userId: v.id("users"),
  // Store structured Foundation data based on the grids
  companyContext: v.object({
      coreOffers: v.optional(v.string()),
      uniqueMechanism: v.optional(v.string()),
      valueProposition: v.optional(v.string()),
      brandPillars: v.optional(v.string()),
      brandVoiceAdjectives: v.optional(v.array(v.string())),
      positioningPrice: v.optional(v.string()),
      missionVision: v.optional(v.string()),
      brandStoryPersonality: v.optional(v.string()),
      // ... potentially add all grid cells as optional fields
  }),
  marketAwareness: v.object({
      competitors: v.optional(v.array(v.object({ name: v.string(), weakness: v.string() }))),
      differentiation: v.optional(v.string()),
      marketTrends: v.optional(v.string()),
      channelAnalysis: v.optional(v.string()),
      // ...
  }),
  customerAvatar: v.object({
      profileSummary: v.optional(v.string()),
      pains: v.optional(v.array(v.string())),
      fears: v.optional(v.array(v.string())),
      goals: v.optional(v.array(v.string())),
      dreams: v.optional(v.array(v.string())),
      needs: v.optional(v.array(v.string())),
      wateringHoles: v.optional(v.string()),
      // ...
  }),
  strategicBlueprintSummary: v.optional(v.string()), // Overall alignment summary
  lastUpdatedAt: v.number(),
}).index("by_userId", ["userId"]);

export const userPromptExecutions = defineTable({
  userId: v.id("users"),
  promptCode: v.string(), // Reference to playbookPrompts.promptCode
  elevateStep: elevateStepValidator,
  inputContextSnapshot: v.any(), // Snapshot of Foundation data USED for this run
  aiRequestTimestamp: v.number(),
  aiResponse: v.optional(v.any()), // The raw AI output
  aiResponseTimestamp: v.optional(v.number()),
  status: v.union(v.literal("Pending"), v.literal("Success"), v.literal("Error")),
  refinedOutputAssetId: v.optional(v.id("userGeneratedAssets")), // Link to the final refined asset
}).index("by_user_step", ["userId", "elevateStep"]);

export const userGeneratedAssets = defineTable({
  userId: v.id("users"),
  promptExecutionId: v.optional(v.id("userPromptExecutions")), // Link back to prompt run
  elevateStep: elevateStepValidator,
  assetType: v.string(), // e.g., "Ad Headline", "Email Subject", "Sales Page Section"
  content: v.string(), // The refined, user-approved content
  channel: v.optional(v.string()), // e.g., "Facebook Ads", "Klaviyo", "Website"
  status: v.union(v.literal("Draft"), v.literal("Implemented"), v.literal("Archived")),
  createdAt: v.number(),
  lastUpdatedAt: v.number(),
}).index("by_user_step", ["userId", "elevateStep"]);

export const userModuleProgress = defineTable({
    userId: v.id("users"),
    moduleId: v.id("courseModules"),
    status: v.union(v.literal("Not Started"), v.literal("In Progress"), v.literal("Completed")),
    completedAt: v.optional(v.number()),
    notes: v.optional(v.string()), // User notes for the module
}).index("by_user_module", ["userId", "moduleId"]);


// --- Ecom Funnel Performance Data (Conceptual - Summarized/Referenced) ---
// NOTE: Real-time, granular funnel data typically lives in Analytics (GA4)
// and the Ecom Platform (Shopify, Woo). This table might store
// user-inputted summaries or potentially integrated data for dashboarding.

export const userFunnelSnapshots = defineTable({
  userId: v.id("users"),
  snapshotDate: v.number(), // Timestamp for the data period start/end
  timePeriod: v.string(), // e.g., "Last 7 Days", "Last 30 Days", "Month of April"

  // ATTRACT Metrics
  hook_AvgCTR: v.optional(v.number()),
  gift_OptInRate: v.optional(v.number()),
  gift_CPL: v.optional(v.number()), // Cost Per Lead
  attract_LeadsTotal: v.optional(v.number()),

  // CONVERT Metrics
  engage_AssistedConversionRate: v.optional(v.number()),
  sell_ConversionRate: v.optional(v.number()), // e.g., Lead -> Sale Rate
  sell_AOV_Initial: v.optional(v.number()), // AOV before upsell
  nurture_EmailConvRate: v.optional(v.number()),
  nurture_RetargetingROAS: v.optional(v.number()),
  convert_TotalSales: v.optional(v.number()),
  convert_CPA: v.optional(v.number()), // Cost Per Acquisition

  // GROW Metrics
  upsell_TakeRate: v.optional(v.number()),
  upsell_AOV_Final: v.optional(v.number()), // AOV including upsell
  educate_RepeatPurchaseRate: v.optional(v.number()),
  educate_CSAT_NPS: v.optional(v.number()), // Could be avg score
  share_ReviewRate: v.optional(v.number()), // % requests resulting in review
  grow_CLTV_Estimate: v.optional(v.number()), // Customer Lifetime Value

  // Overall
  overallROI: v.optional(v.number()),
  notes: v.optional(v.string()), // User notes about this snapshot
  channel: v.optional(v.string()), // e.g., "Facebook Ads", "Google Organic"
  campaignId: v.optional(v.string()),
  experimentId: v.optional(v.string()),
}).index("by_user_date", ["userId", "snapshotDate"]);


// Schema Definition
export default defineSchema({
  // Include base auth tables
  ...authTables,

  // Elevate Framework / Playbook Structure
  playbookPrompts,
  courseModules,

  // User Data & Progress
  // Note: 'users' table now includes auth fields directly
  userFoundations,
  userPromptExecutions,
  userGeneratedAssets,
  userModuleProgress,

  // Conceptual Ecom Funnel Data
  userFunnelSnapshots,

  // Need tables from previous chat schema if integrating that fully
  // agents, conversations, conversationParticipants, conversationMessages, etc.
  // (Omitted here for focus, but would be needed for a full chat/agent system)

  // --- New: userActivityLog table ---
  userActivityLog: defineTable({
    userId: v.id("users"),
    actionType: v.string(), // e.g., "prompt_run", "module_complete", "asset_created"
    actionRef: v.optional(v.string()), // e.g., ID of the related entity
    details: v.optional(v.any()),
    timestamp: v.number(),
    createdBy: v.optional(v.id("users")),
  })
    .index("by_user", ["userId"]),

});

---

# Unified Collaborative Schema for Agents, Users, Groups, Tools, and Conversations

This section presents the latest, unified Convex schema for a collaborative, agent-augmented system. It supports users, richly-configurable agents, user/agent groups, tools, prompts, and group-based conversations. This schema is designed for extensibility, productivity, and seamless integration with advanced UI and analytics.

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  // Agents (AI or user-created, with rich config)
  agents: defineTable({
    name: v.string(),
    description: v.string(),
    avatarUrl: v.string(),
    kind: v.union(v.literal("system_agent"), v.literal("user_agent")),
    createdBy: v.optional(v.id("users")),
    goal: v.optional(v.string()),
    systemPrompt: v.optional(v.string()),
    instructions: v.optional(v.string()),
    personality: v.optional(v.string()), // agent's personality, separate from instructions
    delegatesTo: v.optional(v.array(v.id("agents"))), // agents this agent can delegate to
    attachedPrompts: v.optional(v.array(v.id("prompts"))),
    model: v.optional(v.string()),
    tools: v.optional(v.array(v.id("tools"))),
    knowledge: v.optional(v.any()),
    memories: v.optional(v.any()),
    lastActiveTime: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    updatedBy: v.optional(v.id("users")),
  })
    .index("by_creator", ["createdBy"]),

  // Tools (for agents to use)
  tools: defineTable({
    name: v.string(),
    description: v.string(),
    config: v.optional(v.any()),
    createdBy: v.optional(v.id("users")),
  })
    .index("by_creator", ["createdBy"]),

  // Groups (user-created, can contain users and agents)
  groups: defineTable({
    name: v.string(),
    ownerId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_owner", ["ownerId"]),

  // Group Members (users or agents in a group)
  groupMembers: defineTable(
    v.union(
      v.object({
        groupId: v.id("groups"),
        kind: v.literal("user"),
        userId: v.id("users"),
        role: v.optional(v.string()), // e.g., "admin", "member", "observer"
        addedBy: v.id("users"),
        addedAt: v.number(),
        createdAt: v.number(),
        updatedAt: v.optional(v.number()),
        createdBy: v.optional(v.id("users")),
        updatedBy: v.optional(v.id("users")),
      }),
      v.object({
        groupId: v.id("groups"),
        kind: v.literal("agent"),
        agentId: v.id("agents"),
        role: v.optional(v.string()),
        addedBy: v.id("users"),
        addedAt: v.number(),
        createdAt: v.number(),
        updatedAt: v.optional(v.number()),
        createdBy: v.optional(v.id("users")),
        updatedBy: v.optional(v.id("users")),
      })
    )
  )
    .index("by_group", ["groupId"])
    .index("by_user", ["userId"])
    .index("by_agent", ["agentId"]),

  // Prompts (templates for agent instructions, etc.)
  prompts: defineTable({
    title: v.string(),
    content: v.string(),
    tags: v.optional(v.array(v.string())),
    status: v.optional(v.string()), // e.g., "now", "top", "todo", "done"
    category: v.optional(v.string()),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    updatedBy: v.optional(v.id("users")),
  })
    .index("by_creator", ["createdBy"]),

  // Conversations (group chat, can be linked to a group)
  conversations: defineTable({
    title: v.string(),
    createdBy: v.id("users"),
    groupId: v.optional(v.id("groups")),
    lastMessageTime: v.number(),
  })
    .index("by_user_and_time", ["createdBy", "lastMessageTime"])
    .index("by_group", ["groupId"]),

  // Conversation Participants (users or agents in a conversation)
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
  )
    .index("by_conversationId", ["conversationId"])
    .index("by_userId", ["userId"])
    .index("by_agentId", ["agentId"]),

  // Conversation Messages (messages in a conversation)
  conversationMessages: defineTable({
    conversationId: v.id("conversations"),
    authorParticipantId: v.id("conversationParticipants"),
    kind: v.union(v.literal("participant"), v.literal("system")),
    type: v.optional(v.string()), // e.g., "email", "chat", "system"
    status: v.optional(v.string()), // e.g., "now", "top", "todo", "done"
    tags: v.optional(v.array(v.string())), // message-level tags/labels
    content: v.string(),
    attachments: v.optional(v.array(v.any())), // file/image support
    createdAt: v.number(),
    meta: v.optional(v.any()),
    updatedAt: v.optional(v.number()),
    createdBy: v.optional(v.id("users")),
    updatedBy: v.optional(v.id("users")),
  })
    .index("by_conversationId", ["conversationId"]),

  // --- Agent Tools (join table for agent-tool config/permissions) ---
  agentTools: defineTable({
    agentId: v.id("agents"),
    toolId: v.id("tools"),
    config: v.optional(v.any()), // tool-specific config/permissions
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    createdBy: v.optional(v.id("users")),
    updatedBy: v.optional(v.id("users")),
  })
    .index("by_agent", ["agentId"])
    .index("by_tool", ["toolId"]),

  // --- Attachments (generic prompt attachments to agents or groups) ---
  attachments: defineTable({
    ownerType: v.union(v.literal("agent"), v.literal("group")),
    ownerId: v.string(), // id as string for flexibility
    promptId: v.id("prompts"),
    createdAt: v.number(),
    createdBy: v.optional(v.id("users")),
  })
    .index("by_owner", ["ownerType", "ownerId"])
    .index("by_prompt", ["promptId"]),

  // --- Support Tickets (support/community engagement) ---
  supportTickets: defineTable({
    userId: v.id("users"),
    moduleId: v.optional(v.id("courseModules")),
    subject: v.string(),
    message: v.string(),
    status: v.optional(v.string()), // e.g., "open", "closed"
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    createdBy: v.optional(v.id("users")),
    updatedBy: v.optional(v.id("users")),
  })
    .index("by_user", ["userId"])
    .index("by_module", ["moduleId"]),

  // --- User Feedback (CSAT/NPS, self-reported results) ---
  userFeedback: defineTable({
    userId: v.id("users"),
    moduleId: v.optional(v.id("courseModules")),
    csat: v.optional(v.number()), // Customer Satisfaction
    nps: v.optional(v.number()), // Net Promoter Score
    feedback: v.optional(v.string()),
    selfReportedResults: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    createdBy: v.optional(v.id("users")),
    updatedBy: v.optional(v.id("users")),
  })
    .index("by_user", ["userId"])
    .index("by_module", ["moduleId"]),

  // --- A/B Tests ---
  abTests: defineTable({
    userId: v.id("users"),
    testName: v.string(),
    variant: v.string(),
    result: v.optional(v.string()),
    metric: v.optional(v.string()),
    value: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    createdBy: v.optional(v.id("users")),
    updatedBy: v.optional(v.id("users")),
  })
    .index("by_user", ["userId"]),

  // --- Customers (end customer CRM) ---
  customers: defineTable({
    userId: v.id("users"), // owner (student)
    name: v.string(),
    email: v.optional(v.string()),
    segment: v.optional(v.string()), // e.g., 'Checklist Downloaders'
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    createdBy: v.optional(v.id("users")),
    updatedBy: v.optional(v.id("users")),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    company: v.optional(v.string()),
    marketingConsent: v.optional(v.boolean()),
    preferredChannel: v.optional(v.string()),
    communicationPreferences: v.optional(v.any()),
  })
    .index("by_user", ["userId"]),

  // --- Customer Journey Events ---
  customerJourneyEvents: defineTable({
    customerId: v.id("customers"),
    userId: v.id("users"), // owner (student)
    step: v.string(), // e.g., 'Hook', 'Gift', 'Sell', etc.
    eventType: v.optional(v.string()), // e.g., 'opt-in', 'purchase', 'review'
    channel: v.optional(v.string()),
    details: v.optional(v.string()),
    timestamp: v.number(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    createdBy: v.optional(v.id("users")),
    updatedBy: v.optional(v.id("users")),
  })
    .index("by_customer", ["customerId"])
    .index("by_user", ["userId"]),
});
```

## Summary Table

| Table                    | Purpose                                 | Key Fields/Indexes                        |
|--------------------------|-----------------------------------------|-------------------------------------------|
| users                    | Authenticated users                     | Convex Auth                               |
| agents                   | AI/user agents with config              | by_creator                                |
| tools                    | Tools for agents                        | by_creator                                |
| groups                   | User-created groups                     | by_owner                                  |
| groupMembers             | Users/agents in groups                  | by_group, by_user, by_agent               |
| prompts                  | Prompt templates                        | by_creator                                |
| conversations            | Group chats (optionally linked to group)| by_user_and_time, by_group                |
| conversationParticipants | Users/agents in conversations           | by_conversationId, by_userId, by_agentId  |
| conversationMessages     | Messages in conversations               | by_conversationId                         |

## Improvements and Extensibility

- **Agents**: Now support goals, system prompts, instructions, attached prompts, model selection, tools, knowledge, and memories for advanced AI workflows.
- **Groups**: Flexible membership (users and agents), supporting collaborative work and agent-augmented teams.
- **Tools**: Extensible, can be assigned to agents for custom capabilities.
- **Prompts**: Reusable templates for agent instructions or user workflows.
- **Conversations**: Support for group chat, with both users and agents as participants, and optional group linkage.
- **Scalable**: Add more fields/tables as needed (files, analytics, etc.).

This schema is designed for modern, collaborative, and AI-augmented applications, and can be easily extended to support new features and integrations.

/**
Improvements in this version:
- Added agentTools join table for per-agent tool configuration and permissions.
- Added attachments table for generic prompt attachments to agents or groups.
- Added createdAt, updatedAt, createdBy, updatedBy fields to all major tables for auditability and collaborative tracking.
- Added role field to groupMembers for fine-grained permissions and access control.
- Added type, status, tags, and attachments fields to conversationMessages for filtering, tabs, labels, and file/image support.
- Added status, category, and tags fields to courseModules and prompts for filtering and organization (e.g., ToDo/Done/Now/Top tabs).
*/

/**
Analytics-Focused Improvements:
- Added supportTickets table for support/community engagement analytics.
- Added userFeedback table for CSAT/NPS and self-reported results.
- Added abTests table for A/B test tracking.
- Added customers and customerJourneyEvents tables for end customer journey/CRM analytics, including segment tagging.
*/

/**
Agent Modeling Improvements:
- Added personality field (optional) to agents for explicit personality modeling, separate from instructions.
- Added delegatesTo field (optional) to agents for modeling agent delegation/team structure.
*/

/**
Marketing & Funnel Perfection Improvements:
- Added full contact, company, consent, and communication preference fields to users and customers.
- Added currentFunnelStage and lastActiveAt to users for funnel tracking and engagement.
- Added channel, campaignId, and experimentId to userFunnelSnapshots for advanced e-commerce analytics and attribution.
- Added userActivityLog table for unified, queryable user action history.
*/