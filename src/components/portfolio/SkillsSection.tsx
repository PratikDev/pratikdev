import { Code2 } from "lucide-react";

import { Section } from "@/components/layout/Section";
import { skillGroups } from "@/content/portfolio";
import type { ModeAwareProps } from "@/lib/mode";
import { Reveal } from "./Reveal";

function normalizeSkill(skill: string) {
	return skill.toLowerCase().replaceAll(" ", "_").replaceAll(".", "");
}

export function SkillsSection({ mode }: ModeAwareProps) {
	return (
		<Section id="skills" title="Skills" eyebrow="Tooling" mode={mode}>
			{mode === "frontend" ? (
				<div className="grid gap-4 md:grid-cols-3">
					{skillGroups.map((group, index) => (
						<Reveal key={group.key} delay={index * 80} className="site-card">
							<div className="mb-5 flex items-start gap-3">
								<div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--site-radius-control)] bg-primary text-primary-foreground">
									<Code2 className="size-4" aria-hidden="true" />
								</div>
								<div>
									<h3 className="font-semibold text-card-foreground">{group.label}</h3>
									<p className="mt-1 text-sm text-muted-foreground">
										{group.description}
									</p>
								</div>
							</div>
							<div className="flex flex-wrap gap-2">
								{group.skills.map((skill) => (
									<span key={skill} className="skill-pill">
										{skill}
									</span>
								))}
							</div>
						</Reveal>
					))}
				</div>
			) : (
				<Reveal className="terminal-block overflow-x-auto">
					<div className="grid gap-3">
						{skillGroups.map((group) => (
							<div key={group.key} className="min-w-max">
								<span className="syntax-key">{group.key.padEnd(10)}</span>
								<span className="syntax-muted"> = [</span>
								<span className="syntax-value">
									{group.skills.map(normalizeSkill).join(", ")}
								</span>
								<span className="syntax-muted">]</span>
							</div>
						))}
					</div>
				</Reveal>
			)}
		</Section>
	);
}
