import * as React from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AgentToolsProps {
  agentId: Id<"agents">;
  tools: string[];
}

export const AgentTools: React.FC<AgentToolsProps> = ({ tools }) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Tools</h2>
      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <Badge key={tool} variant="secondary">
            {tool}
          </Badge>
        ))}
      </div>
    </Card>
  );
};
