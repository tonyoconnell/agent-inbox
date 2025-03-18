import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "./components/ui/button";
import { Github } from "lucide-react";

export function SignInWithGithub() {
  const { signIn } = useAuthActions();
  return (
    <Button
      onClick={() => void signIn("github")}
      variant="outline"
      className="w-full h-10 bg-black hover:bg-black/90 text-white border-black"
    >
      <Github className="mr-2 h-4 w-4" />
      Sign in with GitHub
    </Button>
  );
}
