import { Download, FileCode2, FileText } from "lucide-react";

import { Panel } from "@/components/layout/Panel";
import type { ResumeItem } from "@/content/portfolio";
import { resumeItems } from "@/content/portfolio";

function ResumeIcon({ item }: { item: ResumeItem }) {
	const className = "size-7";

	switch (item.key) {
		case "pdf":
			return <FileText className={className} aria-hidden="true" />;
		case "markdown":
			return <FileCode2 className={className} aria-hidden="true" />;
	}
}

export function ResumeSection() {
	return (
		<Panel id="resume" eyebrow="Readable formats" title="Resume">
			<div className="grid gap-5 sm:grid-cols-2">
				{resumeItems.map((item) => (
					<a
						key={item.key}
						href={item.href}
						target="_blank"
						rel="noreferrer"
						className="contact-link p-6 shadow-md"
					>
						<div className="flex size-14 shrink-0 items-center justify-center rounded-(--site-radius-control) bg-primary text-primary-foreground">
							<ResumeIcon item={item} />
						</div>
						<span className="min-w-0 flex-1">
							<span className="font-heading flex items-center gap-2 text-(length:--text-h2) font-semibold text-card-foreground">
								{item.label}
								<Download className="size-5" aria-hidden="true" />
							</span>
							<span className="mt-2 block text-lg text-muted-foreground">
								{item.description}
							</span>
							<span className="mt-4 block truncate text-sm font-medium text-primary">
								{item.fileName}
							</span>
						</span>
					</a>
				))}
			</div>
		</Panel>
	);
}
