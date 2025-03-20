# Agent Inbox - Product Requirements Document

## Overview
Agent Inbox is an agentic chat application that lets users interact with multiple AI agents in a familiar chat interface. The platform uses Convex for real-time data handling and Mastra.AI for the agent capabilities.

## Product Vision
To provide users with a streamlined interface for collaborating with multiple AI agents that can perform tasks, communicate with each other, and assist users in a conversational format.

## User Experience

### Core Interface
- **Left Sidebar**: Contains conversation history and a button to create new conversations
- **Main Window**: Displays the current conversation's message history and input field
- **Optional Right Sidebar**: Shows detailed task history when requested

### Key Interactions
- Users create conversations to start conversations
- Users can "@" specific agents to request their attention or assistance
- Agents respond in the conversation and can go off to perform tasks
- Agents can "@" other agents to bring them into the conversation
- Task histories can be expanded to see detailed steps agents took

## Features

### Conversation Management
- Create new discussion conversations
- View conversation history
- Switch between active conversations

### Agent Interaction
- Direct message agents using @ mentions
- View real-time agent responses
- See agent status (active, processing task, idle)

### Task Execution
- Agents perform tasks in the background when requested
- Tasks can include web searches, document retrieval, etc.
- Task history viewable in a right sidebar on demand

### Agent Management
- Create new custom agents
- Configure agent personalities via prompts
- Define tool access for different agents
- View all agents in a gallery modal

## Technical Requirements

### Backend
- **Convex**: For real-time data synchronization and database
- **Mastra.AI**: For agent capabilities and task execution

### Frontend
- Real-time chat UI
- Conversation management system
- Agent gallery and configuration
- Task history visualization

## User Flows

### Creating a New Conversation
1. User clicks "Create New Conversation" button
2. User enters initial message and selects agents to participate
3. System creates conversation and notifies selected agents

### Interacting with Agents
1. User types message with "@agent" to direct a query
2. Agent is notified and processes the request
3. Agent performs any necessary tasks (invisible to main chat)
4. Agent responds in the conversation with results

### Viewing Task Details
1. User clicks on an agent's response that references a completed task
2. Right sidebar opens showing detailed steps the agent took
3. User can collapse this view to return to focused chat

### Creating a New Agent
1. User selects "Create New Agent" option
2. User provides name, description, personality traits
3. User configures tool access permissions
4. New agent becomes available for conversations

## Success Criteria
- Users can effectively manage multiple agent conversations
- Agents successfully execute tasks and return useful information
- Inter-agent communication creates value beyond single-agent interactions
- System maintains responsive performance even with multiple active agents

## Future Considerations
- Integration with external tools and services
- Advanced agent customization options
- Team collaboration features 