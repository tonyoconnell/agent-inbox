import { MutationCtx, QueryCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import * as Users from "../users/model";
import { predefinedAgents } from "./constants";

type AgentStatus = "idle" | "active" | "processing";

export const createAgent = async (ctx: MutationCtx) => {
  const userId = await Users.getMyId(ctx);
  const randomIndex = Math.floor(Math.random() * predefinedAgents.length);
  const selectedAgent = predefinedAgents[randomIndex];

  return await ctx.db.insert("agents", {
    name: selectedAgent.name,
    description: selectedAgent.description,
    personality: selectedAgent.personality,
    tools: selectedAgent.tools,
    status: "idle" as const,
    createdBy: userId,
    lastActiveTime: Date.now(),
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${selectedAgent.name}`,
    kind: "user_agent",
  });
};

export const listMine = async (ctx: QueryCtx) => {
  const userId = await Users.getMyId(ctx);

  return await ctx.db
    .query("agents")
    .withIndex("by_creator", (q) => q.eq("createdBy", userId))
    .collect();
};

export const findMine = async (
  ctx: QueryCtx,
  { agentId }: { agentId: Id<"agents"> },
) => {
  const userId = await Users.getMyId(ctx);
  const agent = await ctx.db.get(agentId);
  if (agent && agent.createdBy !== userId) throw new Error("Access denied");
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

export const updateMine = async (
  ctx: MutationCtx,
  {
    agentId,
    name,
    description,
    personality,
    tools,
  }: {
    agentId: Id<"agents">;
    name: string;
    description: string;
    personality: string;
    tools: string[];
  },
) => {
  const userId = await Users.getMyId(ctx);
  const agent = await ctx.db.get(agentId);

  if (!agent) throw new Error("Agent not found");
  if (agent.createdBy !== userId) throw new Error("Access denied");

  return await ctx.db.patch(agentId, {
    name,
    description,
    personality,
    tools,
  });
};

export const deleteMine = async (
  ctx: MutationCtx,
  { agentId }: { agentId: Id<"agents"> },
) => {
  const userId = await Users.getMyId(ctx);
  const agent = await ctx.db.get(agentId);

  if (!agent) throw new Error("Agent not found");
  if (agent.createdBy !== userId) throw new Error("Access denied");

  await ctx.db.delete(agentId);
};

export const updateStatus = async (
  ctx: MutationCtx,
  { agentId, status }: { agentId: Id<"agents">; status: AgentStatus },
) => {
  const userId = await Users.getMyId(ctx);
  const agent = await ctx.db.get(agentId);

  if (!agent) throw new Error("Agent not found");
  if (agent.createdBy !== userId) throw new Error("Access denied");

  return await ctx.db.patch(agentId, {
    status,
    lastActiveTime: Date.now(),
  });
};
