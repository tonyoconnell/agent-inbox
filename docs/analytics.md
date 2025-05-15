---
title: Analytics
order: 1
description: Unified Analytics for ONE Network (Multi-Tenant, Agent, Learning Flows)
---

# Analytics Overview

| Dashboard                | Purpose/Stakeholder         | Key Schema Entities                |
|--------------------------|-----------------------------|------------------------------------|
| Teacher/Admin Dashboard  | Course effectiveness, student progress | organisation, group, progress, assignments, events, reminders, permissions |
| Student Dashboard        | Business performance, Elevate framework | organisation, agent, group, knowledge, progress, assignments, permissions, analytics |
| End Customer Dashboard   | Customer journey, segment analysis | organisation, group, customer, events, progress, permissions |
| Agent/Team Analytics     | Agent/AI/team impact, collaboration | agent, group, assignments, knowledge, progress, permissions |
| Learning Flow Analytics  | Step-by-step progress, bottlenecks | progress, assignments, events, reminders, agent, group |

---

## Multi-Tenant & Permission-Aware Analytics
- All analytics are filtered by `organisationId` and, where relevant, `environmentId`.
- Dashboards respect permissions: only data the user/agent has access to (via the `permissions` table) is shown.
- Analytics can be scoped to groups, agents, or individuals, supporting private, shared, and public views.

---

## Agent & Team Analytics
- Track agent/AI actions, tool usage, and collaboration:
  - Which agents contributed to which tasks, steps, or outcomes?
  - How often are agents/tools/knowledge used in workflows?
  - Visualize agent impact on learning, business, or customer outcomes.
- Schema support: `agent`, `assignments`, `knowledge`, `progress`, `events`, `permissions`.
- Example: "@Writer Agent completed 3 content steps for Group A this week."

---

## Learning/Project Flow Analytics
- Each learning or project flow is modeled as a sequence of steps (see `progress`, `assignments`, `events`, `reminders`).
- Track:
  - Step completion rates (per user, team, or cohort)
  - Average time spent per step
  - Where users/teams/agents get stuck (bottlenecks)
  - Which agents or prompts are most helpful at each step
  - Outcomes (e.g., content created, ecommerce KPIs improved)
- Visualize learning/project flow completion, bottlenecks, and agent impact.
- Schema support: `progress`, `assignments`, `events`, `reminders`, `agent`, `group`, `permissions`.

---

## Stakeholder Dashboards

### I. Teacher/Admin Analytics Dashboard
- **Purpose:** Course effectiveness, student progress, agent/team impact.
- **Key Metrics:** Enrollment, module completion, time per module, agent/prompt usage, support queries, course completion, CSAT/NPS, student results.
- **Schema:** `organisation`, `group`, `progress`, `assignments`, `events`, `reminders`, `permissions`.
- **Permission-aware:** Only see data for your org/groups.

### II. Student Analytics Dashboard
- **Purpose:** Business performance, Elevate framework, agent/AI collaboration.
- **Key Metrics:** Funnel conversion, channel performance, A/B test results, agent/tool usage, learning progress.
- **Schema:** `organisation`, `agent`, `group`, `knowledge`, `progress`, `assignments`, `permissions`, `analytics`.
- **Permission-aware:** Only see your own and shared data.

### III. End Customer Analytics
- **Purpose:** Visualize customer journey, segment analysis, agent/AI impact.
- **Key Metrics:** Source, opt-in, lead status, purchase history, onboarding, advocacy, time between stages, segment performance.
- **Schema:** `organisation`, `group`, `customer`, `events`, `progress`, `permissions`.
- **Permission-aware:** Only see data for your customers/segments.

---

## Agent/AI Actions & Collaboration Tracking
- Track which agents/AI contributed to which steps, tasks, or outcomes.
- Visualize collaboration between humans and agents (e.g., "@Guide Agent and Anthony completed the 'Gift' step").
- Schema: `agent`, `assignments`, `progress`, `events`, `permissions`.

