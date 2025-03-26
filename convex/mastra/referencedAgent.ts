"use node";
import { ActionCtx } from "../_generated/server";
import { internal } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";
import { storage, memory } from "./mastra";
import { Mastra } from "@mastra/core/mastra";
import { z } from "zod";
import {
  createMastraAgentFromAgent,
  getAgentAndEnsureItIsJoinedToConversation,
} from "./agents";
import { Agent, createTool } from "@mastra/core";
import { openai } from "@ai-sdk/openai";
import { createTools } from "./tools";

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
      
      If there is another agent that could potentially assist with the message then you should use the tools provided to you to find that agent then message them. You can do that by using the @[AGENT_NAME](agent:AGENT_ID) format.
    
# Your Description:
${agent.description}      

# Your personality:
${agent.personality}
`,
      model: openai("gpt-4o-mini"),
      tools: createTools({ ctx, agent }),
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
    console.error("Error in referenced agent:", error);
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
