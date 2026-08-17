"use client";

import * as React from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import {
	useScrollEngine,
	type NavigationAxis,
	type ScrollAxis,
	type ScrollEngine,
} from "./use-scroll-engine";

/**
 * Visual transform axis for the stage. Distinct from NavigationAxis (which
 * only governs wheel/key input mapping) — "zoom" isn't a meaningful
 * navigation direction, it's purely about how a step is rendered.
 */
export type StageAxis = ScrollAxis | "zoom";

/* -------------------------------------------------------------------------
 * ScrollStage
 * -------------------------------------------------------------------------
 * <ScrollStage axis="x">
 *   <ScrollStage.Track>
 *     <div>panel one</div>
 *     <div>panel two</div>
 *   </ScrollStage.Track>
 * </ScrollStage>
 *
 * - `axis` picks the visual transform: translateX ("x"), translateY ("y"),
 *   or a stacked, non-sliding "zoom" layout where panels overlap and you
 *   supply (or use the default) per-panel scale/opacity transitions instead
 *   of movement. `navAxis` picks which wheel/keys drive next/prev —
 *   defaults to "all", so every arrow key and either wheel axis works
 *   regardless of which way the panels actually move. Pass "x"/"y" for
 *   `navAxis` to restrict input to just that axis instead.
 * - Pass `applyStep` to override the transform entirely — that's the
 *   extension point for zoom, opacity crossfades, diagonal movement, or
 *   anything else. This is the one place axis-specific visuals live.
 * - Step count is derived from ScrollStage.Track's children by default; you
 *   can also pass `stepCount` explicitly if steps don't map 1:1 to DOM children.
 * - Nesting is automatic: mounting a <ScrollStage> inside another one picks
 *   up the ambient parent via context. While the nested stage is `active`,
 *   it locks the parent's own input handling (via the same input-lock
 *   mechanism any other component would use) so only one stage responds to
 *   a given gesture at a time. Reaching the nested stage's first/last step
 *   bubbles the gesture to the parent's next()/prev() automatically.
 * - No component here imports panel lists, ids, or any app-specific config.
 *   This file doesn't know anything exists outside itself.
 * ---------------------------------------------------------------------- */

interface ScrollStageContextValue extends ScrollEngine {
	axis: StageAxis;
	stepCount: number;
	/**
	 * Whether THIS stage instance is currently active (its own `active` prop,
	 * combined with reduced-motion). Doesn't mean the stage's activeIndex is
	 * "correct" in any sense — a stage's activeIndex holds whatever it last
	 * was even after the stage itself goes inactive. A descendant checking
	 * only `activeIndex === someStep` without also checking `active` here
	 * can end up believing it's still "active" long after its containing
	 * stage has moved away from it entirely.
	 */
	active: boolean;
	setInputLocked: (reason: string, locked: boolean) => void;
	/**
	 * Subscribe to a continuously-updating step position (e.g. 1.4 while
	 * animating from step 1 toward step 2), driven by the actual transition
	 * tween rather than by React state — for effects like a diagonal reveal
	 * that need to react every frame, not just on step boundaries. Fires
	 * immediately with the current value, then on every tick during a
	 * transition. Returns an unsubscribe function.
	 */
	subscribeContinuousIndex: (callback: (value: number) => void) => () => void;
}

const ScrollStageContext = React.createContext<ScrollStageContextValue | null>(
	null,
);

/** Throws outside a <ScrollStage> — use this from components that require one. */
export function useScrollStage(): ScrollStageContextValue {
	const ctx = React.useContext(ScrollStageContext);
	if (!ctx) {
		throw new Error("useScrollStage must be used inside a <ScrollStage>.");
	}
	return ctx;
}

/** Returns null instead of throwing — used internally for optional bubbling lookups. */
function useAmbientScrollStage(): ScrollStageContextValue | null {
	return React.useContext(ScrollStageContext);
}

interface TrackContextValue {
	trackRef: React.MutableRefObject<HTMLDivElement | null>;
	axis: StageAxis;
	registerStepCount: (count: number) => void;
	/** Only used for axis="zoom" — each child's own DOM node, in step order, so applyStep can address individual panels. */
	panelRefs: React.MutableRefObject<Array<HTMLDivElement | null>>;
}

