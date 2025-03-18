import * as React from "react";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

export const SignOutButton: React.FC = () => {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (!isAuthenticated) return null;

  return (
    <button
      className="bg-pastel-200 hover:bg-pastel-300 text-pastel-800 rounded-md px-4 py-2 transition-colors duration-200"
      onClick={() => void signOut()}
    >
      Sign out
    </button>
  );
};
