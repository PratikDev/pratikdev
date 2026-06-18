import { BriefcaseBusiness } from "lucide-react";

import { Section } from "@/components/layout/Section";
import { experienceItems } from "@/content/portfolio";
import type { ExperienceItem } from "@/content/portfolio";
import type { ModeAwareProps } from "@/lib/mode";
import { Reveal } from "./Reveal";

function getInitials(company: string) {
	return company
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

function formatBackendDate(item: ExperienceItem) {
	return `${item.start.toLowerCase().replace(" ", "-")} -> ${item.end.toLowerCase()}`;
}

export function ExperienceSection({ mode }: ModeAwareProps) {
	return (
		<Section id="experience" title="Experience" eyebrow="Work log" mode={mode}>
			{mode === "frontend" ? (
				<div className="relative grid gap-5 before:absolute before:left-5 before:top-4 before:hidden before:h-[calc(100%-2rem)] before:w-px before:bg-border sm:before:block">
					{experienceItems.map((item, index) => (
						<Reveal
							key={item.companyKey}
							delay={index * 80}
							className="site-card relative sm:ml-14"
						>
							<div className="absolute -left-14 top-6 hidden size-10 items-center justify-center rounded-full border border-border bg-card text-sm font-semibold text-primary shadow-(--site-shadow-card) sm:flex">
								{getInitials(item.company)}
							</div>
							<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
								<div>
									<div className="mb-2 flex items-center gap-2 text-primary">
										<BriefcaseBusiness className="size-4" aria-hidden="true" />
										<p className="text-sm font-medium">{item.start} - {item.end}</p>
									</div>
									<h3 className="text-xl font-semibold text-card-foreground">
										{item.role}
									</h3>
									<p className="mt-1 text-sm font-medium text-muted-foreground">
										{item.company}
									</p>
									<p className="mt-4 max-w-3xl leading-(--site-leading) text-muted-foreground">
										{item.description}
									</p>
								</div>
								<div className="flex flex-wrap gap-2 lg:max-w-xs lg:justify-end">
									{item.stack.map((tool) => (
										<span key={tool} className="skill-pill">
											{tool}
										</span>
									))}
								</div>
							</div>
						</Reveal>
					))}
				</div>
			) : (
				<Reveal className="terminal-block overflow-x-auto">
					<div className="grid gap-3">
						{experienceItems.map((item) => (
							<div key={item.companyKey} className="min-w-max">
								<span className="syntax-muted">{formatBackendDate(item).padEnd(24)}</span>
								<span className="syntax-key">{item.companyKey.padEnd(22)}</span>
								<span className="syntax-value">
									{item.role.toLowerCase().replaceAll(" ", "_")}
								</span>
								<span className="syntax-muted"> stack=[{item.stack.join(", ")}]</span>
							</div>
						))}
					</div>
				</Reveal>
			)}
		</Section>
	);
}
