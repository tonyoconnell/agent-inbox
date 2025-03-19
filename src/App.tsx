import * as React from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import { AuthenticatedContent } from "./components/AuthenticatedContent";
import { UnauthenticatedContent } from "./components/UnauthenticatedContent";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Authenticated>
        <AuthenticatedContent />
      </Authenticated>
      <Unauthenticated>
        <UnauthenticatedContent />
      </Unauthenticated>
    </div>
  );
}
