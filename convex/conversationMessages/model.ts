import { DatabaseWriter, MutationCtx, QueryCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";
import * as Users from "../users/model";
import { internal } from "../_generated/api";
import { ensureFP } from "../../shared/ensure";
import { exhaustiveCheck } from "../../shared/misc";
import { ParticipantUserOrAgent } from "../conversationParticipants/model";

export const addMessageToConversationFromUserOrAgent = async (
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
    internal.conversationMessages.internalActions.processMessage,
    {
      message: await ctx.db.get(messageId).then(ensureFP()),
      conversation: await ctx.db.get(args.conversationId).then(ensureFP()),
    },
  );

  return messageId;
};

export const addMessageToConversationFromSystem = async (
  db: DatabaseWriter,
  args: {
    conversationId: Id<"conversations">;
    content: string;
  },
) => {
  // Create the message
  return await db.insert("conversationMessages", {
    author: {
      kind: "system",
    },
    conversationId: args.conversationId,
    content: args.content,
    references: [],
  });
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
  return addMessageToConversationFromUserOrAgent(ctx, {
    ...args,
    author: {
      kind: "user",
      userId,
    },
  });
};

export const addMessageToConversationFromAgent = async (
  ctx: MutationCtx,
  args: {
    conversationId: Id<"conversations">;
    agentId: Id<"agents">;
    content: string;
    references: Doc<"conversationMessages">["references"];
  },
) => {
  return addMessageToConversationFromUserOrAgent(ctx, {
    conversationId: args.conversationId,
    content: args.content,
    references: args.references,
    author: {
      kind: "agent",
      agentId: args.agentId,
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

export const createParticipantJoinedConversationMessage = async (
  db: DatabaseWriter,
  args: {
    conversationId: Id<"conversations">;
    agentOrUser: Doc<"agents"> | Doc<"users">;
  },
) => {
  const name = args.agentOrUser.name ?? "Unknown";
  await addMessageToConversationFromSystem(db, {
    conversationId: args.conversationId,
    content: `👋 ${name} has joined the conversation.`,
  });
};

export const createParticipantLeftConversationMessage = async (
  db: DatabaseWriter,
  args: {
    conversationId: Id<"conversations">;
    participant: ParticipantUserOrAgent;
  },
) => {
  const name =
    args.participant.kind === "user"
      ? args.participant.user.name
      : args.participant.agent.name;

  await addMessageToConversationFromSystem(db, {
    conversationId: args.conversationId,
    content: `🚪 ${name} has left the conversation.`,
  });
};
