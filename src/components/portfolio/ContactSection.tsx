import { GitBranch, Mail, Network, Send } from "lucide-react";

import { Panel } from "@/components/layout/Panel";
import type { ContactLink } from "@/content/portfolio";
import { contactLinks } from "@/content/portfolio";

function ContactIcon({ item }: { item: ContactLink }) {
	const className = "size-6";

	switch (item.key) {
		case "email":
			return (
				<Mail
					className={className}
					aria-hidden="true"
				/>
			);
		case "github":
			return (
				<GitBranch
					className={className}
					aria-hidden="true"
				/>
			);
		case "linkedin":
			return (
				<Network
					className={className}
					aria-hidden="true"
				/>
			);
		case "x":
			return (
				<Send
					className={className}
					aria-hidden="true"
				/>
			);
	}
}

export function ContactSection() {
	return (
		<Panel
			id="contact"
			eyebrow="Open channel"
			title="Let's talk"
		>
			<p className="max-w-2xl text-(length:--text-body) text-muted-foreground">
				Open to new opportunities.
			</p>
			<div className="mt-10 grid gap-5 sm:grid-cols-2">
				{contactLinks.map((item) => (
					<a
						key={item.key}
						href={item.href}
						target={item.key === "email" ? undefined : "_blank"}
						rel={item.key === "email" ? undefined : "noreferrer"}
						className="contact-link items-center gap-4 p-6 shadow-md"
					>
						<ContactIcon item={item} />
						<span>
							<span className="font-heading block text-(length:--text-h2) font-semibold text-card-foreground">
								{item.label}
							</span>
							<span className="text-lg break-all text-muted-foreground">
								{item.display}
							</span>
						</span>
					</a>
				))}
			</div>
		</Panel>
	);
}
