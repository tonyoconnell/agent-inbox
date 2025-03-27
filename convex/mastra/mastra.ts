"use node";
import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";
import { InMemoryStorage } from "./lib/storage";
import { InMemoryVector } from "./lib/vector";
import crypto from "crypto";

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
