"use node";
import { Doc } from "../_generated/dataModel";
import { Agent } from "@mastra/core";
import { openai } from "@ai-sdk/openai";
import { Id } from "../_generated/dataModel";
import { ActionCtx } from "../_generated/server";
import { internal } from "../_generated/api";
import { createTools } from "./tools";

export const createMastraAgentFromAgent = ({
  agent,
  participantId,
  messageHistory,
  ctx,
}: {
  agent: Doc<"agents">;
  participantId: Id<"conversationParticipants">;
  messageHistory: any[];
  ctx: ActionCtx;
}) => {
  return new Agent({
    name: agent.name,
    instructions: `You are an agent that is part of a conversation. You will be given a message and your job is to respond to the message. You should use the tools provided to you to help you respond to the message.
    
# Your Description:
${agent.description}      

# Your personality:
${agent.personality}

# Your Participant ID:
${participantId}

# Message History:
${JSON.stringify(messageHistory, null, 2)}
`,
    model: openai("gpt-4o-mini"),
    tools: createTools(ctx),
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
