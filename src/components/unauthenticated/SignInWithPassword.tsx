import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "../ui/button";
import { toast } from "sonner";

export function SignInWithPassword({
  onModeChange,
}: {
  onModeChange?: (mode: "signIn" | "signUp") => void;
}) {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signUp" | "signIn">("signIn");
  const [loading, setLoading] = useState(false);

  const toggleStep = (newStep: "signUp" | "signIn") => {
    setStep(newStep);
    if (onModeChange) onModeChange(newStep);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="text-center"></div>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          void (async () => {
            setLoading(true);
            const formData = new FormData(e.currentTarget);
            try {
              await signIn("password", formData);
            } catch (err: any) {
              // Try to show a helpful error message
              let message = err?.message || err?.toString() || "Unknown error";
              if (message.includes("_id")) {
                message =
                  step === "signUp"
                    ? "Account creation failed. This email may already be in use."
                    : "Sign in failed. Please check your email and password.";
              }
              toast.error(message);
            } finally {
              setLoading(false);
            }
          })();
        }}
      >
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="p-2 border rounded bg-background"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="p-2 border rounded bg-background"
        />
        <input name="flow" type="hidden" value={step} />
        <div className="flex flex-col gap-2">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? step === "signIn"
                ? "Signing in..."
                : "Creating account..."
              : step === "signIn"
              ? "Sign in"
              : "Sign up"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="text-sm"
            onClick={() => toggleStep(step === "signIn" ? "signUp" : "signIn")}
            disabled={loading}
          >
            {step === "signIn"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </Button>
        </div>
      </form>
    </div>
  );
}
