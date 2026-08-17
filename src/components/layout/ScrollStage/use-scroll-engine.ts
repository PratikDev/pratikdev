import * as React from "react";

import { useLatestRef } from "./use-latest-ref";

/* -------------------------------------------------------------------------
 * useScrollEngine
 * -------------------------------------------------------------------------
 * The reusable "brain" behind any step-based scroll stage: turns wheel and
 * keyboard input into a clamped (or looping) step index, with gesture
 * accumulation, a reset window, and a cooldown lock between advances.
 *
 * Deliberately knows nothing about:
 *   - how a "step" is visually represented (translateX, translateY, scale,
 *     opacity crossfade, whatever)
 *   - GSAP, or any other animation library
 *   - panel content, ids, or ordering
 *
 * That's what makes it reusable for horizontal, vertical, or any future
 * axis: the caller supplies `axis` (which just picks a delta-reader and a
 * key map) and an `onStep` callback to apply whatever transform it wants.
 * ---------------------------------------------------------------------- */

export type ScrollAxis = "x" | "y";
/** "x"/"y" restrict navigation to that axis's keys/wheel; "all" accepts every arrow direction and either wheel axis. */
export type NavigationAxis = ScrollAxis | "all";

interface AxisPreset {
  readDelta: (event: WheelEvent) => number;
  nextKeys: Set<string>;
  prevKeys: Set<string>;
}

const AXIS_PRESETS: Record<NavigationAxis, AxisPreset> = {
  x: {
    readDelta: (e) => (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY),
    nextKeys: new Set(["ArrowRight"]),
    prevKeys: new Set(["ArrowLeft"]),
  },
  y: {
    readDelta: (e) => e.deltaY,
    nextKeys: new Set(["ArrowDown", "PageDown"]),
    prevKeys: new Set(["ArrowUp", "PageUp"]),
  },
  all: {
    // Whichever wheel axis has more magnitude wins — covers a plain mouse
    // wheel (deltaY only), a trackpad swipe in either direction, and
    // shift+wheel, without the caller having to predict which one a user
    // will reach for.
    readDelta: (e) => (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY),
    nextKeys: new Set(["ArrowRight", "ArrowDown", "PageDown"]),
    prevKeys: new Set(["ArrowLeft", "ArrowUp", "PageUp"]),
  },
};

export interface UseScrollEngineOptions {
  /** How many discrete steps this engine navigates between. */
  stepCount: number;
  /** Which wheel delta / arrow keys count as "advance" vs "retreat". Defaults are set by ScrollStage, not here. */
  axis: NavigationAxis;
  /** Whether this engine should be listening for input at all right now. */
  active: boolean;
  /** Externally imposed lock (e.g. an input-lock registry). Still mounted, just no-ops. */
  disabled?: boolean;
  /** Wrap from the last step back to the first, and vice versa. */
  loop?: boolean;
  wheelThreshold?: number;
  gestureResetMs?: number;
  lockMs?: number;
  /**
   * How long to ignore wheel/key input right after this engine transitions
   * from inactive to active (native scroll is still suppressed, but nothing
   * advances). Prevents leftover momentum from the gesture that activated
   * this stage — e.g. crossing from a horizontal parent into a vertical
   * nested stage — from immediately triggering another advance here too.
   * Not applied on a stage's very first mount, only on genuine re-activations.
   */
  activationGraceMs?: number;
  /** Called whenever the active step changes. Apply your own transform here. */
  onStep?: (index: number, meta: { fromIndex: number; direction: 1 | -1; animate: boolean }) => void;
  /**
   * Called instead of moving when an advance would go past the first/last
   * step (and `loop` is false). This is what a nested stage uses to bubble
   * an out-of-range gesture up to a parent stage.
   */
  onBoundary?: (direction: 1 | -1) => void;
}

export interface ScrollEngine {
  activeIndex: number;
  progress: number;
  next: () => void;
  prev: () => void;
  goTo: (index: number, options?: { animate?: boolean }) => void;
}

const isEditableTarget = () => {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || el.hasAttribute("contenteditable");
};

