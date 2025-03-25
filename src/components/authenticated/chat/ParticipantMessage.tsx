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
import { Doc } from "convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { MessageMention } from "./MessageMention";

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

  const participant = participants?.find((p) => p.id === message.author);
  const agents = useQuery(api.agents.public.listMine) ?? [];

  const timeAgo = useTimeAgo(message._creationTime);

  const renderMessageContent = (content: string) => {
    const mentionRegex = /@\[(.*?)\]\(agent:(.*?)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      // Add text before the mention
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }

      const [_, display, agentId] = match;
      const agent = agents.find((a) => a._id === agentId);

      // Add the mention component
      parts.push(
        <MessageMention
          key={`${agentId}-${match.index}`}
          display={display}
          agentId={agentId}
          agent={agent}
          isInUserMessage={participant?.kind === "user"}
        />,
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after last mention
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts;
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
