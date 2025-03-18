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
    <div className="w-full h-full p-4 bg-white rounded-lg shadow-sm border border-pastel-200">
      <h2 className="text-lg font-semibold mb-4 text-pastel-900">Agents</h2>

      <div className="space-y-3">
        {agents.map((agent) => (
          <Agent key={agent.id} {...agent} />
        ))}
      </div>

      <button
        className="
          w-full mt-6 p-2 rounded-lg border-2 border-dashed 
          border-pastel-200 text-pastel-500 hover:border-pastel-300 
          hover:text-pastel-600 hover:bg-pastel-50 transition-colors
        "
      >
        Add Agent
      </button>
    </div>
  );
};
