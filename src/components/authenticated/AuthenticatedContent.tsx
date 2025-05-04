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
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-6 flex flex-col">
        <div className="flex items-center space-x-3 mb-8">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{me?.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-gray-900 truncate text-base">{me?.name ?? "Anthony O'Connell"}</span>
        </div>
        <NavigationMenu orientation="vertical" className="w-full">
          <NavigationMenuList className="flex flex-col gap-1 w-full">
            {SIDEBAR_NAV.map((item) => (
              <NavigationMenuItem
                key={item.key}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg cursor-pointer transition-colors
                  ${activeNav === item.key ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => {
                  if (item.key === "conversations" || item.key === "agents") setActiveNav(item.key);
                }}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium text-base">{item.label}</span>
                </div>
                <Badge variant="secondary" className={`rounded-full px-2 py-0.5 text-xs font-semibold ${activeNav === item.key ? "bg-white text-gray-900" : "bg-gray-200 text-gray-700"}`}>{item.count}</Badge>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Middle Panel */}
      <div className="w-1/3 min-w-[24rem] max-w-[28rem] bg-gray-100 border-r border-gray-200 flex flex-col">
        <div className="px-6 pt-6 pb-2">
          <Tabs value={middleTab} onValueChange={setMiddleTab} className="w-full">
            <TabsList className="flex gap-2 mb-4 bg-transparent">
              {MIDDLE_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-full px-4 py-1.5 text-sm font-medium data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 border border-gray-300 data-[state=active]:border-gray-900 shadow-sm"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="relative mb-4">
            <Search className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Search" className="pl-12 pr-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm focus:ring-2 focus:ring-gray-200" />
          </div>
          <div className="flex gap-2 mb-4">
            {CATEGORY_TAGS.map((tag) => (
              <span key={tag.label} className={tag.className}>{tag.label}</span>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {activeNav === "conversations" ? <MainConversationList /> : null}
          {activeNav === "agents" ? <MainAgentList /> : null}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {route.name === "conversation" && route.params.conversationId ? (
          <>
            <div className="flex-1 flex flex-col">
              <ChatArea conversationId={route.params.conversationId as Id<"conversations">} />
            </div>
            <div className="border-t border-gray-200 p-4 flex justify-between items-center bg-white">
              <div className="flex space-x-2">
                <button className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Save</button>
                <button className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Reply</button>
                <button className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Forward</button>
                <button className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Complete</button>
              </div>
              <button className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Share</button>
            </div>
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex gap-2">
                <span className="rounded-full bg-gray-100 border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700">@Teacher One</span>
                <span className="rounded-full bg-gray-100 border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700">@Anthony O'Connell</span>
              </div>
            </div>
          </>
        ) : route.name === "agent" && route.params.agentId ? (
          <AgentProfile agentId={route.params.agentId as Id<"agents">} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
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
