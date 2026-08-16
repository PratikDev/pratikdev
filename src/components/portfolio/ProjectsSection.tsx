import { ExternalLink, GitBranch } from "lucide-react";

import { Panel } from "@/components/layout/Panel";
import type { ProjectItem } from "@/content/portfolio";
import { projectSections } from "@/content/portfolio";
import { useDiagonalReveal } from "@/hooks/use-diagonal-reveal";
import type { PanelId } from "@/lib/panels";

const allProjects = projectSections.flatMap((section) => section.projects);

function ProjectPanel({
	project,
	index,
}: {
	project: ProjectItem;
	index: number;
}) {
	const panelId = `project-${index}` as PanelId;
	const contentRef = useDiagonalReveal(panelId);

	return (
		<Panel id={panelId}>
			<div
				ref={contentRef}
				className="site-card mx-auto w-full max-w-[1600px] p-10 md:p-16"
			>
				<div className="mb-6 flex items-center justify-between">
					<p className="eyebrow">Selected work</p>
					<p className="font-mono text-sm font-semibold text-primary">
						{String(index + 1).padStart(2, "0")} /{" "}
						{String(allProjects.length).padStart(2, "0")}
					</p>
				</div>
				<span className="skill-pill mb-6 inline-block w-fit">
					{project.type}
				</span>
				<h2 className="text-(length:--text-display) leading-[0.9] font-semibold tracking-tight text-foreground">
					{project.name}
				</h2>
				<p className="mt-8 max-w-4xl text-[2rem] leading-snug text-muted-foreground">
					{project.description}
				</p>
				<div className="mt-8 flex flex-wrap gap-2.5">
					{project.stack.map((tool) => (
						<span key={tool} className="skill-pill">
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
								className="inline-flex items-center gap-2 text-lg font-medium text-primary hover:underline"
							>
								View project
								<ExternalLink className="size-4" aria-hidden="true" />
							</a>
						) : null}
						{project.source ? (
							<a
								href={project.source}
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center gap-2 text-lg font-medium text-muted-foreground hover:text-foreground hover:underline"
							>
								Source
								<GitBranch className="size-4" aria-hidden="true" />
							</a>
						) : null}
					</div>
				) : null}
			</div>
		</Panel>
	);
}

export function ProjectsSection() {
	return (
		<>
			{allProjects.map((project, index) => (
				<ProjectPanel key={project.slug} project={project} index={index} />
			))}
		</>
	);
}
