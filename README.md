# Agent Inbox

## Initial Idea

The idea is that we are building an agentic inbox application that uses Convex and Mastra.AI

The main idea is that you have a chat experience simmilar to slack except you are chatting with a number of AI agents. 

On the left is a sidebar with conversation history and a button to let you make a new conversation, then on the right is the main chat window for the current conversation.

In a new conversation you can "at" agents to directly address them when you are chatting. 

The key here is that an agent can go off and do something on behalf of a user and then come back and add a message into the chat and then one agent can "at" another agent to reference it if it thinks that another agent should participate in a discussion.

When an agent is "atted" (@) it can go off on a "Task" this "Task" might involve a number of steps like searching the web, searching for documents etc before it comes back. This Task history isnt shown in the main chat but can be drilled down into if the user wishs. This should open up as a sidebar on the right hand side like a slack conversation.

The user can create new agents at any time. Each agent can be given different personality prompts and tools they have access to so that they behave differntly. 

All agents can be viewed from an agent gallery modal.

## How the Bots Work

Whenever a user posts a message to a conversation I want the function to also schedule a convex action to run that will invoke the "triage bot". 

This triage bot will eventually run an LLM that will look at the message and work out what to do. 

For now its important that you dont attempt to use an LLM and instead you should just fake calling one and instead do a time delay or something. 

What the triage bot will do will look at the message and decide a plan on action. It will look at what agents are conversation participants and what tools and personality and description they have then it it will then reply by creating a message into the conversation and will reference one of those bots. 