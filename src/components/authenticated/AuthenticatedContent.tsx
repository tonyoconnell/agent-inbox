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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookOpen, Users, Wrench, User, Search, Mail } from "lucide-react";
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
  { label: "Meeting", variant: "default", className: "bg-gray-800 text-white hover:bg-gray-700" },
  { label: "Work", variant: "outline", className: "" },
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
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-64 border-r p-4 flex flex-col">
        {/* User profile at top */}
        <div className="flex items-center space-x-2 mb-6">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{me?.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
          <span className="font-medium truncate">{me?.name ?? "Anthony O'Connell"}</span>
        </div>
        {/* Navigation menu */}
        <NavigationMenu orientation="vertical" className="w-full mb-4">
          <NavigationMenuList className="flex flex-col space-y-2 w-full">
            {SIDEBAR_NAV.map((item) => (
              <NavigationMenuItem
                key={item.key}
                className={`flex justify-between w-full px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer ${
                  activeNav === item.key ? "bg-gray-100 font-semibold" : ""
                }`}
                onClick={() => {
                  if (item.key === "conversations" || item.key === "agents") setActiveNav(item.key);
                }}
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </div>
                <Badge variant="secondary" className="bg-gray-100">{item.count}</Badge>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        {/* Removed Conversations/Agents tab buttons */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {activeNav === "conversations" ? <MainConversationList /> : null}
            {activeNav === "agents" ? <MainAgentList /> : null}
          </div>
        </div>
      </div>

      {/* Middle Panel */}
      <div className="w-1/3 border-r flex flex-col min-w-[24rem] max-w-[28rem] bg-card">
        <div className="px-4 pt-4">
          <Tabs value={middleTab} onValueChange={setMiddleTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              {MIDDLE_TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Search" className="pl-10 bg-gray-50 border-gray-200" />
          </div>
          <div className="flex space-x-2 mb-4">
            {CATEGORY_TAGS.map((tag) => (
              <Badge key={tag.label} variant={tag.variant as any} className={tag.className}>{tag.label}</Badge>
            ))}
          </div>
        </div>
        {/* Dynamic conversation/agent list as before, but you may want to style ConversationItem/AgentItem as cards/previews here for a more modern look */}
        <div className="flex-1 overflow-y-auto">
          {activeNav === "conversations" ? <MainConversationList /> : null}
          {activeNav === "agents" ? <MainAgentList /> : null}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {route.name === "conversation" && route.params.conversationId ? (
          <>
            <div className="flex-1 flex flex-col">
              <ChatArea conversationId={route.params.conversationId as Id<"conversations">} />
            </div>
            {/* Action buttons and recipient tags at the bottom */}
            <div className="border-t p-4 flex justify-between items-center">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Save</Button>
                <Button variant="outline" size="sm">Reply</Button>
                <Button variant="outline" size="sm">Forward</Button>
                <Button variant="outline" size="sm">Complete</Button>
              </div>
              <Button variant="outline" size="sm">Share</Button>
            </div>
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Badge variant="outline" className="bg-gray-100">@Teacher One</Badge>
                <Badge variant="outline" className="bg-gray-100">@Anthony O'Connell</Badge>
              </div>
            </div>
          </>
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
