import { useState } from "react";

import { Navbar } from "@/components/layout/Navbar";
import { ContactSection } from "@/components/portfolio/ContactSection";
import { CurrentlySection } from "@/components/portfolio/CurrentlySection";
import { ExperienceSection } from "@/components/portfolio/ExperienceSection";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { ResumeSection } from "@/components/portfolio/ResumeSection";
import { SkillsSection } from "@/components/portfolio/SkillsSection";
import type { PortfolioMode } from "@/lib/mode";

export default function App() {
	const [mode, setMode] = useState<PortfolioMode>("frontend");

	return (
		<div
			data-mode={mode}
			className="min-h-screen bg-background text-foreground transition-mode"
		>
			<Navbar mode={mode} onModeChange={setMode} />
			<main>
				<HeroSection mode={mode} />
				<CurrentlySection mode={mode} />
				<ExperienceSection mode={mode} />
				<ProjectsSection mode={mode} />
				<SkillsSection mode={mode} />
				<ResumeSection mode={mode} />
				<ContactSection mode={mode} />
			</main>
		</div>
	);
}
