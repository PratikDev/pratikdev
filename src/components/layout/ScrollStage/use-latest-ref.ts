import * as React from "react";

/**
 * Keeps a ref in sync with the latest value on every render, so a stable
 * callback (e.g. a `window` event listener attached once) can read the
 * current value without needing to be recreated, and without needing to
 * list that value as an effect dependency.
 *
 * Extracted because the previous scroll-stage code hand-wrote this same
 * "mirror a value into a ref" pattern twice (activeIndexRef, scrollToPanelRef).
 */
export function useLatestRef<T>(value: T): React.MutableRefObject<T> {
  const ref = React.useRef(value);
  React.useEffect(() => {
    ref.current = value;
  });
  return ref;
}