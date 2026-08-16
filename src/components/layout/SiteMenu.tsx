import StaggeredMenu from "@/components/ui/StaggeredMenu";
import { contactLinks, navItems } from "@/content/portfolio";
// import { useScrollStage } from "@/hooks/use-scroll-stage";
import { useScrollStage } from "@/components/layout/ScrollStageV2";
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
	return navId === "projects" ? PROJECT_PANEL_IDS[0] : (navId as PanelId);
}

export function SiteMenu() {
	const { goTo: scrollToPanel, setInputLocked } = useScrollStage();

	return (
		<StaggeredMenu
			position="left"
			items={menuItems}
			socialItems={socialItems}
			displaySocials
			displayItemNumbering
			isFixed
			menuButtonColor="#0e0d0c"
			openMenuButtonColor="#e8380d"
			changeMenuColorOnOpen
			colors={["#fdeee8", "#e8380d"]}
			accentColor="#e8380d"
			onItemClick={(item) => {
				const id = item.link.replace("#", "");
				scrollToPanel(PANEL_ORDER.indexOf(resolvePanelId(id)));
			}}
			onMenuOpen={() => setInputLocked("menu", true)}
			onMenuClose={() => setInputLocked("menu", false)}
		/>
	);
}
