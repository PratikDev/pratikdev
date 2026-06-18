import * as React from "react";

import type { PortfolioMode } from "@/lib/mode";
import { cn } from "@/lib/utils";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
	id: string;
	title?: string;
	eyebrow?: string;
	mode: PortfolioMode;
};

export function Section({
	id,
	title,
	eyebrow,
	mode,
	className,
	children,
	...props
}: SectionProps) {
	return (
		<section
			id={id}
			className={cn("scroll-mt-28 py-(--site-section-padding)", className)}
			{...props}
		>
			<div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
				{title ? (
					<div className="mb-8 max-w-3xl">
						{eyebrow ? (
							<p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
								{mode === "backend" ? `// ${eyebrow}` : eyebrow}
							</p>
						) : null}
						<h2 className="text-2xl font-semibold tracking-normal text-foreground sm:text-3xl">
							{mode === "backend" ? `<${title.toLowerCase()}>` : title}
						</h2>
					</div>
				) : null}
				{children}
			</div>
		</section>
	);
}
