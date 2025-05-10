import * as React from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toolDefinitions } from "../../../../shared/tools";

const tools = Object.values(toolDefinitions);

export default function ToolList() {
  const [search, setSearch] = React.useState("");

  const filteredTools = React.useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return tools;
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(s) ||
        tool.description.toLowerCase().includes(s)
    );
  }, [search]);

  return (
    <>
      <div className="p-4">
        <Input
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredTools.map((tool) => (
          <div
            key={tool.name}
            className="p-4 rounded cursor-pointer flex items-center gap-3 transition-colors hover:bg-accent mb-1"
          >
            <Avatar>
              <AvatarFallback>{tool.name[0]}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-primary-foreground truncate">
                {tool.name}
              </div>
              <div className="text-sm text-muted-foreground/80 truncate">
                {tool.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
} 