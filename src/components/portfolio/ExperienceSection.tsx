import { Panel } from "@/components/layout/Panel";
import { experienceItems } from "@/content/portfolio";
import { motion } from "motion/react";
import { MagneticHoverList } from "../ui/magnetic-hover-list";

export function ExperienceSection() {
	return (
		<Panel
			id="experience"
			eyebrow="Work log"
			title="Experience"
			className="bg-foreground text-accent"
		>
			<MagneticHoverList
				className="flex flex-col divide-y divide-border overflow-hidden"
				highlightClassName="bg-secondary rounded-md"
			>
				{experienceItems.map((item, index) => (
					<MagneticHoverList.Item key={item.companyKey}>
						<motion.div
							initial={{ clipPath: "inset(0 0 100% 0)" }}
							whileInView={{ clipPath: "inset(0 0 0% 0)" }}
							viewport={{ once: true }}
							transition={{
								duration: 0.8,
								ease: [0.22, 1, 0.36, 1],
								delay: index * 0.15,
							}}
							className="flex flex-col gap-1.5 p-3 sm:flex-row sm:items-center sm:gap-6 group"
						>
							<p className="w-36 shrink-0 font-mono text-xs text-primary">
								{item.start} – {item.end}
							</p>
							<div className="flex w-64 shrink-0 items-baseline gap-2">
								<h3 className="text-lg font-semibold text-accent group-hover:text-primary transition-colors">
									{item.company}
								</h3>
								<span className="text-sm text-muted-foreground">
									{item.role}
								</span>
							</div>
							<p className="hidden flex-1 truncate text-sm text-muted-foreground xl:block">
								{item.description}
							</p>
							<div className="flex flex-wrap gap-1.5 sm:justify-end">
								{item.stack.slice(0, 3).map((tool) => (
									<span
										key={tool}
										className="skill-pill px-2 py-0.5 text-xs"
									>
										{tool}
									</span>
								))}
							</div>
						</motion.div>
					</MagneticHoverList.Item>
				))}
			</MagneticHoverList>
		</Panel>
	);
}
