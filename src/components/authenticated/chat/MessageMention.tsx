import * as React from "react";
import { AgentAvatar } from "@/components/ui/agent-avatar";
import { Doc } from "../../../../convex/_generated/dataModel";
import { routes } from "@/routes";

interface MessageMentionProps {
  display: string;
  agentId: string;
  agent?: Doc<"agents">;
  isInUserMessage?: boolean;
}

export const MessageMention: React.FC<MessageMentionProps> = ({
  display,
  agentId,
  agent,
  isInUserMessage,
}) => {
  if (!agent) return null;

  const handleClick = () => {
    routes.agent({ agentId }).push();
  };

  return (
    <span
      onClick={handleClick}
      className={`
        inline-flex items-center gap-1 px-1 py-0.5 rounded text-sm 
        transition-colors duration-200
        cursor-pointer
        align-baseline
        ${
          isInUserMessage
            ? "bg-primary-foreground/20 hover:bg-primary-foreground/30"
            : "bg-accent/50 hover:bg-accent/60"
        }
      `}
    >
      <AgentAvatar
        size="xs"
        avatarUrl={agent.avatarUrl}
        name={agent.name ?? display}
        className="translate-y-[1px]"
      />
      <span className="leading-none">{display}</span>
    </span>
  );
};
