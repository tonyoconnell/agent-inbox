import * as React from "react";
import { SignOutButton } from "./SignOutButton";
import { Content } from "./Content";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";

export const AuthenticatedContent: React.FC = () => {
  const me = useQuery(api.users.getMe);
  return (
    <>
      <header className="sticky top-0 z-10 bg-card p-4 border-b border-border shadow-sm flex flex-row justify-between items-center">
        <img src={"/logo.png"} alt="Agent Inbox" className="h-8" />
        <SignOutButton />
      </header>
      <main className="p-8 flex flex-col gap-16 max-w-4xl mx-auto">
        {me ? <Content me={me} /> : "loading.."}
      </main>
    </>
  );
};
