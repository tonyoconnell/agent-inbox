"use node";
import { Doc } from "../_generated/dataModel";
import { Agent } from "@mastra/core";
import { openai } from "@ai-sdk/openai";
import { Id } from "../_generated/dataModel";
import { ActionCtx } from "../_generated/server";
import { internal } from "../_generated/api";
import { createTools } from "./tools";
import { ToolsInput } from "@mastra/core/agent";
import { storage } from "./mastra";
import { Mastra } from "@mastra/core/mastra";

export const createMastraAgentFromAgent = ({
  agent,
  tools,
}: {
  agent: Doc<"agents">;
  tools: any;
}) => {
  return new Agent({
    name: agent.name,
    instructions: `You are an agent that is part of a conversation. You will be given a message and your job is to respond to the message. You should use the tools provided to you to help you respond to the message.
    
# Your Description:
${agent.description}      

# Your personality:
${agent.personality}
`,
    model: openai("gpt-4o-mini"),
    tools,
  });
};

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
  const participantId = await ctx.runMutation(
    internal.conversationParticipants.private.addAgentIfNotAlreadyJoined,
    {
      conversationId: args.conversationId,
      agentId: agent._id,
    },
  );

  return { agent, participantId };
};

export const invokeAgent = async (
  ctx: ActionCtx,
  args: {
    message: Doc<"conversationMessages">;
    reference: { kind: "agent"; agentId: Id<"agents"> };
  },
) => {
  const { agent, participantId } =
    await getAgentAndEnsureItIsJoinedToConversation(ctx, {
      agentId: args.reference.agentId,
      conversationId: args.message.conversationId,
    });

  // Set the agent's status to thinking
  await ctx.runMutation(
    internal.conversationParticipants.private.updateParticipantStatus,
    {
      participantId,
      status: "thinking",
    },
  );

  try {
    const messageHistory = await ctx.runQuery(
      internal.conversationMessages.private
        .listMessagesHistoryForAgentGeneration,
      { conversationId: args.message.conversationId, count: 10 },
    );

    const messageAuthor = await ctx.runQuery(
      internal.conversationMessages.private.getMessageAuthor,
      { messageId: args.message._id },
    );

    const referencedAgent = new Agent({
      name: agent.name,
      instructions: `You are an agent that is part of a conversation. You will be given a message and your job is to respond to the message. You should use the tools provided to you to help you respond to the message.
      
      If there is another agent that could potentially assist with the message then you should use the tools provided to you to find that agent then message them. 
      
      You dont need to reply with any output if you messaged them." 
    
# Your Description:
${agent.description}      

# Your personality:
${agent.personality}
`,
      model: openai("gpt-4o-mini"),
      tools: createTools({ ctx, agent, agentParticipantId: participantId }),
    });

    const mastra = new Mastra({
      agents: { referencedAgent },
      storage,
    });

    const result = await mastra.getAgent("referencedAgent").generate(
      [
        {
          role: "system",
          content: `Here is some other context you might need: 
${JSON.stringify(
  {
    messageAuthor,
    conversationId: args.message.conversationId,
    yourConversationParticipantId: participantId,
    messageHistory,
  },
  null,
  2,
)}`,
        },
        {
          role: "user",
          content: args.message.content,
        },
      ],
      {
        // async onStepFinish(step) {
        //   console.log(`Step finished:`, step);
        //   await ctx.runMutation(
        //     internal.conversationMessages.private.sendSystemMessage,
        //     {
        //       conversationId: args.message.conversationId,
        //       content: `Agent '${agent.name}' just finished a step: ${step}`,
        //     },
        //   );
        // },
        // toolChoice: "required",
        // output: z.object({
        //   messageContent: z.string(),
        // }),
      },
    );

    console.log(`Referenced agent result:`, result);

    await ctx.runMutation(internal.conversationMessages.private.sendFromAgent, {
      conversationId: args.message.conversationId,
      agentId: agent._id,
      content: result.text,
      author: participantId,
    });
  } catch (error: unknown) {
    console.error("When invoking agent:", error);
    // Send error message to conversation
    await ctx.runMutation(
      internal.conversationMessages.private.sendSystemMessage,
      {
        conversationId: args.message.conversationId,
        content: `Sorry, I encountered an error while processing your message: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
    );
  } finally {
    // No longer thinking
    await ctx.runMutation(
      internal.conversationParticipants.private.updateParticipantStatus,
      {
        participantId,
        status: "inactive",
      },
    );
  }
};
