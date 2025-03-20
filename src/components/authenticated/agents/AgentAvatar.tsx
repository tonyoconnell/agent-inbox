import * as React from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shuffle, Loader2 } from "lucide-react";
import { useApiErrorHandler } from "@/components/misc/errors";

interface AgentAvatarProps {
  agentId: Id<"agents">;
  name: string;
  avatarUrl: string;
  status: "idle" | "active" | "processing";
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  agentId,
  name,
  avatarUrl,
  status,
}) => {
  const updateAvatar = useMutation(api.agents.shuffleAvatar);
  const [isShufflingAvatar, setIsShufflingAvatar] = React.useState(false);
  const onApiError = useApiErrorHandler();

  return (
    <div className="text-center">
      <div className="relative inline-block">
        <img
          src={avatarUrl}
          alt={name}
          className="h-48 w-48 rounded-full mb-4 border-4 border-primary"
        />
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-6 -right-2"
          disabled={isShufflingAvatar}
          onClick={async () => {
            setIsShufflingAvatar(true);
            await updateAvatar({
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
      <h1 className="text-3xl font-bold mb-2">{name}</h1>
      <Badge
        variant={
          status === "idle"
            ? "secondary"
            : status === "active"
              ? "default"
              : "destructive"
        }
      >
        {status}
      </Badge>
    </div>
  );
};
