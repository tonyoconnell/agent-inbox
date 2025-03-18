import * as React from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignOutButton } from "./components/SignOutButton";
import { SignInWithGithub } from "./SignInWithGithub";
import { SignInWithPassword } from "./SignInWithPassword";
import { Content } from "./components/Content";
import { ChevronRight, ArrowLeft, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./components/ui/card";
import { Button } from "./components/ui/button";

export default function App() {
  const [showPasswordSignIn, setShowPasswordSignIn] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<"signIn" | "signUp">("signIn");

  return (
    <div className="min-h-screen bg-background">
      <Authenticated>
        <>
          <header className="sticky top-0 z-10 bg-card p-4 border-b border-border shadow-sm flex flex-row justify-between items-center">
            <h1 className="text-foreground font-semibold text-xl">
              Agent Write
            </h1>
            <SignOutButton />
          </header>
          <main className="p-8 flex flex-col gap-16 max-w-4xl mx-auto">
            <Content />
          </main>
        </>
      </Authenticated>
      <Unauthenticated>
        <main className="min-h-screen flex flex-col items-center justify-center p-8">
          <div className="mb-8 flex flex-col items-center">
            <img
              src="/logo.png"
              alt="Agent Write Logo"
              className="w-72 h-auto mb-2"
            />
            <p className="text-neutral-700 text-lg font-medium mt-2">
              Write with AI
            </p>
          </div>
          <Card className="w-full max-w-md relative overflow-hidden shadow-md border-neutral-200">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: showPasswordSignIn
                  ? "translateX(-100%)"
                  : "translateX(0)",
              }}
            >
              {/* First page - GitHub sign-in */}
              <div className="min-w-full shrink-0">
                <CardContent className="flex flex-col items-center gap-4 p-6">
                  <SignInWithGithub />
                  <div className="flex items-center gap-4 w-full my-2">
                    <div className="h-px bg-neutral-300 flex-1" />
                    <span className="text-neutral-700 text-sm font-medium px-2">
                      or
                    </span>
                    <div className="h-px bg-neutral-300 flex-1" />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full h-10"
                    onClick={() => setShowPasswordSignIn(true)}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Continue with Email
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Button>
                </CardContent>
              </div>

              {/* Second page - Password sign-in */}
              <div className="min-w-full shrink-0">
                <CardHeader className="relative pb-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-4"
                    onClick={() => setShowPasswordSignIn(false)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="text-xl text-center mt-2">
                    {authMode === "signIn"
                      ? "Sign in with Email"
                      : "Create an Account"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <SignInWithPassword onModeChange={setAuthMode} />
                </CardContent>
              </div>
            </div>
          </Card>
        </main>
      </Unauthenticated>
    </div>
  );
}
