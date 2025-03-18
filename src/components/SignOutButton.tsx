import * as React from "react";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

export const SignOutButton: React.FC = () => {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (!isAuthenticated) return null;

  return (
    <button
      className="bg-slate-200 dark:bg-slate-800 text-foreground rounded-md px-2 py-1"
      onClick={() => void signOut()}
    >
      Sign out
    </button>
  );
};