---

## Learning Flows: Analytics & Visualization
- Each flow is a sequence of steps, with assignments and progress tracked for each user/agent/team.
- Visualize:
  - Step completion rates
  - Agent/AI impact (e.g., which steps were completed by agents vs. humans)
  - Bottlenecks and time-to-completion
  - Outcomes and business impact
- Schema: `progress`, `assignments`, `events`, `reminders`, `agent`, `group`, `permissions`.

---

## Schema References
- All analytics are powered by the unified schema: `organisation`, `environment`, `agent`, `group`, `assignments`, `progress`, `events`, `reminders`, `knowledge`, `permissions`, `analytics`, etc.
- See `schema.md` for full table/field details.

---

## Developer Notes
- Analytics dashboards should be permission-aware and multi-tenant by default.
- Use the `permissions` table to filter data for each user/agent.
- Integrate agent/team analytics and learning flow tracking for actionable insights.
- Reference `plan.md` for migration and implementation steps.

---

# ONE Playbook Example: Elevate Framework in Action

The ONE Playbook—built around the Elevate Framework—demonstrates the power of the ONE system to drive business growth, learning, and collaboration. Each step is tracked, measured, and visualized, with agents and humans working together for real results.

## Elevate Framework Steps
1. **Hook** – Attract attention with a compelling offer or message.
2. **Gift** – Deliver value up front (lead magnet, freebie, etc.).
3. **Identify** – Capture and qualify leads.
4. **Engage** – Start a conversation, build trust.
5. **Sell** – Present the core offer and convert.
6. **Nurture** – Follow up, educate, and build the relationship.
7. **Upsell** – Offer additional value, increase AOV.
8. **Educate** – Onboard, train, and empower customers.
9. **Share** – Encourage advocacy, reviews, and referrals.

## How the ONE Analytics System Powers the Playbook
- **Step-by-Step Tracking:** Each step is modeled as a flow in the schema (`progress`, `assignments`, `events`).
- **Agent & Team Collaboration:** Agents (e.g., @Guide, @Writer) and humans are assigned to steps, with all actions and outcomes tracked.
- **Permission-Aware:** Only authorized users/agents see relevant analytics, respecting privacy and sharing settings.
- **Outcome Measurement:** Key business metrics (e.g., leads, sales, NPS, referrals) are linked to playbook steps and visualized in dashboards.

## Example: Business Journey Using the Playbook
1. **Hook:** @Marketing Agent launches a Facebook ad campaign. Analytics track impressions, clicks, and CTR by channel.
2. **Gift:** @Writer Agent creates a downloadable guide. System tracks downloads and opt-ins, visualized in the dashboard.
3. **Identify:** Leads are captured and qualified. Progress and conversion rates are tracked per segment.
4. **Engage:** @Sales Agent starts conversations with new leads. Engagement rates and agent impact are measured.
5. **Sell:** @Sales Agent and human team present the offer. Sales conversion rates and agent/human contributions are tracked.
6. **Nurture:** @Nurture Agent sends follow-up emails. Email open/click rates and nurture sequence progress are visualized.
7. **Upsell:** @Product Agent offers an upsell. Upsell take rate and AOV impact are tracked.
8. **Educate:** @Guide Agent onboards new customers. Onboarding completion and satisfaction are measured.
9. **Share:** @Advocacy Agent requests reviews/referrals. Review rates and referral conversions are tracked.

## Visualizing Success
- **Dashboards** show funnel progression, agent/human contributions, and business outcomes at each step.
- **Bottlenecks** are identified (e.g., low conversion at 'Gift' step), and agents can suggest improvements.
- **Collaboration** is visible: see which agents/teams drove the best results.

## Why This Matters
The ONE Playbook is more than a checklist—it's a living, collaborative framework. With analytics, agents, and teams working together, every business or learning journey is measurable, improvable, and inspiring.
