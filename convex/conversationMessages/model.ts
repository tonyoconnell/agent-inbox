import { MutationCtx, QueryCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";
import * as Users from "../users/model";
import { internal } from "../_generated/api";
import { ensureFP } from "../../shared/ensure";
import { exhaustiveCheck } from "../../shared/misc";

export const addMessageToConversation = async (
  ctx: MutationCtx,
  args: {
    conversationId: Id<"conversations">;
    content: string;
    author: Doc<"conversationMessages">["author"];
    references: Doc<"conversationMessages">["references"];
  },
) => {
  // Create the message
  const messageId = await ctx.db.insert("conversationMessages", {
    ...args,
    references: args.references ?? [],
  });

  // Update conversation's last message time
  await ctx.db.patch(args.conversationId, {
    lastMessageTime: Date.now(),
  });

  // Schedule a task to process the message
  await ctx.scheduler.runAfter(
    0,
    internal.conversationMessages.private.processMessage,
    {
      message: await ctx.db.get(messageId).then(ensureFP()),
    },
  );

  return messageId;
};

export const addMessageToConversationFromMe = async (
  ctx: MutationCtx,
  args: {
    conversationId: Id<"conversations">;
    content: string;
    references: Doc<"conversationMessages">["references"];
  },
) => {
  const userId = await Users.getMyId(ctx);
  return addMessageToConversation(ctx, {
    ...args,
    author: {
      kind: "user",
      userId,
    },
  });
};

export const addMessageToConversationFromSystem = async (
  ctx: MutationCtx,
  args: {
    conversationId: Id<"conversations">;
    content: string;
    references: Doc<"conversationMessages">["references"];
    systemId: "triage";
  },
) => {
  const userId = await Users.getMyId(ctx);
  return addMessageToConversation(ctx, {
    ...args,
    author: {
      kind: "system",
      systemId: "triage",
    },
  });
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
      }

      if (message.author.kind === "agent") {
        const agent = await ctx.db.get(message.author.agentId);
        if (!agent) return { ...message, avatarUrl: null };
        return {
          ...message,
          avatarUrl: agent.avatarUrl,
        };
      }

      if (message.author.kind === "system") {
        return {
          ...message,
          avatarUrl: null,
        };
      }

      exhaustiveCheck(message.author);
    }),
  );

  return messagesWithAvatars;
};
