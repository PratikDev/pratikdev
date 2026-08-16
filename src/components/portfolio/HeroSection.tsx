import { useGSAP } from "@gsap/react";

import { Panel } from "@/components/layout/Panel";
import { heroContent } from "@/content/portfolio";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useStageInputLock } from "@/hooks/use-stage-input-lock";
import { gsap } from "@/lib/gsap";
import { useRef, useState } from "react";
import { TypeGrowText } from "../ui/TypeGrowText";

export function HeroSection() {
	const [isAnimating, setIsAnimating] = useState(true);
	useStageInputLock(isAnimating, "hero-typing");
	const reducedMotion = useReducedMotion();
	const headlineRef = useRef<HTMLHeadingElement | null>(null);

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
					onGrowComplete: () => setIsAnimating(false),
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
