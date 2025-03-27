"use node";
import { Doc } from "../_generated/dataModel";
import { openai } from "@ai-sdk/openai";
import { Id } from "../_generated/dataModel";
import { ActionCtx } from "../_generated/server";
import { internal } from "../_generated/api";
import { createTools } from "./tools";
import { generateText, CoreMessage } from "ai";
import { constructAgentReplyInstructions } from "./instructions";
import { ParticipantUserOrAgent } from "../conversationParticipants/model";
import { getMessageHistory } from "./history";
import {
  getAgentAndEnsureItIsJoinedToConversation,
  sendSystemMessageToConversation,
} from "./utils";

export const agentReplyToMessage = async (
  ctx: ActionCtx,
  args: {
    message: Doc<"conversationMessages">;
    agentId: Id<"agents">;
    conversation: Doc<"conversations">;
    messageAuthor: ParticipantUserOrAgent;
  },
) => {
  const { agent, participant } =
    await getAgentAndEnsureItIsJoinedToConversation(ctx, {
      agentId: args.agentId,
      conversationId: args.message.conversationId,
    });

  // Set the agent's status to thinking
  await ctx.runMutation(
    internal.conversationParticipants.private.updateParticipantStatus,
    {
      participantId: participant._id,
      status: "thinking",
    },
  );

  try {
    const messageHistory = await getMessageHistory(ctx, {
      conversationId: args.conversation._id,
      messageId: args.message._id,
      count: 20,
    });

    const messages: CoreMessage[] = [
      {
        role: "system",
        content: constructAgentReplyInstructions({
          conversation: args.conversation,
          message: args.message,
          messageAuthor: args.messageAuthor,
          agent,
          participant,
        }),
      },
      ...messageHistory.map(
        (m) =>
          ({
            role: m.author?.kind === "user" ? "user" : "assistant",
            content: `${JSON.stringify(m, null, 2)}`,
          }) as const,
      ),
      {
        role: "user",
        content: `${JSON.stringify({ message: args.message, author: args.messageAuthor }, null, 2)}`,
      },
    ];

    console.log(`messages`, messages);

    const result = await generateText({
      model: openai("gpt-4o-mini"),
      tools: createTools({
        ctx,
        agent,
        agentParticipant: participant,
        conversation: args.conversation,
      }),
      maxSteps: 5,
      messages,
    });

    console.log(`Agent result:`, result);
    console.log(`Tool Calls:`, result.toolCalls);

    if (result.text != "")
      await ctx.runMutation(
        internal.conversationMessages.private.sendFromAgent,
        {
          conversationId: args.message.conversationId,
          agentId: agent._id,
          content: result.text,
          authorParticipantId: participant._id,
        },
      );
    else {
      const noOp = result.toolCalls.find((t) => t.toolName == "noOutput");
      if (noOp)
        await sendSystemMessageToConversation(ctx, {
          conversationId: args.message.conversationId,
          content: `Agent ${agent.name} decided not to respond to the message because: "${noOp.args.reasoning}"`,
        });
    }
  } catch (error: unknown) {
    console.error("Error while replying to message:", error);
    // Send error message to conversation
    await ctx.runMutation(
      internal.conversationMessages.private.sendSystemMessage,
      {
        conversationId: args.message.conversationId,
        content: `Error while replying to message: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
    );
  } finally {
    // No longer thinking
    await ctx.runMutation(
      internal.conversationParticipants.private.updateParticipantStatus,
      {
        participantId: participant._id,
        status: "inactive",
      },
    );
  }
};
