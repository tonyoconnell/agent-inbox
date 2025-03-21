import { ActionCtx } from "../_generated/server";
import * as Agents from "../agents/model";
import { internal } from "../_generated/api";
import { Doc } from "../_generated/dataModel";
import { wait } from "../../shared/misc";
import { createMastra } from "./mastra";

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

  const participant = await ctx.runMutation(
    internal.conversations.private
      .joinTriageAgentToConversationIfNotAlreadyJoined,
    {
      conversationId: args.conversation._id,
    },
  );

  if (participant.kind != "agent")
    throw new Error(
      `Participant is not an agent, it should be as it is the triage agent`,
    );

  // Set the triage agent's status to thinking
  await ctx.runMutation(
    internal.conversationParticipants.private.updateParticipantStatus,
    {
      participantId: participant._id,
      status: "thinking",
    },
  );

  try {
    // Get available non-system agents in the conversation
    const availableAgents = await ctx.runQuery(
      internal.conversationParticipants.private.listNonSystemAgentParticipants,
      { conversationId: args.conversation._id },
    );

    const mastra = createMastra(ctx);
    const mastraAgent = mastra.getAgent("triageAgent");

    // Format agent information for the system message
    const agentDescriptions = availableAgents
      .map(
        ({ agent }) => `[${agent._id}] - ${agent.name}: ${agent.description}`,
      )
      .join("\n");

    await mastraAgent.generate([
      {
        role: "system",
        content: `Available agents in this conversation:
${agentDescriptions}
`,
      },
    ]);
  } catch (error) {
    // we should add a message to the conversation to notify the user that the triage agent has errored
  } finally {
    // No longer thinking
    await ctx.runMutation(
      internal.conversationParticipants.private.updateParticipantStatus,
      {
        participantId: participant._id,
        status: "none",
      },
    );
  }
};
