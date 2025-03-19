import * as React from "react";
import { SignOutButton } from "./SignOutButton";
import { Content } from "./Content";

export const AuthenticatedContent: React.FC = () => (
  <>
    <header className="sticky top-0 z-10 bg-card p-4 border-b border-border shadow-sm flex flex-row justify-between items-center">
      <img src={"/logo-no-bg.png"} alt="Agent Write" className="h-8" />
      <SignOutButton />
    </header>
    <main className="p-8 flex flex-col gap-16 max-w-4xl mx-auto">
      <Content />
    </main>
  </>
);
