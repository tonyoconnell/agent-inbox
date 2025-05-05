import * as React from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ConversationHeader } from "./ConversationHeader";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { Skeleton } from "../../ui/skeleton";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { ChatProvider } from "./ChatContext";

interface ChatAreaProps {
  conversationId: Id<"conversations">;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ conversationId }) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const conversation = useQuery(api.conversations.queries.findMine, {
    conversationId,
  });
  const messages = useQuery(api.conversationMessages.queries.listForMe, {
    conversationId,
  });

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <ChatProvider>
      <div className="flex flex-col flex-1 min-h-0 bg-background">
        <ConversationHeader conversation={conversation} />
        <div className="relative flex-1 min-h-0">
          <div className="flex flex-col-reverse h-full min-h-0">
            <div className="sticky bottom-0 left-0 right-0 z-10 bg-background border-t border-gray-200" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
              <ChatInput conversationId={conversationId} />
            </div>
            <div className="flex-1 overflow-y-auto px-2 pb-4 pt-2 min-h-0">
              <div className="space-y-4">
                {!messages ? (
                  <>
                    <div className="flex justify-start">
                      <Skeleton className="h-24 w-2/3" />
                    </div>
                    <div className="flex justify-end">
                      <Skeleton className="h-16 w-1/2" />
                    </div>
                    <div className="flex justify-start">
                      <Skeleton className="h-20 w-3/5" />
                    </div>
                  </>
                ) : (
                  <>
                    {messages.map((message) => (
                      <ChatMessage key={message._id} message={message} />
                    ))}
                    <ThinkingIndicator conversationId={conversationId} />
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChatProvider>
  );
};
