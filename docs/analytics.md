---
title: Analytics
description: Elevate KPIs
date: 2024-02-02
tags:
  - agents
order: 1
---

Analytics for each stakeholders 

**I. Teacher/Admin Analytics Dashboard (Focus: Course Effectiveness & Student Progress)**

- **Goal:** Understand how students are engaging with the course content, where they might be struggling, and the overall effectiveness of the training in driving _student_ success (indicated by their usage and potential self-reported results).
- **Key Metrics & KPIs:**
  - **Enrollment Rate:** (If applicable, comparing landing page views to enrollments).
  - **Module Completion Rates:** % of students completing each module (0-9). Identifies potential drop-off points in the course itself.
  - **Average Time Spent per Module:** Indicates engagement level or difficulty.
  - **Playbook Prompt Usage Rate:** (If trackable within the system) % of students actively using prompts for each module. Which prompts are most/least popular?
  - **Worksheet/Template Download Rate:** Indicates engagement with practical tools.
  - **Community Engagement Rate (If applicable):** Activity level, questions asked per module topic.
  - **Support Query Volume (by Module):** Where are students most frequently asking for help?
  - **Course Completion Rate:** % of students finishing the entire course.
  - **CSAT/NPS (Course Specific):** Student satisfaction with the course content and structure.
  - **Self-Reported Student Results (Qualitative/Surveys):** Case studies, testimonials, reported % increase in _their own_ Ecom metrics after applying the framework.
- **Dashboard Visualizations:**
  - **Course Funnel:** Enrollment -> Module 1 Completion -> ... -> Module 9 Completion -> Final Project/Result.
  - **Module Progress Bars:** Visualizing average completion across all students for each module.
  - **Prompt Usage Heatmap:** Showing which module's prompts are used most often.
  - **Support Ticket Trends:** Line graph showing query volume per module topic over time.
  - **Student Testimonial Showcase:** Featuring key success stories.
- **Integration:** Data primarily comes from the Learning Management System (LMS) or course platform, potentially combined with community platform analytics and periodic student surveys.

**II. Student Analytics Dashboard (Focus: Implementing & Optimizing _Their_ Elevate Framework)**

- **Goal:** Provide the student (Ecom Owner/Marketer using the ONE system) with clear insights into how _their_ implementation of the Elevate Framework is performing for _their_ business, allowing them to diagnose bottlenecks and optimize effectively. **This directly mirrors the detailed framework analytics we outlined previously.**
- **Key Metrics & KPIs (Grouped by Elevate Level):**
  - **ATTRACT (Hook, Gift, Identify):**
    - Hook CTRs (by channel/angle)
    - Gift Landing Page Conversion Rate
    - Cost Per Lead (CPL)
    - Overall Leads Generated
    - Flow-Through: % Leads from Hook Clicks
  - **CONVERT (Engage, Sell, Nurture):**
    - Sales/Product Page Conversion Rate
    - Add-to-Cart Rate
    - Checkout Completion Rate
    - Nurture Email Engagement & Conversion Rates
    - Retargeting ROAS
    - Assisted Conversion Rate (from Engage)
    - Cost Per Acquisition (CPA)
    - Overall Lead-to-Customer Conversion Rate
  - **GROW (Upsell, Educate, Share):**
    - Upsell Take Rate & AOV Impact
    - Repeat Purchase Rate & Churn Rate
    - Customer Satisfaction (CSAT/NPS)
    - Review Generation Rate & Avg. Rating
    - Referral Conversion Rate
    - Customer Lifetime Value (CLTV)
- **Dashboard Visualizations:**
  - **Primary Elevate Funnel View:** Visualizing the flow Reach -> Leads -> Customers -> Repeat Buyers -> Advocates with key conversion rates between stages.
  - **Level-Specific Dashboards:** Drill-downs for ATTRACT, CONVERT, GROW showing the relevant step KPIs and flow-through rates within that level.
  - **Channel Performance Comparison:** Tables/Charts showing performance (Leads, CPL, CPA, Sales) broken down by traffic source (e.g., Facebook Ads, Google Organic, Email).
  - **Trend Lines:** Key metrics (Leads, Sales, CPA, AOV, CLTV) over time (Week/Month/Quarter).
  - **A/B Test Tracking Area:** A section to input and monitor results of specific tests run on Hooks, Gifts, Sell Pages, Emails etc.
- **Integration:** **Requires the student to connect their _own_ data sources.** This is the major technical challenge. Potential integrations:
  - Google Analytics 4 (Requires proper event/goal setup by student).
  - Ecom Platform Analytics API (Shopify, WooCommerce etc.).
  - Ad Platform APIs (Meta, Google Ads).
  - ESP/CRM APIs (Klaviyo, Mailchimp etc.).
  - _(The ONE system ideally provides wizards or guides for these integrations, or uses tools like Looker Studio with connectors)._

**III. End Customer Analytics (Focus: Their Journey Experience - Visualized _for the Student_)**

