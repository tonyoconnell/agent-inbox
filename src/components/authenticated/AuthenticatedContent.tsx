import * as React from "react";
import { ChatArea } from "./chat/ChatArea";
import { UserProfile } from "@/components/authenticated/threads/UserProfile";
import { Sidebar } from "./sidebar/Sidebar";
import {
  useRoute,
  routes,
  useCurrentThreadId,
  useCurrentTaskId,
} from "../../routes";
import { Id } from "convex/_generated/dataModel";

interface Message {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: string;
  agentName?: string;
}

export const AuthenticatedContent: React.FC = () => {
  const route = useRoute();
  const currentThreadId = useCurrentThreadId();
  const currentTaskId = useCurrentTaskId();

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

  // If we're not in a thread, show a welcome message
  if (!currentThreadId)
    return (
      <div className="h-screen flex bg-background">
        <div className="w-64 bg-card border-r border-border flex flex-col dark">
          <Sidebar />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome to Agent Inbox</h1>
            <p className="text-muted-foreground">
              Select a thread to get started
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="h-screen flex bg-background">
      <div className="w-64 bg-card border-r border-border flex flex-col dark">
        <Sidebar />
      </div>

      {route.name == "thread" ? (
        <ChatArea
          messages={dummyMessages}
          onSendMessage={handleSendMessage}
          threadId={route.params.threadId as Id<"threads">}
        />
      ) : null}

      {/* Right Sidebar - Task Details */}
      {currentTaskId && (
        <div className="w-80 bg-background border-l border-border p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Task Details</h3>
            <button
              onClick={() =>
                routes.thread({ threadId: currentThreadId! }).push()
              }
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
