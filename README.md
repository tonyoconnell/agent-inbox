# Agent Inbox

## Initial Idea

The idea is that we are building an agentic inbox application that uses Convex and Mastra.AI

The main idea is that you have a chat experience simmilar to slack except you are chatting with a number of AI agents. 

On the left is a sidebar with thread history and a button to let you make a new thread, then on the right is the main chat window for the current thread.

In a new thread you can "at" agents to directly address them when you are chatting. 

The key here is that an agent can go off and do something on behalf of a user and then come back and add a message into the chat and then one agent can "at" another agent to reference it if it thinks that another agent should participate in a discussion.

When an agent is "atted" (@) it can go off on a "Task" this "Task" might involve a number of steps like searching the web, searching for documents etc before it comes back. This Task history isnt shown in the main chat but can be drilled down into if the user wishs. This should open up as a sidebar on the right hand side like a slack thread.

The user can create new agents at any time. Each agent can be given different personality prompts and tools they have access to so that they behave differntly. 

All agents can be viewed from an agent gallery modal.