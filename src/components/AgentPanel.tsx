import * as React from "react";
import { Agent } from "./Agent";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

export interface AgentType {
  id: string;
  name: string;
  isRaisingHand: boolean;
  avatar?: string;
}

export const AgentPanel: React.FC = () => {
  // Mock data for now
  const [agents] = React.useState<AgentType[]>([
    { id: "1", name: "Skeptic", isRaisingHand: true },
    { id: "2", name: "Technical Knowledgeable", isRaisingHand: false },
    { id: "3", name: "Empathetic Coworker", isRaisingHand: false },
  ]);

  return (
    <div className="w-full h-full p-4 bg-white rounded-lg shadow-sm border border-border text-muted-foreground">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Agents</h2>

      <div className="space-y-3">
        {agents.map((agent) => (
          <Agent key={agent.id} {...agent} />
        ))}
      </div>

      <Button variant="outline" className="w-full mt-6 border-2 border-dashed">
        <Plus className="size-4" />
        Add Agent
      </Button>
    </div>
  );
};
