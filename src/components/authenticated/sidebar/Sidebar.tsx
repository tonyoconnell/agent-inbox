import * as React from "react";
import { ConversationList } from "./ConversationList";
import { AgentList } from "./AgentList";
import { Button } from "../../ui/button";
import { UserProfile } from "@/components/authenticated/conversations/UserProfile";
import { routes } from "@/routes";
import { api } from "@/../convex/_generated/api";
import { useQuery } from "convex/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Tab = "conversations" | "agents";

export const Sidebar = () => {
  const [activeTab, setActiveTab] = React.useState<Tab>("conversations");
  const me = useQuery(api.users.queries.getMe);

  return (
    <div className="flex flex-col h-full border-r">
      <a
        href={routes.profile().href}
        className="flex items-center gap-2 px-4 py-3 hover:bg-accent/30 transition group"
        style={{ minHeight: 56 }}
        onClick={(e) => {
          e.preventDefault();
          routes.profile().push();
        }}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={me?.image} />
          <AvatarFallback>{me?.name?.[0] ?? "U"}</AvatarFallback>
        </Avatar>
        <span className="font-medium truncate group-hover:underline">
          {me?.name || "User"}
        </span>
      </a>
      <div className="h-16 border-b border-border flex items-center px-4">
        <img
          src="/logo.svg"
          alt="ONE"
          className="h-[40px] w-auto object-contain"
        />
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
      <a
        href={routes.profile().href}
        className="block rounded transition hover:ring-2 hover:ring-primary/40 hover:bg-accent/30"
      >
        <UserProfile />
      </a>
    </div>
  );
};
