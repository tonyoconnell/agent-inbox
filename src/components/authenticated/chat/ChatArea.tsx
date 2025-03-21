import * as React from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ConversationHeader } from "./ConversationHeader";
import { Skeleton } from "../../ui/skeleton";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { routes } from "@/routes";

interface ChatAreaProps {
  conversationId: Id<"conversations">;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ conversationId }) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const conversation = useQuery(api.conversations.public.findMine, {
    conversationId,
  });
  const messages = useQuery(api.conversationMessages.public.listFromMe, {
    conversationId,
  });
  const sendMessage = useMutation(api.conversationMessages.public.sendFromMe);

  // If the conversation is not found, redirect to the home page
  React.useEffect(() => {
    if (conversation === undefined) return; // loading
    if (conversation === null) routes.home().push();
  }, [conversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (
    content: string,
    references: Array<{
      kind: "agent";
      agentId: Id<"agents">;
      startIndex: number;
      endIndex: number;
    }> = [],
  ) => {
    await sendMessage({ conversationId, content, references });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <ConversationHeader conversation={conversation} />
      <div className="relative flex-1">
        <div className="absolute inset-0 flex flex-col-reverse">
          <div className="absolute bottom-0 left-0 right-0">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
          <div className="overflow-y-auto pb-24">
            <div className="p-4 space-y-4">
              <div ref={messagesEndRef} />
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
                messages.map((message) => (
                  <ChatMessage
                    key={message._id}
                    id={message._id}
                    content={message.content}
                    sender={message.author.kind}
                    timestamp={new Date(message._creationTime).toISOString()}
                    agentName={
                      message.author.kind === "agent" ? "Agent" : undefined
                    }
                    avatarUrl={message.avatarUrl ?? undefined}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
