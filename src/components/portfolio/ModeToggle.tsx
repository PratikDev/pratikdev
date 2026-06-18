import { Monitor, Terminal, MoveLeft } from "lucide-react";

import type { PortfolioMode } from "@/lib/mode";
import { cn } from "@/lib/utils";

type ModeToggleProps = {
	mode: PortfolioMode;
	onModeChange: (mode: PortfolioMode) => void;
};

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
	const isBackend = mode === "backend";

	return (
		<div className="flex items-center gap-2">
			{mode === "frontend" ? (
				<span className="hidden items-center gap-1 text-xs italic text-muted-foreground sm:flex">
					see what's underneath
					<MoveLeft className="size-3" aria-hidden="true" />
				</span>
			) : null}
			<button
				type="button"
				role="switch"
				aria-checked={isBackend}
				aria-label="Switch portfolio visual mode"
				className="mode-toggle"
				onClick={() => onModeChange(isBackend ? "frontend" : "backend")}
			>
				<span className={cn("mode-toggle-option", !isBackend && "is-active")}>
					<Monitor className="size-3.5" aria-hidden="true" />
					<span>UI</span>
				</span>
				<span className={cn("mode-toggle-option", isBackend && "is-active")}>
					<Terminal className="size-3.5" aria-hidden="true" />
					<span>raw</span>
				</span>
			</button>
		</div>
	);
}
