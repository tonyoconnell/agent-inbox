import * as React from "react";
import { ConversationList } from "./ConversationList";
import { AgentList } from "./AgentList";
import { Button } from "../../ui/button";
import { UserProfile } from "@/components/authenticated/conversations/UserProfile";

type Tab = "conversations" | "agents";

export const Sidebar = () => {
  const [activeTab, setActiveTab] = React.useState<Tab>("conversations");

  return (
    <div className="flex flex-col h-full border-r">
      <div className="h-24 border-b border-border relative overflow-hidden">
        <img
          src="/logo.svg"
          alt="ONE"
          className="absolute -right-0 -top-2 h-32 object-cover p-5"
        />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card to-transparent" />
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
          {activeTab === "conversations" ? <ConversationList /> : <AgentList />}
        </div>
      </div>
      <UserProfile />
    </div>
  );
};
