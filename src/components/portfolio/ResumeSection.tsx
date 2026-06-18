import { Download, FileCode2, FileText } from "lucide-react";

import { Section } from "@/components/layout/Section";
import { resumeItems } from "@/content/portfolio";
import type { ResumeItem } from "@/content/portfolio";
import type { ModeAwareProps } from "@/lib/mode";
import { Reveal } from "./Reveal";

function ResumeIcon({ item }: { item: ResumeItem }) {
	const className = "size-5";

	switch (item.key) {
		case "pdf":
			return <FileText className={className} aria-hidden="true" />;
		case "markdown":
			return <FileCode2 className={className} aria-hidden="true" />;
	}
}

export function ResumeSection({ mode }: ModeAwareProps) {
	return (
		<Section
			id="resume"
			title="Resume"
			eyebrow="Readable formats"
			mode={mode}
		>
			<Reveal className="site-card">
				{mode === "frontend" ? (
					<div className="grid gap-3 sm:grid-cols-2">
						{resumeItems.map((item) => (
							<a
								key={item.key}
								href={item.href}
								target="_blank"
								rel="noreferrer"
								className="contact-link"
							>
								<div className="flex size-10 shrink-0 items-center justify-center rounded-(--site-radius-control) bg-primary text-primary-foreground">
									<ResumeIcon item={item} />
								</div>
								<span className="min-w-0 flex-1">
									<span className="flex items-center gap-2 text-sm font-medium text-card-foreground">
										{item.label}
										<Download className="size-3.5" aria-hidden="true" />
									</span>
									<span className="mt-1 block text-sm text-muted-foreground">
										{item.description}
									</span>
									<span className="mt-3 block break-all text-xs font-medium text-primary">
										{item.fileName}
									</span>
								</span>
							</a>
						))}
					</div>
				) : (
					<pre className="terminal-block overflow-x-auto">
						<code>
							<span className="syntax-muted">[</span>
							{resumeItems.map((item, index) => (
								<div key={item.key} className="pl-4">
									<span className="syntax-muted">{"{"}</span>
									<div className="pl-4">
										<div>
											<span className="syntax-key">"format"</span>
											<span className="syntax-muted">: </span>
											<span className="syntax-value">"{item.format.toLowerCase()}"</span>
											<span className="syntax-muted">,</span>
										</div>
										<div>
											<span className="syntax-key">"file"</span>
											<span className="syntax-muted">: </span>
											<span className="syntax-value">"{item.fileName}"</span>
											<span className="syntax-muted">,</span>
										</div>
										<div>
											<span className="syntax-key">"href"</span>
											<span className="syntax-muted">: </span>
											<span className="syntax-value">"{item.href}"</span>
										</div>
									</div>
									<span className="syntax-muted">
										{"}"}
										{index < resumeItems.length - 1 ? "," : ""}
									</span>
								</div>
							))}
							<span className="syntax-muted">]</span>
						</code>
					</pre>
				)}
			</Reveal>
		</Section>
	);
}
