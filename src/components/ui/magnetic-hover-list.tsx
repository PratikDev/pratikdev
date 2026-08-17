import {
	motion,
	useSpring,
	type HTMLMotionProps,
	type SpringOptions,
} from "motion/react";
import * as React from "react";

/* -------------------------------------------------------------------------
 * MagneticHoverList
 * -------------------------------------------------------------------------
 * A shared background highlight that morphs (position + size) to match
 * whichever item is currently hovered, and pulls slightly toward the
 * cursor's position WITHIN that item — the "magnetic" part happens on the
 * highlight itself. Item content never moves; only the highlight does.
 *
 * Usage:
 *   <MagneticHoverList className="flex flex-col">
 *     {items.map((item) => (
 *       <MagneticHoverList.Item key={item.id}>
 *         {item.label}
 *       </MagneticHoverList.Item>
 *     ))}
 *   </MagneticHoverList>
 * ---------------------------------------------------------------------- */

const DEFAULT_SPRING: SpringOptions = {
	stiffness: 300,
	damping: 30,
	mass: 0.4,
};

function cn(...classes: Array<string | false | null | undefined>) {
	return classes.filter(Boolean).join(" ");
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
	return (node: T | null) => {
		refs.forEach((ref) => {
			if (!ref) return;
			if (typeof ref === "function") ref(node);
			else (ref as React.MutableRefObject<T | null>).current = node;
		});
	};
}

function clamp(value: number, min: number, max: number) {
	return Math.max(min, Math.min(max, value));
}

interface PointerPosition {
	x: number;
	y: number;
}

interface MagneticListContextValue {
	onItemHover: (el: HTMLElement, pointer?: PointerPosition) => void;
	onItemLeave: () => void;
}

const MagneticListContext =
	React.createContext<MagneticListContextValue | null>(null);

function useMagneticListContext(): MagneticListContextValue {
	const ctx = React.useContext(MagneticListContext);
	if (!ctx) {
		throw new Error(
			"MagneticHoverList.Item must be used inside <MagneticHoverList>.",
		);
	}
	return ctx;
}

export interface MagneticHoverListProps extends Omit<
	HTMLMotionProps<"div">,
	"ref" | "children"
> {
	/** Element type for the container. Defaults to 'div'. */
	as?: React.ElementType;
	children?: React.ReactNode;
	/**
	 * How strongly the highlight pulls toward the cursor's position within
	 * the hovered item, roughly px of travel per px of cursor offset from
	 * that item's center. 0 disables the pull — the highlight then just
	 * snaps to cover whichever item is hovered, no cursor-following.
	 */
	magneticStrength?: number;
	/** Spring physics for the highlight — both snapping between items and following the cursor within one. */
	highlightSpring?: SpringOptions;
	/** Classes for the background highlight element itself — control its color, radius, blur, etc. here. */
	highlightClassName?: string;
}

const MagneticHoverListRoot = React.forwardRef<
	HTMLDivElement,
	MagneticHoverListProps
