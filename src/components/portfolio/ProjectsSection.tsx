import { ExternalLink, GitBranch } from "lucide-react";
import { useState } from "react";

import { Panel } from "@/components/layout/Panel";
import OptionWheel from "@/components/ui/OptionWheel";
import type { ProjectItem } from "@/content/portfolio";
import { projects } from "@/content/portfolio";

import clickSoftSoundPath from "@/assets/sounds/click-soft.mp3";
import { cn } from "@/lib/utils";

function ProjectPanel({
	project,
	className,
}: {
	project: ProjectItem;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"site-card mx-auto p-10 md:p-16 shadow-shadow border-4",
				className,
			)}
		>
			<span className="skill-pill mb-6 inline-block w-fit">{project.type}</span>
			<h2 className="text-(length:--text-h2) leading-[0.9] font-semibold tracking-tight text-foreground">
				{project.name}
			</h2>
			<p className="mt-8 max-w-4xl text-[2rem] leading-snug text-zinc-800">
				{project.description}
			</p>
			<div className="mt-8 flex flex-wrap gap-2.5">
				{project.stack.map((tool) => (
					<span
						key={tool}
						className="skill-pill"
					>
						{tool}
					</span>
				))}
			</div>
			{project.url || project.source ? (
				<div className="mt-10 flex flex-wrap gap-6">
					{project.url ? (
						<a
							href={project.url}
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-2 text-lg font-medium text-primary hover:underline border border-primary bg-secondary px-3 py-1"
						>
							View project
							<ExternalLink
								className="size-4"
								aria-hidden="true"
							/>
						</a>
					) : null}
					{project.source ? (
						<a
							href={project.source}
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-2 text-lg font-medium text-muted-foreground hover:text-foreground hover:underline border border-foreground bg-muted px-3 py-1"
						>
							Source
							<GitBranch
								className="size-4"
								aria-hidden="true"
							/>
						</a>
					) : null}
				</div>
			) : null}
		</div>
	);
}

export function ProjectsSection() {
	const [activeProjectIndex, setActiveProjectIndex] = useState<number>(2);
	const allProjectNames = projects.map((project) => project.name);
	const activeProject = projects[activeProjectIndex];

	return (
		<Panel
			id="projects"
			className="relative"
		>
			<div className="absolute left-0 top-1/2 -translate-y-1/2 h-[calc(100%+400px)] bg-foreground -z-20 w-1/2 rounded-r-[480px]"></div>

			<div className="grid grid-cols-3 h-full">
				<OptionWheel
					items={allProjectNames}
					defaultSelected={2}
					textColor="var(--muted-foreground)"
					activeColor="var(--primary)"
					className="font-heading"
					side="left"
					fontSize={3}
					spacing={1.4}
					curve={1}
					tilt={10.5}
					blur={2}
					fade={0.25}
					smoothing={100}
					inset={40}
					// loop
					draggable
					soundUrl={clickSoftSoundPath}
					soundVolume={0.5}
					onChange={setActiveProjectIndex}
				/>

				<div className="p-3 col-span-2 grid place-content-center">
					<p className="eyebrow mb-3 ml-6 text-2xl">Selected Work</p>

					<ProjectPanel
						project={activeProject}
						className=""
					/>
				</div>
			</div>
		</Panel>
	);
}