const ScrollStageTrackContext = React.createContext<TrackContextValue | null>(
	null,
);

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
	return (node: T | null) => {
		refs.forEach((r) => {
			if (!r) return;
			if (typeof r === "function") r(node);
			else (r as React.MutableRefObject<T | null>).current = node;
		});
	};
}

// Shared by the default transform AND the continuous-progress broadcast
// below, so a consumer subscribing to continuous progress (e.g. a diagonal
// parallax reveal) always stays in sync with the actual visual transition.
// A custom `applyStep` that wants continuous-progress consumers to track it
// accurately should animate with these same values.
const STEP_DURATION = 1;
const STEP_EASE = "power2.inOut";

/** Passed to `applyStep` on every step change — enough context for x/y, zoom, or anything custom. */
export interface ApplyStepContext {
	/** The Track container itself. Always present. */
	track: HTMLDivElement;
	/** Each panel's own DOM node, in step order. Only populated for axis="zoom" (x/y panels aren't individually wrapped). */
	panels: Array<HTMLDivElement | null>;
	fromIndex: number;
	index: number;
	animate: boolean;
}

export interface ScrollStageProps extends React.ComponentPropsWithoutRef<"div"> {
	/**
	 * Visual transform: "x"/"y" slide the whole Track; "zoom" stacks panels
	 * on top of each other (no sliding) and calls applyStep per-panel instead.
	 */
	axis?: StageAxis;
	/**
	 * Which wheel directions / arrow keys trigger next/prev. Defaults to
	 * "all" — every arrow key and either wheel axis advances/retreats,
	 * regardless of `axis` — so a user never has to know or guess whether a
	 * given panel happens to scroll horizontally or vertically underneath.
	 * Pass "x" or "y" to restrict input to just that axis's keys/wheel.
	 */
	navAxis?: NavigationAxis;
	/**
	 * Whether this stage may capture input right now. Defaults to true.
	 * Nested stages should pass whatever boolean means "the panel containing
	 * me is the one currently active in the parent stage" — see the AboutSection
	 * usage example.
	 */
	active?: boolean;
	/** Explicit step count, if steps don't map 1:1 to ScrollStage.Track's children. */
	stepCount?: number;
	loop?: boolean;
	wheelThreshold?: number;
	gestureResetMs?: number;
	lockMs?: number;
	/**
	 * How long, after this stage genuinely transitions from inactive to
	 * active, to ignore wheel/key input (native scroll still suppressed).
	 * Absorbs leftover momentum from whatever gesture just activated this
	 * stage — e.g. crossing from a horizontal parent stage into a vertical
	 * nested one — so it doesn't also trigger an advance in here. Not
	 * applied on a stage's very first mount.
	 */
	activationGraceMs?: number;
	/**
	 * Bubble out-of-range advances to the nearest ancestor stage. Defaults to
	 * true whenever nested inside another ScrollStage, false at the root
	 * (there's nowhere to bubble to).
	 */
	bubble?: boolean;
	/**
	 * Override how a step is visually applied. Defaults to translateX (axis
	 * "x"), translateY (axis "y"), or a crossfade+scale between the outgoing
	 * and incoming panel (axis "zoom"). Supply your own for custom
	 * choreography — this is the one place axis-specific visuals live.
	 */
	applyStep?: (context: ApplyStepContext) => void;
	onStep?: (
		index: number,
		meta: { fromIndex: number; direction: 1 | -1; animate: boolean },
	) => void;
}

