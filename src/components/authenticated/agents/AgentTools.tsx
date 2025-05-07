import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, X, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UserChoosableToolName,
  userChoosableToolDefinitions,
  toolDefinitions,
  AgentToolName,
} from "../../../../shared/tools";

interface ToolsProps {
  agentId: Id<"agents">;
  name: string;
  description: string;
  personality: string;
  tools: Id<"tools">[];
}

export const Tools: React.FC<ToolsProps> = ({
  agentId,
  name,
  description,
  personality,
  tools,
}) => {
  const updateAgent = useMutation(api.agents.mutations.updateMine);
  const [isEditing, setIsEditing] = React.useState(false);

  // Fetch all tools from the backend
  const allTools = useQuery(api.tools.queries.listAll, {});

  // Map tool IDs to tool info for display
  const toolIdToName: Record<string, string> = React.useMemo(() => {
    const map: Record<string, string> = {};
    allTools?.forEach((tool: { _id: Id<"tools">; name: string }) => {
      map[tool._id] = tool.name;
    });
    return map;
  }, [allTools]);

  const handleRemoveTool = async (toolIdToRemove: Id<"tools">) => {
    await updateAgent({
      agentId,
      name,
      description,
      tools: tools.filter((toolId) => toolId !== toolIdToRemove),
    });
  };

  const handleAddTool = async (toolIdToAdd: Id<"tools">) => {
    if (tools.includes(toolIdToAdd)) return;
    await updateAgent({
      agentId,
      name,
      description,
      tools: [...tools, toolIdToAdd],
    });
  };

  // Only show tools that are not already assigned
  const availableTools = allTools
    ? allTools.filter((tool: { _id: Id<"tools"> }) => !tools.includes(tool._id))
    : [];

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Tools</h2>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tools.map((toolId) => (
          <Badge
            key={toolId}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {toolIdToName[toolId as string] || toolId}
            {isEditing && (
              <button
                onClick={() => { void handleRemoveTool(toolId); }}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
        {isEditing && availableTools.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-6">
                <Plus className="h-3 w-3 mr-1" />
                Add Tool
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {availableTools.map((tool: { _id: Id<"tools">; name: string; description: string }) => (
                <DropdownMenuItem key={tool._id} onClick={() => { void handleAddTool(tool._id); }}>
                  <div>
                    <div className="font-medium">{tool.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {tool.description}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </Card>
  );
};
