import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

type ScrollButtonAlignment = "left" | "center" | "right";

interface ScrollButtonProps {
	onClick: () => void;
	alignment?: ScrollButtonAlignment;
	className?: string;
}

export function ScrollButton({
	onClick,
	alignment = "right",
	className,
}: ScrollButtonProps) {
	const alignmentClasses = {
		left: "left-4",
		center: "left-1/2 -translate-x-1/2",
		right: "right-4",
	};

	return (
		<Button
			variant="secondary"
			size="icon"
			className={cn(
				"absolute bottom-4 rounded-full shadow-lg hover:bg-secondary transition-all duration-300 animate-bounce-subtle opacity-90 hover:opacity-100 border border-primary/10",
				alignmentClasses[alignment],
				className,
			)}
			onClick={onClick}
		>
			<ChevronDown className="h-4 w-4" />
		</Button>
	);
}

interface ChatMessageAreaProps {
	children: ReactNode;
	className?: string;
	scrollButtonAlignment?: ScrollButtonAlignment;
}

export function ChatMessageArea({
	children,
	className,
	scrollButtonAlignment = "right",
}: ChatMessageAreaProps) {
	const [containerRef, showScrollButton, scrollToBottom] =
		useScrollToBottom<HTMLDivElement>({
			threshold: 150,
			behavior: "smooth",
			debounce: 100,
		});

	return (
		<ScrollArea className="h-full w-full relative">
			<div 
				ref={containerRef}
				className="min-h-full w-full transition-all duration-300"
			>
				<div className={cn("min-h-full w-full", className)}>{children}</div>
			</div>
			{showScrollButton && (
				<ScrollButton
					onClick={scrollToBottom}
					alignment={scrollButtonAlignment}
					className="z-10 animate-fade-in"
				/>
			)}
		</ScrollArea>
	);
}

ChatMessageArea.displayName = "ChatMessageArea";
