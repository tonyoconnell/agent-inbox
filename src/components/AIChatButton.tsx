import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AIChatButtonProps {
    variant?: "default" | "outline";
    size?: "default" | "sm" | "lg";
    className?: string;
    children: React.ReactNode;
    onOpenPanel: () => void;
}

export function AIChatButton({
    variant = "default",
    size = "lg",
    className = "",
    children,
    onOpenPanel
}: AIChatButtonProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
        >
            <Button
                variant={variant}
                size={size}
                className={cn(
                    "relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
                    "shadow-[0_0_20px_rgba(66,153,225,0.5)] hover:shadow-[0_0_25px_rgba(66,153,225,0.6)]",
                    "transform hover:scale-105 transition-all duration-300",
                    "after:absolute after:inset-0 after:bg-gradient-to-r after:from-white/10 after:via-transparent after:to-transparent",
                    "after:animate-shimmer",
                    className
                )}
                onClick={onOpenPanel}
            >
                {children}
            </Button>
        </motion.div>
    );
}