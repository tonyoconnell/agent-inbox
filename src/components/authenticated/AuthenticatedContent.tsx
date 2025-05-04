import * as React from "react";
import { ChatArea } from "./chat/ChatArea";
import { ConversationList as MainConversationList } from "../authenticated/conversations/ConversationList";
import { AgentList as MainAgentList } from "../authenticated/sidebar/AgentList";
import { useRoute, useCurrentConversationId, useCurrentAgentId } from "../../routes";
import { Id } from "convex/_generated/dataModel";
import { AgentProfile } from "./agents/AgentProfile";
import { UserProfile } from "../authenticated/conversations/UserProfile";
import { Button } from "../ui/button";

// Sidebar tab state
const SIDEBAR_TABS = ["conversations", "agents"] as const;
type SidebarTab = typeof SIDEBAR_TABS[number];

export const AuthenticatedContent: React.FC = () => {
  const route = useRoute();
  const currentConversationId = useCurrentConversationId();
  const currentAgentId = useCurrentAgentId();
  const [activeTab, setActiveTab] = React.useState<SidebarTab>("conversations");

  // If navigating directly to a conversation or agent, auto-switch tab
  React.useEffect(() => {
    if (route.name === "conversation") setActiveTab("conversations");
    if (route.name === "agent") setActiveTab("agents");
  }, [route.name]);

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 border-r flex flex-col">
        <div className="h-16 border-b border-border flex items-center px-4">
          <img src="/logo.svg" alt="ONE" className="h-[40px] w-auto object-contain" />
        </div>
        <div className="flex border-b">
          <Button
            variant={activeTab === "conversations" ? "default" : "ghost"}
            className="flex-1 rounded-none text-primary-foreground"
            onClick={() => setActiveTab("conversations")}
          >
            Conversations
          </Button>
          <Button
            variant={activeTab === "agents" ? "default" : "ghost"}
            className="flex-1 rounded-none text-primary-foreground"
            onClick={() => setActiveTab("agents")}
          >
            Agents
          </Button>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {activeTab === "conversations" ? <MainConversationList /> : <MainAgentList />}
          </div>
        </div>
        <UserProfile />
      </div>

      {/* Middle Panel: List of conversations or agents */}
      <div className="w-96 border-r flex flex-col min-w-[24rem] max-w-[28rem] bg-card">
        {activeTab === "conversations" ? <MainConversationList /> : <MainAgentList />}
      </div>

      {/* Right Panel: Conversation body or agent profile */}
      <div className="flex-1 flex flex-col min-w-0">
        {route.name === "conversation" && route.params.conversationId ? (
          <ChatArea conversationId={route.params.conversationId as Id<"conversations">} />
        ) : route.name === "agent" && route.params.agentId ? (
          <AgentProfile agentId={route.params.agentId as Id<"agents">} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Welcome to Agent Inbox</h1>
              <p className="text-muted-foreground">
                Select a conversation or agent to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
