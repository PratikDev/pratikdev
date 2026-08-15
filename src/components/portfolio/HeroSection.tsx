import { useGSAP } from "@gsap/react";
import * as React from "react";

import { Panel } from "@/components/layout/Panel";
import { heroContent } from "@/content/portfolio";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap } from "@/lib/gsap";

export function HeroSection() {
	const reducedMotion = useReducedMotion();
	const headlineRef = React.useRef<HTMLHeadingElement | null>(null);

	useGSAP(
		() => {
			if (reducedMotion || !headlineRef.current) {
				return;
			}

			gsap.from(headlineRef.current, {
				y: 40,
				opacity: 0,
				duration: 0.9,
				ease: "power3.out",
				delay: 0.15,
			});
		},
		{ scope: headlineRef, dependencies: [reducedMotion] },
	);

	return (
		<Panel id="top">
			<p className="eyebrow mb-6">Software Engineer</p>
			<h1
				ref={headlineRef}
				className="text-(length:--text-hero) leading-[0.85] font-semibold tracking-tight text-foreground"
			>
				{heroContent.headline}
			</h1>
			<p className="mt-6 text-(length:--text-h2) font-medium text-primary">
				{heroContent.highlight}
			</p>
		</Panel>
	);
}
