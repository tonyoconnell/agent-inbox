import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTimeAgo } from "@/components/misc/hooks";
import { useQuery } from "convex/react";
import { Doc, Id } from "convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { AgentMention } from "./AgentMention";
import { UserMention } from "./UserMention";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  message: Doc<"conversationMessages">;
}

export const ParticipantMessage: React.FC<Props> = ({ message }) => {
  if (message.kind != "participant")
    throw new Error("Message is not a participant message");

  const participants = useQuery(
    api.conversationParticipants.public.listDetailsForMe,
    {
      conversationId: message.conversationId,
    },
  );

  const participant = participants?.find(
    (p) => p.id === message.authorParticipantId,
  );

  const timeAgo = useTimeAgo(message._creationTime);

  const renderMessageContent = (content: string) => {
    const mentionRegex = /@\[(.*?)\]\((agent|user):(.*?)\)/g;
    const parts: {
      type: "text" | "mention";
      content: string;
      mentionData?: { display: string; type: "agent" | "user"; id: string };
    }[] = [];
    let lastIndex = 0;
    let match;

    // Split content into text and mention parts
    while ((match = mentionRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: content.slice(lastIndex, match.index),
        });
      }

      const [_, display, type, id] = match;
      parts.push({
        type: "mention",
        content: match[0],
        mentionData: { display, type: type as "agent" | "user", id },
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({ type: "text", content: content.slice(lastIndex) });
    }

    // Render parts with Markdown for text and MessageMention for mentions
    return parts.map((part, index) => {
      if (part.type === "text") {
        return (
          <ReactMarkdown
            key={index}
            remarkPlugins={[remarkGfm]}
            components={{
              // Ensure links open in new tab
              a: (props) => (
                <a
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${
                    participant?.kind === "user"
                      ? "text-primary-foreground  decoration-primary-foreground/70 hover:decoration-primary-foreground hover:text-orange-200"
                      : "text-blue-600 dark:text-blue-400 font-medium  decoration-blue-600/70 dark:decoration-blue-400/70 hover:text-orange-500 dark:hover:text-orange-400"
                  } transition-all`}
                />
              ),
              // Preserve the styling of your messages
              p: (props) => <span {...props} />,
            }}
          >
            {part.content}
          </ReactMarkdown>
        );
      } else {
        const mentionData = part.mentionData!;
        if (mentionData.type === "agent") {
          return (
            <AgentMention
              key={`mention-${index}`}
              display={mentionData.display}
              agentId={mentionData.id as Id<"agents">}
              isInUserMessage={participant?.kind === "user"}
            />
          );
        } else {
          return (
            <UserMention
              key={`mention-${index}`}
              display={mentionData.display}
              userId={mentionData.id as Id<"users">}
              isInUserMessage={participant?.kind === "user"}
            />
          );
        }
      }
    });
  };

  return (
    <div
      className={`flex items-start gap-3 ${
        participant?.kind === "user" ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar className="mt-1">
              <AvatarImage src={participant?.avatarUrl} />
              <AvatarFallback>
                {participant?.kind === "user"
                  ? "U"
                  : participant?.name?.[0] ?? "A"}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            {participant?.kind === "user"
              ? "You"
              : participant?.name ?? "Agent"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          participant?.kind === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        {participant?.kind === "agent" && (
          <div className="text-sm font-medium text-foreground mb-1">
            {participant.name}
          </div>
        )}
        <div className="space-x-1">{renderMessageContent(message.content)}</div>
        <div
          className={`text-xs mt-1 ${
            participant?.kind === "user"
              ? "text-primary-foreground/80"
              : "text-muted-foreground"
          }`}
        >
          {timeAgo}
        </div>
      </div>
    </div>
  );
};
