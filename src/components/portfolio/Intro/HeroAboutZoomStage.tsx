import {
	ScrollStage,
	useScrollStage,
	type ApplyStepContext,
} from "@/components/layout/ScrollStageV2";
import { gsap } from "@/lib/gsap";
import { usePanelRequest } from "@/lib/panel-navigation";

// Hero occupies step 0, About step 1 in this two-step nested zoom stage.
const HERO_STEP = 0;
const ABOUT_STEP = 1;

// How far into the transition Hero finishes scaling past the screen before
// About starts fading in. 0.6 means the zoom (0 -> 0.6 of the timeline)
// finishes before the fade (0.6 -> 1) begins — a genuine two-phase
// sequence, not two things crossfading simultaneously.
const ZOOM_PHASE_END = 0.6;

// transition config
const HERO_SCALE = 40;

/**
 * Where the zoom scales FROM/TOWARD, in viewport-relative pixels — set by
 * HeroSection after measuring the actual on-screen position of the "P"
 * glyph's counter, not a fixed guess. Falls back to the panel's own center
 * until that measurement has run once. Panel is `inset-0` (fills the
 * viewport exactly), so viewport-relative coordinates ARE panel-relative
 * coordinates — no extra offset math needed here.
 */
export const heroZoomOrigin = { x: "50%", y: "50%" };

function heroAboutApplyStep({
	panels,
	fromIndex,
	index,
	animate,
}: ApplyStepContext) {
	const hero = panels[HERO_STEP];
	const about = panels[ABOUT_STEP];
	if (!hero || !about) return;

	const enteringAbout = index === ABOUT_STEP && fromIndex === HERO_STEP;
	const leavingAbout = index === HERO_STEP && fromIndex === ABOUT_STEP;
	const origin = `${heroZoomOrigin.x} ${heroZoomOrigin.y}`;

	if (!animate) {
		// Silent positioning (e.g. re-entering this stage later): snap straight
		// to whichever end state matches the target step, no phased sequence.
		gsap.set(hero, {
			scale: index === HERO_STEP ? 1 : 6,
			opacity: index === HERO_STEP ? 1 : 0,
			transformOrigin: origin,
		});
		gsap.set(about, { opacity: index === ABOUT_STEP ? 1 : 0 });
		return;
	}

	const tl = gsap.timeline();

	if (enteringAbout) {
		// Phase 1 (0 -> ZOOM_PHASE_END): push through the Hero headline by
		// scaling it up until it's passed the screen. Keep the opacity fade
		// separate so it starts only after the zoom has finished.
		// transformOrigin is set (not animated) at the start of this tween —
		// it needs to already be correct before scale starts moving.
		tl.to(
			hero,
			{
				scale: HERO_SCALE,
				transformOrigin: origin,
				ease: "power1.in",
				duration: ZOOM_PHASE_END,
			},
			0,
		);
		tl.to(
			hero,
			{ opacity: 0, ease: "power1.in", duration: 1 - ZOOM_PHASE_END },
			ZOOM_PHASE_END,
		);
		// Phase 2 (ZOOM_PHASE_END -> 1): only once Hero has passed, About fades in.
		tl.fromTo(
			about,
			{ opacity: 0 },
			{ opacity: 1, ease: "power1.out", duration: 1 - ZOOM_PHASE_END },
			ZOOM_PHASE_END,
		);
	} else if (leavingAbout) {
		// Reverse: About fades out first, then Hero scales back down from
		// beyond the screen, landing at its normal size.
		tl.to(
			about,
			{ opacity: 0, ease: "power1.in", duration: 1 - ZOOM_PHASE_END },
			0,
		);
		tl.fromTo(
			hero,
			{ scale: HERO_SCALE, opacity: 0, transformOrigin: origin },
			{
				scale: 1,
				opacity: 1,
				transformOrigin: origin,
				ease: "power1.out",
				duration: ZOOM_PHASE_END,
			},
			1 - ZOOM_PHASE_END,
		);
	}
}

// Self-positions this zoom stage in response to a menu/nav request for
// "hero" or "about" — must render INSIDE <ScrollStage> to reach its own
// goTo via useScrollStage(); HeroAboutZoomStage itself can't, since it's
// the component that renders the stage, not a descendant of it.
function ZoomNavigationBridge() {
	const { goTo } = useScrollStage();

	usePanelRequest((id) => {
		if (id === "hero" || id === "top") {
			// Animated, not a silent snap: if the intro group is already the
			// visible panel, this is the on-screen case the zoom effect exists
			// for. If it's off-screen (navigating in from elsewhere), the tween
			// runs invisibly behind overflow-hidden and is simply done well
			// before the root's own slide finishes arriving — harmless either way.
			goTo(HERO_STEP);
		} else if (id === "about") {
			goTo(ABOUT_STEP);
		}
	});

	return null;
}

export function HeroAboutZoomStage({
	active,
	children,
}: {
	active: boolean;
	children: React.ReactNode;
}) {
	return (
		<ScrollStage
			axis="zoom"
			active={active}
			applyStep={heroAboutApplyStep}
			className="h-screen w-screen shrink-0"
		>
			<ZoomNavigationBridge />
			<ScrollStage.Track>{children}</ScrollStage.Track>
		</ScrollStage>
	);
}
