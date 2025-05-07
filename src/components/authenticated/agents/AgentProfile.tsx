import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useApiErrorHandler } from "@/components/misc/errors";
import { routes } from "@/routes";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Confirm } from "@/components/ui/confirm";
import { AgentAvatar } from "@/components/ui/agent-avatar";
import { AgentDescription } from "./AgentDescription";
import { Loader2, Shuffle, Pencil, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AgentToolName } from "../../../../shared/tools";
import { Tools } from "./AgentTools";

export const AgentProfile = ({ agentId }: { agentId: Id<"agents"> }) => {
  const agent = useQuery(api.agents.queries.findMine, { agentId });
  const deleteAgent = useMutation(api.agents.mutations.removeMine);
  const shuffleAvatar = useMutation(api.agents.mutations.shuffleAvatar);
  const updateAgent = useMutation(api.agents.mutations.updateMine);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [isEditingDescription, setIsEditingDescription] = React.useState(false);
  const [isEditingPrompt, setIsEditingPrompt] = React.useState(false);
  const [isEditingTags, setIsEditingTags] = React.useState(false);
  const [isEditingTools, setIsEditingTools] = React.useState(false);
  const [editedName, setEditedName] = React.useState("");
  const [editedDescription, setEditedDescription] = React.useState("");
  const [editedPrompt, setEditedPrompt] = React.useState("");
  const [editedTags, setEditedTags] = React.useState<string[]>([]);
  const [editedTools, setEditedTools] = React.useState<(string | Id<"tools">)[]>([]);
  const [isShufflingAvatar, setIsShufflingAvatar] = React.useState(false);
  const onApiError = useApiErrorHandler();

  React.useEffect(() => {
    if (agent) {
      setEditedName(agent.name);
      setEditedDescription(agent.description);
      setEditedPrompt(agent.prompt ?? "");
      setEditedTags(agent.tags ?? []);
      setEditedTools(agent.tools ?? []);
    }
  }, [agent]);

  const filteredTools = (editedTools ?? []).filter((t): t is Id<"tools"> => typeof t !== "string");

  const handleSaveField = async (field: string) => {
    if (!agent) return;
    const update: any = {
      agentId,
      name: agent.name,
      description: agent.description,
      prompt: agent.prompt ?? "",
      tags: agent.tags ?? [],
      tools: (agent.tools ?? []).filter((t): t is Id<"tools"> => typeof t !== "string"),
    };
    if (field === "name") update.name = editedName;
    if (field === "description") update.description = editedDescription;
    if (field === "prompt") update.prompt = editedPrompt;
    if (field === "tags") update.tags = editedTags;
    if (field === "tools") update.tools = filteredTools;
    await updateAgent(update).catch(onApiError);
    if (field === "name") setIsEditingName(false);
    if (field === "description") setIsEditingDescription(false);
    if (field === "prompt") setIsEditingPrompt(false);
    if (field === "tags") setIsEditingTags(false);
    if (field === "tools") setIsEditingTools(false);
  };

  const handleCancelField = (field: string) => {
    if (!agent) return;
    if (field === "name") {
      setEditedName(agent.name);
      setIsEditingName(false);
    }
    if (field === "description") {
      setEditedDescription(agent.description);
      setIsEditingDescription(false);
    }
    if (field === "prompt") {
      setEditedPrompt(agent.prompt ?? "");
      setIsEditingPrompt(false);
    }
    if (field === "tags") {
      setEditedTags(agent.tags ?? []);
      setIsEditingTags(false);
    }
    if (field === "tools") {
      setEditedTools(agent.tools ?? []);
      setIsEditingTools(false);
    }
  };

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
        <div className="text-center">
          <div className="relative inline-block">
            <AgentAvatar
              avatarUrl={agent.avatarUrl ?? ""}
              name={agent.name}
              size="lg"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-6 -right-2"
              disabled={isShufflingAvatar}
              onClick={() => {
                setIsShufflingAvatar(true);
                void shuffleAvatar({
                  agentId,
                })
                  .catch(onApiError)
                  .finally(() => setIsShufflingAvatar(false));
              }}
            >
              {isShufflingAvatar ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Shuffle className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            {isEditingName ? (
              <>
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-2xl font-bold text-center w-64"
                  autoFocus
                />
                <Button variant="ghost" size="icon" onClick={() => { void handleSaveField("name"); }}><Check className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleCancelField("name")}>Cancel</Button>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold">{agent.name}</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingName(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg font-semibold">Description</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsEditingDescription(true)}><Pencil className="h-4 w-4" /></Button>
          </div>
          {isEditingDescription ? (
            <>
              <Input
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full"
                autoFocus
              />
              <Button variant="ghost" size="icon" onClick={() => { void handleSaveField("description"); }}><Check className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleCancelField("description")}>Cancel</Button>
            </>
          ) : (
            <div className="mb-4 text-muted-foreground whitespace-pre-wrap">{agent.description || <span className="italic">No description set.</span>}</div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg font-semibold">Prompt</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsEditingPrompt(true)}><Pencil className="h-4 w-4" /></Button>
          </div>
          {isEditingPrompt ? (
            <>
              <Input
                value={editedPrompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
                className="w-full"
                autoFocus
              />
              <Button variant="ghost" size="icon" onClick={() => { void handleSaveField("prompt"); }}><Check className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleCancelField("prompt")}>Cancel</Button>
            </>
          ) : (
            <div className="mb-4 text-muted-foreground whitespace-pre-wrap">{agent.prompt || <span className="italic">No prompt set.</span>}</div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg font-semibold">Tags</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsEditingTags(true)}><Pencil className="h-4 w-4" /></Button>
          </div>
          {isEditingTags ? (
            <>
              <Input
                value={editedTags.join(", ")}
                onChange={(e) => setEditedTags(e.target.value.split(",").map((tag) => tag.trim()).filter(Boolean))}
                className="w-full"
                autoFocus
              />
              <Button variant="ghost" size="icon" onClick={() => { void handleSaveField("tags"); }}><Check className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleCancelField("tags")}>Cancel</Button>
            </>
          ) : (
            <div className="mb-4 text-muted-foreground">
              {agent.tags && agent.tags.length > 0 ? agent.tags.join(", ") : <span className="italic">No tags set.</span>}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-semibold">Tools</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsEditingTools(true)}><Pencil className="h-4 w-4" /></Button>
            </div>
            <Tools
              agentId={agent._id}
              name={agent.name}
              description={agent.description}
              tools={isEditingTools ? editedTools : agent.tools ?? []}
              onChange={isEditingTools ? (updater => {
                if (typeof updater === 'function') {
                  setEditedTools(prev => updater(prev));
                } else {
                  setEditedTools(updater);
                }
              }) : undefined}
            />
            {isEditingTools && (
              <div className="flex gap-2 mt-2">
                <Button variant="ghost" size="icon" onClick={() => { void handleSaveField("tools"); }}><Check className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleCancelField("tools")}>Cancel</Button>
              </div>
            )}
          </div>
        </div>
        <div className="text-sm text-muted-foreground text-center">
          Last active: {new Date(("lastActiveTime" in agent ? (agent as any).lastActiveTime ?? agent._creationTime : agent._creationTime)).toLocaleString()}
        </div>
        <div className="flex justify-center">
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Agent
          </Button>
        </div>
        <Confirm
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          title="Delete Agent"
          description={`Are you sure you want to delete ${agent.name}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => {
            void deleteAgent({ agentId: agent._id })
              .then(() => routes.home().push())
              .catch(onApiError);
          }}
          variant="destructive"
        />
      </div>
    </div>
  );
};
