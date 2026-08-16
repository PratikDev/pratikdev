// import {
// 	ScrollStageProvider,
// 	ScrollTrack,
// } from "@/components/layout/ScrollStage";
import { SiteMenu } from "@/components/layout/SiteMenu";
import { AboutSection } from "@/components/portfolio/AboutSectionV2";
import { ContactSection } from "@/components/portfolio/ContactSection";
import { ExperienceSection } from "@/components/portfolio/ExperienceSection";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { ResumeSection } from "@/components/portfolio/ResumeSection";
import { SkillsSection } from "@/components/portfolio/SkillsSection";
import ShapeGrid from "@/components/ui/ShapeGrid";
import { ScrollStage } from "./components/layout/ScrollStageV2";
import { ProjectsSection } from "./components/portfolio/ProjectsSection";
import { PANEL_ORDER } from "./lib/panels";

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
				<SiteMenu />
				<ScrollStage.Track>
					<HeroSection />
					<AboutSection />
					<ExperienceSection />
					<ProjectsSection />
					<SkillsSection />
					<ResumeSection />
					<ContactSection />
				</ScrollStage.Track>
			</ScrollStage>
		</div>
	);
}
