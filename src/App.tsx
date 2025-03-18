import * as React from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignOutButton } from "./components/SignOutButton";
import { SignInForm } from "./components/SignInForm";
import { Content } from "./components/Content";

export default function App() {
  return (
    <div className="min-h-screen bg-pastel-50">
      <header className="sticky top-0 z-10 bg-pastel-100 p-4 border-b border-pastel-200 shadow-sm flex flex-row justify-between items-center">
        <h1 className="text-pastel-900 font-semibold text-xl">
          Agentic Writing
        </h1>
        <SignOutButton />
      </header>
      <main className="p-8 flex flex-col gap-16 max-w-4xl mx-auto">
        <Authenticated>
          <Content />
        </Authenticated>
        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>
      </main>
    </div>
  );
}
