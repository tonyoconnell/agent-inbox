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
          <Card className="w-full max-w-md relative overflow-hidden">
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
                <CardHeader className="pb-0">
                  <CardTitle className="text-2xl text-center">
                    Welcome Back
                  </CardTitle>
                  <CardDescription className="text-center mb-6">
                    Sign in to continue to Agent Write
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4 py-6">
                  <SignInWithGithub />
                  <div className="flex items-center gap-4 w-full my-2">
                    <div className="h-px bg-gray-300 flex-1" />
                    <span className="text-gray-500 text-sm">or</span>
                    <div className="h-px bg-gray-300 flex-1" />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
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
                <CardHeader className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-4"
                    onClick={() => setShowPasswordSignIn(false)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="text-2xl text-center mt-2">
                    {authMode === "signIn"
                      ? "Sign in with Email"
                      : "Create an Account"}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {authMode === "signIn"
                      ? "Enter your email and password to sign in"
                      : "Enter your details to create a new account"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
