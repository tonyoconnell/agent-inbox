---
title: Project Plan for ONE Framework App
description: High-level roadmap for building the ONE agent-augmented collaborative system
date: 2024-02-02
tags:
  - plan
order: 1
---

# ONE Framework App: Agent System Project Plan (2024)

## Top Priority: Agent System Implementation

The following steps are the current focus for the project, in order:

### 1. Review or Update the Convex Schema for Agents
- **Deliverables:**
  - Ensure the schema supports all agent fields and relationships (name, description, goal, systemPrompt, instructions, personality, delegatesTo, tools, agentTools, knowledge, memories, attachedPrompts, model, kind, createdBy, createdAt, updatedAt, updatedBy, tags, status, etc.)
  - Add/verify join tables: agentTools, attachments
  - Add/verify indexes for efficient queries
- **Dependencies:**
  - Foundation for all subsequent steps

### 2. Seed the Initial Set of System Agents in the Database
- **Deliverables:**
  - Populate the database with core system agents (Director, Sage, Teacher, Writer, etc.)
  - Use detailed roles, personalities, and prompts from agents.md
  - Ensure correct tools, delegatesTo, and relationships
- **Dependencies:**
  - Requires schema to be finalized

### 3. Scaffold the Convex Functions/Actions for Agent Logic
- **Deliverables:**
  - Create Convex internal actions/functions for each agent
  - Implement orchestration logic for the Director
  - Set up @mention parsing and message routing
- **Dependencies:**
  - Requires seeded agents and schema

### 4. Build or Update the Frontend Agent Profile Components
- **Deliverables:**
  - Create/update React components to display agent profiles (all fields)
  - Add UI for agent selection, team structure, and @mentioning in chat
  - Integrate with backend queries for real-time agent data
- **Dependencies:**
  - Requires backend logic and seeded agents

---

## Future Steps (After Agent System)
- Analytics, CRM, and advanced features (see previous plan for details)
- Testing, QA, and launch

---

## Developer Checklist: Agent System Focus
- [ ] Schema supports all agent fields and relationships
- [ ] agentTools and attachments tables implemented
- [ ] System agents seeded with full config and logic
- [ ] Agent orchestration and message routing implemented
- [ ] Agent profile UI components built/updated
- [ ] All new fields and tables covered by tests and documentation
