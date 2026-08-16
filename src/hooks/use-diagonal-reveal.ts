import { useGSAP } from "@gsap/react";
import * as React from "react";

import { useScrollStage } from "@/components/layout/ScrollStageV2";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap } from "@/lib/gsap";
import { PANEL_ORDER, type PanelId } from "@/lib/panels";

const Y_MAGNITUDE = 180;
const ROTATE_MAGNITUDE = 9;

function smoothstep(t: number) {
	return t * t * (3 - 2 * t);
}

export function useDiagonalReveal(panelId: PanelId) {
	const ref = React.useRef<HTMLDivElement | null>(null);
	const reducedMotion = useReducedMotion();
	const { subscribeContinuousIndex } = useScrollStage();
	const myIndex = PANEL_ORDER.indexOf(panelId);

	useGSAP(
		() => {
			if (reducedMotion || !ref.current) {
				return;
			}

			const setY = gsap.quickSetter(ref.current, "y", "px");
			const setRotate = gsap.quickSetter(ref.current, "rotate", "deg");
			const setOpacity = gsap.quickSetter(ref.current, "opacity");

			// `continuous` is the stage's live step position — e.g. 2.4 while
			// animating from panel 2 toward panel 3 — driven by the stage's
			// own transition tween rather than by real document scroll.
			const update = (continuous: number) => {
				const diff = Math.max(-1, Math.min(1, continuous - myIndex));
				const fade = 1 - smoothstep(Math.min(Math.abs(diff), 1));

				setY(diff * Y_MAGNITUDE);
				setRotate(diff * ROTATE_MAGNITUDE);
				setOpacity(Math.max(fade, 0.08));
			};

			// Fires immediately with the current value (correct initial pose on
			// mount), then again on every tick while a transition is in flight.
			return subscribeContinuousIndex(update);
		},
		{
			scope: ref,
			dependencies: [reducedMotion, myIndex, subscribeContinuousIndex],
		},
	);

	return ref;
}