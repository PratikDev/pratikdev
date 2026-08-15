import { Panel } from "@/components/layout/Panel";
import { currentlyContent } from "@/content/portfolio";

export function CurrentlySection() {
	return (
		<Panel
			id="about"
			eyebrow="About"
			title="Currently"
		>
			<p className="text-(length:--text-h2) leading-snug font-medium text-muted-foreground">
				{currentlyContent.prose}
			</p>
		</Panel>
	);
}
