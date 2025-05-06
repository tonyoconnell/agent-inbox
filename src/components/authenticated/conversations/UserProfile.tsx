import * as React from "react";
import { Card } from "../../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { SignOutButton } from "../SignOutButton";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";
import { Button } from "../../ui/button";
import { routes } from "@/routes";
import { useAuthActions } from "@convex-dev/auth/react";

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      className="w-full text-primary-foreground hover:bg-accent"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="ml-2">{isDark ? "Light mode" : "Dark mode"}</span>
    </Button>
  );
};

export const UserProfile: React.FC = () => {
  const me = useQuery(api.users.queries.getMe);
  const { signOut } = useAuthActions();
  return (
    <div className="flex flex-col gap-2">
      <Card className="m-2 p-2 bg-[#18181b] border-accent/50">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={me?.image} />
            <AvatarFallback>{me?.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-primary-foreground truncate">
              {me?.name ? (
                <a
                  href={routes.profile().href}
                  className="hover:underline hover:text-primary transition-colors"
                >
                  {me.name}
                </a>
              ) : (
                me?.name
              )}
            </div>
            <div className="text-xs text-muted-foreground/80 truncate">
              {me?.email}
            </div>
          </div>
        </div>
      </Card>
      <div className="flex flex-col gap-2 px-2">
        <Button
          variant="ghost"
          className="w-full text-muted-foreground text-xs p-0 h-6 hover:underline bg-transparent border-none shadow-none"
          onClick={() => {
            void signOut();
          }}
        >
          Sign out
        </Button>
      </div>
    </div>
  );
};
