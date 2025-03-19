import * as React from "react";
import { Plus } from "lucide-react";
import { ThreadItem } from "./ThreadItem";
import { UserProfile } from "./UserProfile";
import { api } from "../../../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useApiErrorHandler } from "@/components/misc/errors";

const DEFAULT_THREAD_TITLE = "New Conversation";

interface ThreadListProps {}

export const ThreadList: React.FC<ThreadListProps> = ({}) => {
  const threads = useQuery(api.threads.list);
  const createThread = useMutation(api.threads.create);
  const onApiError = useApiErrorHandler();

  // TEMP, replace it with routing stuff
  const selectedThreadId = "123213";

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
          onClick={() => {
            createThread({ title: DEFAULT_THREAD_TITLE }).catch(onApiError);
          }}
          className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-primary/90"
        >
          <Plus className="h-5 w-5" />
          New Thread
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {threads
          ? threads.map((thread) => (
              <ThreadItem
                key={thread._id}
                id={thread._id}
                title={thread.title}
                lastMessageTime={thread.lastMessageTime}
                isSelected={selectedThreadId === thread._id}
                onSelect={() => {
                  // update the route
                }}
              />
            ))
          : "loading.."}
      </div>
    </>
  );
};
