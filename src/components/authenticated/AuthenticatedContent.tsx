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

const SIDEBAR_NAV = [
  { key: "conversations", label: "Conversations", icon: BookOpen, count: 128 },
  { key: "agents", label: "Agents", icon: Users, count: 20 },
  { key: "tools", label: "Tools", icon: Wrench, count: 10 },
  { key: "people", label: "People", icon: User, count: 128 },
];

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

  // Auto-switch sidebar nav if navigating directly
  React.useEffect(() => {
    if (route.name === "conversation") setActiveNav("conversations");
    if (route.name === "agent") setActiveNav("agents");
  }, [route.name]);

  // --- Layout ---
  return (
    <div className="flex h-screen bg-[#101014] text-white">
      {/* Sidebar */}
      <div className="w-72 flex flex-col justify-between bg-[#18181b] border-r border-[#23232a]">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6">
            <span className="font-bold text-lg tracking-wide">ONE</span>
          </div>
          {/* Navigation */}
          <nav className="px-2">
            {SIDEBAR_NAV.map((item) => (
              <button
                key={item.key}
                className={`flex items-center justify-between w-full px-4 py-2 rounded-lg mb-1 transition-colors text-left ${activeNav === item.key ? "bg-[#23232a] text-white" : "text-gray-300 hover:bg-[#23232a]"}`}
                onClick={() => {
                  if (item.key === "conversations" || item.key === "agents") setActiveNav(item.key);
                }}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium text-base">{item.label}</span>
                </div>
                <span className={`ml-2 text-xs font-semibold rounded-full px-2 py-0.5 ${activeNav === item.key ? "bg-white text-[#18181b]" : "bg-[#23232a] text-gray-300"}`}>{item.count}</span>
              </button>
            ))}
          </nav>
          {/* Grouped Conversations */}
          <div className="mt-8 px-2">
            {/* Example groups, replace with dynamic grouping if available */}
            <div className="mb-4">
              <div className="uppercase text-xs text-gray-500 mb-2 px-2">Recent</div>
              {/* Render recent conversations here */}
              {/* ... */}
            </div>
            <div className="mb-4">
              <div className="uppercase text-xs text-gray-500 mb-2 px-2">Previous 7 Days</div>
              {/* Render previous 7 days conversations here */}
              {/* ... */}
            </div>
            <div className="mb-4">
              <div className="uppercase text-xs text-gray-500 mb-2 px-2">Previous 30 Days</div>
              {/* Render previous 30 days conversations here */}
              {/* ... */}
            </div>
            <div className="mb-4">
              <div className="uppercase text-xs text-gray-500 mb-2 px-2">Previous Years</div>
              {/* Render previous years conversations here */}
              {/* ... */}
            </div>
          </div>
        </div>
        {/* User Profile at bottom */}
        <div className="flex items-center gap-3 px-6 py-5 border-t border-[#23232a] bg-[#16161a]">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{me?.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-sm truncate">{me?.name ?? "John Doe"}</span>
            <span className="text-xs text-gray-400 truncate">{me?.email ?? "m@example.com"}</span>
          </div>
        </div>
      </div>

      {/* Middle Panel */}
      <div className="w-1/3 min-w-[24rem] max-w-[28rem] bg-[#18181b] border-r border-[#23232a] flex flex-col">
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-semibold">{activeNav === "conversations" ? "Conversations" : "Agents"}</span>
          </div>
          {/* Tabs and search can be added here if needed */}
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {activeNav === "conversations" ? <MainConversationList /> : null}
          {activeNav === "agents" ? <MainAgentList /> : null}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#101014]">
        {route.name === "conversation" && route.params.conversationId ? (
          <>
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
      </div>
    </div>
  );
};
