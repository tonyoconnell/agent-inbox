import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Plus } from "lucide-react";
import { useApiErrorHandler } from "../../misc/errors";
import { ThreadItem } from "./ThreadItem";
import { useCurrentThreadId, routes } from "../../../routes";

const DEFAULT_THREAD_TITLE = "New Conversation";

interface ThreadListProps {}

export const ThreadList: React.FC<ThreadListProps> = ({}) => {
  const threads = useQuery(api.threads.listMine);
  const createThread = useMutation(api.threads.create);
  const onApiError = useApiErrorHandler();
  const currentThreadId = useCurrentThreadId();

  const handleCreateThread = async () => {
    try {
      const threadId = await createThread({ title: DEFAULT_THREAD_TITLE });
      routes.thread({ threadId }).push();
    } catch (error) {
      onApiError(error);
    }
  };

  return (
    <>
      <div className="h-24 border-b border-border relative overflow-hidden">
        <img
          src="/logo-white.png"
          alt="Agent Inbox"
          className="absolute -right-0 -top-2 h-32 object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card to-transparent" />
      </div>
      <div className="p-4">
        <button
          onClick={handleCreateThread}
          className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-primary/90"
        >
          <Plus className="h-5 w-5" />
          New Thread
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {threads?.map((thread) => (
          <ThreadItem
            key={thread._id}
            id={thread._id}
            title={thread.title}
            lastMessageTime={thread._creationTime}
            isSelected={thread._id === currentThreadId}
            onSelect={(id) => routes.thread({ threadId: id }).push()}
          />
        ))}
      </div>
    </>
  );
};
