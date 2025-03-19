import * as React from "react";
import { Agent } from "./Agent";
import { Button } from "../ui/button";
import { Plus, Pencil } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Id } from "../../../convex/_generated/dataModel";

export const AgentPanel: React.FC = () => {
  const agents = useQuery(api.agents.listAgents);
  const createAgent = useMutation(api.agents.createAgent);
  const updateAgent = useMutation(api.agents.updateAgent);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [personality, setPersonality] = React.useState("");
  const [selectedAgent, setSelectedAgent] = React.useState<{
    id: Id<"agents">;
    name: string;
    personality: string;
    avatar?: string;
  } | null>(null);

  if (!agents) return <div>Loading...</div>;

  const handleCreateAgent = async () => {
    await createAgent({ name, personality });
    setIsOpen(false);
    setName("");
    setPersonality("");
  };

  const handleUpdateAgent = async () => {
    if (!selectedAgent) return;

    await updateAgent({
      id: selectedAgent.id,
      name: selectedAgent.name,
      personality: selectedAgent.personality,
      avatar: selectedAgent.avatar,
    });

    setIsEditOpen(false);
    setSelectedAgent(null);
  };

  const handleAgentClick = (agent: any) => {
    setSelectedAgent({
      id: agent._id,
      name: agent.name,
      personality: agent.personality,
      avatar: agent.avatar,
    });
    setIsEditOpen(true);
  };

  return (
    <div className="w-full h-full p-4 bg-white rounded-lg shadow-sm border border-border text-muted-foreground">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Agents</h2>

      <div className="space-y-3">
        {agents.map((agent) => (
          <Agent
            key={agent._id}
            {...agent}
            onClick={() => handleAgentClick(agent)}
          />
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full mt-6 border-2 border-dashed"
          >
            <Plus className="size-4 mr-2" />
            Add Agent
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Agent</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                placeholder="Agent name..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="personality">Personality</Label>
              <Textarea
                id="personality"
                value={personality}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setPersonality(e.target.value)
                }
                placeholder="Describe the agent's personality..."
              />
            </div>
            <Button
              className="w-full"
              onClick={handleCreateAgent}
              disabled={!name || !personality}
            >
              Create Agent
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={selectedAgent.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedAgent({
                      ...selectedAgent,
                      name: e.target.value,
                    })
                  }
                  placeholder="Agent name..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-personality">Personality</Label>
                <Textarea
                  id="edit-personality"
                  value={selectedAgent.personality}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setSelectedAgent({
                      ...selectedAgent,
                      personality: e.target.value,
                    })
                  }
                  placeholder="Describe the agent's personality..."
                />
              </div>
              <Button
                className="w-full"
                onClick={handleUpdateAgent}
                disabled={!selectedAgent.name || !selectedAgent.personality}
              >
                Update Agent
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
