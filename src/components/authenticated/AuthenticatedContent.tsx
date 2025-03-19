import * as React from "react";
import { ThreadList } from "./threads/ThreadList";
import { ChatArea } from "./chat/ChatArea";
import { UserProfile } from "@/components/authenticated/threads/UserProfile";

interface Message {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: string;
  agentName?: string;
}

export const AuthenticatedContent: React.FC = () => {
  const [isTaskPanelOpen, setIsTaskPanelOpen] = React.useState(false);

  // Dummy messages for now - we'll replace these later
  const dummyMessages: Message[] = [
    {
      id: "1",
      content: "Can you help me plan this project?",
      sender: "user",
      timestamp: "10:00 AM",
    },
    {
      id: "2",
      content:
        "I'd be happy to help break down the project planning. Let's start by identifying the main objectives.",
      sender: "agent",
      agentName: "ProjectBot",
      timestamp: "10:01 AM",
    },
    {
      id: "3",
      content: "@ResearchBot can you find some relevant case studies?",
      sender: "agent",
      agentName: "ProjectBot",
      timestamp: "10:02 AM",
    },
  ];

  const handleSendMessage = (message: string) => {
    console.log("Sending message:", message);
    // TODO: Implement sending message
  };

  return (
    <div className="h-screen flex bg-background">
      <div className="w-64 bg-card border-r border-border flex flex-col dark">
        <ThreadList />
        <UserProfile />
      </div>

      <ChatArea messages={dummyMessages} onSendMessage={handleSendMessage} />

      {/* Right Sidebar - Task Details (Optional) */}
      {isTaskPanelOpen && (
        <div className="w-80 bg-background border-l border-border p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Task Details</h3>
            <button
              onClick={() => setIsTaskPanelOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium">Web Search</div>
              <div className="text-sm text-muted-foreground">
                Searched for "project planning methodologies"
              </div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium">Document Analysis</div>
              <div className="text-sm text-muted-foreground">
                Analyzed 3 case studies related to similar projects
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
