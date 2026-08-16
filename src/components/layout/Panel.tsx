import * as React from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type PanelProps = React.HTMLAttributes<HTMLElement> & {
	id: string;
	eyebrow?: string;
	title?: string;
	fullBleed?: boolean;
};

export const Panel = React.forwardRef<HTMLElement, PanelProps>(function Panel(
	{ id, eyebrow, title, fullBleed = false, className, children, ...props },
	ref,
) {
	const reducedMotion = useReducedMotion();

	return (
		<section
			ref={ref}
			id={id}
			className={cn(
				"shrink-0",
				reducedMotion ? "w-full" : "h-full w-screen",
				className,
			)}
			{...props}
		>
			{fullBleed ? (
				children
			) : (
				<div
					className={cn(
						"mx-auto flex w-full max-w-[1800px] flex-col justify-center py-[calc(var(--site-nav-height)+2rem)] px-(--site-panel-padding-x)",
						reducedMotion ? "min-h-screen" : "h-full",
					)}
				>
					{title ? (
						<div className="mb-10 max-w-6xl shrink-0">
							{eyebrow ? <p className="eyebrow mb-5">{eyebrow}</p> : null}
							<h2 className="text-(length:--text-display) leading-[0.9] font-semibold tracking-tight text-foreground">
								{title}
							</h2>
						</div>
					) : null}
					{children}
				</div>
			)}
		</section>
	);
});
