import * as React from "react";
import { AgentAvatar } from "@/components/ui/agent-avatar";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { routes } from "@/routes";
import { BaseMention } from "./BaseMention";

interface AgentMentionProps {
  display: string;
  agentId: Id<"agents">;
  isInUserMessage?: boolean;
}

export const AgentMention: React.FC<AgentMentionProps> = ({
  display,
  agentId,
  isInUserMessage,
}) => {
  console.log(`ATTEMPTING TO GET agentId`, agentId);

  const agent = useQuery(api.agents.public.findMention, { agentId });
  if (!agent) return null;

  const handleClick = () => {
    routes.agent({ agentId }).push();
  };

  return (
    <BaseMention
      display={display}
      isInUserMessage={isInUserMessage}
      onClick={handleClick}
      avatar={
        <AgentAvatar
          size="xs"
          avatarUrl={agent.avatarUrl}
          name={agent.name ?? display}
          className="translate-y-[1px]"
        />
      }
    />
  );
};
