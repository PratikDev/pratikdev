import * as React from "react";

import { Panel } from "@/components/layout/Panel";
import { ScrollStage, useScrollStage } from "@/components/layout/ScrollStageV2";
import { aboutChapters } from "@/content/portfolio";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap } from "@/lib/gsap";
import { PANEL_ORDER } from "@/lib/panels";
import { cn } from "@/lib/utils";

// Content-level lookup only — the stage itself never imports PANEL_ORDER.
// This is just "which index in the main horizontal stage is 'about'", used
// here purely to know when this section is the active one.
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
					{String(index + 1).padStart(2, "0")} /{" "}
					{String(CHAPTER_COUNT).padStart(2, "0")} · {chapter.label}
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
							<span
								key={tag}
								className="skill-pill"
							>
								{tag}
							</span>
						))}
					</div>
				) : null}
			</div>
		</div>
	);
}

/**
 * Everything below lives INSIDE the nested <ScrollStage axis="y">, so it
 * can call useScrollStage() to reach the chapter-level engine directly —
 * activeIndex, progress, and goTo all come from the stage now instead of
 * being hand-tracked in refs.
 *
 * `mainIndex` is passed down as a prop (not read via context) because once
 * we're inside the nested stage, useScrollStage() resolves to THIS stage,
 * not the outer horizontal one — there's no way to read both through the
 * same hook call at the same point in the tree.
 */
function AboutStageBody({ mainIndex }: { mainIndex: number }) {
	const { activeIndex: chapterIndex, progress, goTo } = useScrollStage();
	const isActive = mainIndex === ABOUT_INDEX;

	const arrowRef = React.useRef<SVGPathElement | null>(null);
	const arrowLengthRef = React.useRef(0);

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
	}, []);

	// Draw the arrow in as chapters advance. `progress` (0..1) comes straight
	// from the stage's own engine — no more manually recomputing
	// index / (CHAPTER_COUNT - 1) or threading an "animate" flag through by hand.
	React.useEffect(() => {
		const path = arrowRef.current;
		const length = arrowLengthRef.current;

		if (!path || !length) {
			return;
		}

		gsap.to(path, {
			strokeDashoffset: length * (1 - progress),
			duration: 1,
			ease: "power2.inOut",
		});
	}, [progress]);

	// Decide the entry chapter from travel direction. Both effects below stay
	// in this one component, in this order, on purpose — the same trick the
	// original implementation relied on: the first effect reads
	// prevMainIndexRef BEFORE the second effect (declared after it) updates
	// it, since same-component effects run in declaration order within a
	// commit. Splitting these across components would break that ordering.
	const prevMainIndexRef = React.useRef(mainIndex);

	React.useEffect(() => {
		if (!isActive) {
			return;
		}

		const enteredForward = mainIndex > prevMainIndexRef.current;
		const start = enteredForward ? 0 : CHAPTER_COUNT - 1;
		goTo(start, { animate: false });
	}, [isActive, mainIndex, goTo]);

	React.useEffect(() => {
		prevMainIndexRef.current = mainIndex;
	}, [mainIndex]);

	return (
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
				<ScrollStage.Track>
					{aboutChapters.map((chapter, index) => (
						<Chapter
							key={chapter.key}
							chapter={chapter}
							index={index}
						/>
					))}
				</ScrollStage.Track>
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
	);
}

export function AboutSection() {
	const reducedMotion = useReducedMotion();
	// Outer/main horizontal stage — read here, BEFORE entering the nested
	// <ScrollStage axis="y"> below, since useScrollStage() always resolves
	// to the nearest one in the tree.
	const { activeIndex: mainIndex } = useScrollStage();
	const isActive = mainIndex === ABOUT_INDEX;

	if (reducedMotion) {
		return (
			<Panel
				id="about"
				fullBleed
			>
				<div className="flex flex-col">
					{aboutChapters.map((chapter, index) => (
						<Chapter
							key={chapter.key}
							chapter={chapter}
							index={index}
						/>
					))}
				</div>
			</Panel>
		);
	}

	return (
		<Panel
			id="about"
			fullBleed
		>
			<ScrollStage
				axis="y"
				active={isActive}
				className="h-full w-full"
			>
				<AboutStageBody mainIndex={mainIndex} />
			</ScrollStage>
		</Panel>
	);
}
