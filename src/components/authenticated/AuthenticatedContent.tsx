import * as React from "react";
import { ChatArea } from "./chat/ChatArea";
import { ConversationList as MainConversationList } from "../authenticated/conversations/ConversationList";
import { AgentList as MainAgentList } from "../authenticated/sidebar/AgentList";
import {
  useRoute,
  useCurrentConversationId,
  useCurrentAgentId,
} from "../../routes";
import { Id } from "convex/_generated/dataModel";
import { AgentProfile } from "./agents/AgentProfile";
import { UserProfile } from "../authenticated/conversations/UserProfile";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, Wrench, User, Search, Menu, X } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toolDefinitions } from "../../../shared/tools";
import { useState } from "react";
import { Dialog, DialogContent, DialogOverlay, DialogTrigger } from "@/components/ui/dialog";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const MIDDLE_TABS = [
  { value: "now", label: "Now" },
  { value: "top", label: "Top" },
  { value: "todo", label: "ToDo" },
  { value: "done", label: "Done" },
];

const CATEGORY_TAGS = [
  {
    label: "Meeting",
    variant: "default",
    className:
      "bg-gray-900 text-white hover:bg-gray-800 rounded-full px-3 py-1 text-xs font-medium",
  },
  {
    label: "Work",
    variant: "outline",
    className:
      "bg-white border border-gray-300 text-gray-700 rounded-full px-3 py-1 text-xs font-medium",
  },
];

export const AuthenticatedContent: React.FC = () => {
  const route = useRoute();
  const currentConversationId = useCurrentConversationId();
  const currentAgentId = useCurrentAgentId();
  const [activeNav, setActiveNav] = React.useState<"conversations" | "agents">(
    "conversations",
  );
  const [middleTab, setMiddleTab] = React.useState("now");
  const me = useQuery(api.users.queries.getMe);
  const conversations = useQuery(api.conversations.queries.listMine) ?? [];
  const agents = useQuery(api.agents.queries.listMine) ?? [];
  // Tools are static in shared/tools
  const toolsCount = Object.keys(toolDefinitions).length;
  // People: set to 1 (current user) for now
  const peopleCount = 1;

  const SIDEBAR_NAV = [
    {
      key: "conversations",
      label: "Conversations",
      icon: BookOpen,
      count: conversations.length,
    },
    { key: "agents", label: "Agents", icon: Users, count: agents.length },
    { key: "tools", label: "Tools", icon: Wrench, count: toolsCount },
    { key: "people", label: "People", icon: User, count: peopleCount },
  ];

  // Auto-switch sidebar nav if navigating directly
  React.useEffect(() => {
    if (route.name === "conversation") setActiveNav("conversations");
    if (route.name === "agent") setActiveNav("agents");
  }, [route.name]);

  return (
    <SidebarProvider>
      <div className="flex flex-col md:flex-row h-screen bg-[#101014] text-white">
        {/* Sidebar trigger for mobile */}
        <div className="md:hidden p-2">
          <SidebarTrigger />
        </div>
        {/* Sidebar: visible on all screens via shadcn/ui */}
        <AppSidebar
          user={{
            name: me?.name ?? "John Doe",
            email: me?.email ?? "john@example.com",
            image: me?.image,
          }}
          navItems={SIDEBAR_NAV}
          activeNav={activeNav}
          onNavChange={(key) => setActiveNav(key as "conversations" | "agents")}
        />
        {/* Middle Panel */}
        <main
          className="flex flex-col bg-[#18181b] border-r border-[#23232a] w-full md:w-[22.4rem] min-w-0 max-w-full md:max-w-[22.4rem] transition-all duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <span className="text-lg font-semibold">
              {activeNav === "conversations" ? "Conversations" : "Agents"}
            </span>
            {/* Filter buttons (example) */}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full px-4 py-1.5 text-xs font-medium text-gray-300 hover:bg-[#23232a]"
              >
                All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full px-4 py-1.5 text-xs font-medium text-gray-300 hover:bg-[#23232a]"
              >
                Unread
              </Button>
            </div>
          </div>
          {/* List of conversations/agents as cards */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 scrollbar-thin scrollbar-thumb-[#18181b] scrollbar-track-[#101014]">
            {activeNav === "conversations" ? <MainConversationList /> : null}
            {activeNav === "agents" ? <MainAgentList /> : null}
          </div>
        </main>
        {/* Right Panel */}
        <section className="flex-1 flex flex-col min-w-0 bg-[#101014]">
          {route.name === "conversation" && route.params.conversationId ? (
            <>
              <div className="flex-1 flex flex-col">
                <ChatArea
                  conversationId={
                    route.params.conversationId as Id<"conversations">
                  }
                />
              </div>
            </>
          ) : route.name === "agent" && route.params.agentId ? (
            <AgentProfile agentId={route.params.agentId as Id<"agents">} />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-[#101014]">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">
                  Welcome to Agent Inbox
                </h1>
                <p className="text-gray-500">
                  Select a conversation or agent to get started
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </SidebarProvider>
  );
};
