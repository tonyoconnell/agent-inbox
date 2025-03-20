import * as React from "react";
import { ThreadList } from "./ThreadList";
import { AgentList } from "./AgentList";
import { Button } from "../../ui/button";
import { UserProfile } from "@/components/authenticated/threads/UserProfile";

type Tab = "threads" | "agents";

export const Sidebar = () => {
  const [activeTab, setActiveTab] = React.useState<Tab>("threads");

  return (
    <div className="flex flex-col h-full border-r">
      <div className="h-24 border-b border-border relative overflow-hidden">
        <img
          src="/logo-white.png"
          alt="Agent Inbox"
          className="absolute -right-0 -top-2 h-32 object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card to-transparent" />
      </div>
      <div className="flex border-b">
        <Button
          variant={activeTab === "threads" ? "default" : "ghost"}
          className="flex-1 rounded-none text-primary-foreground"
          onClick={() => setActiveTab("threads")}
        >
          Threads
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
          {activeTab === "threads" ? <ThreadList /> : <AgentList />}
        </div>
      </div>
      <UserProfile />
    </div>
  );
};
