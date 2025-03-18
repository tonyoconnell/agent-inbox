import * as React from "react";
import { Agent } from "./Agent";

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
    <div className="w-full h-full p-4 bg-white rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Agents</h2>

      <div className="space-y-2">
        {agents.map((agent) => (
          <Agent key={agent.id} {...agent} />
        ))}
      </div>

      <button
        className="
          w-full mt-4 p-2 rounded-lg border-2 border-dashed 
          border-gray-300 text-gray-500 hover:border-gray-400 
          hover:text-gray-600 transition-colors
        "
      >
        Add Agent
      </button>
    </div>
  );
};