export function useScrollEngine({
  stepCount,
  axis,
  active,
  disabled = false,
  loop = false,
  wheelThreshold = 12,
  gestureResetMs = 150,
  lockMs = 1050,
  activationGraceMs = 350,
  onStep,
  onBoundary,
}: UseScrollEngineOptions): ScrollEngine {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const indexRef = useLatestRef(activeIndex);
  const disabledRef = useLatestRef(disabled);
  const onStepRef = useLatestRef(onStep);
  const onBoundaryRef = useLatestRef(onBoundary);
  const stepCountRef = useLatestRef(stepCount);
  const loopRef = useLatestRef(loop);
  const activationGraceMsRef = useLatestRef(activationGraceMs);
  const lockMsRef = useLatestRef(lockMs);

  // Timestamp-based cooldown, shared across every caller of goTo — not just
  // this stage's own wheel/key handlers. This matters for nesting: when a
  // nested stage bubbles a boundary advance via parentStage.next(), that
  // call goes straight into the PARENT's goTo from outside the parent's own
  // listener effect entirely. A cooldown that only lived inside that
  // effect's closure (a local `let isGestureLocked`) could never be armed
  // by a bubbled call — so the parent stayed fully unlocked and any
  // leftover wheel momentum from the same physical gesture immediately
  // advanced it again. A shared ref that goTo itself arms closes that gap
  // regardless of which code path triggered the move.
  const lockUntilRef = React.useRef(0);

  // Tracks whether `active` just flipped false -> true this commit, so the
  // listener effect below knows whether to grant a grace window. Runs as a
  // layout effect specifically so it fires before the listener effect
  // (a plain effect) on the same commit, regardless of declaration order.
  const wasActiveRef = React.useRef(active);
  const justActivatedRef = React.useRef(false);
  React.useLayoutEffect(() => {
    justActivatedRef.current = !wasActiveRef.current && active;
    wasActiveRef.current = active;
  });

  const goTo = React.useCallback(
    (rawIndex: number, options?: { animate?: boolean }) => {
      const animate = options?.animate ?? true;

      // Single gatekeeper for every caller — wheel/key handlers, a bubbled
      // call from a child stage's onBoundary, or an external goTo (e.g. a
      // nav menu click). Checking this only inside the wheel handler (as
      // before) meant a bubbled call, which skips the handler entirely,
      // could never be rate-limited — a rapid burst of bubbled advances
      // sailed straight through, each kicking off its own tween on top of
      // the last. Silent (animate: false) repositioning bypasses the lock
      // entirely since it's not a user-facing move.
      if (animate && performance.now() < lockUntilRef.current) {
        return;
      }

      const count = stepCountRef.current;
      if (count <= 0) return;

      const fromIndex = indexRef.current;
      const direction: 1 | -1 = rawIndex >= fromIndex ? 1 : -1;
      let index = rawIndex;

      if (loopRef.current) {
        index = ((rawIndex % count) + count) % count;
      } else if (index < 0 || index > count - 1) {
        // Arm the lock even here: hitting a boundary and bubbling still
        // counts as "an advance was consumed". Without this, the stage
        // that detected the boundary had no cooldown on itself and could
        // hit the boundary again immediately from the same leftover
        // momentum, bubbling next()/prev() to the parent repeatedly.
        if (animate) {
          lockUntilRef.current = performance.now() + lockMsRef.current;
        }
        onBoundaryRef.current?.(direction);
        return;
      }

      if (animate) {
        lockUntilRef.current = performance.now() + lockMsRef.current;
      }

      indexRef.current = index;
      setActiveIndex(index);
      onStepRef.current?.(index, { fromIndex, direction, animate });
    },
    [indexRef, loopRef, onBoundaryRef, onStepRef, stepCountRef, lockMsRef],
  );

  const next = React.useCallback(() => goTo(indexRef.current + 1), [goTo, indexRef]);
  const prev = React.useCallback(() => goTo(indexRef.current - 1), [goTo, indexRef]);

  React.useEffect(() => {
    if (!active) return;

    const preset = AXIS_PRESETS[axis];
    const graceUntil = justActivatedRef.current ? performance.now() + activationGraceMsRef.current : 0;
    const withinActivationGrace = () => performance.now() < graceUntil;
    const withinGestureLock = () => performance.now() < lockUntilRef.current;

    let wheelAccum = 0;
    let resetTimer = 0;

    const advance = (direction: 1 | -1) => {
      // This check is just a shortcut to skip goTo's own work while
      // obviously locked — goTo itself is the actual enforcement point now,
      // so this being wrong in some edge case wouldn't cause a double-move.
      if (withinGestureLock() || disabledRef.current) return;
      goTo(indexRef.current + direction);
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (withinActivationGrace()) return; // absorb leftover momentum from the gesture that just activated this stage
      if (withinGestureLock() || disabledRef.current) return;

      wheelAccum += preset.readDelta(event);
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        wheelAccum = 0;
      }, gestureResetMs);

      if (Math.abs(wheelAccum) < wheelThreshold) return;

      const direction: 1 | -1 = wheelAccum > 0 ? 1 : -1;
      wheelAccum = 0;
      advance(direction);
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (isEditableTarget()) return;

      const isNext = preset.nextKeys.has(event.key);
      const isPrev = preset.prevKeys.has(event.key);
      if (!isNext && !isPrev) return;

      // Always suppress the browser's native scroll response to these keys
      // first, THEN decide whether we're locked or in the activation grace
      // window. Checking either of those before preventDefault() is what
      // caused the native-scroll nudge bug in the old implementation.
      event.preventDefault();
      if (withinActivationGrace()) return;
      if (withinGestureLock() || disabledRef.current) return;

      advance(isNext ? 1 : -1);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeydown);
      window.clearTimeout(resetTimer);
    };
  }, [active, axis, disabledRef, goTo, indexRef, gestureResetMs, wheelThreshold, activationGraceMsRef]);

  const progress = stepCount > 1 ? activeIndex / (stepCount - 1) : 0;

  return { activeIndex, progress, next, prev, goTo };
}