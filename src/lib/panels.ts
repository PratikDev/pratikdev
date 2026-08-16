import { projectSections } from "@/content/portfolio";

const PROJECT_COUNT = projectSections.reduce(
	(sum, section) => sum + section.projects.length,
	0,
);

export const PROJECT_PANEL_IDS = Array.from(
	{ length: PROJECT_COUNT },
	(_, index) => `project-${index}` as const,
);

export const PANEL_ORDER = [
	"top",
	"about",
	"experience",
	...PROJECT_PANEL_IDS,
	"skills",
	"resume",
	"contact",
] as const;

export type PanelId = (typeof PANEL_ORDER)[number];
