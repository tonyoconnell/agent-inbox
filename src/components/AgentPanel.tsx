import * as React from "react";
import { Agent } from "./Agent";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export const AgentPanel: React.FC = () => {
  const agents = useQuery(api.agents.listAgents);
  const createAgent = useMutation(api.agents.createAgent);
  const [isOpen, setIsOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [personality, setPersonality] = React.useState("");

  if (!agents) return <div>Loading...</div>;

  const handleCreateAgent = async () => {
    await createAgent({ name, personality });
    setIsOpen(false);
    setName("");
    setPersonality("");
  };

  return (
    <div className="w-full h-full p-4 bg-white rounded-lg shadow-sm border border-border text-muted-foreground">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Agents</h2>

      <div className="space-y-3">
        {agents.map((agent) => (
          <Agent key={agent._id} {...agent} />
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
    </div>
  );
};
