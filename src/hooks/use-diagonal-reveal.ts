import { useGSAP } from "@gsap/react";
import * as React from "react";

import { useScrollStage } from "@/hooks/use-scroll-stage";
import { gsap } from "@/lib/gsap";
import { PANEL_ORDER, type PanelId } from "@/lib/panels";

const Y_MAGNITUDE = 180;
const ROTATE_MAGNITUDE = 9;

function smoothstep(t: number) {
	return t * t * (3 - 2 * t);
}

export function useDiagonalReveal(panelId: PanelId) {
	const ref = React.useRef<HTMLDivElement | null>(null);
	const { masterTween, reducedMotion, panelCount } = useScrollStage();
	const myIndex = PANEL_ORDER.indexOf(panelId);

	useGSAP(
		() => {
			if (reducedMotion || !masterTween || !ref.current) {
				return;
			}

			const setY = gsap.quickSetter(ref.current, "y", "px");
			const setRotate = gsap.quickSetter(ref.current, "rotate", "deg");
			const setOpacity = gsap.quickSetter(ref.current, "opacity");

			const update = () => {
				const scrollTrigger = masterTween.scrollTrigger;
				const progress = scrollTrigger ? scrollTrigger.progress : 0;
				const continuous = progress * (panelCount - 1);
				const diff = Math.max(-1, Math.min(1, continuous - myIndex));
				const fade = 1 - smoothstep(Math.min(Math.abs(diff), 1));

				setY(diff * Y_MAGNITUDE);
				setRotate(diff * ROTATE_MAGNITUDE);
				setOpacity(Math.max(fade, 0.08));
			};

			gsap.ticker.add(update);

			return () => {
				gsap.ticker.remove(update);
			};
		},
		{
			scope: ref,
			dependencies: [masterTween, reducedMotion, panelCount, myIndex],
		},
	);

	return ref;
}
