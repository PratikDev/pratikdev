import { motion, type Easing } from "motion/react";
import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	type ComponentPropsWithoutRef,
	type ComponentPropsWithRef,
	type ElementType,
	type ReactNode,
} from "react";

/* -------------------------------------------------------------------------
 * TypeGrowText
 * -------------------------------------------------------------------------
 * Drop-in replacement for any HTML element (h1, p, span, div...) that types
 * its text out, then grows it from a small "typing" size to the element's
 * OWN font-size — the one already defined by your className / CSS.
 *
 * You never need to pass baseFontSize or targetFontSize:
 *   - targetFontSize is read from getComputedStyle() on mount, so whatever
 *     sets the font-size on the element today (Tailwind class, CSS var,
 *     clamp(), media query...) keeps working exactly as before.
 *   - baseFontSize defaults to a ratio of that measured target size.
 *
 * Both remain overridable via props if you ever want to be explicit.
 *
 * Usage — identical to your current <h1>, just swap the tag. All typing/
 * grow behavior goes in the config prop, so it never mixes with native
 * element props like className, style, or event handlers:
 *
 *   <TypeGrowText
 *     as="h1"
 *     ref={headlineRef}
 *     className="text-(length:--text-hero) leading-[0.85] font-semibold tracking-tight text-foreground"
 *     config={{ typingSpeed: 40, growDuration: 0.8 }}
 *   >
 *     {heroContent.headline}
 *   </TypeGrowText>
 * ---------------------------------------------------------------------- */

type Phase = "idle" | "typing" | "waiting" | "growing" | "done";

const wait = (ms: number) =>
	new Promise<void>((resolve) => setTimeout(resolve, ms));

const toCss = (v: number | string) => (typeof v === "number" ? `${v}px` : v);

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
	return (node: T | null) => {
		refs.forEach((ref) => {
			if (!ref) return;
			if (typeof ref === "function") ref(node);
			else (ref as React.MutableRefObject<T | null>).current = node;
		});
	};
}

interface TypeGrowConfig {
	/** Skip auto-detection and force a specific end size. Numbers = px. */
	targetFontSize?: number | string;
	/** Skip the ratio calculation and force a specific starting size. Numbers = px. */
	baseFontSize?: number | string;
	/** When baseFontSize isn't set, base = measured target * this ratio. */
	baseFontRatio?: number;

	/** Ms between each typed character. */
	typingSpeed?: number;
	/** Ms before typing begins. */
	startDelay?: number;
	/** Ms to pause after typing finishes, before growth starts. */
	growDelay?: number;
	/** Seconds for the grow animation. */
	growDuration?: number;
	growEase?: Easing | Easing[];

	showCursor?: boolean;
	cursorChar?: string;
	cursorColor?: string;
	hideCursorOnGrow?: boolean;
	/** Seconds per blink half-cycle. */
	cursorBlinkSpeed?: number;

	play?: boolean;
	loop?: boolean;
	loopDelay?: number;

	onTypingStart?: () => void;
	onTypingComplete?: () => void;
	onGrowStart?: () => void;
	onGrowComplete?: () => void;
}

interface TypeGrowOwnProps {
	/** All typing/growth behavior lives here, out of the way of native element props. */
	config?: TypeGrowConfig;
	/** The text to type. A plain string — same as writing it as children of an h1/p/span. */
	children?: ReactNode;
}

// --- polymorphic "as" plumbing, shadcn/Radix style -------------------------

type AsProp<C extends ElementType> = { as?: C };

type PolymorphicProps<C extends ElementType> = TypeGrowOwnProps &
	AsProp<C> &
	Omit<ComponentPropsWithoutRef<C>, keyof TypeGrowOwnProps | "as">;

type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>["ref"];

type TypeGrowTextComponent = <C extends ElementType = "div">(
	props: PolymorphicProps<C> & { ref?: PolymorphicRef<C> },
) => React.ReactElement | null;

const DEFAULT_ELEMENT = "div";

// ---------------------------------------------------------------------------

const TypeGrowTextInner = React.forwardRef<
	HTMLElement,
	PolymorphicProps<ElementType>
