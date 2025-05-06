import * as React from "react";
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useApiErrorHandler } from "../../misc/errors";
import { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex-helpers/react/cache";
import { routes, useCurrentAgentId } from "../../../routes";
import { AgentAvatar } from "@/components/ui/agent-avatar";

type Agent = {
  _id: Id<"agents">;
  name: string;
  description: string;
  status: "idle" | "active" | "processing";
  avatarUrl: string;
};

export const AgentList = () => {
  const agents = useQuery(api.agents.queries.listMine);
  const createAgent = useMutation(api.agents.mutations.create);
  const onApiError = useApiErrorHandler();
  const currentAgentId = useCurrentAgentId();

  return (
    <>
      <div className="p-4">
        <Button
          className="w-full bg-accent/50 border border-accent/50 text-primary-foreground hover:bg-accent"
          variant="ghost"
          onClick={() => {
            void createAgent()
              .then((agentId) => routes.agent({ agentId }).push())
              .catch(onApiError);
          }}
        >
          <Plus className="h-5 w-5" />
          New Agent
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {agents?.map((agent) => (
          <div
            key={agent._id}
            onClick={() => routes.agent({ agentId: agent._id }).push()}
            className={`bg-white rounded-xl border mb-3 px-5 py-4 cursor-pointer transition-all duration-150 shadow-sm border-gray-200 hover:bg-gray-50 hover:shadow-md flex items-center gap-3
              ${agent._id === currentAgentId ? "border-blue-600 ring-2 ring-blue-600" : ""}`}
          >
            <AgentAvatar
              size="sm"
              avatarUrl={agent.avatarUrl}
              name={agent.name}
            />
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-gray-900 text-base mb-1 truncate">
                {agent.name}
              </div>
              <div className="text-xs text-gray-500 mb-1 truncate">
                {agent.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
