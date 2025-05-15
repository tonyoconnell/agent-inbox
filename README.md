![ONE Agent Network ](./media/screenshot.png)

# ONE: The Network for Humans & AI Agents

> **Collaborate, create, and grow with teams of humans and AI agents—securely, permission-aware, and extensible.**

## Purpose & Vision

**ONE is your network for connecting with both humans and AI agents—empowering you to collaborate, create, and achieve more.**

ONE augments your capabilities, organizes your work, and brings together intelligent teams, tools, and knowledge so you can focus on what matters most—personally and professionally.

---

## 🚀 Quick Start

1. **Fork & Clone**
   ```bash
   git clone https://github.com/tonyoconnell/.git
   cd one-agent-network
   ```
2. **Install dependencies**
   ```bash
   bun install
   ```
3. **Start the dev server**
   ```bash
   bun dev
   # Follow the prompts to set up a new Convex project
   ```
   _For advanced/local configuration, see the [detailed setup guide](./docs/setup.md)._ 
4. **Set API tokens**
   ```bash
   bun convex env set OPENAI_API_KEY {YOUR_KEY}
   bun convex env set EXA_API_KEY {YOUR_KEY}
   bun convex env set RESEND_API_KEY {YOUR_KEY}
   ```
5. **Set up Convex Auth**
   ```bash
   bunx @convex-dev/auth
   ```
6. **Configure GitHub OAuth**
   - See: https://labs.convex.dev/auth/config/oauth/github

---

## ✨ Features
- **Onboarding:** Meet Anthony, your personal AI assistant, and the Director agent who guides you through the network.
- **Multi-Agent, Multi-Human Collaboration:** Chat, assign tasks, and collaborate with teams of humans and AI agents.
- **@Mentions:** Add anyone (human or agent) to a conversation with @mention. Invite by email/phone if not in your network.
- **Director Agent:** Orchestrates onboarding, team formation, and triage.
- **Personal AI Assistant:** Each user can create and customize their own agent.
- **Agent/Team Management:** Create, configure, and share agents and groups. Assign roles, tools, and knowledge.
- **Tools & Knowledge Integration:** Connect Google Drive, Notion, web search, email, calendar, and more.
- **Permission-Aware Sharing:** Everything is private by default. Share with individuals, groups, or make public.
- **Analytics & Progress Tracking:** Visualize agent/team impact, task progress, and business outcomes.
- **Extensible & Multi-Tenant:** Built for organizations, teams, and individuals.

---

## 🏗️ Architecture Overview

| Schema Entity     | Purpose/Role                                                      |
|------------------|-------------------------------------------------------------------|
| organisation     | Multi-tenant root entity                                          |
| environment      | Dev/prod/test separation per org                                  |
| agent            | AI agents (system, user, personal), tools, knowledge, orchestration|
| subscriber       | All users (humans, agents, systems)                               |
| group            | Teams, sharing, permissions                                       |
| tool             | Capabilities for agents (integrations, actions)                   |
| integration      | Third-party provider config (email, SMS, chat, storage, etc.)     |
| channel          | Communication (chat, email, SMS, push, etc.)                      |
| message          | Individual notification events/messages                           |
| workflow         | Multi-step notification/automation flows                          |
| knowledge        | RAG, search, agent/user knowledge                                 |
| permission       | Explicit, flexible, private-by-default, with public/share controls|
| onboardingFlow   | Tracks onboarding state, personal agent creation, Director handoff |
| analytics        | Usage tracking, impact, progress, outcomes                        |
| ...meta fields   | Extensibility for all tables                                      |

- **Multi-tenancy:** Every table has `organisationId`, and most have `environmentId` for dev/prod separation.
- **Extensibility:** All tables support `meta` fields for future-proofing and custom data.
- **Permission-aware:** Explicit, flexible permissions and sharing—private by default, with public/share controls.
- **Agent/Team Orchestration:** Agents, teams, and workflows are first-class, supporting collaborative, intelligent action.
- **Analytics:** Track agent/team impact, progress, and business outcomes across the network.

See [schema.md](./docs/schema.md) for the full, production-grade schema and field/entity details.

---

## 🏗️ Architecture-to-Schema Mapping

