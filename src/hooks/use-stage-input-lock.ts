import * as React from "react";

// import { useScrollStage } from "@/hooks/use-scroll-stage";
import { useScrollStage } from "@/components/layout/ScrollStage";

/* -------------------------------------------------------------------------
 * useStageInputLock
 * -------------------------------------------------------------------------
 * Registers a named reason in ScrollStageProvider's lock registry
 * (lockReasonsRef) for as long as `locked` is true, and clears it when
 * `locked` becomes false or the component unmounts.
 *
 * This is the scroll-stage equivalent of a generic "disable scroll while
 * X is happening" hook, except it plugs into the Set-based reason system
 * ScrollStageProvider already has (setInputLocked), rather than touching
 * the DOM. Any number of unrelated components can each hold their own
 * reason simultaneously — wheel/keyboard navigation only re-enables once
 * every reason has cleared.
 *
 * Reusable for any future animated component, not just typing effects:
 * just resolve "is this thing still animating" into a boolean.
 *
 * Usage:
 *   const [isAnimating, setIsAnimating] = useState(true);
 *   useStageInputLock(isAnimating, "hero-typing");
 *
 *   <TypeGrowText config={{ onGrowComplete: () => setIsAnimating(false) }}>
 *     {headline}
 *   </TypeGrowText>
 *
 * The `reason` string is optional — omit it and a stable, unique id is
 * generated per component instance (via useId), so you don't have to
 * worry about collisions if the same component mounts more than once.
 * Pass an explicit reason when it's useful for debugging which source is
 * currently holding the lock.
 * ---------------------------------------------------------------------- */

export function useStageInputLock(locked: boolean, reason?: string) {
  const { setInputLocked } = useScrollStage();
  const autoId = React.useId();
  const key = reason ?? `input-lock-${autoId}`;

  // Sync the lock state whenever `locked` changes.
  React.useEffect(() => {
    setInputLocked(key, locked);
  }, [key, locked, setInputLocked]);

  // Safety net: always release on unmount, even if the component unmounts
  // mid-animation while still holding a `true` lock — otherwise the reason
  // stays in the Set forever and wheel/keyboard input stays disabled.
  React.useEffect(() => {
    return () => setInputLocked(key, false);
  }, [key, setInputLocked]);
}