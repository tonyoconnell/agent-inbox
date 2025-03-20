import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { routes } from "@/routes";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface AgentProfileProps {
  agentId: Id<"agents">;
}

export const AgentProfile: React.FC<AgentProfileProps> = ({ agentId }) => {
  const agent = useQuery(api.agents.findMine, { agentId });

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
          <p className="text-muted-foreground">{agent.description}</p>
        </Card>

        {/* Personality and Tools */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Personality</h2>
            <p className="text-muted-foreground">{agent.personality}</p>
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
      </div>
    </div>
  );
};
