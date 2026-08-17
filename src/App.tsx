import { SiteMenu } from "@/components/layout/SiteMenu";
import { AboutSection } from "@/components/portfolio/AboutSection";
import { ContactSection } from "@/components/portfolio/ContactSection";
import { ExperienceSection } from "@/components/portfolio/ExperienceSection";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { ResumeSection } from "@/components/portfolio/ResumeSection";
import { SkillsSection } from "@/components/portfolio/SkillsSection";
import ShapeGrid from "@/components/ui/ShapeGrid";
import { ScrollStage, useScrollStage } from "./components/layout/ScrollStage";
import { HeroAboutZoomStage } from "./components/portfolio/Intro/HeroAboutZoomStage";
import { ProjectsSection } from "./components/portfolio/ProjectsSection";
import { PANEL_ORDER } from "./lib/panels";

const INTRO_INDEX = PANEL_ORDER.indexOf("intro");

// Everything that needs to read the root stage's activeIndex has to live
// INSIDE <ScrollStage>, not alongside it — App itself renders the provider,
// so useScrollStage() isn't available at that level yet.
function SiteTrack() {
	const { activeIndex } = useScrollStage();

	return (
		<>
			<SiteMenu />
			<ScrollStage.Track>
				<HeroAboutZoomStage active={activeIndex === INTRO_INDEX}>
					<HeroSection />
					<AboutSection />
				</HeroAboutZoomStage>
				<ExperienceSection />
				<ProjectsSection />
				<SkillsSection />
				<ResumeSection />
				<ContactSection />
			</ScrollStage.Track>
		</>
	);
}

export default function App() {
	return (
		<div className="min-h-screen text-foreground">
			<div className="fixed inset-0 -z-10">
				<ShapeGrid
					direction="diagonal"
					speed={0.15}
					squareSize={44}
					shape="square"
					borderColor="#f2f0eb"
					hoverFillColor="#fff"
					hoverTrailAmount={0}
					vignetteColor="#ffffff"
					vignetteStopColor="rgba(255, 255, 255, 0)"
				/>
			</div>
			<ScrollStage
				axis="x"
				stepCount={PANEL_ORDER.length}
				className="h-screen w-screen"
			>
				<SiteTrack />
			</ScrollStage>
		</div>
	);
}
