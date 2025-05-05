import * as React from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import { AuthenticatedContent } from "./components/authenticated/AuthenticatedContent";
import { UnauthenticatedContent } from "./components/unauthenticated/UnauthenticatedContent";
import { toast, Toaster } from "sonner";
import { RouteProvider } from "./routes";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function App() {
  return (
    <RouteProvider>
      <ConvexQueryCacheProvider>
        <SidebarProvider>
          <div className="min-h-screen bg-background flex">
            <main className="flex-1 min-w-0">
              <Authenticated>
                <AuthenticatedContent />
              </Authenticated>
              <Unauthenticated>
                <UnauthenticatedContent />
              </Unauthenticated>
            </main>
          </div>
          <Toaster />
        </SidebarProvider>
      </ConvexQueryCacheProvider>
    </RouteProvider>
  );
}
