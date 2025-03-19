import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Skeleton } from "../../ui/skeleton";

interface ThreadHeaderProps {
  threadId: string | undefined;
}

export const ThreadHeader: React.FC<ThreadHeaderProps> = ({ threadId }) => {
  const thread = useQuery(
    api.threads.getMine,
    threadId ? { threadId: threadId as Id<"threads"> } : "skip",
  );

  return (
    <div className="h-14 border-b border-border flex items-center px-4">
      {threadId && !thread ? (
        <Skeleton className="h-7 w-48" />
      ) : (
        <h1 className="font-medium text-lg">{thread?.title}</h1>
      )}
    </div>
  );
};
