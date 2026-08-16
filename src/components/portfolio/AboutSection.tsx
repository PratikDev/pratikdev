import * as React from "react";

import { Panel } from "@/components/layout/Panel";
import { aboutChapters } from "@/content/portfolio";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useScrollStage } from "@/hooks/use-scroll-stage";
import { gsap } from "@/lib/gsap";
import { PANEL_ORDER } from "@/lib/panels";
import { cn } from "@/lib/utils";

const ABOUT_INDEX = PANEL_ORDER.indexOf("about");
const CHAPTER_COUNT = aboutChapters.length;

// A squiggle-into-loop-into-arrowhead flourish, traced top to bottom as one
// continuous path (the arrowhead is an open chevron, not a separate shape)
// so the whole thing can draw in with a single strokeDasharray animation.
// Built from cubic beziers only (no arcs) so it stays a valid shape at any
// scale — the left gutter this sits in is narrow (max 96px), so the path is
// tall and slender rather than wide.
const ARROW_PATH =
	"M40 8 C68 30 12 70 40 110 C78 120 78 180 40 190 C2 180 2 120 40 110 C70 150 10 230 40 290 L16 282 L40 308 L64 282";

function renderBody(body: string, emphasis?: string) {
	if (!emphasis) {
		return body;
	}

	const index = body.indexOf(emphasis);

	if (index === -1) {
		return body;
	}

	return (
		<>
			{body.slice(0, index)}
			<span className="text-primary">{emphasis}</span>
			{body.slice(index + emphasis.length)}
		</>
	);
}

function Chapter({
	chapter,
	index,
}: {
	chapter: (typeof aboutChapters)[number];
	index: number;
}) {
	return (
		<div className="flex h-screen w-full shrink-0 flex-col justify-center px-(--site-panel-padding-x)">
			<div className="mx-auto w-full max-w-6xl">
				<p className="eyebrow mb-5">
					{String(index + 1).padStart(2, "0")} / {String(CHAPTER_COUNT).padStart(2, "0")} ·{" "}
					{chapter.label}
				</p>
				<h3 className="font-heading text-(length:--text-display) leading-[0.9] font-semibold tracking-tight text-foreground">
					{chapter.heading}
				</h3>
				<p className="mt-8 max-w-4xl text-(length:--text-h2) leading-snug text-muted-foreground">
					{renderBody(chapter.body, chapter.emphasis)}
				</p>
				{chapter.tags ? (
					<div className="mt-8 flex flex-wrap gap-2.5">
						{chapter.tags.map((tag) => (
							<span key={tag} className="skill-pill">
								{tag}
							</span>
						))}
					</div>
				) : null}
			</div>
		</div>
	);
}

export function AboutSection() {
	const reducedMotion = useReducedMotion();
	const { activeIndex, scrollToPanel, setInputLocked } = useScrollStage();
	const trackRef = React.useRef<HTMLDivElement | null>(null);
	const chapterIndexRef = React.useRef(0);
	const [chapterIndex, setChapterIndex] = React.useState(0);
	const prevActiveIndexRef = React.useRef(activeIndex);
	const arrowRef = React.useRef<SVGPathElement | null>(null);
	const arrowLengthRef = React.useRef(0);

	const isActive = activeIndex === ABOUT_INDEX;

	const applyArrowProgress = React.useCallback(
		(index: number, animate: boolean) => {
			const path = arrowRef.current;
			const length = arrowLengthRef.current;

			if (!path || !length) {
				return;
			}

			const progress = index / (CHAPTER_COUNT - 1);
			const offset = length * (1 - progress);

			if (animate) {
				gsap.to(path, { strokeDashoffset: offset, duration: 1, ease: "power2.inOut" });
			} else {
				gsap.set(path, { strokeDashoffset: offset });
			}
		},
		[],
	);

	// Measure the arrow path once on mount so strokeDasharray/strokeDashoffset
	// can drive its scroll-synced draw-in from a known total length.
	React.useLayoutEffect(() => {
		const path = arrowRef.current;

		if (!path) {
			return;
		}

		const length = path.getTotalLength();
		arrowLengthRef.current = length;
		gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
		applyArrowProgress(chapterIndexRef.current, false);
	}, [applyArrowProgress]);

	// Decide the entry chapter from travel direction, before prevActiveIndexRef
	// is updated below — arriving forward (from Hero) starts at the first
	// chapter, arriving backward (from Experience) starts at the last.
	React.useEffect(() => {
		if (reducedMotion || !isActive) {
			return;
		}

		const enteredForward = activeIndex > prevActiveIndexRef.current;
		const start = enteredForward ? 0 : CHAPTER_COUNT - 1;

		chapterIndexRef.current = start;
		setChapterIndex(start);
		gsap.set(trackRef.current, { y: -start * window.innerHeight });
		applyArrowProgress(start, false);
	}, [isActive, reducedMotion, activeIndex, applyArrowProgress]);

	React.useEffect(() => {
		prevActiveIndexRef.current = activeIndex;
	}, [activeIndex]);

	React.useEffect(() => {
		if (reducedMotion || !isActive) {
			return;
		}

		setInputLocked("about", true);

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
			const next = chapterIndexRef.current + direction;

			if (next < 0 || next > CHAPTER_COUNT - 1) {
				isLocked = true;
				scrollToPanel(ABOUT_INDEX + direction);
				return;
			}

			isLocked = true;
			chapterIndexRef.current = next;
			setChapterIndex(next);
			gsap.to(trackRef.current, {
				y: -next * window.innerHeight,
				duration: 1,
				ease: "power2.inOut",
			});
			applyArrowProgress(next, true);
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
			setInputLocked("about", false);
		};
	}, [isActive, reducedMotion, scrollToPanel, setInputLocked, applyArrowProgress]);

	if (reducedMotion) {
		return (
			<Panel id="about" fullBleed>
				<div className="flex flex-col">
					{aboutChapters.map((chapter, index) => (
						<Chapter key={chapter.key} chapter={chapter} index={index} />
					))}
				</div>
			</Panel>
		);
	}

	return (
		<Panel id="about" fullBleed>
			<div className="relative flex h-full w-full overflow-hidden">
				<div className="hidden w-[clamp(11rem,20vw,22rem)] shrink-0 items-center justify-center sm:flex">
					<svg
						className="h-[62vh] w-auto text-primary"
						viewBox="0 0 80 320"
						fill="none"
						aria-hidden="true"
					>
						<path
							d={ARROW_PATH}
							stroke="currentColor"
							strokeWidth={5}
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-border"
						/>
						<path
							ref={arrowRef}
							d={ARROW_PATH}
							stroke="currentColor"
							strokeWidth={5}
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-primary"
						/>
					</svg>
				</div>
				<div className="relative min-w-0 flex-1 overflow-hidden">
					<div ref={trackRef} className="flex flex-col">
						{aboutChapters.map((chapter, index) => (
							<Chapter key={chapter.key} chapter={chapter} index={index} />
						))}
					</div>
				</div>
				<div
					className="absolute right-8 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-2 sm:flex"
					aria-hidden="true"
				>
					{aboutChapters.map((chapter, index) => (
						<span
							key={chapter.key}
							className={cn(
								"h-1.5 w-1.5 bg-border transition-colors",
								index === chapterIndex && "bg-primary",
							)}
						/>
					))}
				</div>
			</div>
		</Panel>
	);
}
