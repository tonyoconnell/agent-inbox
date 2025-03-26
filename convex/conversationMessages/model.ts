import {
  DatabaseReader,
  DatabaseWriter,
  MutationCtx,
  QueryCtx,
} from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";
import * as Users from "../users/model";
import { internal } from "../_generated/api";
import { ensureFP } from "../../shared/ensure";
import * as ConversationParticipants from "../conversationParticipants/model";
import {
  conversationMessageReferencesSchemaValidator,
  conversationAgentMessageSchemaValidator,
} from "./schema";
import {
  ParticipantUserOrAgent,
  getMyParticipant,
} from "../conversationParticipants/model";

export const addMessageToConversationFromUserOrAgent = async (
  ctx: MutationCtx,
  args: {
    conversationId: Id<"conversations">;
    content: string;
    author: Id<"conversationParticipants">;
  },
) => {
  // Create the message
  const messageId = await ctx.db.insert("conversationMessages", {
    ...args,
    kind: "participant",
  });

  // Update conversation's last message time
  await ctx.db.patch(args.conversationId, {
    lastMessageTime: Date.now(),
  });

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
    kind: "system",
    conversationId: args.conversationId,
    content: args.content,
  });
};

export const addMessageToConversationFromMe = async (
  ctx: MutationCtx,
  args: {
    conversationId: Id<"conversations">;
    content: string;
  },
) => {
  const participant = await ConversationParticipants.getMyParticipant(ctx, {
    conversationId: args.conversationId,
  });
  const messageId = await addMessageToConversationFromUserOrAgent(ctx, {
    ...args,
    author: participant._id,
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

export const addMessageToConversationFromAgent = async (
  ctx: MutationCtx,
  {
    author,
    content,
    conversationId,
  }: {
    conversationId: Id<"conversations">;
    agentId: Id<"agents">;
    content: string;
    author: Id<"conversationParticipants">;
  },
) => {
  return await addMessageToConversationFromUserOrAgent(ctx, {
    conversationId,
    content,
    author,
  });
};

export const listMessages = async (
  db: DatabaseReader,
  {
    conversationId,
    limit = 50,
    kind,
  }: {
    conversationId: Id<"conversations">;
    kind?: typeof conversationAgentMessageSchemaValidator.type.kind;
    limit?: number;
  },
) => {
  if (kind) {
    return await db
      .query("conversationMessages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", conversationId),
      )
      .order("asc")
      .take(limit);
  }

  return await db
    .query("conversationMessages")
    .withIndex("by_conversationId", (q) =>
      q.eq("conversationId", conversationId),
    )
    .order("asc")
    .take(limit);
};

// export const listMessagesAndJoinAuthorDetails = async (
//   ctx: QueryCtx,
//   {
//     conversationId,
//     limit = 50,
//   }: {
//     conversationId: Id<"conversations">;
//     limit?: number;
//   },
// ) => {
//   const messages = await listMessages(ctx, {
//     conversationId,
//     limit,
//   });

//   const messagesWithAuthorDetails = await Promise.all(
//     messages.map(async (message) => {
//       const userOrAgent =
//         await ConversationParticipants.getParticipantUserOrAgent(ctx.db, {
//           participantId: message.author,
//         });
//       return { message, author: userOrAgent };
//     }),
//   );

//   // Fetch avatar URLs and names for each message
//   // const messagesWithAvatars = await Promise.all(
//   //   messages.map(async (message) => {
//   //     if (message.author.kind === "user") {
//   //       const user = await ctx.db.get(message.author.userId);
//   //       if (!user) return { ...message, avatarUrl: null };
//   //       return {
//   //         ...message,
//   //         avatarUrl:
//   //           user.image ??
//   //           `https://api.dicebear.com/7.x/avataaars/svg?seed=${user._id}`,
//   //       };
//   //     }

//   //     if (message.author.kind === "agent") {
//   //       const agent = await ctx.db.get(message.author.agentId);
//   //       if (!agent) return { ...message, avatarUrl: null };
//   //       return {
//   //         ...message,
//   //         avatarUrl: agent.avatarUrl,
//   //       };
//   //     }

//   //     if (message.author.kind === "system") {
//   //       return {
//   //         ...message,
//   //         avatarUrl: null,
//   //       };
//   //     }

//   //     exhaustiveCheck(message.author);
//   //   }),
//   // );

//   return messages;
// };

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

export const parseReferencesFromMessageContent = (content: string) => {
  /**
   * Parses message content to extract references to entities like users or agents.
   *
   * References are formatted as: @[name](kind:id)
   * Example: "Hello @[Mike](agent:abc1234)" references a agent with ID abc1234
   *
   * @param content - The message content to parse
   * @returns Array of references found in the message content
   */
  const references: typeof conversationMessageReferencesSchemaValidator.type =
    [];

  // Regular expression to match references in the format @[name](kind:id)
  const referenceRegex = /@\[([^\]]+)\]\(([^:]+):([^)]+)\)/g;

  let match;
  while ((match = referenceRegex.exec(content)) !== null) {
    const [_, name, kind, id] = match;

    // Currently only agent references are supported in the schema
    if (kind === "agent") {
      references.push({
        kind: "agent",
        agentId: id as Id<"agents">,
      });
    }
    // Note: If we want to support other reference types in the future,
    // we would need to update the schema validator and add cases here
  }

  return references;
};

export const deleteAllMessagesForConversation = async (
  db: DatabaseWriter,
  { conversationId }: { conversationId: Id<"conversations"> },
) => {
  const messages = await db
    .query("conversationMessages")
    .withIndex("by_conversationId", (q) =>
      q.eq("conversationId", conversationId),
    )
    .collect();

  await Promise.all(messages.map((message) => db.delete(message._id)));
};