const defaultApplyStep: (
	axis: StageAxis,
) => (context: ApplyStepContext) => void = (axis) => {
	if (axis === "zoom") {
		return ({ panels, fromIndex, index, animate }) => {
			const outgoing = panels[fromIndex];
			const incoming = panels[index];
			if (outgoing && outgoing !== incoming) {
				if (animate) {
					gsap.to(outgoing, {
						opacity: 0,
						scale: 1.08,
						duration: STEP_DURATION,
						ease: STEP_EASE,
					});
				} else {
					gsap.set(outgoing, { opacity: 0, scale: 1.08 });
				}
			}
			if (incoming) {
				if (animate) {
					gsap.to(incoming, {
						opacity: 1,
						scale: 1,
						duration: STEP_DURATION,
						ease: STEP_EASE,
					});
				} else {
					gsap.set(incoming, { opacity: 1, scale: 1 });
				}
			}
		};
	}

	return ({ track, index, animate }) => {
		const size = axis === "x" ? window.innerWidth : window.innerHeight;
		const vars = axis === "x" ? { x: -index * size } : { y: -index * size };
		if (animate) {
			gsap.to(track, { ...vars, duration: STEP_DURATION, ease: STEP_EASE });
		} else {
			gsap.set(track, vars);
		}
	};
};

const ScrollStageInner = React.forwardRef<HTMLDivElement, ScrollStageProps>(
	(
		{
			axis = "x",
			navAxis = "all",
			active = true,
			stepCount: stepCountProp,
			loop = false,
			wheelThreshold,
			gestureResetMs,
			lockMs,
			activationGraceMs,
			bubble,
			applyStep,
			onStep,
			className,
			children,
			...rest
		},
		ref,
	) => {
		const reducedMotion = useReducedMotion();
		const parentStage = useAmbientScrollStage();
		const shouldBubble = bubble ?? Boolean(parentStage);

		// --- input lock registry, scoped to this stage instance (not a module
		// singleton — every <ScrollStage> gets its own, so nested stages don't
		// fight over one shared Set). ---
		const lockReasonsRef = React.useRef<Set<string>>(new Set());
		const [isLocked, setIsLocked] = React.useState(false);
		const setInputLocked = React.useCallback(
			(reason: string, locked: boolean) => {
				if (locked) lockReasonsRef.current.add(reason);
				else lockReasonsRef.current.delete(reason);
				setIsLocked(lockReasonsRef.current.size > 0);
			},
			[],
		);

		// A nested, active stage suspends its parent's own input handling for
		// as long as it itself is active. This is the whole nesting mechanism —
		// it's just another lock reason, held by the framework instead of a
		// consumer component.
		React.useEffect(() => {
			if (!parentStage || !active) return;
			parentStage.setInputLocked("nested-stage", true);
			return () => parentStage.setInputLocked("nested-stage", false);
		}, [parentStage, active]);

		const trackRef = React.useRef<HTMLDivElement | null>(null);
		const panelRefs = React.useRef<Array<HTMLDivElement | null>>([]);
		const [measuredStepCount, setMeasuredStepCount] = React.useState(0);
		const stepCount = stepCountProp ?? measuredStepCount;

		// --- continuous-progress broadcast, independent of React state ---
		const continuousIndexRef = React.useRef(0);
		const continuousListenersRef = React.useRef<Set<(value: number) => void>>(
			new Set(),
		);

		const notifyContinuous = React.useCallback((value: number) => {
			continuousIndexRef.current = value;
			continuousListenersRef.current.forEach((cb) => cb(value));
		}, []);

		const subscribeContinuousIndex = React.useCallback(
			(callback: (value: number) => void) => {
				continuousListenersRef.current.add(callback);
				callback(continuousIndexRef.current);
				return () => {
					continuousListenersRef.current.delete(callback);
				};
			},
			[],
		);

		const applyStepRef = React.useRef(applyStep ?? defaultApplyStep(axis));
		applyStepRef.current = applyStep ?? defaultApplyStep(axis);

		const engine = useScrollEngine({
			stepCount,
			axis: navAxis,
			active: active && !reducedMotion,
			disabled: isLocked,
			loop,
			wheelThreshold,
			gestureResetMs,
			lockMs,
			activationGraceMs,
			onStep: (index, meta) => {
				const track = trackRef.current;
				if (track) {
					applyStepRef.current({
						track,
						panels: panelRefs.current,
						fromIndex: meta.fromIndex,
						index,
						animate: meta.animate,
					});
				}

				// Broadcast continuous progress separately from the visual
				// transform itself, so this works even with a custom applyStep
				// (zoom, diagonal, whatever) — subscribers get an interpolated
				// step position without needing to know how the transform works.
				if (meta.animate) {
					const proxy = { value: continuousIndexRef.current };
					gsap.to(proxy, {
						value: index,
						duration: STEP_DURATION,
						ease: STEP_EASE,
						onUpdate: () => notifyContinuous(proxy.value),
					});
				} else {
					notifyContinuous(index);
				}

				onStep?.(index, meta);
			},
			onBoundary: shouldBubble
				? (direction) =>
						direction > 0 ? parentStage?.next() : parentStage?.prev()
				: undefined,
		});

		const isEffectivelyActive = active && !reducedMotion;

		const contextValue = React.useMemo<ScrollStageContextValue>(
			() => ({
				...engine,
				axis,
				stepCount,
				active: isEffectivelyActive,
				setInputLocked,
				subscribeContinuousIndex,
			}),
			[
				engine,
				axis,
				stepCount,
				isEffectivelyActive,
				setInputLocked,
				subscribeContinuousIndex,
			],
		);

		const trackContextValue = React.useMemo<TrackContextValue>(
			() => ({
				trackRef,
				axis,
				registerStepCount: setMeasuredStepCount,
				panelRefs,
			}),
			[axis],
		);

		if (reducedMotion) {
			// Reduced motion: render everything stacked and scrollable, no
			// stage machinery at all. Track still renders so Track's own
			// reduced-motion layout (flex-col / stacked) takes over.
			return (
				<ScrollStageContext.Provider value={contextValue}>
					<ScrollStageTrackContext.Provider value={trackContextValue}>
						<div
							ref={ref}
							className={className}
							{...rest}
						>
							{children}
						</div>
					</ScrollStageTrackContext.Provider>
				</ScrollStageContext.Provider>
			);
		}

		return (
			<ScrollStageContext.Provider value={contextValue}>
				<div
					ref={ref}
					className={cn("relative h-full w-full overflow-hidden", className)}
					{...rest}
				>
					<ScrollStageTrackContext.Provider value={trackContextValue}>
						{children}
					</ScrollStageTrackContext.Provider>
				</div>
			</ScrollStageContext.Provider>
		);
	},
);
ScrollStageInner.displayName = "ScrollStage";

