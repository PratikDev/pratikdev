import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { heroContent } from "@/content/portfolio";
import type { ModeAwareProps } from "@/lib/mode";
import { Reveal } from "./Reveal";

export function HeroSection({ mode }: ModeAwareProps) {
	return (
		<section
			id="top"
			className="relative flex min-h-[calc(100vh-var(--site-nav-height))] items-center pt-[calc(var(--site-nav-height)+var(--site-hero-offset))]"
		>
			<div className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-12 sm:px-6 lg:px-8">
				<Reveal className="max-w-4xl">
					<p className="mb-4 text-sm font-medium text-primary">
						{mode === "frontend" ? "Frontend craft, backend curiosity" : "$ whoami"}
					</p>
					{mode === "frontend" ? (
						<>
							<h1 className="text-4xl font-semibold leading-tight tracking-normal text-foreground sm:text-5xl lg:text-6xl">
								{heroContent.headline}
							</h1>
							<p className="mt-6 max-w-2xl text-lg leading-(--site-leading) text-muted-foreground">
								{heroContent.subheading}
							</p>
						</>
					) : (
						<pre className="terminal-block overflow-x-auto text-sm sm:text-base">
							<code>{heroContent.logLine}</code>
						</pre>
					)}
					<div className="mt-8 flex flex-wrap items-center gap-4">
						<Button asChild size="lg" className="rounded-(--site-radius-control)">
							<a href="#projects">
								View projects
								<ArrowRight className="size-4" aria-hidden="true" />
							</a>
						</Button>
						<a
							href="#contact"
							className="text-sm font-medium text-primary underline-offset-4 transition-mode hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							Get in touch
						</a>
					</div>
				</Reveal>
				<Reveal delay={120} className="text-sm italic text-muted-foreground">
					{mode === "frontend"
						? "Use the toggle in the nav to switch from the interface to the internals."
						: "// same content, raw surface"}
				</Reveal>
			</div>
		</section>
	);
}
