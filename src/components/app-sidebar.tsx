import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { BookOpen, Users, Wrench, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/components/authenticated/conversations/UserProfile";

export interface SidebarNavItem {
  key: string;
  label: string;
  icon: React.ElementType;
  count?: number;
}

interface AppSidebarProps {
  user?: { name: string; email: string; image?: string };
  navItems: SidebarNavItem[];
  activeNav: string;
  onNavChange: (key: string) => void;
}

export function AppSidebar({
  user = { name: "John Doe", email: "john@example.com" },
  navItems,
  activeNav,
  onNavChange,
}: AppSidebarProps) {
  return (
    <Sidebar className="border-r border-border shadow-sm backdrop-blur-sm bg-sidebar/80 min-h-screen flex flex-col">
      <SidebarHeader>
        <div className="flex flex-col items-center justify-center py-6">
          <img src="/logo.svg" alt="Logo" className="h-10 w-auto mb-2" />
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground px-2 pb-2">Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-1">
              {navItems.map((item) => {
                const active = activeNav === item.key;
                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton asChild isActive={active}>
                      <button
                        className={`flex items-center gap-3 w-full px-2 py-2 rounded-lg transition-colors relative
                          ${active ? "bg-accent/80 text-accent-foreground font-semibold shadow border-l-4 border-primary" : "hover:bg-muted/60 text-muted-foreground"}
                        `}
                        style={active ? { boxShadow: "0 2px 8px rgba(0,0,0,0.08)" } : {}}
                        onClick={() => onNavChange(item.key)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                        {typeof item.count === "number" && item.count > 0 && (
                          <Badge
                            variant={active ? "default" : "secondary"}
                            className="ml-auto bg-muted text-white text-xs rounded-full px-2 py-0.5 border-none"
                          >
                            {item.count}
                          </Badge>
                        )}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
} 