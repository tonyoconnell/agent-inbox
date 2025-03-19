import * as React from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import { AuthenticatedContent } from "./components/authenticated/AuthenticatedContent";
import { UnauthenticatedContent } from "./components/unauthenticated/UnauthenticatedContent";
import { toast, Toaster } from "sonner";
import { ErrorBoundary } from "react-error-boundary";

export default function App() {
  return (
    // <ErrorBoundary fallback={<>error</>} onError={(e) => toast.error("error!")}>
    <>
      <div className="min-h-screen bg-background">
        <Authenticated>
          <AuthenticatedContent />
        </Authenticated>
        <Unauthenticated>
          <UnauthenticatedContent />
        </Unauthenticated>
      </div>
      <Toaster />
    </>
    // </ErrorBoundary>
  );
}
