import * as React from "react";

export function useReveal<TElement extends HTMLElement>() {
	const ref = React.useRef<TElement | null>(null);
	const [isRevealed, setIsRevealed] = React.useState(false);

	React.useEffect(() => {
		const node = ref.current;

		if (!node || isRevealed) {
			return;
		}

		if (typeof IntersectionObserver === "undefined") {
			const frame = requestAnimationFrame(() => setIsRevealed(true));
			return () => cancelAnimationFrame(frame);
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					setIsRevealed(true);
					observer.disconnect();
				}
			},
			{ rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
		);

		observer.observe(node);

		return () => observer.disconnect();
	}, [isRevealed]);

	return { ref, isRevealed };
}
