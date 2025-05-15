---
title: Project Structure (Unified ONE System)
description: How the codebase supports the unified schema, agent/team model, and permission-aware collaboration
order: 1
---

# Project Structure: Unified ONE System

## Summary Table: Directories & Key Entities
| Directory      | Purpose/Role                                 | Key Schema/Entities                | Legacy Inspiration |
|---------------|----------------------------------------------|------------------------------------|-------------------|
| convex/       | Backend logic, schema, agent orchestration   | agents, conversations, permissions, analytics, assignments, progress | Modular feature directories, colocated tests, clear CRUD separation |
| shared/       | Shared types, mention logic, tools           | mentions, tools, agent config      | Centralized shared logic, test placement, type safety |
| src/          | Frontend UI, agent/team management, chat     | agents, conversations, permissions | Modular UI, authenticated/unauthenticated split, shadcn/ui usage |
| public/       | Static assets                                | avatars, logos, etc.               | Simple, direct asset serving |
| .cursor/      | Editor/AI config, coding rules               | coding standards, rules            | Project-specific rules, enforced best practices |

---

## How Structure Supports the Unified System

### convex/
- **Schema:** Unified schema (`schema.ts`) imports all agent, conversation, permission, analytics, and assignment tables.
- **Agents:** `agents/` directory manages agent CRUD, orchestration, and team logic (see [agents.md](./agents.md)).
- **AI Logic:** `ai/` directory handles agent replies, triage, tool usage, and orchestration (Director, flows, etc.).
- **Conversations:** `conversations/`, `conversationParticipants/`, and `conversationMessages/` manage threads, participants, and messages, supporting mention logic and permission-aware collaboration.
- **Permissions:** All actions and queries enforce permission checks (see [schema.md](./schema.md)).
- **Analytics:** Analytics tables and logic track agent/team impact, progress, and outcomes (see [analytics.md](./analytics.md)).
- **Multi-tenancy:** All tables include `organisationId` and (where needed) `environmentId`.
- **Legacy Inspiration:** Modular feature directories, colocated tests, and CRUD separation are retained and extended for new features.

### shared/
- **Mentions:** Core mention logic (`mentions.ts`) supports user, agent, and group mentions, with parsing/rendering for permission-aware collaboration (see [mentions.md](./mentions.md)).
- **Tools:** Definitions and validation for agent tools, shared between backend and frontend.
- **Types:** Shared types for agents, tools, messages, etc., ensuring consistency across the stack.
- **Legacy Inspiration:** Centralized shared logic, colocated tests (e.g., `mentions.test.ts`), and type safety are preserved.

### src/
- **UI Components:** Agent/team management, chat, conversation, and permission-aware UI built with shadcn/ui (see [ui.md](./ui.md)).
- **Mentions UI:** Interactive mention badges, suggestions, and routing, fully integrated with backend mention logic.
- **Agent Profiles:** Management and display of agent/team configuration, roles, and permissions.
- **Analytics Dashboards:** Visualize agent/team impact, progress, and outcomes (see [analytics.md](./analytics.md)).
- **Routing & Auth:** Type-safe routing and authentication, supporting multi-tenant, permission-aware flows.
- **Legacy Inspiration:** Modular UI, authenticated/unauthenticated split, and shadcn/ui usage are retained and improved.

### public/
- **Assets:** Avatars, logos, and other static files for agents, teams, and org branding.
- **Legacy Inspiration:** Simple, direct asset serving is preserved.

### .cursor/
- **Coding Rules:** Project-specific coding standards and rules for Convex, shadcn/ui, and agent/team best practices.
- **Legacy Inspiration:** Enforced best practices and project-specific rules are continued.

---

## Legacy-to-Unified Mapping
| Legacy Feature/Component         | Unified System Mapping/Enhancement |
|----------------------------------|------------------------------------|
| Modular backend feature dirs     | convex/ retains and extends this   |
| Colocated tests                  | Preserved in shared/ and convex/   |
| Shared types/utilities           | shared/ is still the hub           |
| Authenticated/unauthenticated UI | src/components split, improved     |
| Mention logic                    | shared/mentions.ts, now permission-aware |
| CRUD separation                  | convex/agents, conversations, etc. |
| Asset serving                    | public/ as before                  |
| Coding rules                     | .cursor/ rules, extended           |

---

## Best Practices Retained
- **Colocated tests** (e.g., `mentions.test.ts` in shared/)
- **Modular backend/frontend separation**
- **Shared types and logic**
- **Clear CRUD and feature boundaries**
- **Type safety and code quality enforcement**

---

## References
- See [schema.md](./schema.md) for canonical schema.
- See [agents.md](./agents.md) for agent/team logic.
- See [analytics.md](./analytics.md) for analytics and impact tracking.
- See [mentions.md](./mentions.md) for mention logic and permissions.
- See [ontology.md](./ontology.md) for entity relationships and extensibility.

---

This structure is both a bridge for legacy developers and a robust foundation for new features, ensuring your app is stable, extensible, and ready for collaborative, agent-augmented, permission-aware growth.

---
