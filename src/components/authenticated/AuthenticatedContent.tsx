import * as React from "react";
import { ChatArea } from "./chat/ChatArea";
import { ConversationList as MainConversationList } from "../authenticated/conversations/ConversationList";
import { AgentList as MainAgentList } from "../authenticated/sidebar/AgentList";
import { useRoute, useCurrentConversationId, useCurrentAgentId } from "../../routes";
import { Id } from "convex/_generated/dataModel";
import { AgentProfile } from "./agents/AgentProfile";
import { UserProfile } from "../authenticated/conversations/UserProfile";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, Wrench, User, Search } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toolDefinitions } from "../../../shared/tools";
import { useState } from "react";

const MIDDLE_TABS = [
  { value: "now", label: "Now" },
  { value: "top", label: "Top" },
  { value: "todo", label: "ToDo" },
  { value: "done", label: "Done" },
];

const CATEGORY_TAGS = [
  { label: "Meeting", variant: "default", className: "bg-gray-900 text-white hover:bg-gray-800 rounded-full px-3 py-1 text-xs font-medium" },
  { label: "Work", variant: "outline", className: "bg-white border border-gray-300 text-gray-700 rounded-full px-3 py-1 text-xs font-medium" },
];

export const AuthenticatedContent: React.FC = () => {
  const route = useRoute();
  const currentConversationId = useCurrentConversationId();
  const currentAgentId = useCurrentAgentId();
  const [activeNav, setActiveNav] = React.useState<"conversations" | "agents">("conversations");
  const [middleTab, setMiddleTab] = React.useState("now");
  const me = useQuery(api.users.queries.getMe);
  const conversations = useQuery(api.conversations.queries.listMine) ?? [];
  const agents = useQuery(api.agents.queries.listMine) ?? [];
  // Tools are static in shared/tools
  const toolsCount = Object.keys(toolDefinitions).length;
  // People: set to 1 (current user) for now
  const peopleCount = 1;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const SIDEBAR_NAV = [
    { key: "conversations", label: "Conversations", icon: BookOpen, count: conversations.length },
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
    <div className="flex h-screen bg-[#101014] text-white">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-200 flex flex-col bg-[#18181b] border-r border-[#23232a] ${
          sidebarCollapsed ? "w-14" : "w-56"
        }`}
      >
        {/* Collapse/Expand Button */}
        <button
          className="absolute top-4 right-2 z-10 p-1 rounded hover:bg-[#23232a]"
          onClick={() => setSidebarCollapsed((c) => !c)}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="sr-only">Toggle Sidebar</span>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {sidebarCollapsed ? (
              <path d="M9 18l6-6-6-6" />
            ) : (
              <path d="M15 6l-6 6 6 6" />
            )}
          </svg>
        </button>
        {/* User Profile at top */}
        {!sidebarCollapsed && (
          <div className="flex items-center gap-3 px-6 py-5 border-b border-[#23232a]">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{me?.name?.[0] ?? "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-base truncate">{me?.name ?? "John Doe"}</span>
              <span className="text-xs text-gray-400 truncate">{me?.email ?? "m@example.com"}</span>
            </div>
          </div>
        )}
        {/* Navigation */}
        <nav className="flex-1 px-2 py-4">
          {SIDEBAR_NAV.map((item) => (
            <button
              key={item.key}
              className={`flex items-center justify-center ${
                sidebarCollapsed ? "px-0" : "justify-between w-full px-4"
              } py-2 rounded-lg mb-1 transition-colors text-left ${
                activeNav === item.key ? "bg-[#23232a] text-white" : "text-gray-300 hover:bg-[#23232a]"
              }`}
              onClick={() => {
                if (item.key === "conversations" || item.key === "agents") setActiveNav(item.key);
              }}
            >
              <div className="flex items-center gap-3 justify-center w-full">
                <item.icon className="h-5 w-5" />
                {!sidebarCollapsed && <span className="font-medium text-base">{item.label}</span>}
              </div>
              {!sidebarCollapsed && (
                <span className={`ml-2 text-xs font-semibold rounded-full px-2 py-0.5 ${activeNav === item.key ? "bg-white text-[#18181b]" : "bg-[#23232a] text-gray-300"}`}>{item.count}</span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Middle Panel */}
      <main className="transition-all duration-200 flex flex-col bg-[#18181b] border-r border-[#23232a]" style={{ width: sidebarCollapsed ? '20vw' : '28vw', minWidth: sidebarCollapsed ? '14rem' : '22rem', maxWidth: sidebarCollapsed ? '24rem' : '28rem' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <span className="text-lg font-semibold">{activeNav === "conversations" ? "Conversations" : "Agents"}</span>
          {/* Filter buttons (example) */}
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="rounded-full px-4 py-1.5 text-xs font-medium text-gray-300 hover:bg-[#23232a]">All</Button>
            <Button variant="ghost" size="sm" className="rounded-full px-4 py-1.5 text-xs font-medium text-gray-300 hover:bg-[#23232a]">Unread</Button>
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
            {/* Header with actions, subject, sender, time can be added in ChatArea or here if needed */}
            <div className="flex-1 flex flex-col">
              <ChatArea conversationId={route.params.conversationId as Id<"conversations">} />
            </div>
          </>
        ) : route.name === "agent" && route.params.agentId ? (
          <AgentProfile agentId={route.params.agentId as Id<"agents">} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#101014]">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Welcome to Agent Inbox</h1>
              <p className="text-gray-500">
                Select a conversation or agent to get started
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
