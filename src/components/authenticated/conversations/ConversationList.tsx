import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Plus, Search } from "lucide-react";
import { useApiErrorHandler } from "../../misc/errors";
import { ConversationItem } from "./ConversationItem";
import { useCurrentConversationId, routes } from "../../../routes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DEFAULT_THREAD_TITLE = "New Conversation";

export const ConversationList: React.FC = () => {
  const conversations = useQuery(api.conversations.queries.listForUser);
  const createConversation = useMutation(api.conversations.mutations.create);
  const onApiError = useApiErrorHandler();
  const currentConversationId = useCurrentConversationId();
  const [search, setSearch] = React.useState("");

  const handleCreateConversation = async () => {
    try {
      const conversationId = await createConversation({
        title: DEFAULT_THREAD_TITLE,
      });
      routes.conversation({ conversationId }).push();
    } catch (error) {
      onApiError(error);
    }
  };

  const filteredConversations = React.useMemo(() => {
    if (!conversations) return [];
    if (!search.trim()) return conversations;
    return conversations.filter((c) =>
      c.title.toLowerCase().includes(search.trim().toLowerCase()),
    );
  }, [conversations, search]);

  return (
    <>
      <div className="p-4">
        <Button
          onClick={() => { void handleCreateConversation(); }}
          className="w-full bg-accent/50 border border-accent/50 text-primary-foreground hover:bg-accent"
          variant="ghost"
        >
          <Plus className="h-5 w-5" />
          New Conversation
        </Button>
        <div className="relative mt-4">
          <Search className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="pl-12 pr-4 py-2 bg-[#23232a] border border-[#23232a] text-white placeholder:text-gray-400 rounded-full"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => (
          <ConversationItem
            key={conversation._id}
            id={conversation._id}
            title={conversation.title}
            lastMessageTime={conversation._creationTime}
            isSelected={conversation._id === currentConversationId}
            onSelect={(id) =>
              routes.conversation({ conversationId: id }).push()
            }
          />
        ))}
      </div>
    </>
  );
};
