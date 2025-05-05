import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Plus, Search } from "lucide-react";
import { useApiErrorHandler } from "../../misc/errors";
import { ConversationItem } from "./ConversationItem";
import { useCurrentConversationId, routes } from "../../../routes";
import { Input } from "@/components/ui/input";

const DEFAULT_THREAD_TITLE = "New Conversation";

interface ConversationListProps {}

export const ConversationList: React.FC<ConversationListProps> = ({}) => {
  const conversations = useQuery(api.conversations.queries.listMine);
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
        <button
          onClick={handleCreateConversation}
          className="w-full bg-[#2563eb] text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 font-semibold shadow-sm hover:bg-[#1d4ed8] transition-colors duration-150"
        >
          <Plus className="h-5 w-5" />
          New Conversation
        </button>
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
