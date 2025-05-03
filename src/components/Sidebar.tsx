import { 
  ChevronUp, 
  BookOpen,
  Mic,
  MessageSquare,
  Code2,
  Globe,
  FileText,
  Lightbulb,
  GraduationCap,
  Users,
  Moon,
  Sun,
} from "lucide-react"
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Menu items for the main navigation
const think = [
  {
    title: "Chat",
    url: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Stream",
    url: "/stream",
    icon: BookOpen,
  },
  {
    title: "Podcast",
    url: "/podcast",
    icon: Mic,
  },
  {
    title: "Blog",
    url: "/blog",
    icon: MessageSquare,
  },
  {
    title: "Prompts",
    url: "/prompts",
    icon: MessageSquare,
  },
  {
    title: "Docs",
    url: "/docs",
    icon: FileText,
  },
]

const build = [
  {
    title: "Software",
    url: "/software",
    icon: Code2,
  },
  {
    title: "Websites",
    url: "/websites",
    icon: Globe,
  },
  {
    title: "Content",
    url: "/content",
    icon: FileText,
  },
]

const grow = [
  {
    title: "License",
    url: "/free-license",
    icon: FileText,
  },
  {
    title: "Framework",
    url: "/framework",
    icon: Lightbulb,
  },
  {
    title: "Education",
    url: "/education",
    icon: GraduationCap,
  },
  {
    title: "Partners",
    url: "/partners",
    icon: Users,
  },
]

export function AppSidebar() {
  return (
    <>
      {/* Header with ONE logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/">
                <img src="/icon.svg" alt="ONE" className="h-10 w-10" />
                <span>ONE</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Main sidebar content */}
      <SidebarContent className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
        <SidebarGroup>
          <SidebarGroupLabel>Think</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {think.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-10 w10" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Build</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {build.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-10 w-10" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Grow</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {grow.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-10 w-10" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with theme toggle */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Sun className="h-6 w-6 dark:hidden" />
                  <Moon className="hidden h-6 w-6 dark:block" />
                  <span>Theme</span>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}