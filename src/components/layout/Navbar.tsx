import { ModeToggle } from "@/components/portfolio/ModeToggle";
import { navItems } from "@/content/portfolio";
import type { PortfolioMode } from "@/lib/mode";
import { cn } from "@/lib/utils";

type NavbarProps = {
	mode: PortfolioMode;
	onModeChange: (mode: PortfolioMode) => void;
};

export function Navbar({ mode, onModeChange }: NavbarProps) {
	return (
		<header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur transition-mode">
			<div className="mx-auto flex min-h-(--site-nav-height) w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
				<a
					href="#top"
					className="text-sm font-semibold tracking-normal text-foreground outline-none transition-mode hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
				>
					{mode === "frontend" ? "Pratik Dev" : "pratik_dev"}
				</a>
				<nav
					aria-label="Primary navigation"
					className="order-3 flex w-full gap-1 overflow-x-auto pb-1 text-xs sm:order-0 sm:w-auto sm:pb-0"
				>
					{navItems.map((item) => (
						<a
							key={item.id}
							href={`#${item.id}`}
							className={cn(
								"nav-link",
								mode === "backend" && "font-mono uppercase",
							)}
						>
							{mode === "frontend" ? item.frontendLabel : item.backendLabel}
						</a>
					))}
				</nav>
				<ModeToggle
					mode={mode}
					onModeChange={onModeChange}
				/>
			</div>
		</header>
	);
}
