"use node";
import { Mastra } from "@mastra/core/mastra";
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";
import { InMemoryStorage } from "./lib/storage";
import { InMemoryVector } from "./lib/vector";
import crypto from "crypto";
import { createTools } from "./tools";
import { ActionCtx } from "../_generated/server";
import { pick } from "../../shared/misc";
import schema from "../schema";
import { Doc } from "../_generated/dataModel";

// // Some of the packages look for it globally
global.crypto = crypto as any;

export const createMastra = (ctx: ActionCtx) => {
  const storage = new InMemoryStorage();
  const vector = new InMemoryVector();

  const embedder = openai.embedding("text-embedding-3-small");
  const memory = new Memory({
    storage,
    vector,
    embedder,
  });

  const allTools = createTools(ctx);

  const triageAgent = new Agent({
    name: "Conversation Triage Agent",
    instructions: `You are a helpful agent that triages conversations.

  You will be given a conversation message and its up to you to determine what agent you should route this message to.
  You must select one of the agents from the list of agents that I will provide.
  If there are no agent provided then you should send a message to the conversation stating that there are no agents available to handle the message.
  If there is an agent that can handle the message then you should send a message to the conversation stating that the message has been routed to the agent.

  `,
    model: openai("gpt-4o-mini"),
    tools: pick(allTools, "sendMessageToConversation"),
    memory,
  });

  const mastra = new Mastra({
    agents: { triageAgent },
    storage,
  });

  return mastra;
};


