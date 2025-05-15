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
import { Input } from "@/components/ui/input";

const DEFAULT_AGENT_NAME = "New Agent";

export const AgentList = () => {
  const agents = useQuery(api.agents.queries.listAll);
  const createAgent = useMutation(api.agents.mutations.create);
  const onApiError = useApiErrorHandler();
  const currentAgentId = useCurrentAgentId();
  const [search, setSearch] = React.useState("");

  const filteredAgents = React.useMemo(() => {
    if (!agents) return [];
    const s = search.trim().toLowerCase();
    if (!s) return agents;
    return agents.filter(
      (a) =>
        a.name.toLowerCase().includes(s) ||
        a.description.toLowerCase().includes(s)
    );
  }, [agents, search]);

  const handleCreate = () => {
    createAgent()
      .then((agentId) => {
        setSearch("");
        routes.agent({ agentId }).push();
      })
      .catch(onApiError);
  };

  return (
    <>
      <div className="p-4">
        <Button
          className="w-full"
          variant="default"
          onClick={handleCreate}
        >
          <Plus className="h-5 w-5" />
          New Agent
        </Button>
        <Input
          placeholder="Search agents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-3"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredAgents?.map((agent) => (
          <div
            key={agent._id}
            onClick={() => routes.agent({ agentId: agent._id }).push()}
            className={`p-4 rounded cursor-pointer flex items-center gap-3 transition-colors hover:bg-accent mb-1 ${
              agent._id === currentAgentId ? "bg-accent" : ""
            }`}
          >
            <AgentAvatar
              size="sm"
              avatarUrl={agent.avatarUrl ?? ""}
              name={agent.name}
            />
            <div className="min-w-0 flex-1">
              <div className="font-medium text-primary-foreground truncate">
                {agent.name}
              </div>
              <div className="text-sm text-muted-foreground/80 truncate">
                {agent.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
