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
} from "@/components/ui/sidebar";
import { BookOpen, Users, Wrench, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-4 py-4">
          <Avatar className="w-10 h-10">
            {/* If you have user.image, use AvatarImage */}
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-base truncate">{user.name}</span>
            <span className="text-xs text-gray-400 truncate">{user.email}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeNav === item.key}
                  >
                    <button
                      className={`flex items-center w-full justify-between px-2 py-2 rounded-lg transition-colors ${
                        activeNav === item.key ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                      }`}
                      onClick={() => onNavChange(item.key)}
                    >
                      <span className="flex items-center gap-2">
                        <item.icon className="mr-2" />
                        <span>{item.label}</span>
                      </span>
                      {typeof item.count === "number" && (
                        <Badge
                          variant={activeNav === item.key ? "default" : "secondary"}
                          className="ml-2 text-xs font-semibold rounded-full px-2 py-0.5"
                        >
                          {item.count}
                        </Badge>
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* Optionally add <SidebarFooter> here */}
    </Sidebar>
  );
} 