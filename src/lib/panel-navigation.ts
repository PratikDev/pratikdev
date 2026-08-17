import * as React from "react";

/* -------------------------------------------------------------------------
 * requestPanel / usePanelRequest
 * -------------------------------------------------------------------------
 * SiteMenu knows about nav ids; it doesn't (and shouldn't) know about every
 * nested stage's internal shape. This is the bridge: requesting navigation
 * to an id is a plain broadcast, and any component nested anywhere that
 * knows how to position itself for that id can subscribe and react — a
 * root-level ScrollStage, a nested zoom stage, a chapter stage three levels
 * deep, all the same mechanism.
 *
 * Deliberately typed as `string`, NOT PanelId — a nav id and a root-level
 * stage id are no longer the same set (e.g. "hero"/"about"/"top" are valid
 * nav ids a listener deep inside HeroAboutZoomStage cares about, but
 * neither is a PanelId since Hero+About collapsed into one root-level
 * "intro" step). Individual listeners narrow to whatever ids they actually
 * care about themselves.
 * ---------------------------------------------------------------------- */

type NavId = string;
type Listener = (id: NavId) => void;

const listeners = new Set<Listener>();

export function requestPanel(id: NavId) {
  listeners.forEach((listener) => listener(id));
}

/** Fires synchronously whenever requestPanel(id) is called, for any id — filter to what you care about inside the callback. */
export function usePanelRequest(onRequest: (id: NavId) => void) {
  const handlerRef = React.useRef(onRequest);
  handlerRef.current = onRequest;

  React.useEffect(() => {
    const listener: Listener = (id) => handlerRef.current(id);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
}