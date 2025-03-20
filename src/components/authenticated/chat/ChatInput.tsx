import * as React from "react";
import { MentionsInput, Mention, SuggestionDataItem } from "react-mentions";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Avatar } from "@/components/ui/avatar";
import { AgentAvatar } from "@/components/ui/agent-avatar";

interface ChatInputProps {
  onSendMessage: (
    message: string,
    references: Array<{
      kind: "agent";
      agentId: Id<"agents">;
      startIndex: number;
      endIndex: number;
    }>,
  ) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = React.useState("");
  const agents = useQuery(api.agents.listMine) ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Extract references from the message
    const references: Array<{
      kind: "agent";
      agentId: Id<"agents">;
      startIndex: number;
      endIndex: number;
    }> = [];
    const regex = /@\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = regex.exec(message)) !== null) {
      references.push({
        kind: "agent",
        agentId: match[2] as Id<"agents">,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }

    onSendMessage(message, references);
    setMessage("");
  };

  return (
    <div className="p-4 sticky bottom-0">
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 bg-card shadow-lg p-2 rounded-lg border border-border"
      >
        <MentionsInput
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mentions"
          style={{
            control: {
              backgroundColor: "transparent",
              fontSize: 16,
              fontWeight: "normal",
            },
            input: {
              margin: 0,
              padding: "8px 12px",
              overflow: "auto",
              height: "40px",
              border: "none",
              borderRadius: 6,
              backgroundColor: "transparent",
              color: "inherit",
              outline: "none",
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
                zIndex: 1000,
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
          placeholder="Type a message... Use @ to mention agents"
          singleLine={true}
          allowSpaceInQuery={true}
        >
          <Mention
            trigger="@"
            data={agents.map((agent) => ({
              id: agent._id,
              display: agent.name,
            }))}
            displayTransform={(id, display) => `@${display}`}
            markup="@[__display__](__id__)"
            appendSpaceOnAdd={true}
            renderSuggestion={(
              suggestion: SuggestionDataItem,
              search,
              highlightedDisplay,
              index,
            ) => (
              <div className="flex items-center gap-2 p-2 hover:bg-accent cursor-pointer">
                <AgentAvatar
                  size="sm"
                  avatarUrl={agents[index].avatarUrl}
                  name={agents[index].name}
                />
                <span>{highlightedDisplay}</span>
              </div>
            )}
          />
        </MentionsInput>
        <button
          type="submit"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Send
        </button>
      </form>

      <style>
        {`
        .mentions {
          width: 100%;
        }
        .mentions--focused {
          outline: none;
        }
        .mentions__suggestions__list {
          background-color: var(--background);
          border: 1px solid var(--border);
          border-radius: 6px;
          margin-top: 8px;
          position: absolute;
          bottom: 100%;
          left: 0;
          right: 0;
          z-index: 10;
        }
        .mentions__suggestions__item {
          padding: 8px;
          cursor: pointer;
        }
        .mentions__suggestions__item--focused {
          background-color: var(--accent);
        }
        .mentions__highlighter {
          padding: 8px 12px;
          overflow: hidden;
        }
        `}
      </style>
    </div>
  );
};
