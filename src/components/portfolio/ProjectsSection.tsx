import { ExternalLink, Server, Sparkles } from "lucide-react";
import type * as React from "react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/Section";
import { projectSections } from "@/content/portfolio";
import type { ProjectItem } from "@/content/portfolio";
import type { ModeAwareProps } from "@/lib/mode";
import { Reveal } from "./Reveal";

function displayUrl(url: string) {
	return url.replace(/^https?:\/\//, "");
}

function JsonLine({
	label,
	children,
	comma = true,
}: {
	label: string;
	children: React.ReactNode;
	comma?: boolean;
}) {
	return (
		<div>
			<span className="syntax-key">"{label}"</span>
			<span className="syntax-muted">: </span>
			{children}
			{comma ? <span className="syntax-muted">,</span> : null}
		</div>
	);
}

function ProjectJson({ project }: { project: ProjectItem }) {
	return (
		<pre className="terminal-block overflow-x-auto">
			<code>
				<span className="syntax-muted">{"{"}</span>
				<div className="pl-4">
					<JsonLine label="name">
						<span className="syntax-value">"{project.slug}"</span>
					</JsonLine>
					<JsonLine label="stack">
						<span className="syntax-muted">[</span>
						{project.stack.map((tool, index) => (
							<span key={tool}>
								<span className="syntax-value">"{tool.toLowerCase()}"</span>
								{index < project.stack.length - 1 ? (
									<span className="syntax-muted">, </span>
								) : null}
							</span>
						))}
						<span className="syntax-muted">]</span>
					</JsonLine>
					<JsonLine label="type">
						<span className="syntax-value">"{project.type}"</span>
					</JsonLine>
					<JsonLine label="status" comma={Boolean(project.url)}>
						<span className="syntax-value">"{project.status}"</span>
					</JsonLine>
					{project.url ? (
						<JsonLine label="url" comma={false}>
							<span className="syntax-value">"{displayUrl(project.url)}"</span>
						</JsonLine>
					) : null}
				</div>
				<span className="syntax-muted">{"}"}</span>
			</code>
		</pre>
	);
}

export function ProjectsSection({ mode }: ModeAwareProps) {
	return (
		<Section id="projects" title="Projects" eyebrow="Selected work" mode={mode}>
			<div className="grid gap-12">
				{projectSections.map((section) => (
					<div key={section.maturity}>
						<div className="mb-5 flex items-center gap-3">
							{mode === "frontend" ? (
								<div className="flex size-9 items-center justify-center rounded-(--site-radius-control) bg-primary text-primary-foreground">
									{section.maturity === "production" ? (
										<Sparkles className="size-4" aria-hidden="true" />
									) : (
										<Server className="size-4" aria-hidden="true" />
									)}
								</div>
							) : null}
							<h3 className="text-xl font-semibold text-foreground">
								{mode === "backend" ? `// ${section.title}` : section.title}
							</h3>
						</div>
						{section.note ? (
							<p className="mb-5 max-w-2xl text-sm italic text-muted-foreground">
								{mode === "backend" ? `// ${section.note}` : section.note}
							</p>
						) : null}
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{section.projects.map((project, index) => (
								<Reveal key={project.slug} delay={index * 70}>
									{mode === "frontend" ? (
										<article className="site-card group h-full">
											<div className="project-visual mb-5">
												<span>{project.type}</span>
											</div>
											<div className="flex h-[calc(100%-var(--site-project-visual-height)-1.25rem)] flex-col">
												<h4 className="text-lg font-semibold text-card-foreground">
													{project.name}
												</h4>
												<p className="mt-3 flex-1 leading-(--site-leading) text-muted-foreground">
													{project.description}
												</p>
												<div className="mt-5 flex flex-wrap gap-2">
													{project.stack.map((tool) => (
														<span key={tool} className="skill-pill">
															{tool}
														</span>
													))}
												</div>
												{project.url ? (
													<Button asChild variant="outline" className="mt-6 rounded-(--site-radius-control)">
														<a href={project.url} target="_blank" rel="noreferrer">
															View project
															<ExternalLink className="size-4" aria-hidden="true" />
														</a>
													</Button>
												) : null}
											</div>
										</article>
									) : (
										<ProjectJson project={project} />
									)}
								</Reveal>
							))}
						</div>
					</div>
				))}
			</div>
		</Section>
	);
}
