import { useAuthActions } from "@convex-dev/auth/react";

export function SignInWithGithub() {
  const { signIn } = useAuthActions();
  return (
    <button onClick={() => void signIn("github")}>Sign in with GitHub</button>
  );
}
