import * as React from "react";
import { Doc } from "convex/_generated/dataModel";
import { useTimeAgo } from "@/components/misc/hooks";
import { InfoIcon } from "lucide-react";

interface Props {
  message: Doc<"conversationMessages">;
}

export const SystemMessage: React.FC<Props> = ({ message }) => {
  if (message.kind != "system")
    throw new Error("Message is not a system message");

  const timeAgo = useTimeAgo(message._creationTime);

  return (
    <div className="flex items-center justify-center my-4">
      <div className="flex items-center gap-2 max-w-[80%] rounded-lg bg-secondary/50 px-4 py-2 text-sm text-secondary-foreground">
        <InfoIcon className="h-4 w-4" />
        <div className="flex-1">{message.content}</div>
        <div className="text-xs text-secondary-foreground/70">{timeAgo}</div>
      </div>
    </div>
  );
};