export interface ScrollStageTrackProps extends React.ComponentPropsWithoutRef<"div"> {}

const ScrollStageTrack = React.forwardRef<
	HTMLDivElement,
	ScrollStageTrackProps
>(({ className, children, ...rest }, ref) => {
	const ctx = React.useContext(ScrollStageTrackContext);
	const reducedMotion = useReducedMotion();
	if (!ctx) {
		throw new Error("ScrollStage.Track must be used inside a <ScrollStage>.");
	}

	const childArray = React.Children.toArray(children);
	const childCount = childArray.length;
	React.useEffect(() => {
		ctx.registerStepCount(childCount);
	}, [childCount, ctx]);

	if (!reducedMotion && ctx.axis === "zoom") {
		return (
			<div
				ref={mergeRefs(ctx.trackRef, ref)}
				className={cn("relative h-full w-full", className)}
				{...rest}
			>
				{childArray.map((child, i) => (
					<div
						key={i}
						ref={(node) => {
							ctx.panelRefs.current[i] = node;
						}}
						className="absolute inset-0 h-full w-full"
						// Matches the default zoom applyStep's "hidden" state (opacity
						// 0, scale 1.08) so there's no flash of every panel stacked
						// fully visible before the first transition runs. A custom
						// applyStep with a different hidden state will briefly
						// mismatch on first paint — minor, and only until step one.
						style={
							i === 0 ? undefined : { opacity: 0, transform: "scale(1.08)" }
						}
					>
						{child}
					</div>
				))}
			</div>
		);
	}

	return (
		<div
			ref={mergeRefs(ctx.trackRef, ref)}
			className={cn(
				reducedMotion
					? "flex flex-col"
					: ctx.axis === "x"
						? "flex h-full w-max"
						: "flex h-max w-full flex-col",
				className,
			)}
			{...rest}
		>
			{children}
		</div>
	);
});
ScrollStageTrack.displayName = "ScrollStage.Track";

export const ScrollStage = Object.assign(ScrollStageInner, {
	Track: ScrollStageTrack,
});
