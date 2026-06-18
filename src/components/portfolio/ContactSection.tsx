import { GitBranch, Mail, Network, Send } from "lucide-react";

import { Section } from "@/components/layout/Section";
import { contactLinks } from "@/content/portfolio";
import type { ContactLink } from "@/content/portfolio";
import type { ModeAwareProps } from "@/lib/mode";
import { Reveal } from "./Reveal";

function ContactIcon({ item }: { item: ContactLink }) {
	const className = "size-4";

	switch (item.key) {
		case "email":
			return <Mail className={className} aria-hidden="true" />;
		case "github":
			return <GitBranch className={className} aria-hidden="true" />;
		case "linkedin":
			return <Network className={className} aria-hidden="true" />;
		case "x":
			return <Send className={className} aria-hidden="true" />;
	}
}

export function ContactSection({ mode }: ModeAwareProps) {
	return (
		<Section id="contact" title="Contact" eyebrow="Open channel" mode={mode}>
			<Reveal className="site-card">
				{mode === "frontend" ? (
					<div className="grid gap-3 sm:grid-cols-2">
						{contactLinks.map((item) => (
							<a
								key={item.key}
								href={item.href}
								target={item.key === "email" ? undefined : "_blank"}
								rel={item.key === "email" ? undefined : "noreferrer"}
								className="contact-link"
							>
								<ContactIcon item={item} />
								<span>
									<span className="block text-sm font-medium text-card-foreground">
										{item.label}
									</span>
									<span className="break-all text-sm text-muted-foreground">
										{item.display}
									</span>
								</span>
							</a>
						))}
					</div>
				) : (
					<pre className="terminal-block overflow-x-auto">
						<code>
							<span className="syntax-muted">{"{"}</span>
							{contactLinks.map((item, index) => (
								<div key={item.key} className="pl-4">
									<span className="syntax-key">"{item.key}"</span>
									<span className="syntax-muted">: </span>
									<span className="syntax-value">"{item.display}"</span>
									{index < contactLinks.length - 1 ? (
										<span className="syntax-muted">,</span>
									) : null}
								</div>
							))}
							<span className="syntax-muted">{"}"}</span>
						</code>
					</pre>
				)}
			</Reveal>
		</Section>
	);
}