>(({ as, children, config, ...rest }, ref) => {
	const {
		targetFontSize,
		baseFontSize,
		baseFontRatio = 0.32,
		typingSpeed = 45,
		startDelay = 0,
		growDelay = 300,
		growDuration = 0.7,
		growEase = [0.22, 1, 0.36, 1],
		showCursor = true,
		cursorChar = "|",
		cursorColor,
		hideCursorOnGrow = true,
		cursorBlinkSpeed = 0.8,
		play = true,
		loop = false,
		loopDelay = 1200,
		onTypingStart,
		onTypingComplete,
		onGrowStart,
		onGrowComplete,
	} = config ?? {};

	const Wrapper = (as || DEFAULT_ELEMENT) as ElementType;
	const text = typeof children === "string" ? children : String(children ?? "");

	// --- auto-detect the target size from the element's own computed style ---
	const wrapperRef = useRef<HTMLElement | null>(null);
	const [measuredTarget, setMeasuredTarget] = useState<number | null>(null);

	const measure = useCallback(() => {
		if (targetFontSize !== undefined) return; // explicit override, no need to read the DOM
		if (!wrapperRef.current) return;
		const px = parseFloat(getComputedStyle(wrapperRef.current).fontSize);
		if (!Number.isNaN(px)) setMeasuredTarget(px);
	}, [targetFontSize]);

	useLayoutEffect(() => {
		measure();
		window.addEventListener("resize", measure);
		return () => window.removeEventListener("resize", measure);
	}, [measure]);

	const targetPx: number | string | null =
		targetFontSize !== undefined ? targetFontSize : measuredTarget;

	const basePx: number | string | null =
		baseFontSize !== undefined
			? baseFontSize
			: targetPx !== null
				? (typeof targetPx === "number"
						? targetPx
						: parseFloat(String(targetPx))) * baseFontRatio
				: null;

	const sizesReady = basePx !== null;

	// --- typing sequence -----------------------------------------------------
	const [displayedText, setDisplayedText] = useState("");
	const [phase, setPhase] = useState<Phase>("idle");
	const runIdRef = useRef(0);

	const runSequence = useCallback(async () => {
		const myRunId = ++runIdRef.current;
		const isCurrent = () => runIdRef.current === myRunId;

		setDisplayedText("");
		setPhase("idle");

		if (startDelay > 0) await wait(startDelay);
		if (!isCurrent()) return;

		setPhase("typing");
		onTypingStart?.();

		for (let i = 1; i <= text.length; i++) {
			await wait(typingSpeed);
			if (!isCurrent()) return;
			setDisplayedText(text.slice(0, i));
		}
		if (!isCurrent()) return;

		onTypingComplete?.();
		setPhase("waiting");

		if (growDelay > 0) await wait(growDelay);
		if (!isCurrent()) return;

		setPhase("growing");
		onGrowStart?.();
	}, [
		text,
		typingSpeed,
		startDelay,
		growDelay,
		onTypingStart,
		onTypingComplete,
		onGrowStart,
	]);

	useEffect(() => {
		// hold off until sizes are known so there's no flash of the wrong size
		if (!play || !text || !sizesReady) {
			runIdRef.current++;
			setDisplayedText("");
			setPhase("idle");
			return;
		}
		runSequence();
		return () => {
			runIdRef.current++;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [play, text, sizesReady, runSequence]);

	const handleGrowComplete = () => {
		if (phase !== "growing") return;
		setPhase("done");
		onGrowComplete?.();
		if (loop) {
			wait(loopDelay).then(() => {
				if (play) runSequence();
			});
		}
	};

	const isGrownState = phase === "growing" || phase === "done";
	const cursorVisible = showCursor && (!hideCursorOnGrow || !isGrownState);

	return (
		<Wrapper
			ref={mergeRefs(wrapperRef, ref)}
			{...rest}
		>
			<motion.span
				style={{
					display: "inline-block",
					fontSize: sizesReady ? toCss(basePx as number | string) : undefined,
					lineHeight: "inherit",
					visibility: sizesReady ? "visible" : "hidden",
				}}
				animate={
					sizesReady
						? {
								fontSize: toCss(isGrownState ? (targetPx ?? basePx)! : basePx!),
							}
						: undefined
				}
				transition={{ duration: growDuration, ease: growEase }}
				onAnimationComplete={handleGrowComplete}
			>
				{displayedText}
				{cursorVisible && (
					<motion.span
						aria-hidden="true"
						style={{
							display: "inline-block",
							marginLeft: "0.05em",
							color: cursorColor || "currentColor",
						}}
						animate={{ opacity: [1, 1, 0, 0] }}
						transition={{
							duration: cursorBlinkSpeed * 2,
							repeat: Infinity,
							ease: "linear",
							times: [0, 0.5, 0.5, 1],
						}}
					>
						{cursorChar}
					</motion.span>
				)}
			</motion.span>
		</Wrapper>
	);
});

TypeGrowTextInner.displayName = "TypeGrowText";

export const TypeGrowText = TypeGrowTextInner as TypeGrowTextComponent;
