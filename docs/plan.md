---
title: Project Plan for ONE Framework App
description: High-level roadmap for building the ONE agent-augmented collaborative system
date: 2024-02-02
tags:
  - plan
order: 1
---

# ONE Framework App: Project Plan

## 1. Schema & Backend Foundation

- **Deliverables:**
  - Finalize Convex schema (users, agents, groups, tools, prompts, conversations, messages, analytics, etc.)
  - Implement all backend tables, indexes, and audit fields
  - Set up authentication and access control
  - Write core backend queries and mutations for CRUD operations
  - **Include new tables and fields:** agentTools, attachments, userActivityLog, supportTickets, userFeedback, abTests, customers, customerJourneyEvents, and all new fields (personality, delegatesTo, tags, status, attachments, etc.)
- **Schema Support:**
  - All entities and relationships are explicitly modeled for real-time, transactional, and extensible backend logic
- **Dependencies:**
  - Must be completed before frontend and AI logic can be fully implemented

## 2. Core UI & Frontend

- **Deliverables:**
  - Build UI using shadcn/ui, React, Tailwind, and type-route
  - Implement sidebar navigation, conversation list, agent profiles, chat area, and analytics dashboards
  - Integrate with backend using convex/react hooks
  - Support mentions, filtering, search, and responsive design
  - **Expose and handle all new fields in UI:** personality, delegatesTo, tags, status, attachments, audit fields, etc.
- **Schema Support:**
  - All UI data (users, agents, conversations, messages, tags, status, etc.) is available via schema-backed queries
- **Dependencies:**
  - Requires backend queries/mutations and schema to be in place

## 3. AI/Agent Logic & Orchestration

- **Deliverables:**
  - Implement agent orchestration, @mention parsing, and message routing
  - Integrate AI SDK (OpenAI, tools, prompt templates)
  - Build agent team logic (Director, Sage, Writer, etc.) and tool-calling workflows
  - Support agent configuration, personality, and delegation/team structure
  - **Utilize new agent fields and tables:** personality, delegatesTo, agentTools, attachments, knowledge, memories, etc.
- **Schema Support:**
  - Agents, agentTools, attachments, knowledge, memories, and conversationParticipants/messages enable all agent workflows
- **Dependencies:**
  - Requires schema, backend, and core UI to be functional

## 4. Analytics, CRM, and Advanced Features

- **Deliverables:**
  - Implement analytics dashboards (course progress, funnel metrics, customer journey, A/B tests, feedback)
  - Build CRM features (customers, journey events, segmentation)
  - Add support/community features (supportTickets, userFeedback)
  - Extend UI and backend for advanced filtering, reporting, and insights
  - **Leverage new analytics/CRM tables:** userFunnelSnapshots, userModuleProgress, customers, customerJourneyEvents, abTests, supportTickets, userFeedback, userActivityLog
- **Schema Support:**
  - All analytics and CRM needs are covered by the new schema tables and fields
- **Dependencies:**
  - Built on top of core schema, backend, and UI

## 5. Testing, QA, and Launch

- **Deliverables:**
  - Write unit and integration tests (Vitest, shared logic, backend, frontend)
  - Linting, formatting, and code quality enforcement
  - User acceptance testing and feedback
  - Prepare documentation and onboarding materials
  - Launch to production (Vercel, Convex Cloud)
  - **Test all new fields and tables for correct handling in backend and UI**
- **Schema Support:**
  - Strong typing and audit fields enable robust testing and traceability
- **Dependencies:**
  - All previous phases must be complete

---

## Summary

This plan ensures a robust, extensible, and user-friendly product by:

- Building on a strong, real-time schema foundation
- Sequencing backend, UI, and AI logic for rapid iteration
- Supporting advanced analytics, CRM, agent modeling, and extensibility for future features
- Enabling future growth and feature additions with modular, well-typed data models

---

## Developer Checklist: Schema Implementation

- [ ] All new fields (personality, delegatesTo, tags, status, attachments, etc.) are present in schema and handled in backend logic
- [ ] agentTools join table is implemented and used for per-agent tool config
- [ ] attachments table is implemented and used for prompt attachments
- [ ] userActivityLog table is implemented and logs all relevant user actions
- [ ] supportTickets, userFeedback, abTests, customers, customerJourneyEvents tables are implemented and integrated
- [ ] All new fields are exposed to the frontend and handled in UI components
- [ ] All analytics, CRM, and advanced features are supported by backend and UI
- [ ] All new fields and tables are covered by tests and documentation
