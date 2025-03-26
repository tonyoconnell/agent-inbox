"use node";
import { ActionCtx } from "../_generated/server";
import { internal } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";
import { storage, memory } from "./mastra";
import { Mastra } from "@mastra/core/mastra";
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { createTools } from "./tools";
import { z } from "zod";
import { Tool } from "@mastra/core";

const getAgentAndEnsureItIsJoinedToConversation = async (
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

  if (!agent) {
    throw new Error(`Agent of id '${args.agentId}' could not be found`);
  }

  // Get or create the participant for this agent in the conversation
  const participantId = await ctx.runMutation(
    internal.conversationParticipants.private.addAgent,
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
    const allTools = createTools(ctx);

    const referencedAgent = new Agent({
      name: agent.name,
      instructions: `You are:
${agent.description}      

Your personality is:
${agent.personality}

Your id is:
${agent._id}
`,
      model: openai("gpt-4o-mini"),
      memory,
      // tools: agent.tools.reduce(
      //   (acc, toolName) => {
      //     const tool = allTools[toolName as keyof typeof allTools];
      //     if (!tool) {
      //       throw new Error(`Tool '${toolName}' not found`);
      //     }
      //     return { ...acc, [toolName]: tool };
      //   },
      //   {} as Record<string, Tool>,
      // ),
    });

    const mastra = new Mastra({
      agents: { referencedAgent },
      storage,
    });

    const result = await mastra.getAgent("referencedAgent").generate(
      [
        {
          role: "user",
          content: args.message.content,
        },
      ],
      {
        maxRetries: 1,
        output: z.object({
          messageContent: z.string(),
        }),
      },
    );

    console.log(`Referenced agent result:`, result);

    await ctx.runMutation(internal.conversationMessages.private.sendFromAgent, {
      conversationId: args.message.conversationId,
      agentId: agent._id,
      content: result.object.messageContent,
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
