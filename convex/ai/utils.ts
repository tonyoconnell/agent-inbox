import { internal } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";
import { ActionCtx } from "../_generated/server";
import * as Agents from "../agents/model";
import { generateText } from "ai";
import { ParticipantUserOrAgent } from "../conversationParticipants/model";

export const sendSystemMessageToConversation = async (
  ctx: ActionCtx,
  args: {
    conversationId: Id<"conversations">;
    content: string;
  },
) =>
  ctx.runMutation(internal.conversationMessages.private.sendSystemMessage, {
    conversationId: args.conversationId as Id<"conversations">,
    content: args.content,
  });

export const getAgentAndEnsureItIsJoinedToConversation = async (
  ctx: ActionCtx,
  args: {
    agentId: Id<"agents">;
    conversationId: Id<"conversations">;
  },
) => {
  // Get the referenced agent
  const agent = await ctx.runQuery(internal.agents.private.find, {
    agentId: args.agentId,
  });

  if (!agent)
    throw new Error(`Agent of id '${args.agentId}' could not be found`);

  // Get or create the participant for this agent in the conversation
  const participant = await ctx.runMutation(
    internal.conversationParticipants.private.addAgentIfNotAlreadyJoined,
    {
      conversationId: args.conversationId,
      agentId: agent._id,
    },
  );

  return { agent, participant };
};

export const getTriageAgent = async (ctx: ActionCtx) => {
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

export const getTriageAgentAndEnsureItIsJoinedToConversation = async (
  ctx: ActionCtx,
  conversationId: Id<"conversations">,
) => {
  const agent = await getTriageAgent(ctx);

  const participant = await ctx.runMutation(
    internal.conversations.private
      .joinTriageAgentToConversationIfNotAlreadyJoined,
    {
      conversationId,
    },
  );

  if (participant.kind != "agent")
    throw new Error(
      `Participant is not an agent, it should be as it is the triage agent`,
    );

  return { agent, participant };
};

/**
 * Generic function to handle AI generation with consistent status management
 */
export const runAgentAIGeneration = async <T>(
  ctx: ActionCtx,
  args: {
    agent: Doc<"agents">;
    participant: Doc<"conversationParticipants"> & { kind: "agent" };
    conversation: Doc<"conversations">;
    generateAIResponse: () => Promise<T>;
  },
) => {
  // Set the agent's status to thinking
  await ctx.runMutation(
    internal.conversationParticipants.private.updateParticipantStatus,
    {
      participantId: args.participant._id,
      status: "thinking",
    },
  );

  try {
    return await args.generateAIResponse();
  } catch (error: unknown) {
    await handleAgentError(ctx, {
      error,
      conversationId: args.conversation._id,
      errorContext: "responding to message",
    });
    return null;
  } finally {
    // No longer thinking
    await ctx.runMutation(
      internal.conversationParticipants.private.updateParticipantStatus,
      {
        participantId: args.participant._id,
        status: "inactive",
      },
    );
  }
};

/**
 * Handles agent errors with a consistent approach
 */
export const handleAgentError = async (
  ctx: ActionCtx,
  args: {
    error: unknown;
    conversationId: Id<"conversations">;
    errorContext: string;
  },
) => {
  console.error(`Error while ${args.errorContext}:`, args.error);

  // Send error message to conversation
  await sendSystemMessageToConversation(ctx, {
    conversationId: args.conversationId,
    content: `Error while ${args.errorContext}: ${args.error instanceof Error ? args.error.message : "Unknown error"}`,
  });
};

/**
 * Process AI result and handle noOp cases
 */
export const processAgentAIResult = async (
  ctx: ActionCtx,
  args: {
    result: { text: string; toolCalls: Array<{ toolName: string; args: any }> };
    agent: Doc<"agents">;
    conversation: Doc<"conversations">;
    participant: Doc<"conversationParticipants"> & { kind: "agent" };
    sendMessage: (text: string) => Promise<void>;
  },
) => {
  console.log(`Agent result:`, args.result);
  console.log(`Tool Calls:`, args.result.toolCalls);

  if (args.result.text !== "") {
    await args.sendMessage(args.result.text);
  } else {
    const noOp = args.result.toolCalls.find((t) => t.toolName === "noOutput");
    if (noOp) {
      await sendSystemMessageToConversation(ctx, {
        conversationId: args.conversation._id,
        content: `Agent ${args.agent.name} decided not to respond to the message because: "${noOp.args.reasoning}"`,
      });
    }
  }
};
