import * as React from "react";

export type ScrollStageContextValue = {
	activeIndex: number;
	panelCount: number;
	reducedMotion: boolean;
	masterTween: GSAPTween | null;
	scrollToPanel: (index: number) => void;
	setInputLocked: (locked: boolean) => void;
	stageRef: React.RefObject<HTMLDivElement | null>;
	trackRef: React.RefObject<HTMLDivElement | null>;
};

export const ScrollStageContext =
	React.createContext<ScrollStageContextValue | null>(null);

export function useScrollStage() {
	const ctx = React.useContext(ScrollStageContext);

	if (!ctx) {
		throw new Error("useScrollStage must be used within a ScrollStage");
	}

	return ctx;
}
