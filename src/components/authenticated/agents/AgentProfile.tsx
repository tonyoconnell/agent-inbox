import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useApiErrorHandler } from "@/components/misc/errors";
import { routes } from "@/routes";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Confirm } from "@/components/ui/confirm";
import { AgentAvatar } from "./AgentAvatar";
import { AgentDescription } from "./AgentDescription";
import { AgentPersonality } from "./AgentPersonality";
import { AgentTools } from "./AgentTools";

export const AgentProfile = ({ agentId }: { agentId: Id<"agents"> }) => {
  const agent = useQuery(api.agents.findMine, { agentId });
  const deleteAgent = useMutation(api.agents.removeMine);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const onApiError = useApiErrorHandler();

  if (!agent)
    return (
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-48 w-48 rounded-full mx-auto" />
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex-1 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <AgentAvatar
          agentId={agent._id}
          name={agent.name}
          avatarUrl={agent.avatarUrl}
          status={agent.status}
        />
        <AgentDescription
          agentId={agent._id}
          name={agent.name}
          description={agent.description}
          personality={agent.personality}
          tools={agent.tools}
        />
        <div className="grid grid-cols-2 gap-6">
          <AgentPersonality
            agentId={agent._id}
            name={agent.name}
            description={agent.description}
            personality={agent.personality}
            tools={agent.tools}
          />
          <AgentTools agentId={agent._id} tools={agent.tools} />
        </div>
        <div className="text-sm text-muted-foreground text-center">
          Last active: {new Date(agent.lastActiveTime).toLocaleString()}
        </div>
        <div className="flex justify-center">
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Agent
          </Button>
        </div>

        <Confirm
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          title="Delete Agent"
          description={`Are you sure you want to delete ${agent.name}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() =>
            deleteAgent({ agentId: agent._id })
              .then(() => routes.home().push())
              .catch(onApiError)
          }
          variant="destructive"
        />
      </div>
    </div>
  );
};
