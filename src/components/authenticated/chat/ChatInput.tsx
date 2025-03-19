import * as React from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSendMessage(message);
    setMessage("");
  };

  return (
    <div className="p-4 sticky bottom-0">
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 bg-card shadow-lg p-2 rounded-lg border border-border"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-md border-0 bg-transparent px-3 py-2 focus-visible:ring-0 outline-none placeholder:text-muted-foreground/50"
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Send
        </button>
      </form>
    </div>
  );
};