- **Goal:** Help the student visualize how _individual_ or _segmented groups_ of their customers are moving through the implemented Elevate Framework. **This data is primarily viewed and interpreted _by the student_ via the Guide Agent or Student Dashboard.**
- **Key Metrics & KPIs (Tracked per Customer/Segment):**
  - **Source/Hook:** Which channel/campaign brought them in?
  - **Gift Opt-in:** Did they receive the Gift? Which one?
  - **Lead Status:** Identified, Engaged (Chat?), In Nurture Sequence, Purchased.
  - **Purchase History:** First Purchase Date, Items Bought, AOV, Upsell Taken (Y/N).
  - **Onboarding Status (Educate):** Opened Welcome Emails? Clicked Tutorial Links? (Requires ESP tracking).
  - **Advocacy Status (Share):** Left Review? Referred Others? (Requires Review/Referral Platform integration).
  - **Time Between Stages:** How long from Identify to Sell? How long from Sell to Repeat Purchase?
  - **Segment Performance:** Compare journey progression for different lead segments (e.g., 'Checklist Downloaders' vs. 'Webinar Attendees').
- **Dashboard Visualizations (Within Student's ONE System, potentially via Guide Agent):**
  - **Customer Journey Map (Visualized):** Show the typical path/timeline customers take through the 9 steps, highlighting conversion rates and time lags.
  - **Segment Comparison:** Side-by-side funnel views for different lead source tags or customer segments.
  - **Individual Customer Timeline (CRM View - Future State):** See a specific customer's interaction history mapped against the Elevate steps (requires deep CRM integration).
- **Integration:** Relies heavily on data being captured correctly with consistent tagging in the ESP/CRM (from IDENTIFY onwards) and potentially advanced integration with analytics platforms to stitch sessions together.

**IV. Learning Flows: Guided Step-by-Step Collaboration**

- **Goal:** Enable users (students, teams) and agents to follow a structured sequence of steps/messages (e.g., the Elevate steps), with clear instructions, collaborative assignments, and analytics tracking for both learning and ecommerce objectives.

- **How it works:**
  - **Step Sequences:** Each learning or project flow is modeled as a sequence of steps (e.g., Foundation → Hook → Gift ... Share), each with associated instructions, prompts, and expected outputs.
  - **Instructions:** For each step, instructions are surfaced to users and agents (via UI and/or agent messages), guiding them on what to do, what to submit, and what to review.
  - **Assignments:** People and agents can be assigned to specific steps (e.g., "Anthony" and "@Writer Agent" are responsible for "Gift").
  - **Message Linking:** Messages, prompts, and outputs are linked to steps, so all discussion and work for a step is easily accessible and reviewable.
  - **Agent Guidance:** Agents (e.g., Teacher, Guide) can proactively nudge, explain, or summarize progress at each step, and help resolve blockers.
  - **Progress Tracking:** The system tracks which steps are completed, in progress, or blocked for each user/team/agent. Analytics can show:
    - Step completion rates (per user, team, or cohort)
    - Average time spent per step
    - Where users/teams get stuck (bottlenecks)
    - Which agents or prompts are most helpful at each step
    - Outcomes (e.g., content created, ecommerce KPIs improved)
  - **Ecommerce Integration:** For business users, each step can be mapped to real-world ecommerce actions (e.g., "Gift" step = launch a lead magnet, "Sell" step = optimize product page), and analytics can track the impact of completing each step on business metrics.

- **Example Flow:**
  1. **User enrolls in a learning journey or project.**
  2. **System assigns steps and instructions.**
  3. **User and agents collaborate on each step, exchanging messages, prompts, and outputs.**
  4. **Agent (e.g., Teacher) provides feedback, nudges, or explanations as needed.**
  5. **Progress and outcomes are tracked and visualized in analytics dashboards.**

- **Schema Support:**
  - `prompts` and `conversationMessages` are linked to steps.
  - `assignments` (could be a new table) link people/agents to steps.
  - `progress` (could be a new table or tracked in messages) records completion status per step/user/agent.
  - `events` and `reminders` can be used to schedule reviews, deadlines, or collaborative sessions for each step.

- **Analytics:**
  - Visualize learning/project flow completion, bottlenecks, and agent impact.
  - Compare learning outcomes or business KPIs before/after completing each step.
  - Identify which instructions, agents, or prompts drive the best results.

**Summary:**
- The system supports guided, collaborative, and analytics-driven learning and ecommerce flows, with agents and people working together to achieve step-by-step progress and measurable outcomes.

**Summary:**

- **Teacher:** Focuses on course engagement and student success metrics.
- **Student:** Focuses on _their own business performance_ mapped against the Elevate Framework steps, requiring integration with _their_ tools.
- **End Customer:** Their journey is tracked and visualized _for the student_ to understand flow, bottlenecks, and segment performance across the framework stages.

Implementing the **Student Dashboard** requires the most technical integration effort but provides the highest direct value by showing them the real-world impact of implementing the Elevate system on _their specific business_. The **Guide Agent** acts as the interpreter of this customer journey data for the student.
