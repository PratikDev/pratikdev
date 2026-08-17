import { useGSAP } from "@gsap/react";

import { Panel } from "@/components/layout/Panel";
import { heroContent } from "@/content/portfolio";
import { useHeroZoomOrigin } from "@/hooks/use-hero-zoom-origin";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useStageInputLock } from "@/hooks/use-stage-input-lock";
import { gsap } from "@/lib/gsap";
import { useRef, useState } from "react";
import { TypeGrowText } from "../ui/TypeGrowText";

export function HeroSection() {
	const [isAnimating, setIsAnimating] = useState(true);
	useStageInputLock(isAnimating, "hero-typing");
	const reducedMotion = useReducedMotion();

	const headlineRef = useRef<HTMLHeadingElement>(null);

	// Tune these two by eye against the actual rendered result — they locate
	// the hole WITHIN the "P" glyph's own bounding box (0,0 = top-left of
	// the character, 1,1 = bottom-right).
	const remeasureZoomOrigin = useHeroZoomOrigin(headlineRef, 0.52, 0.42);

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

			<TypeGrowText
				as="h1"
				ref={headlineRef}
				className="text-(length:--text-hero) leading-[0.85] font-semibold tracking-tight text-foreground"
				config={{
					startDelay: 1000,
					typingSpeed: 200,
					growDelay: 800,
					cursorColor: "var(--primary)",
					growEase: "backOut",
					onGrowComplete: () => {
						setIsAnimating(false);
						// The "P" only exists as a rendered glyph, at full size,
						// once growth finishes — this is the correct moment to
						// measure it, not on mount.
						remeasureZoomOrigin();
					},
				}}
			>
				{heroContent.headline}
			</TypeGrowText>

			<p className="mt-6 text-(length:--text-h2) font-medium text-primary">
				{heroContent.highlight}
			</p>
		</Panel>
	);
}
