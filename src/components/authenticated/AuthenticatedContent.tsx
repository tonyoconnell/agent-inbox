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
import { BookOpen, Users, Wrench, User, Search, Menu, X, Plus } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toolDefinitions } from "../../../shared/tools";
import { useState } from "react";
import { Dialog, DialogContent, DialogOverlay, DialogTrigger } from "@/components/ui/dialog";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { routes } from "@/routes";
import { useApiErrorHandler } from "../misc/errors";
import { UsersPage } from "./users/UsersPage";
import ToolList from "./sidebar/ToolList";
import PeopleList from "./sidebar/PeopleList";
import { TaskList } from "./sidebar/TaskList";

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

export function AuthenticatedContent() {
  const route = useRoute();
  const currentConversationId = useCurrentConversationId();
  const currentAgentId = useCurrentAgentId();
  const [activeNav, setActiveNav] = React.useState<"conversations" | "agents" | "tools" | "people">("conversations");
  const [middleTab, setMiddleTab] = React.useState("now");
  const me = useQuery(api.users.queries.getMe);
  const conversations = useQuery(api.conversations.queries.listMine) ?? [];
  const agents = useQuery(api.agents.queries.listAll) ?? [];
  const toolsCount = Object.keys(toolDefinitions).length;
  const peopleCount = 0; // You can update this to the actual count if needed
  const createConversation = useMutation(api.conversations.mutations.create);
  const onApiError = useApiErrorHandler();

  // Auto-switch sidebar nav if navigating directly
  React.useEffect(() => {
    if (route.name === "conversation") setActiveNav("conversations");
    if (route.name === "agent") setActiveNav("agents");
    if (route.name === "tools") setActiveNav("tools");
    if (route.name === "people") setActiveNav("people");
  }, [route.name]);

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

  return (
    <SidebarProvider>
      <div className="flex flex-col md:flex-row h-screen w-full bg-[#101014] text-white">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between px-2 py-3 bg-sidebar border-b border-[#23232a]">
          <SidebarTrigger />
          <a href="/" aria-label="Home">
            <img src="/logo.svg" alt="Logo" className="h-8" />
          </a>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => {
              void createConversation({ title: "New Conversation" })
                .then((conversationId) => routes.conversation({ conversationId }).push())
                .catch(onApiError);
            }}
            aria-label="New Conversation"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        {/* Sidebar trigger for mobile */}
        <div className="md:hidden p-2 hidden">
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
          onNavChange={(key) => {
            setActiveNav(key as "conversations" | "agents" | "tools" | "people");
            if (key === "tools") routes.tools().push();
            if (key === "conversations") routes.home().push();
            if (key === "agents") routes.home().push(); // or navigate to the agent list route if available
            if (key === "people") routes.profile().push(); // or create a /people route if desired
          }}
        />
        {/* Middle Panel */}
        <main
          className="flex flex-col bg-[#18181b] border-r border-[#23232a] w-full md:w-[22.4rem] min-w-0 transition-all duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <span className="text-lg font-semibold">
              {activeNav === "conversations"
                ? "Conversations"
                : activeNav === "agents"
                ? "Agents"
                : activeNav === "tools"
                ? "Tools"
                : activeNav === "people"
                ? "People"
                : ""}
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
          {/* List of conversations/agents/tools/people as cards */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 scrollbar-thin scrollbar-thumb-[#18181b] scrollbar-track-[#101014]">
            {route.name === "tasks" ? <TaskList /> : null}
            {(route.name === "home" || route.name === "conversation") ? <MainConversationList /> : null}
            {route.name === "agent" ? <MainAgentList /> : null}
            {route.name === "tools" ? <ToolList /> : null}
            {route.name === "profile" ? <PeopleList /> : null}
          </div>
        </main>
        {/* Right Panel */}
        <section className="flex-1 min-w-0 flex flex-col bg-sidebar">
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
            <div className="flex-1 flex items-center justify-center bg-sidebar">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">
                  Welcome to ONE
                </h1>
                <p className="text-gray-500">
                  Select or start a new conversation or agent
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </SidebarProvider>
  );
}