>(
	(
		{
			as: Container = "div",
			magneticStrength = 0.25,
			highlightSpring = DEFAULT_SPRING,
			highlightClassName,
			className,
			children,
			onMouseLeave,
			...rest
		},
		ref,
	) => {
		const containerRef = React.useRef<HTMLElement | null>(null);
		const [visible, setVisible] = React.useState(false);

		const x = useSpring(0, highlightSpring);
		const y = useSpring(0, highlightSpring);
		const width = useSpring(0, highlightSpring);
		const height = useSpring(0, highlightSpring);

		const onItemHover = React.useCallback(
			(el: HTMLElement, pointer?: PointerPosition) => {
				const container = containerRef.current;
				if (!container) return;
				const itemRect = el.getBoundingClientRect();
				const containerRect = container.getBoundingClientRect();

				// Magnetic pull: nudge the highlight's TARGET position toward the
				// cursor's spot within the item, clamped so it can't drift past
				// the item's own edges. This offset is baked into the same x/y
				// spring the highlight already uses to snap between items, so
				// both behaviors (jumping to a new item, following the cursor
				// within one) share identical, consistent motion.
				let offsetX = 0;
				let offsetY = 0;
				if (pointer && magneticStrength > 0) {
					const centerX = itemRect.left + itemRect.width / 2;
					const centerY = itemRect.top + itemRect.height / 2;
					const maxPullX = itemRect.width * 0.15;
					const maxPullY = itemRect.height * 0.15;
					offsetX = clamp(
						(pointer.x - centerX) * magneticStrength,
						-maxPullX,
						maxPullX,
					);
					offsetY = clamp(
						(pointer.y - centerY) * magneticStrength,
						-maxPullY,
						maxPullY,
					);
				}

				x.set(itemRect.left - containerRect.left + offsetX);
				y.set(itemRect.top - containerRect.top + offsetY);
				width.set(itemRect.width);
				height.set(itemRect.height);
				setVisible(true);
			},
			[x, y, width, height, magneticStrength],
		);

		const onItemLeave = React.useCallback(() => {
			setVisible(false);
		}, []);

		const contextValue = React.useMemo<MagneticListContextValue>(
			() => ({ onItemHover, onItemLeave }),
			[onItemHover, onItemLeave],
		);

		const handleContainerMouseLeave: HTMLMotionProps<"div">["onMouseLeave"] = (
			e,
		) => {
			onItemLeave();
			onMouseLeave?.(e);
		};

		return (
			<Container
				ref={mergeRefs(containerRef, ref)}
				className={cn("relative", className)}
				onMouseLeave={handleContainerMouseLeave}
				{...rest}
			>
				<motion.div
					aria-hidden="true"
					className={cn(
						"pointer-events-none absolute left-0 top-0 rounded-lg bg-foreground/10",
						highlightClassName,
					)}
					style={{ x, y, width, height }}
					animate={{ opacity: visible ? 1 : 0 }}
					transition={{ duration: 0.15 }}
				/>
				<MagneticListContext.Provider value={contextValue}>
					{children}
				</MagneticListContext.Provider>
			</Container>
		);
	},
);
MagneticHoverListRoot.displayName = "MagneticHoverList";

export interface MagneticHoverListItemProps extends Omit<
	HTMLMotionProps<"div">,
	"ref"
> {}

const MagneticHoverListItem = React.forwardRef<
	HTMLDivElement,
	MagneticHoverListItemProps
>(
	(
		{
			className,
			children,
			onMouseEnter,
			onMouseMove,
			onMouseLeave,
			onFocus,
			onBlur,
			tabIndex,
			...rest
		},
		ref,
	) => {
		const { onItemHover, onItemLeave } = useMagneticListContext();
		const itemRef = React.useRef<HTMLDivElement | null>(null);
		const frameRef = React.useRef<number | null>(null);

		const handleMouseEnter: HTMLMotionProps<"div">["onMouseEnter"] = (e) => {
			if (itemRef.current)
				onItemHover(itemRef.current, { x: e.clientX, y: e.clientY });
			onMouseEnter?.(e);
		};

		const handleMouseMove: HTMLMotionProps<"div">["onMouseMove"] = (e) => {
			// rAF-throttled: mousemove fires far more often than a frame renders.
			if (frameRef.current !== null) return;
			const { clientX, clientY } = e;
			frameRef.current = requestAnimationFrame(() => {
				if (itemRef.current)
					onItemHover(itemRef.current, { x: clientX, y: clientY });
				frameRef.current = null;
			});
			onMouseMove?.(e);
		};

		const handleMouseLeave: HTMLMotionProps<"div">["onMouseLeave"] = (e) => {
			if (frameRef.current !== null) {
				cancelAnimationFrame(frameRef.current);
				frameRef.current = null;
			}
			onItemLeave();
			onMouseLeave?.(e);
		};

		// Keyboard users get the highlight (via focus), just not the
		// cursor-following pull — there's no pointer position to follow.
		const handleFocus: HTMLMotionProps<"div">["onFocus"] = (e) => {
			if (itemRef.current) onItemHover(itemRef.current);
			onFocus?.(e);
		};
		const handleBlur: HTMLMotionProps<"div">["onBlur"] = (e) => {
			onItemLeave();
			onBlur?.(e);
		};

		React.useEffect(() => {
			return () => {
				if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
			};
		}, []);

		return (
			<motion.div
				ref={mergeRefs(itemRef, ref)}
				className={cn("relative", className)}
				onMouseEnter={handleMouseEnter}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				onFocus={handleFocus}
				onBlur={handleBlur}
				tabIndex={tabIndex ?? 0}
				{...rest}
			>
				{children}
			</motion.div>
		);
	},
);
MagneticHoverListItem.displayName = "MagneticHoverList.Item";

export const MagneticHoverList = Object.assign(MagneticHoverListRoot, {
	Item: MagneticHoverListItem,
});
