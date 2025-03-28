import React, { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextType {
  replyToMention: string | null;
  setReplyToMention: (mention: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [replyToMention, setReplyToMention] = useState<string | null>(null);

  return (
    <ChatContext.Provider value={{ replyToMention, setReplyToMention }}>
      {children}
    </ChatContext.Provider>
  );
}
