import * as React from "react";

import { Panel } from "@/components/layout/Panel";
import { ScrollStage, useScrollStage } from "@/components/layout/ScrollStage";
import { aboutChapters } from "@/content/portfolio";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { usePanelRequest } from "@/lib/panel-navigation";

// Position within HeroAboutZoomStage specifically (Hero = 0, About = 1) —
// not a lookup into PANEL_ORDER anymore, since About no longer has its own
// top-level slot in the root sequence.
const ABOUT_STEP = 1;
const CHAPTER_COUNT = aboutChapters.length;

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
function AboutStageBody({
	mainIndex,
	isActive,
}: {
	mainIndex: number;
	isActive: boolean;
}) {
	const { goTo } = useScrollStage();

	// Decide the entry chapter from travel direction. Both effects below stay
	// in this one component, in this order, on purpose — the same trick the
	// original implementation relied on: the first effect reads
	// prevMainIndexRef BEFORE the second effect (declared after it) updates
	// it, since same-component effects run in declaration order within a
	// commit. Splitting these across components would break that ordering.
	const prevMainIndexRef = React.useRef(mainIndex);

	// An explicit "About" nav click always means chapter 1, full stop — it
	// shouldn't go through the entered-forward/backward heuristic below at
	// all. That heuristic infers direction from whether mainIndex changed,
	// but a menu click can land here with mainIndex UNCHANGED (you were
	// already on About, left, and clicked About again) — in that case the
	// heuristic sees no index change, infers "entered backward", and would
	// silently pick the LAST chapter instead, overriding the explicit
	// request. Setting this ref makes the intentional jump win.
	const pendingChapterRef = React.useRef<number | null>(null);

	usePanelRequest((id) => {
		if (id !== "about") {
			return;
		}
		if (isActive) {
			// Already viewing About (on some other chapter) — jump directly.
			// The effect below won't re-run for this case since neither
			// isActive nor mainIndex is about to change, so it would never
			// consume a pending ref set here. Animated: this panel is already
			// on screen, so the vertical slide back to chapter 1 should be
			// visible, not an instant snap.
			goTo(0);
		} else {
			pendingChapterRef.current = 0;
		}
	});

	React.useEffect(() => {
		if (!isActive) {
			return;
		}

		let start: number;
		if (pendingChapterRef.current !== null) {
			start = pendingChapterRef.current;
			pendingChapterRef.current = null;
		} else {
			const enteredForward = mainIndex > prevMainIndexRef.current;
			start = enteredForward ? 0 : CHAPTER_COUNT - 1;
		}
		goTo(start, { animate: false });
	}, [isActive, mainIndex, goTo]);

	React.useEffect(() => {
		prevMainIndexRef.current = mainIndex;
	}, [mainIndex]);

	return (
		<div className="relative flex h-full w-full overflow-hidden">
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
		</div>
	);
}

export function AboutSection() {
	const reducedMotion = useReducedMotion();
	// Nearest ancestor here is the zoom stage (HeroAboutZoomStage), not the
	// root — this is a descendant of ScrollStage.Track inside that zoom
	// group. `active` is the zoom stage's OWN active prop (is the intro
	// group even the panel currently on screen), separate from
	// `activeIndex` (which of Hero/About the zoom group is showing). Both
	// are required: activeIndex alone stays === ABOUT_STEP forever once you
	// last visited About, even after scrolling away to Experience — without
	// the `active` check, About's chapter stage would believe itself still
	// live and keep eating wheel input in the background indefinitely.
	const { active: zoomActive, activeIndex: zoomIndex } = useScrollStage();
	const isActive = zoomActive && zoomIndex === ABOUT_STEP;

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
				<AboutStageBody
					mainIndex={zoomIndex}
					isActive={isActive}
				/>
			</ScrollStage>
		</Panel>
	);
}
