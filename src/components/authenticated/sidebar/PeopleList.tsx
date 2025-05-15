import * as React from "react";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../../../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function PeopleList() {
  const users = useQuery(api.users.queries.listAll);
  const [search, setSearch] = React.useState("");

  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    const s = search.trim().toLowerCase();
    if (!s) return users;
    return users.filter(
      (u) => (u.name ?? "").toLowerCase().includes(s)
    );
  }, [users, search]);

  return (
    <>
      <div className="p-4">
        <Input
          placeholder="Search people..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="p-4 rounded cursor-pointer flex items-center gap-3 transition-colors hover:bg-accent mb-1"
          >
            <Avatar>
              {user.image ? (
                <AvatarImage src={user.image} alt={user.name ?? "?"} />
              ) : (
                <AvatarFallback>{(user.name ?? "?")[0]}</AvatarFallback>
              )}
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-primary-foreground truncate">
                {user.name ?? "Unknown"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
} 