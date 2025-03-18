# Agent Write PRD

## Project Overview

The Agent Write is a collaborative writing tool that provides users with multiple AI agents, each with a different personality, to assist in the writing process. These agents work autonomously in the background, performing research, providing feedback, and offering insights from different perspectives. Unlike traditional AI writing tools where the user must explicitly prompt for assistance, these agents proactively engage with the content being written.

## Core Value Proposition

The system allows writers to access multiple AI perspectives simultaneously while writing, mimicking a collaborative environment with different "people" helping with the writing process. Each agent has a distinct personality and can approach the content from a unique angle, providing a richer, more diverse set of insights than a single AI assistant could.

## Target Audience

- Content creators
- Professional writers
- Students working on essays/papers
- Anyone looking for diverse perspectives on their writing

## Key Features

### 1. Editable Text Area

- A ProseMirror-based rich text editor on the left side of the application
- Real-time editing capabilities
- Clean, distraction-free interface
- Ability to save, load, and export written content

### 2. Autonomous Agents Panel

- Panel on the right side showcasing available agents
- Each agent has a distinct personality (e.g., Skeptic, Technical Expert, Empathetic Coworker)
- Agents can be added, removed, or customized
- Visual indicator when an agent has something to contribute (hand raising)

### 3. Agent Capabilities

- Autonomous background operation without explicit prompting
- Web search capabilities to find relevant information
- Processing and analysis of the user's writing
- Ability to "interrupt" with insights when they have something valuable to add
- Memory of the document's context and previous interactions

### 4. User Control

- Toggle individual agents on/off
- Ability to customize agent personalities and specialties
- Control over whether agents can interrupt or only provide insights when requested
- Ability to dismiss or save agent suggestions

## Technical Requirements

### Frontend Components

1. **Text Editor Component**
   - ProseMirror-based rich text editor
   - Real-time saving and synchronization with Convex

2. **Agent Panel Component**
   - Display of available agents with their personalities
   - Status indicators for each agent (thinking, has suggestion, idle)
   - Interface for adding/removing agents

3. **Suggestion Display Component**
   - Area to show agent suggestions when selected
   - Option to incorporate suggestions into the main text

### Backend Components

1. **Document Storage**
   - Convex tables for storing document content
   - Real-time synchronization of edits

2. **Agent Management**
   - Definition and storage of agent personalities
   - Association of agents with specific documents
   - Background processing of agent tasks

3. **Agent Thinking & Actions**
   - Background processing for agent analysis
   - Web search functionality
   - Natural language generation for agent responses
   - Triggered actions based on document content

### Data Schema

1. **Documents**
   - Content
   - User ID
   - Creation and modification timestamps
   - Associated agents

2. **Agents**
   - Personality type
   - Specialties
   - User preferences for the agent

3. **Agent Thoughts**
   - Generated insights
   - Related document section
   - Status (shared/dismissed)
   - Timestamps

4. **User Preferences**
   - Default agent settings
   - Interface preferences

## Implementation Phases

### Phase 1: Core Writing Environment

- Implement basic document editor with ProseMirror
- Set up real-time synchronization with Convex
- Create basic document management (create, save, load)

### Phase 2: Agent Framework

- Implement the agent panel UI
- Create the first 3 agent personalities (Skeptic, Technical, Empathetic)
- Set up background processing for agent analysis
- Implement basic notification system when agents have suggestions

### Phase 3: Agent Intelligence

- Add web search capabilities for agents
- Implement more sophisticated analysis of written content
- Develop the "hand raising" interruption mechanism
- Add more agent personalities

### Phase 4: Advanced Features

- User customization of agent personalities
- Import/export capabilities
- Collaboration features (multiple human users)
- Analytics on agent effectiveness

## User Stories

1. **As a writer**, I want autonomous agents to research topics related to what I'm writing, so I can access relevant information without breaking my flow.

2. **As a student**, I want agents with different perspectives to critique my essay, so I can strengthen my arguments.

3. **As a content creator**, I want an empathetic agent to check the emotional tone of my writing, so I can ensure it resonates with my audience.

4. **As a technical writer**, I want a skeptical agent to find weaknesses in my explanations, so I can improve clarity.

5. **As a user**, I want to customize which agents are active for different writing projects, so I can get the most relevant assistance.

## Open Questions & Considerations

1. How to balance agent autonomy with user control to avoid overwhelming interruptions?
2. What is the optimal number of agents before diminishing returns?
3. How to ensure web search results are relevant and properly attributed?
4. Privacy considerations for content being analyzed by agents
5. How to effectively visualize agent "thinking" without cluttering the interface

## Success Metrics

1. User engagement with agent suggestions
2. Time saved in research and editing
3. User satisfaction with the quality of agent insights
4. Reduction in revision cycles needed for completed documents
5. User retention and frequency of use 