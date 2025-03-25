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

  const timeAgo = useTimeAgo(message._creationTime);

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
        <div>{message.content}</div>
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
