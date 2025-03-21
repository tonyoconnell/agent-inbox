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

export const storage = new InMemoryStorage();
export const vector = new InMemoryVector();

export const embedder = openai.embedding("text-embedding-3-small");
export const memory = new Memory({
  storage,
  vector,
  embedder,
});
