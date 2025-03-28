# Agent Inbox

A playground to experimenting with agentic behaviours on Convex.

## Setup

1. Install dependencies: `bun install`

2. Start the dev server: `bun dev` this will step you though getting up a new convex project

3. Provide the API tokens needed: 
+ OPENAI_API_KEY - for AI models - `bun convex env set EXA_API_KEY {YOUR_KEY}`
+ EXA_API_KEY - for web search tooling - `bun convex env set EXA_API_KEY {YOUR_KEY}`
+ RESEND_API_KEY - for emailing tooling - `bun convex env set RESEND_API_KEY {YOUR_KEY}`

4. Setup convex auth tokens: `bunx @convex-dev/auth`

5. Setup GithubOauth: https://labs.convex.dev/auth/config/oauth/github


## Initial Idea

The idea is that we are building an agentic inbox application that uses Convex and Mastra.AI

The main idea is that you have a chat experience simmilar to slack except you are chatting with a number of AI agents. 

On the left is a sidebar with conversation history and a button to let you make a new conversation, then on the right is the main chat window for the current conversation.

In a new conversation you can "at" agents to directly address them when you are chatting. 

The key here is that an agent can go off and do something on behalf of a user and then come back and add a message into the chat and then one agent can "at" another agent to reference it if it thinks that another agent should participate in a discussion.

When an agent is "atted" (@) it can go off on a "Task" this "Task" might involve a number of steps like searching the web, searching for documents etc before it comes back. This Task history isnt shown in the main chat but can be drilled down into if the user wishs. This should open up as a sidebar on the right hand side like a slack conversation.

The user can create new agents at any time. Each agent can be given different personality prompts and tools they have access to so that they behave differntly. 

All agents can be viewed from an agent gallery modal.