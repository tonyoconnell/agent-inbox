import { ActionCtx } from "../_generated/server";
import * as Agents from "../agents/model";
import { internal } from "../_generated/api";
import { Doc } from "../_generated/dataModel";

const getTriageAgent = async (ctx: ActionCtx) => {
  const agent = await ctx.runQuery(
    internal.agents.private.findSystemAgentByKind,
    { systemAgentKind: "triage" },
  );
  if (agent) return agent;
  return await ctx.runMutation(internal.agents.private.createSystemAgent, {
    systemAgentKind: "triage",
    name: "System Triage Agent",
    description: `Triage messages to the correct agent`,
    personality: `Helpful, concise`,
    avatarUrl: Agents.createAgentAvatarUrl(`system-triage`),
    tools: [],
    lastActiveTime: Date.now(),
    kind: "system_agent",
  });
};

export const triageMessage = async (
  ctx: ActionCtx,
  args: {
    message: Doc<"conversationMessages">;
    conversation: Doc<"conversations">;
  },
) => {
  const agent = await getTriageAgent(ctx);
  await ctx.runMutation(
    internal.conversations.private
      .joinTriageAgentToConversationIfNotAlreadyJoined,
    {
      conversationId: args.conversation._id,
    },
  );

  // const mastra = createMastra(ctx);
  // const mastraAgent = mastra.getAgent("triageAgent");
  // mastraAgent.generate([{
  //   role: "system"
  // }])
};
