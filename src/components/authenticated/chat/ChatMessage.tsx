import * as React from "react";

interface ChatMessageProps {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: string;
  agentName?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  sender,
  timestamp,
  agentName,
}) => (
  <div
    className={`flex ${sender === "user" ? "justify-end" : "justify-start"}`}
  >
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
        className={`text-xs mt-1 ${sender === "user" ? "text-primary-foreground/80" : "text-muted-foreground"}`}
      >
        {timestamp}
      </div>
    </div>
  </div>
);
