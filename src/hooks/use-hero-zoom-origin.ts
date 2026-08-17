import * as React from "react";

import { heroZoomOrigin } from "@/components/portfolio/Intro/HeroAboutZoomStage";

/**
 * Measures the position of the FIRST CHARACTER of whatever text node lives
 * inside `containerRef`'s element, and writes a point within that
 * character's box into heroZoomOrigin (viewport-relative px, matching what
 * heroAboutApplyStep expects).
 *
 * Uses the Range API (range.setStart/setEnd on a text node,
 * getBoundingClientRect()) instead of wrapping the character in a <span> —
 * TypeGrowText renders its typed text as one plain text node and only
 * accepts a plain string as children, so there's nowhere to attach a
 * per-character ref. Range measures a SUBSTRING of an existing text node
 * directly, no DOM changes needed, so TypeGrowText itself stays untouched.
 *
 * Returns a `remeasure` function rather than measuring on a fixed schedule,
 * because there's no single correct "on mount" or "on interval" moment: the
 * character doesn't exist as a rendered glyph until typing finishes, so the
 * caller needs to trigger a measurement at the right point in ITS OWN
 * animation lifecycle (e.g. TypeGrowText's onGrowComplete). A resize
 * listener is still wired up automatically, since that's always safe to
 * react to once the first real measurement has succeeded.
 */
export function useHeroZoomOrigin(
  containerRef: React.RefObject<HTMLElement | null>,
  xRatio: number,
  yRatio: number,
) {
  const measure = React.useCallback(() => {
    const root = containerRef.current;
    if (!root) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNode = walker.nextNode();
    if (!textNode || !textNode.textContent || textNode.textContent.length === 0) {
      return; // typing hasn't produced any characters yet
    }

    const range = document.createRange();
    range.setStart(textNode, 0);
    range.setEnd(textNode, 1); // just the first character
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      return; // not actually laid out/visible yet
    }

    heroZoomOrigin.x = `${rect.left + rect.width * xRatio}px`;
    heroZoomOrigin.y = `${rect.top + rect.height * yRatio}px`;
  }, [containerRef, xRatio, yRatio]);

  React.useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return measure;
}