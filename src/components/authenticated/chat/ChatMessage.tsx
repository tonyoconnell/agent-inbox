import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface ChatMessageProps {
  id: string;
  content: string;
  sender: "user" | "agent";
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
  // Format the timestamp using date-fns
  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });

  return (
    <div
      className={`flex items-start gap-3 ${
        sender === "user" ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <Avatar className="mt-1">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>
          {sender === "user" ? "U" : agentName?.[0] ?? "A"}
        </AvatarFallback>
      </Avatar>
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
