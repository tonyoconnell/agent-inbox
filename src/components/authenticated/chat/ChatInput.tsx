import * as React from "react";
import { MentionsInput, Mention, SuggestionDataItem } from "react-mentions";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useApiErrorHandler } from "@/components/misc/errors";
import { Send } from "lucide-react";

interface CustomSuggestionData extends SuggestionDataItem {
  type: "agent" | "user";
  avatarUrl?: string;
  display: string;
}

interface ChatInputProps {
  conversationId: Id<"conversations">;
}

export const ChatInput: React.FC<ChatInputProps> = ({ conversationId }) => {
  const [message, setMessage] = React.useState("");
  const agents = useQuery(api.agents.queries.listMine) ?? [];
  const users = useQuery(api.users.queries.listAll) ?? [];
  const sendMessage = useMutation(api.conversationMessages.mutations.sendFromMe);
  const onApiError = useApiErrorHandler();
  const mentionsRef = React.useRef<HTMLDivElement>(null);

  // Auto-resize MentionsInput
  React.useEffect(() => {
    if (mentionsRef.current) {
      const textarea = mentionsRef.current.querySelector("textarea");
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
      }
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage({ content: message, conversationId })
      .then(() => setMessage(""))
      .catch(onApiError);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const suggestions: CustomSuggestionData[] = [
    ...agents.map((agent) => ({
      id: `agent:${agent._id}`,
      display: agent.name ?? "",
      type: "agent" as const,
      avatarUrl: agent.avatarUrl,
    })),
    ...users.map((user) => ({
      id: `user:${user._id}`,
      display: user.name ?? "",
      type: "user" as const,
      avatarUrl: user.image,
    })),
  ];

  return (
    <div className="w-full px-4 pb-4">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 bg-[#23232a] border border-[#23232a] rounded-2xl px-4 py-2 w-full"
      >
        <div className="flex-1 min-w-0" ref={mentionsRef}>
          <MentionsInput
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="mentions"
            style={{
              control: {
                backgroundColor: "#23232a",
                fontSize: 17,
                fontWeight: 400,
                color: "var(--foreground)",
                borderRadius: 20,
                border: "none",
                padding: "10px 0",
                minHeight: "44px",
              },
              input: {
                margin: 0,
                padding: "0px 24px",
                overflow: "auto",
                minHeight: "56px",
                maxHeight: "160px",
                borderRadius: 20,
                border: "none",
                backgroundColor: "#23232a",
                color: "var(--foreground)",
                outline: "none",
                fontSize: 17,
                fontWeight: 400,
              },
              suggestions: {
                list: {
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.375rem",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  fontSize: "14px",
                  maxHeight: "300px",
                  overflow: "auto",
                  width: "300px",
                  minWidth: "100%",
                  position: "absolute" as const,
                  bottom: "100%",
                  left: 0,
                  right: 0,
                  marginBottom: "0.5rem",
                  zIndex: 100,
                },
                item: {
                  padding: "8px 12px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  "&focused": {
                    backgroundColor: "var(--accent)",
                  },
                },
              },
            }}
            placeholder="Type a message... Use @ to mention agents or users"
            singleLine={false}
            allowSpaceInQuery={true}
          >
            <Mention
              trigger="@"
              data={suggestions}
              displayTransform={(id, display) => `@${display}`}
              markup="@[__display__](__id__)"
              appendSpaceOnAdd={true}
              style={{
                backgroundColor: "var(--accent)",
                borderRadius: "6px",
              }}
            />
          </MentionsInput>
        </div>
        <button
          type="submit"
          disabled={!message.trim()}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
      <style>{`
        .mentions textarea::placeholder {
          color: var(--muted-foreground);
          font-size: 17px;
          font-weight: 400;
          opacity: 1;
        }
      `}</style>
    </div>
  );
};
