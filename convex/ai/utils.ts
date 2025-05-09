import { internal } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";
import { ActionCtx } from "../_generated/server";
import * as Agents from "../agents/model";
import { Resend } from "resend";

export const sendSystemMessageToConversation = async (
  ctx: ActionCtx,
  args: {
    conversationId: Id<"conversations">;
    content: string;
    authorParticipantId: Id<"conversationParticipants">;
    meta?: any;
  },
) =>
  ctx.runMutation(
    internal.conversationMessages.internalMutations.sendSystemMessage,
    {
      conversationId: args.conversationId,
      content: args.content,
      meta: args.meta,
      authorParticipantId: args.authorParticipantId,
    },
  );

export const getAgentAndEnsureItIsJoinedToConversation = async (
  ctx: ActionCtx,
  args: {
    agentId: Id<"agents">;
    conversationId: Id<"conversations">;
  },
) => {
  // Get the referenced agent
  const agent = await ctx.runQuery(internal.agents.internalQueries.find, {
    agentId: args.agentId,
  });

  if (!agent)
    throw new Error(`Agent of id '${args.agentId}' could not be found`);

  // Get or create the participant for this agent in the conversation
  const participant = await ctx.runMutation(
    internal.conversationParticipants.internalMutations
      .addAgentIfNotAlreadyJoined,
    {
      conversationId: args.conversationId,
      agentId: agent._id,
    },
  );

  return { agent, participant };
};

export const getTriageAgent = async (ctx: ActionCtx, userId?: Id<"users">) => {
  if (!userId) throw new Error("userId is required to list agents for user");
  const agents = await ctx.runQuery(internal.agents.internalQueries.listAgentsForUser, {
    userId,
  });
  const agent = Array.isArray(agents)
    ? agents.find((a) => a.kind === "system_agent" && a.name === "Director")
    : undefined;
  if (agent) return agent;
  // If not found, create and return the agent
  return await ctx.runMutation(
    internal.agents.internalMutations.createSystemAgent,
    {
      name: "Director",
      description: `Triage messages to the correct agent`,
      personality: "Helpful, concise",
      avatarUrl: Agents.createAgentAvatarUrl(`system-triage`),
      tools: [],
      lastActiveTime: Date.now(),
      kind: "system_agent",
      systemAgentKind: "triage",
    },
  );
};

export const getTriageAgentAndEnsureItIsJoinedToConversation = async (
  ctx: ActionCtx,
  conversationId: Id<"conversations">,
  userId?: Id<"users">,
) => {
  const agent = await getTriageAgent(ctx, userId);

  const participant = await ctx.runMutation(
    internal.conversations.internalMutations
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
    internal.conversationParticipants.internalMutations.updateParticipantStatus,
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
      internal.conversationParticipants.internalMutations
        .updateParticipantStatus,
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

  const errorMessage =
    args.error instanceof Error ? args.error.message : "Unknown error";

  // Send error message to conversation
  await sendSystemMessageToConversation(ctx, {
    conversationId: args.conversationId,
    content: `Error while ${args.errorContext}: ${errorMessage}`,
    meta: {
      error: errorMessage,
      errorContext: args.errorContext,
      fullError:
        args.error instanceof Error
          ? {
              message: args.error.message,
              stack: args.error.stack,
              name: args.error.name,
            }
          : String(args.error),
    },
    authorParticipantId: undefined as any, // TODO: Provide a valid participantId if possible
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

  // Fallback: If agent is Emailer, no sendEmail tool call, and message looks like a send email request
  const isEmailer = args.agent.name.toLowerCase().includes("email");
  const hasSendEmailCall = args.result.toolCalls.some((t) => t.toolName === "sendEmail");
  const sendEmailRegex = /send (an? )?email to ([^\s]+@[^\s]+)\b/i;
  const match = sendEmailRegex.exec(args.result.text);

  if (
    isEmailer &&
    !hasSendEmailCall &&
    match
  ) {
    const to = match[2];
    const subject = "Test Email";
    const content = "This is a test email sent by the Emailer agent fallback.";
    await sendSystemMessageToConversation(ctx, {
      conversationId: args.conversation._id,
      content: `Fallback: Emailer did not call sendEmail tool, sending test email to ${to}.`,
      meta: {
        toolName: "sendEmail-fallback",
        to,
        subject,
        content,
        agentName: args.agent.name,
        agentId: args.agent._id,
      },
      authorParticipantId: args.participant._id,
    });
    // Actually call the sendEmail tool implementation
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
      const response = await resend.emails.send({
        to,
        subject,
        html: content,
        from: "tony@one.ie",
      });
      if (response.error) throw new Error(`Failed to send email: ${response.error.message}`);
      await args.sendMessage(`Fallback: Sent test email to ${to}.`);
    } catch (error: any) {
      await args.sendMessage(`Fallback: Failed to send email to ${to}: ${error?.message ?? "Unknown error"}`);
    }
    return;
  }

  if (args.result.text !== "") {
    await args.sendMessage(args.result.text);
  } else {
    const noOp = args.result.toolCalls.find((t) => t.toolName === "noOutput");
    if (noOp) {
      await sendSystemMessageToConversation(ctx, {
        conversationId: args.conversation._id,
        content: `Agent ${args.agent.name} decided not to respond to the message because: "${noOp.args.reasoning}"`,
        meta: {
          toolName: "noOutput",
          reasoning: noOp.args.reasoning,
          agentName: args.agent.name,
          agentId: args.agent._id,
        },
        authorParticipantId: args.participant._id,
      });
    }
  }
};
