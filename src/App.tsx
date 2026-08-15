import { Navbar } from "@/components/layout/Navbar";
import {
	ScrollStageProvider,
	ScrollTrack,
} from "@/components/layout/ScrollStage";
import { ContactSection } from "@/components/portfolio/ContactSection";
import { CurrentlySection } from "@/components/portfolio/CurrentlySection";
import { ExperienceSection } from "@/components/portfolio/ExperienceSection";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { ResumeSection } from "@/components/portfolio/ResumeSection";
import { SkillsSection } from "@/components/portfolio/SkillsSection";

export default function App() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<ScrollStageProvider>
				<Navbar />
				<ScrollTrack>
					<HeroSection />
					<CurrentlySection />
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
