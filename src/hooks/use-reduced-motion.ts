import * as React from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function useReducedMotion() {
	const [reducedMotion] = React.useState(
		() =>
			typeof window !== "undefined" &&
			window.matchMedia(REDUCED_MOTION_QUERY).matches,
	);

	return reducedMotion;
}
