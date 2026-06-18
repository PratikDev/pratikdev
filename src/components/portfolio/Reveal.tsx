import * as React from "react";

import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

type RevealProps = React.HTMLAttributes<HTMLDivElement> & {
	delay?: number;
};

export function Reveal({ className, delay = 0, style, ...props }: RevealProps) {
	const { ref, isRevealed } = useReveal<HTMLDivElement>();

	return (
		<div
			ref={ref}
			className={cn("reveal", className)}
			data-revealed={isRevealed}
			style={{ "--reveal-delay": `${delay}ms`, ...style } as React.CSSProperties}
			{...props}
		/>
	);
}
