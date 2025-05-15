---
title: UI & UX (Unified ONE System)
description: How the UI supports the unified schema, agent/team model, and permission-aware collaboration
order: 1
---

# UI & UX: Unified ONE System

## Summary Table: UI Areas & Key Entities
| UI Area/Component      | Purpose/Role                                 | Key Schema/Entities                |
|-----------------------|----------------------------------------------|------------------------------------|
| Sidebar/Navigation    | Access to main features, agent/team mgmt     | agents, groups, permissions        |
| Message List/Inbox    | View/filter/search messages/conversations    | conversations, conversationMessages, mentions |
| Content Panel         | View/edit message content, agent actions     | conversationMessages, agents, permissions |
| Agent/Team Management | Create/manage agents, teams, roles           | agents, groups, assignments, permissions |
| Analytics Dashboards  | Visualize agent/team impact, progress        | analytics, progress, assignments   |
| Mentions/Badges       | Mention users/agents/groups, permission-aware| mentions, agents, groups, permissions |
| Profile/Settings      | Manage user/agent profiles, preferences      | users, agents, preferences         |

---

## How UI Supports the Unified System

### Sidebar/Navigation
- Provides access to all major features: chat, agents, teams, tools, analytics.
- Shows counts/badges for agents, tools, people, etc., reflecting real-time data from the schema.
- Permission-aware: Only shows features the user/agent has access to.

### Message List/Inbox
- Displays conversations/messages, filterable by tags, status, or participants.
- Integrates mention logic: highlights messages where the user/agent/team is mentioned.
- Supports multi-tenancy: shows only data for the current org/environment.

### Content Panel
- Shows full message content, sender/recipient info, and agent actions (Save, Reply, Forward, Complete, Share).
- Action buttons are permission-aware (e.g., only show 'Complete' if user/agent has rights).
- Displays recipient tags as badges, supporting mention logic and agent/team collaboration.

### Agent/Team Management
- UI for creating, configuring, and managing agents/teams, roles, and permissions.
- Assign agents to flows, lessons, or teams; visualize team structure and assignments.
- Permission-aware: Only creators/owners can edit/delete agents; public/private agent controls.
- See [agents.md](./agents.md) for backend logic.

### Analytics Dashboards
- Visualize agent/team impact, progress, and business outcomes.
- Filterable by org, group, agent, or permission.
- See [analytics.md](./analytics.md) for dashboard logic.

### Mentions/Badges
- UI for mentioning users, agents, and groups in messages.
- Suggestion popups, clickable badges, and permission-aware rendering.
- See [mentions.md](./mentions.md) for mention logic.

### Profile/Settings
- Manage user/agent profiles, preferences, and notification settings.
- Permission-aware: Only users/agents with rights can edit certain fields.

---

## Multi-Tenancy, Orchestration, and Extensibility
- All UI areas respect multi-tenancy (org/environment context).
- Agent orchestration (Director, flows, assignments) is surfaced in team/agent management and analytics.
- UI is modular and extensible, supporting new agent types, tools, and collaboration patterns.

---

## Legacy & New UI Features: Interoperability
- **Legacy UI features** (sidebar, message list, content panel, mention logic) are preserved and extended for the unified system.
- **New features** (agent/team management, analytics dashboards, permission-aware actions) are layered on top, with all components updated to interoperate.
- **All UI and docs** reference the unified schema, ensuring consistency and extensibility.

---

## References
- See [schema.md](./schema.md) for canonical schema.
- See [agents.md](./agents.md) for agent/team logic.
- See [analytics.md](./analytics.md) for analytics and impact tracking.
- See [mentions.md](./mentions.md) for mention logic and permissions.
- See [structure.md](./structure.md) for project structure and best practices.

---

This UI is designed for clarity, collaboration, and extensibility—empowering users and agents to work together in a robust, permission-aware environment.
