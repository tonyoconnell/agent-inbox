import { CoreMessage } from "ai";
import { ActionCtx } from "../_generated/server";
import { getMessageHistory } from "./history";
import { Doc } from "../_generated/dataModel";
import { ParticipantUserOrAgent } from "../conversationParticipants/model";

export const gatherMessages = async (
  ctx: ActionCtx,
  {
    systemMessage,
    conversation,
    message,
    messageAuthor,
  }: {
    systemMessage: string;
    conversation: Doc<"conversations">;
    message: Doc<"conversationMessages">;
    messageAuthor: ParticipantUserOrAgent;
  },
): Promise<CoreMessage[]> => {
  const messageHistory = await getMessageHistory(ctx, {
    conversationId: conversation._id,
    messageId: message._id,
    count: 20,
  });

  console.log(`messageHistory:`, messageHistory);

  const messages: CoreMessage[] = [
    {
      role: "system",
      content: systemMessage,
    },
    ...messageHistory.map(
      (m) =>
        ({
          role: "user", //m.author?.kind === "user" ? "user" : "assistant",
          content: `${m.author.name} said: ${m.message.content}`,
        }) as const,
    ),
    {
      role: "user",
      content: `${messageAuthor.kind == "agent" ? messageAuthor.agent.name : messageAuthor.user.name} said: ${message.content}`,
    },
  ];

  console.log(`agent messages:`, messages);

  return messages;
};
