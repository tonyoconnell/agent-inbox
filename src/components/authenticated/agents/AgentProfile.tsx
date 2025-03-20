import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { routes } from "@/routes";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Confirm } from "@/components/ui/confirm";
import { EditableText } from "@/components/ui/editable-text";
import { useApiErrorHandler } from "@/components/misc/errors";

interface AgentProfileProps {
  agentId: Id<"agents">;
}

export const AgentProfile: React.FC<AgentProfileProps> = ({ agentId }) => {
  const agent = useQuery(api.agents.findMine, { agentId });
  const deleteAgent = useMutation(api.agents.removeMine);
  const updateAgent = useMutation(api.agents.updateMine);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);


  // If the agent is not found, redirect to home
  React.useEffect(() => {
    if (agent === undefined) return; // loading
    if (agent === null) routes.home().push();
  }, [agent]);

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
        {/* Avatar and Status */}
        <div className="text-center">
          <img
            src={agent.avatarUrl}
            alt={agent.name}
            className="h-48 w-48 rounded-full mx-auto mb-4 border-4 border-primary"
          />
          <h1 className="text-3xl font-bold mb-2">{agent.name}</h1>
          <Badge
            variant={
              agent.status === "idle"
                ? "secondary"
                : agent.status === "active"
                  ? "default"
                  : "destructive"
            }
          >
            {agent.status}
          </Badge>
        </div>

        {/* Description */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <EditableText
            value={agent.description}
            onSave={async (description) => {
              await updateAgent({
                agentId,
                name: agent.name,
                description,
                personality: agent.personality,
                tools: agent.tools,
              });
            }}
          />
        </Card>

        {/* Personality and Tools */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Personality</h2>
            <EditableText
              value={agent.personality}
              onSave={async (personality) => {
                await updateAgent({
                  agentId,
                  name: agent.name,
                  description: agent.description,
                  personality,
                  tools: agent.tools,
                });
              }}
            />
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Tools</h2>
            <div className="flex flex-wrap gap-2">
              {agent.tools.map((tool) => (
                <Badge key={tool} variant="outline">
                  {tool}
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Last Active */}
        <div className="text-sm text-muted-foreground text-center">
          Last active: {new Date(agent.lastActiveTime).toLocaleString()}
        </div>

        {/* Delete Button */}
        <div className="flex justify-center">
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Agent
          </Button>
        </div>

        {/* Delete Confirmation Dialog */}
        <Confirm
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          title="Delete Agent"
          description={`Are you sure you want to delete ${agent.name}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={async () => {
            await deleteAgent({ agentId });
            routes.home().push();
          }}
          variant="destructive"
        />
      </div>
    </div>
  );
};
