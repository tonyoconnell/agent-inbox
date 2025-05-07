---
title: ONE Plan
order: 1
description: ONE plan to safely migrate to a Turing-complete agent system
---

# ONE Agent System Project Plan (2024)

## Schema Migration Roadmap (Top Priority)

To upgrade the current codebase to the new, Turing-complete schema **without breaking anything**, follow this stepwise, safety-first plan:

### 1. Schema Gap Analysis
- **Deliverables:**
  - Compare new schema (docs/schema.md) to current Convex schema and codebase
  - List all changes needed (tables, fields, types, indexes)
- **Safety:**
  - No changes yet; just analysis and planning

### 2. Incremental Schema Upgrade
- **Deliverables:**
  - Add new tables/fields as optional (avoid breaking existing code)
  - Update validators/types and add new indexes
- **Safety:**
  - Do not remove or rename fields in a single step—deprecate first
  - Add new fields as optional, keep old fields until migration is complete

### 3. Codebase Refactor
- **Deliverables:**
  - Update backend logic (models, mutations, queries) to support new schema
  - Update frontend to read/write new fields, maintain compatibility
- **Safety:**
  - Refactor in small, testable increments
  - Use feature flags or toggles for risky changes

### 4. Data Migration
- **Deliverables:**
  - Write/run scripts or mutations to backfill and migrate data
  - Validate data integrity at each step
- **Safety:**
  - Take full backups before each migration step
  - Plan for rollback; every migration step should be reversible

### 5. Testing & QA
- **Deliverables:**
  - Expand automated and manual tests for all core flows
  - Test with both old and new data
- **Safety:**
  - Monitor for errors and regressions at each step

### 6. Deprecate & Clean Up
- **Deliverables:**
  - Remove old fields/tables only after migration is complete and tested
  - Remove legacy code
- **Safety:**
  - Clean up only after full validation and sign-off

### 7. Launch & Monitor
- **Deliverables:**
  - Monitor for errors, performance, and data issues post-migration
  - Rollback if any critical issues are found
- **Safety:**
  - Keep rollback plan and backups ready

---

## Agent System Implementation (Sub-Priority)

The following steps remain important, but are now sequenced after the migration:

1. Finalise Schema (see migration steps above)
2. Seed the Initial Set of System Agents in the Database
3. Scaffold the Convex Functions/Actions for Agent Logic
4. Build or Update the Frontend Agent Profile Components

---

## Developer Checklist: Migration Focus
- [ ] Schema gap analysis complete
- [ ] New tables/fields added as optional
- [ ] Backend and frontend refactored for new schema
- [ ] Data migration scripts run and validated
- [ ] All core flows tested (old and new data)
- [ ] Deprecated fields/tables removed after validation
- [ ] Launch and monitor with rollback plan in place

---

## Notes
- **Zero downtime, no data loss, robust testing** are the guiding principles
- Communicate changes and migration steps clearly to all team members
- Document every change and migration step for future reference

 Here's a detailed, actionable checklist for the incremental schema upgrade, based on the gap analysis. This will guide you step-by-step through the migration, ensuring nothing is missed and everything is done safely.
🟢 Incremental Schema Upgrade Checklist
1. Add New Tables (as optional, non-breaking)
[ ] agentTools
[ ] attachments
[ ] knowledge
[ ] tags
[ ] reactions
[ ] comments
[ ] follows
[ ] events
[ ] reminders
[ ] learningFlows
[ ] assignments
[ ] progress
2. Update Existing Tables
[ ] agents: Add/rename fields (delegatesTo, tools as IDs, canGuideSteps, etc.; replace goal, systemPrompt, personality, instructions with a single prompt field)
[ ] prompts: Add step, learningFlowId, orderInFlow, etc.
[ ] conversationMessages: Add step, vector, meta, attachments, etc.
[ ] conversations: Add tags, createdAt, etc.
[ ] conversationParticipants: Add status, isRemoved, addedAt, etc.
3. Add/Update Indexes
[ ] Add indexes for new tables (see schema)
[ ] Add/verify indexes for learning, assignments, progress, etc.
4. Update Validators/Types
[ ] Update all validators to match new field types and optionality
[ ] Update TypeScript types/interfaces for all affected entities
5. Update Backend Logic
[ ] Update models, mutations, and queries to support new fields/tables
[ ] Ensure backward compatibility during transition
6. Update Frontend
[ ] Update UI to read/write new fields (agents, messages, learning, social, etc.)
[ ] Add support for new features (learning flows, reactions, scheduling, etc.)
7. Data Migration
[ ] Write scripts/mutations to backfill new fields (e.g., set createdAt where missing)
[ ] Migrate/convert data for renamed fields or changed types
[ ] Validate data integrity after each migration step
8. Testing & QA
[ ] Expand automated and manual tests for all flows (old and new data)
[ ] Test all new features and data paths
9. Deprecate & Clean Up
[ ] Remove old fields/tables only after migration is complete and tested
[ ] Remove legacy code
10. Launch & Monitor
[ ] Monitor for errors, performance, and data issues post-migration
[ ] Rollback if any critical issues are found
Next Step:
Would you like to start with the schema file update (step 1), or do you want a more granular breakdown for each table/field?
Let me know if you want to proceed with the schema update, or if you want to review/plan the migration scripts and code changes in more detail!