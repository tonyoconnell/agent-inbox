import * as React from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Plus } from "lucide-react";
import { useApiErrorHandler } from "../../misc/errors";
import { routes, useCurrentThreadId } from "../../../routes";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex-helpers/react/cache";

const DEFAULT_THREAD_TITLE = "New Conversation";

export const ThreadList = () => {
  const threads = useQuery(api.threads.listMine);
  const createThread = useMutation(api.threads.create);
  const onApiError = useApiErrorHandler();
  const currentThreadId = useCurrentThreadId();

  return (
    <>
      <div className="p-4">
        <Button
          className="w-full"
          variant="default"
          onClick={() =>
            createThread({ title: DEFAULT_THREAD_TITLE })
              .then((threadId) => routes.thread({ threadId }).push())
              .catch(onApiError)
          }
        >
          <Plus className="h-5 w-5" />
          New Thread
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {threads?.map((thread) => (
          <div
            key={thread._id}
            onClick={() => routes.thread({ threadId: thread._id }).push()}
            className={`p-4 cursor-pointer hover:bg-accent ${
              thread._id === currentThreadId ? "bg-accent" : ""
            }`}
          >
            <div className="font-medium text-primary-foreground">
              {thread.title}
            </div>
            <div className="text-sm text-muted-foreground/80 truncate">
              {new Date(thread._creationTime).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
