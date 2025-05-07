import { DatabaseReader, MutationCtx, QueryCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";
import * as Users from "../users/model";
import { predefinedAgents } from "../../shared/predefinedAgents";

export const find = async (
  db: DatabaseReader,
  { agentId }: { agentId: Id<"agents"> },
) => {
  return await db.get(agentId);
};

export const get = async (
  db: DatabaseReader,
  { agentId }: { agentId: Id<"agents"> },
) => {
  const agent = await find(db, { agentId });
  if (!agent) throw new Error(`Agent not found ${agentId}`);
  return agent;
};

export const createAgentAvatarUrl = (seed: string) => {
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
};

export const createAgent = async (ctx: MutationCtx) => {
  const userId = await Users.getMyId(ctx);
  const randomIndex = Math.floor(Math.random() * predefinedAgents.length);
  const selectedAgent = predefinedAgents[randomIndex];

  // Store tool names directly for user agents
  return await ctx.db.insert("agents", {
    name: selectedAgent.name,
    description: selectedAgent.description,
    prompt: undefined, // or map from personality if needed
    tools: selectedAgent.tools, // string[]
    createdBy: userId,
    createdAt: Date.now(),
    avatarUrl: createAgentAvatarUrl(selectedAgent.name),
    kind: "user_agent",
  });
};

export const createSystemAgent = async (
  ctx: MutationCtx,
  args: {
    name: string;
    description: string;
    avatarUrl: string;
    tools?: string[];
    // add other fields as needed from the main schema
  },
) => {
  // If you want system agents to use tool IDs, keep the mapping. Otherwise, store tool names directly as well.
  return await ctx.db.insert("agents", {
    name: args.name,
    description: args.description,
    prompt: undefined, // or map from personality if needed
    tools: args.tools, // string[]
    createdBy: undefined,
    createdAt: Date.now(),
    avatarUrl: args.avatarUrl,
    kind: "system_agent",
    // delegatesTo, tags, model, knowledge, memories, updatedAt, updatedBy can be added if needed
  });
};

export const listForUser = async (
  db: DatabaseReader,
  { userId }: { userId: Id<"users"> },
) => {
  return await db
    .query("agents")
    .withIndex("by_createdBy", (q) => q.eq("createdBy", userId))
    .collect();
};

export const listMine = async (ctx: QueryCtx) => {
  const userId = await Users.getMyId(ctx);
  return listForUser(ctx.db, { userId });
};

export const findMine = async (
  ctx: QueryCtx,
  { agentId }: { agentId: Id<"agents"> },
) => {
  const userId = await Users.getMyId(ctx);
  const agent = await ctx.db.get(agentId);
  if (!agent) throw new Error("Access denied");
  if (agent.kind != "user_agent") throw new Error("Access denied");
  if (agent.createdBy != userId) throw new Error("Access denied");
  return agent;
};

export const getMine = async (
  ctx: QueryCtx,
  { agentId }: { agentId: Id<"agents"> },
) => {
  const agent = await findMine(ctx, { agentId });
  if (!agent) throw new Error("Agent not found");
  return agent;
};

export const ensureICanAccessAgent = async (
  ctx: QueryCtx,
  { agentId }: { agentId: Id<"agents"> },
) => {
  const agent = await getMine(ctx, { agentId });
  if (!agent) throw new Error("Access denied");
};

export const updateMine = async (
  ctx: MutationCtx,
  {
    agentId,
    name,
    description,
    prompt,
    tags,
    tools,
  }: {
    agentId: Id<"agents">;
    name: string;
    description: string;
    prompt?: string;
    tags?: string[];
    tools?: string[];
  },
) => {
  return await ctx.db.patch(agentId, {
    name,
    description,
    prompt,
    tags,
    tools,
  });
};

export const remove = async (
  ctx: MutationCtx,
  { agentId }: { agentId: Id<"agents"> },
) => {
  await ctx.db.delete(agentId);
};

export const getTriageAgent = async (db: DatabaseReader) => {
  // Find the triage agent by kind and name (or another unique identifier)
  const agent = await db
    .query("agents")
    .filter((q) => q.eq(q.field("kind"), "system_agent"))
    .filter((q) => q.eq(q.field("name"), "Director"))
    .first();
  if (!agent) throw new Error("Triage agent not found");
  return agent;
};

// Helper to map tool names to IDs
async function getToolIdsByNames(ctx: MutationCtx, toolNames: string[]): Promise<Id<"tools">[]> {
  const ids: Id<"tools">[] = [];
  for (const name of toolNames) {
    const tool = await ctx.db.query("tools").filter((q) => q.eq(q.field("name"), name)).first();
    if (tool) ids.push(tool._id);
  }
  return ids;
}
