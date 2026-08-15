import { Panel } from "@/components/layout/Panel";
import { skillGroups } from "@/content/portfolio";

export function SkillsSection() {
	return (
		<Panel id="skills" eyebrow="Tooling" title="Skills">
			<div className="grid gap-8 sm:grid-cols-2">
				{skillGroups.map((group) => (
					<div key={group.key}>
						<h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
							{group.label}
						</h3>
						<div className="flex flex-wrap gap-2">
							{group.skills.map((skill) => (
								<span key={skill} className="skill-pill">
									{skill}
								</span>
							))}
						</div>
					</div>
				))}
			</div>
		</Panel>
	);
}