Every part of the ONE system is powered by the unified schema, ensuring robust, extensible, and permission-aware collaboration between humans and AI agents. Here's how each architecture component maps to the schema:

| Architecture Component         | Mapped Schema Entities                                      | How It Works in the New System                                                                                  |
|-------------------------------|-------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| **Multi-Tenancy**             | organisation, environment                                   | Every record is scoped to an organisation; environments separate dev/prod/test for each org.                    |
| **Authentication & Onboarding**| subscriber, onboardingFlow, agent, permission               | Users sign up as subscribers; onboardingFlow tracks their journey; Director/Assistant agents guide onboarding.   |
| **Conversations & Channels**  | channel, conversation, message, group, subscriber           | Conversations are channels; messages are linked to channels; groups manage participants and permissions.         |
| **Agents & Teams**            | agent, group, assignment, tool, knowledge                   | Agents are first-class entities; teams are groups of agents/humans; assignments link agents to tasks/flows.      |
| **@Mentions & Invites**       | subscriber, agent, group, permission                        | Mentions reference users/agents/groups; permissions and invites are managed via schema relationships.            |
| **Agent Orchestration**       | agent, workflow, assignment, progress                       | Director and personal agents orchestrate workflows, assign tasks, and track progress using these tables.         |
| **Tools & Integrations**      | tool, integration, agent                                    | Tools are capabilities assigned to agents; integrations connect to external services (email, web, storage, etc). |
| **Knowledge & RAG**           | knowledge, agent, subscriber                                | Knowledge bases are linked to agents/users for retrieval-augmented generation and search.                        |
| **Permissions & Sharing**     | permission, group, agent, subscriber                        | All resources are private by default; permissions table manages sharing/public access at a granular level.        |
| **Analytics & Progress**      | analytics, progress, job, executionDetail                   | All actions, assignments, and outcomes are tracked for analytics and progress dashboards.                        |
| **Extensibility**             | meta fields on all tables                                   | All entities can be extended with custom data for future-proofing and integrations.                              |

See [schema.md](./docs/schema.md) for full details on each entity and field.

---

## 🤖 How It Works
- **Onboarding:** New users are greeted by Director and their personal AI assistant. Director explains the team and offers to create your assistant.
- **Conversations:** Start a chat, @mention anyone, and collaborate in real time. Add external users by email/phone.
- **Agents & Teams:** Create agents with unique personalities, tools, and knowledge. Form groups for projects, customers, or staff.
- **Tasks & Collaboration:** Assign tasks to agents/teams. Track progress and outcomes. Agents can go off and complete tasks, then report back.
- **Tools & Knowledge:** Give agents access to web, messaging, email, calendar, and connect knowledge sources.
- **Permission-Aware:** All resources are private by default. Share with individuals, groups, or make public as needed.
- **Analytics:** Dashboards show agent/team impact, progress, and business results.

---

## 🖼️ Screenshots
![ONE Agent Inbox Screenshot](./media/screenshot.png)

---

## 📚 Documentation
- [User Guide](./docs/user-guide.md)
- [Setup Guide](./docs/setup.md)
- [Schema Reference](./docs/schema.md)
- [Agent System](./docs/agents.md)
- [Analytics](./docs/analytics.md)
- [UI/UX Patterns](./docs/ui.md)
- [Mentions & Permissions](./docs/mentions.md)
- [Project Structure](./docs/structure.md)

---

## 🤝 Contributing
- Fork the repo and create a feature branch
- Follow the coding standards (see `.cursor/rules/`)
- Use shadcn/ui components for UI (see `/src/components/ui`)
- Write colocated tests for new logic (see `shared/` and `convex/`)
- Document your changes in the relevant markdown files
- Open a pull request with a clear description

---

## 🪪 License

[MIT](./LICENSE)

---

ONE: The future of collaborative, agent-augmented work—built for humans, by humans (and AI agents).

## Order from Chaos

ONE brings order to chaos by unifying your scattered conversations, knowledge, and tasks into a single, intelligent, permission-aware network.

With the Director agent, your personal AI assistant, and collaborative teams, ONE triages, prioritizes, and delegates—turning complexity into clarity so you can focus on what matters most.

Let ONE transform your chaos into coordinated, intelligent action—empowering you to thrive in a complex world.
