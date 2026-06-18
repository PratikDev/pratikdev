import { Activity } from "lucide-react";

import { Section } from "@/components/layout/Section";
import { currentlyContent } from "@/content/portfolio";
import type { ModeAwareProps } from "@/lib/mode";
import { Reveal } from "./Reveal";

export function CurrentlySection({ mode }: ModeAwareProps) {
	return (
		<Section id="about" title="Currently" eyebrow="About" mode={mode}>
			<Reveal className="site-card">
				{mode === "frontend" ? (
					<div className="flex gap-4">
						<div className="flex size-10 shrink-0 items-center justify-center rounded-(--site-radius-control) bg-primary text-primary-foreground">
							<Activity className="size-5" aria-hidden="true" />
						</div>
						<p className="text-base leading-(--site-leading) text-card-foreground">
							{currentlyContent.prose}
						</p>
					</div>
				) : (
					<pre className="terminal-block overflow-x-auto">
						<code>{currentlyContent.logLine}</code>
					</pre>
				)}
			</Reveal>
		</Section>
	);
}
