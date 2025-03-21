import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { useTimeAgo } from "../../misc/hooks";

interface ChatMessageProps {
  id: string;
  content: string;
  sender: "user" | "agent" | "system";
  timestamp: string;
  agentName?: string;
  avatarUrl?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  sender,
  timestamp,
  agentName,
  avatarUrl,
}) => {
  const timeAgo = useTimeAgo(timestamp);

  return (
    <div
      className={`flex items-start gap-3 ${
        sender === "user" ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar className="mt-1">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>
                {sender === "user" ? "U" : agentName?.[0] ?? "A"}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            {sender === "user" ? "You" : agentName ?? "Agent"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        {sender === "agent" && (
          <div className="text-sm font-medium text-foreground mb-1">
            {agentName}
          </div>
        )}
        <div>{content}</div>
        <div
          className={`text-xs mt-1 ${
            sender === "user"
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
