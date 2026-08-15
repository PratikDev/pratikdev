import { useGSAP } from "@gsap/react";
import * as React from "react";

import { ScrollStageContext, useScrollStage } from "@/hooks/use-scroll-stage";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PANEL_ORDER } from "@/lib/panels";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const panelCount = PANEL_ORDER.length;

type ScrollStageProviderProps = {
	children: React.ReactNode;
};

export function ScrollStageProvider({ children }: ScrollStageProviderProps) {
	const stageRef = React.useRef<HTMLDivElement | null>(null);
	const trackRef = React.useRef<HTMLDivElement | null>(null);
	const [activeIndex, setActiveIndex] = React.useState(0);
	const [masterTween, setMasterTween] = React.useState<GSAPTween | null>(
		null,
	);
	const [reducedMotion] = React.useState(
		() =>
			typeof window !== "undefined" &&
			window.matchMedia(REDUCED_MOTION_QUERY).matches,
	);

	React.useEffect(() => {
		if (
			typeof window === "undefined" ||
			!("scrollRestoration" in window.history)
		) {
			return;
		}

		window.history.scrollRestoration = "manual";
		window.scrollTo(0, 0);
	}, []);

	useGSAP(
		() => {
			if (reducedMotion) {
				return;
			}

			const track = trackRef.current;
			const stage = stageRef.current;

			if (!track || !stage) {
				return;
			}

			// Panels are always exactly 100vw each by design, so the scroll
			// distance can be computed arithmetically instead of measured from
			// layout (track.scrollWidth) — this stays correct even before the
			// tab has ever painted (e.g. opened in a background tab), whereas
			// a layout measurement can read 0 until a paint has occurred.
			const getScrollDistance = () => (panelCount - 1) * window.innerWidth;

			const tween = gsap.to(track, {
				x: () => -getScrollDistance(),
				ease: "none",
				scrollTrigger: {
					trigger: stage,
					start: "top top",
					end: () => `+=${getScrollDistance()}`,
					pin: true,
					scrub: 1,
					invalidateOnRefresh: true,
					anticipatePin: 1,
					onUpdate: (self) => {
						setActiveIndex(
							Math.round(self.progress * (panelCount - 1)),
						);
					},
				},
			});

			setMasterTween(tween);

			let resizeFrame = 0;
			const handleResize = () => {
				cancelAnimationFrame(resizeFrame);
				resizeFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
			};

			const handleVisibility = () => {
				if (!document.hidden) {
					ScrollTrigger.refresh();
				}
			};

			window.addEventListener("resize", handleResize);
			document.addEventListener("visibilitychange", handleVisibility);
			document.fonts?.ready.then(() => ScrollTrigger.refresh());

			return () => {
				cancelAnimationFrame(resizeFrame);
				window.removeEventListener("resize", handleResize);
				document.removeEventListener("visibilitychange", handleVisibility);
				tween.scrollTrigger?.kill();
				tween.kill();
				setMasterTween(null);
			};
		},
		{ scope: stageRef, dependencies: [reducedMotion] },
	);

	const scrollToPanel = React.useCallback(
		(index: number) => {
			const clamped = Math.min(Math.max(index, 0), panelCount - 1);
			const targetId = PANEL_ORDER[clamped];
			const scrollTrigger = masterTween?.scrollTrigger;

			if (reducedMotion || !scrollTrigger) {
				document
					.getElementById(targetId)
					?.scrollIntoView({ behavior: "smooth", block: "start" });
				return;
			}

			const targetProgress = clamped / (panelCount - 1);
			const y =
				scrollTrigger.start +
				targetProgress * (scrollTrigger.end - scrollTrigger.start);

			gsap.to(window, { duration: 1, scrollTo: y, ease: "power2.inOut" });
		},
		[masterTween, reducedMotion],
	);

	const activeIndexRef = React.useRef(activeIndex);
	React.useEffect(() => {
		activeIndexRef.current = activeIndex;
	}, [activeIndex]);

	const scrollToPanelRef = React.useRef(scrollToPanel);
	React.useEffect(() => {
		scrollToPanelRef.current = scrollToPanel;
	}, [scrollToPanel]);

	React.useEffect(() => {
		if (reducedMotion) {
			return;
		}

		const WHEEL_THRESHOLD = 12;
		const GESTURE_RESET_MS = 150;
		const LOCK_MS = 1050;
		const NEXT_KEYS = new Set(["ArrowDown", "ArrowRight", "PageDown"]);
		const PREV_KEYS = new Set(["ArrowUp", "ArrowLeft", "PageUp"]);

		let wheelAccum = 0;
		let isLocked = false;
		let resetTimer = 0;
		let lockTimer = 0;

		const isEditableTarget = () => {
			const el = document.activeElement;
			if (!el) return false;
			const tag = el.tagName;
			return (
				tag === "INPUT" ||
				tag === "TEXTAREA" ||
				el.hasAttribute("contenteditable")
			);
		};

		const advance = (direction: number) => {
			if (isLocked) return;
			isLocked = true;
			scrollToPanelRef.current(activeIndexRef.current + direction);
			lockTimer = window.setTimeout(() => {
				isLocked = false;
			}, LOCK_MS);
		};

		const handleWheel = (event: WheelEvent) => {
			event.preventDefault();
			if (isLocked) return;

			wheelAccum += event.deltaY;
			window.clearTimeout(resetTimer);
			resetTimer = window.setTimeout(() => {
				wheelAccum = 0;
			}, GESTURE_RESET_MS);

			if (Math.abs(wheelAccum) < WHEEL_THRESHOLD) {
				return;
			}

			const direction = wheelAccum > 0 ? 1 : -1;
			wheelAccum = 0;
			advance(direction);
		};

		const handleKeydown = (event: KeyboardEvent) => {
			if (isEditableTarget()) return;

			if (NEXT_KEYS.has(event.key)) {
				event.preventDefault();
				advance(1);
			} else if (PREV_KEYS.has(event.key)) {
				event.preventDefault();
				advance(-1);
			}
		};

		window.addEventListener("wheel", handleWheel, { passive: false });
		window.addEventListener("keydown", handleKeydown);

		return () => {
			window.removeEventListener("wheel", handleWheel);
			window.removeEventListener("keydown", handleKeydown);
			window.clearTimeout(resetTimer);
			window.clearTimeout(lockTimer);
		};
	}, [reducedMotion]);

	const contextValue = React.useMemo(
		() => ({
			activeIndex,
			panelCount,
			reducedMotion,
			masterTween,
			scrollToPanel,
			stageRef,
			trackRef,
		}),
		[activeIndex, reducedMotion, masterTween, scrollToPanel],
	);

	return (
		<ScrollStageContext.Provider value={contextValue}>
			{children}
		</ScrollStageContext.Provider>
	);
}

type ScrollTrackProps = {
	children: React.ReactNode;
};

export function ScrollTrack({ children }: ScrollTrackProps) {
	const { reducedMotion, stageRef, trackRef } = useScrollStage();

	if (reducedMotion) {
		return <div className="flex flex-col">{children}</div>;
	}

	return (
		<div ref={stageRef} className="h-screen w-screen overflow-hidden">
			<div ref={trackRef} className="flex h-full w-max">
				{children}
			</div>
		</div>
	);
}
