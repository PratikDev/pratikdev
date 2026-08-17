export const PANEL_ORDER = [
	"intro",
	"experience",
	"projects",
	"skills",
	"resume",
	"contact",
] as const;

export type PanelId = (typeof PANEL_ORDER)[number];
