import {
	ScrollStageProvider,
	ScrollTrack,
} from "@/components/layout/ScrollStage";
import { SiteMenu } from "@/components/layout/SiteMenu";
import { AboutSection } from "@/components/portfolio/AboutSection";
import { ContactSection } from "@/components/portfolio/ContactSection";
import { ExperienceSection } from "@/components/portfolio/ExperienceSection";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { ResumeSection } from "@/components/portfolio/ResumeSection";
import { SkillsSection } from "@/components/portfolio/SkillsSection";
import ShapeGrid from "@/components/ui/ShapeGrid";

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
			<ScrollStageProvider>
				<SiteMenu />
				<ScrollTrack>
					<HeroSection />
					<AboutSection />
					<ExperienceSection />
					<ProjectsSection />
					<SkillsSection />
					<ResumeSection />
					<ContactSection />
				</ScrollTrack>
			</ScrollStageProvider>
		</div>
	);
}
