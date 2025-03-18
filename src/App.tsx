import * as React from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignOutButton } from "./components/SignOutButton";
import { SignInForm } from "./components/SignInForm";
import { Content } from "./components/Content";

export default function App() {
  return (
    <>
      <header className="sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
        Convex + React + Convex Auth
        <SignOutButton />
      </header>
      <main className="p-8 flex flex-col gap-16">
        <Authenticated>
          <Content />
        </Authenticated>
        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>
      </main>
    </>
  );
}
