import { MutationCtx, QueryCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import * as Users from "../users/model";
import { predefinedAgents } from "./constants";

export const createAgent = async (ctx: MutationCtx) => {
  const userId = await Users.getMyId(ctx);
  const randomIndex = Math.floor(Math.random() * predefinedAgents.length);
  const selectedAgent = predefinedAgents[randomIndex];

  return await ctx.db.insert("agents", {
    name: selectedAgent.name,
    description: selectedAgent.description,
    personality: selectedAgent.personality,
    tools: selectedAgent.tools,
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
  return await ctx.db.patch(agentId, {
    name,
    description,
    personality,
    tools,
  });
};

export const remove = async (
  ctx: MutationCtx,
  { agentId }: { agentId: Id<"agents"> },
) => {
  await ctx.db.delete(agentId);
};
