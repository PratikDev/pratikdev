import { navItems } from "@/content/portfolio";
import { useScrollStage } from "@/hooks/use-scroll-stage";
import { PANEL_ORDER, PROJECT_PANEL_IDS, type PanelId } from "@/lib/panels";
import { cn } from "@/lib/utils";

function resolvePanelId(navId: string): PanelId {
	return navId === "projects" ? PROJECT_PANEL_IDS[0] : (navId as PanelId);
}

export function Navbar() {
	const { activeIndex, scrollToPanel } = useScrollStage();
	const activePanelId = PANEL_ORDER[activeIndex];

	return (
		<header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
			<div className="mx-auto flex min-h-(--site-nav-height) w-full max-w-6xl items-center justify-between gap-4 px-(--site-panel-padding-x)">
				<button
					type="button"
					onClick={() => scrollToPanel(0)}
					className="shrink-0 text-sm font-semibold tracking-tight text-foreground outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
				>
					Pratik Dev
				</button>
				<nav
					aria-label="Primary navigation"
					className="flex gap-1 overflow-x-auto"
				>
					{navItems.map((item) => {
						const isActive =
							item.id === "projects"
								? (PROJECT_PANEL_IDS as readonly string[]).includes(
										activePanelId,
									)
								: activePanelId === item.id;

						return (
							<button
								key={item.id}
								type="button"
								onClick={() =>
									scrollToPanel(PANEL_ORDER.indexOf(resolvePanelId(item.id)))
								}
								className={cn("nav-link", isActive && "is-active")}
							>
								{item.label}
							</button>
						);
					})}
				</nav>
				<div
					className="hidden shrink-0 items-center gap-1.5 sm:flex"
					aria-hidden="true"
				>
					{PANEL_ORDER.map((id, index) => (
						<span
							key={id}
							className={cn(
								"h-1.5 w-1.5 bg-border transition-colors",
								index === activeIndex && "bg-primary",
							)}
						/>
					))}
				</div>
			</div>
		</header>
	);
}
