import * as React from "react";
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useApiErrorHandler } from "../../misc/errors";
import { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex-helpers/react/cache";
import { routes, useCurrentAgentId } from "../../../routes";

type Agent = {
  _id: Id<"agents">;
  name: string;
  description: string;
  status: "idle" | "active" | "processing";
  avatarUrl: string;
};

const DEFAULT_AGENT = {
  name: "New Agent",
  description: "A helpful AI assistant",
  personality: "Friendly and professional",
  tools: [],
};

export const AgentList = () => {
  const agents = useQuery(api.agents.listMine);
  const createAgent = useMutation(api.agents.create);
  const onApiError = useApiErrorHandler();
  const currentAgentId = useCurrentAgentId();

  return (
    <>
      <div className="p-4">
        <Button
          className="w-full"
          variant="default"
          onClick={() =>
            createAgent(DEFAULT_AGENT)
              .then((agentId) => routes.agent({ agentId }).push())
              .catch(onApiError)
          }
        >
          <Plus className="h-5 w-5" />
          New Agent
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {agents?.map((agent: Agent) => (
          <div
            key={agent._id}
            onClick={() => routes.agent({ agentId: agent._id }).push()}
            className={`p-4 cursor-pointer hover:bg-accent ${
              agent._id === currentAgentId ? "bg-accent" : ""
            }`}
          >
            <div className="font-medium text-primary-foreground">
              {agent.name}
            </div>
            <div className="text-sm text-muted-foreground">
              {agent.description}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
