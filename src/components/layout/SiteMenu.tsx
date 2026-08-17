import { useScrollStage } from "@/components/layout/ScrollStage";
import StaggeredMenu from "@/components/ui/StaggeredMenu";
import { contactLinks, navItems } from "@/content/portfolio";
import { requestPanel } from "@/lib/panel-navigation";
import { PANEL_ORDER, PROJECT_PANEL_IDS, type PanelId } from "@/lib/panels";

const menuItems = navItems.map((item) => ({
	label: item.label,
	ariaLabel: `Go to ${item.label}`,
	link: `#${item.id}`,
}));

const socialItems = contactLinks.map((item) => ({
	label: item.label,
	link: item.href,
}));

function resolvePanelId(navId: string): PanelId {
	if (navId === "projects") return PROJECT_PANEL_IDS[0];
	// Hero and About collapsed into one root-level slot (HeroAboutZoomStage);
	// both nav ids now resolve to that combined "intro" step.
	if (navId === "hero" || navId === "top" || navId === "about")
		return "intro" as PanelId;
	return navId as PanelId;
}

const DARK_SCREEN_PANEL_INDEXES = [1, 2];

export function SiteMenu() {
	const { goTo, setInputLocked, activeIndex } = useScrollStage();

	return (
		<StaggeredMenu
			position="left"
			items={menuItems}
			socialItems={socialItems}
			displaySocials
			displayItemNumbering
			isFixed
			menuButtonColor={
				DARK_SCREEN_PANEL_INDEXES.indexOf(activeIndex) !== -1
					? "#fff"
					: "#0e0d0c"
			}
			openMenuButtonColor="#e8380d"
			changeMenuColorOnOpen
			colors={["#fdeee8", "#e8380d"]}
			accentColor="#e8380d"
			onItemClick={(item) => {
				const id = item.link.replace("#", "");
				goTo(PANEL_ORDER.indexOf(resolvePanelId(id)));
				// Broadcast the RAW id (not the resolved root-level one) — any
				// nested stage down the tree (the zoom stage, About's own
				// chapter stage) that knows how to position itself for this
				// specific id can react, independently of how many root-level
				// slots it maps to. Not a PanelId — see panel-navigation.ts.
				requestPanel(id);
			}}
			onMenuOpen={() => setInputLocked("menu", true)}
			onMenuClose={() => setInputLocked("menu", false)}
		/>
	);
}
