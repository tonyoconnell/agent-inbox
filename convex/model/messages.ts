import { MutationCtx, QueryCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import * as Users from "./users";
import * as Conversations from "./conversations";

export const addMessageToConversationFromMe = async (
  ctx: MutationCtx,
  {
    conversationId,
    content,
    references = [],
  }: {
    conversationId: Id<"conversations">;
    content: string;
    references?: Array<{
      kind: "agent";
      agentId: Id<"agents">;
      startIndex: number;
      endIndex: number;
    }>;
  },
) => {
  const userId = await Users.getMyId(ctx);

  // Ensure user has access to conversation
  await Conversations.ensureICanAccessConversation(ctx, { conversationId });

  // Create the message
  const messageId = await ctx.db.insert("conversationMessages", {
    conversationId,
    author: {
      kind: "user",
      userId,
    },
    content,
    references,
  });

  // Update conversation's last message time
  await ctx.db.patch(conversationId, {
    lastMessageTime: Date.now(),
  });

  return messageId;
};

export const listMessages = async (
  ctx: QueryCtx,
  {
    conversationId,
    limit = 50,
  }: {
    conversationId: Id<"conversations">;
    limit?: number;
  },
) => {
  // Ensure user has access to conversation
  await Conversations.ensureICanAccessConversation(ctx, { conversationId });

  const messages = await ctx.db
    .query("conversationMessages")
    .withIndex("by_conversationId", (q) =>
      q.eq("conversationId", conversationId),
    )
    .order("asc")
    .take(limit);

  // Fetch avatar URLs and names for each message
  const messagesWithAvatars = await Promise.all(
    messages.map(async (message) => {
      if (message.author.kind === "user") {
        const user = await ctx.db.get(message.author.userId);
        if (!user) return { ...message, avatarUrl: null };
        return {
          ...message,
          avatarUrl:
            user.image ??
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user._id}`,
        };
      } else {
        const agent = await ctx.db.get(message.author.agentId);
        if (!agent) return { ...message, avatarUrl: null };
        return {
          ...message,
          avatarUrl: agent.avatarUrl,
        };
      }
    }),
  );

  return messagesWithAvatars;
};
