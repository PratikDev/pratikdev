import resumeMarkdownUrl from "@/assets/pratik-resume.md?url";
import resumePdfUrl from "@/assets/pratik-resume.pdf?url";

export type NavItem = {
	id: "about" | "experience" | "projects" | "resume" | "contact";
	frontendLabel: string;
	backendLabel: string;
};

export type ExperienceItem = {
	company: string;
	companyKey: string;
	role: string;
	start: string;
	end: string;
	description: string;
	stack: string[];
};

export type ProjectMaturity = "production" | "learning";

export type ProjectItem = {
	name: string;
	slug: string;
	description: string;
	stack: string[];
	maturity: ProjectMaturity;
	url?: string;
	source?: string;
	status: "shipped" | "learning";
	type: "fullstack" | "frontend" | "backend" | "cli" | "systems";
};

export type ProjectSection = {
	title: string;
	note?: string;
	maturity: ProjectMaturity;
	projects: ProjectItem[];
};

export type SkillGroup = {
	label: string;
	key: "primary" | "backend" | "ai_agents";
	description: string;
	skills: string[];
};

export type ContactLink = {
	key: "email" | "github" | "linkedin" | "x";
	label: string;
	href: string;
	display: string;
};

export type ResumeItem = {
	key: "pdf" | "markdown";
	label: string;
	format: "PDF" | "Markdown";
	href: string;
	fileName: string;
	description: string;
};

export const navItems: NavItem[] = [
	{ id: "about", frontendLabel: "About", backendLabel: "GET /about" },
	{
		id: "experience",
		frontendLabel: "Experience",
		backendLabel: "GET /experience",
	},
	{ id: "projects", frontendLabel: "Projects", backendLabel: "GET /projects" },
	{ id: "resume", frontendLabel: "Resume", backendLabel: "GET /resume" },
	{ id: "contact", frontendLabel: "Contact", backendLabel: "POST /contact" },
];

export const heroContent = {
	headline:
		"Frontend engineer with 4+ years shipping production UIs - currently going deep on Go and backend systems.",
	subheading:
		"I build polished interfaces for a living. Right now I'm spending my nights and weekends learning what happens below the API layer.",
	logLine:
		'[2026-06-18T10:42:01Z] INFO role="frontend_engineer" status="open_to_work" focus="backend_transition"',
};

export const currentlyContent = {
	prose:
		"Currently deepening my Go and backend systems knowledge - recently rebuilt a production-style URL shortener API from scratch (structured logging, connection pooling, Docker, schema migrations) and worked through distributed systems fundamentals (load balancing, message queues, BGP routing).",
	logLine:
		'[2026-06-18T10:42:01Z] INFO currently="deepening_go_backend_systems" recent="url_shortener_api" topics=["structured_logging","pgxpool","docker","migrations","load_balancing","queues","bgp"]',
};

export const experienceItems: ExperienceItem[] = [
	{
		company: "Devspace",
		companyKey: "devspace",
		role: "Software Engineer",
		start: "Mar 2026",
		end: "Present",
		description:
			"Working on AI-powered features, helping build and scale web applications across the product lifecycle.",
		stack: ["React", "TypeScript", "Mastra AI", "Convex", "Vercel AI SDK"],
	},
	{
		company: "Osilion",
		companyKey: "osilion",
		role: "Fullstack Engineer",
		start: "Oct 2025",
		end: "Feb 2026",
		description:
			"Built and maintained full-stack features for an intelligent recruitment platform.",
		stack: ["Next.js", "TypeScript", "Azure", "PostgreSQL"],
	},
	{
		company: "Hone",
		companyKey: "hone",
		role: "Frontend Engineer",
		start: "Aug 2025",
		end: "Sep 2025",
		description:
			"Built and maintained the frontend of Web and Desktop apps, focusing on clean UI and scalable component architecture.",
		stack: ["React", "Tailwind", "ShadcnUI", "TypeScript"],
	},
	{
		company: "Hello World Communications",
		companyKey: "hello_world",
		role: "Full Stack Developer",
		start: "Sep 2024",
		end: "Jul 2025",
		description:
			"Built frontend and backend of web apps and APIs for a software development agency.",
		stack: ["Next.js", "Drizzle ORM", "Appwrite", "Firebase"],
	},
	{
		company: "Bilsida",
		companyKey: "bilsida",
		role: "Full Stack Developer",
		start: "Oct 2023",
		end: "Aug 2024",
		description:
			"Built frontend and backend of web apps and APIs for a Swedish car marketplace startup.",
		stack: ["Next.js", "Appwrite", "Docker"],
	},
	{
		company: "Freelancer",
		companyKey: "freelancer",
		role: "Full Stack Developer",
		start: "2021",
		end: "Oct 2023",
		description:
			"Worked on various frontend and backend projects and APIs.",
		stack: ["React", "Next.js", "Node.js", "APIs"],
	},
];

export const projectSections: ProjectSection[] = [
	{
		title: "Shipped & production",
		maturity: "production",
		projects: [
			{
				name: "Narrative Guard",
				slug: "narrative-guard",
				description:
					"AI brand voice coherence agent. Audits content against brand guidelines before publishing.",
				stack: ["Next.js", "Convex", "Gemini"],
				maturity: "production",
				status: "shipped",
				type: "fullstack",
				url: "https://narrative-guard.vercel.app",
				source: "https://github.com/PratikDev/narrative-guard",
			},
			{
				name: "Roadmap App",
				slug: "roadmap-app",
				description:
					"Full-stack roadmap tool with upvoting, filtering, sorting, and comments.",
				stack: ["Next.js", "Drizzle", "PostgreSQL"],
				maturity: "production",
				status: "shipped",
				type: "fullstack",
				url: "https://bitcode-roadmap-app.vercel.app",
				source: "https://github.com/pratikDev/roadmap-app"
			},
			{
				name: "Kar Communication",
				slug: "kar-communication",
				description:
					"Landing page with dynamic content for an IT solutions company.",
				stack: ["Next.js", "Firebase", "React Query"],
				maturity: "production",
				status: "shipped",
				type: "frontend",
				url: "https://karcommunication.com",
			},
		],
	},
	{
		title: "Backend & systems learning",
		note: "Projects I built specifically to learn backend fundamentals - not production software.",
		maturity: "learning",
		projects: [
			{
				name: "URL Shortener (Go rebuild)",
				slug: "url-shortener-go-rebuild",
				description:
					"Production-style API with structured logging (slog), pgxpool, Docker multi-stage builds, schema migrations.",
				stack: ["Go", "PostgreSQL", "pgxpool", "Docker", "slog"],
				maturity: "learning",
				status: "learning",
				type: "backend",
				source: "https://github.com/PratikDev/url-shortener-api"
			},
			{
				name: "The Super Tiny Compiler",
				slug: "the-super-tiny-compiler",
				description:
					"Minimal compiler built from scratch in Go, covering tokenizing, parsing, and transformation.",
				stack: ["Go", "Compiler basics", "Parsing"],
				maturity: "learning",
				status: "learning",
				type: "systems",
				source: "https://github.com/PratikDev/the-super-tiny-compiler-go"
			},
			{
				name: "URL Scraper",
				slug: "url-scraper",
				description:
					"Terminal-based concurrent URL scraper using goroutines and mutex locks.",
				stack: ["Go", "Goroutines", "Mutexes", "CLI"],
				maturity: "learning",
				status: "learning",
				type: "cli",
				source: "https://github.com/PratikDev/url-scrapper"
			},
			{
				name: "TreeEx",
				slug: "treeex",
				description:
					"CLI tool that analyzes directory structure and outputs JSON.",
				stack: ["Go", "CLI", "JSON"],
				maturity: "learning",
				status: "learning",
				type: "cli",
				source: "https://github.com/PratikDev/treeEx"
			},
		],
	},
];

export const skillGroups: SkillGroup[] = [
	{
		label: "Primary",
		key: "primary",
		description: "what I'm hired for",
		skills: ["React", "Next.js", "TypeScript", "Tailwind", "ShadcnUI"],
	},
	{
		label: "Backend & infra",
		key: "backend",
		description: "what I'm building toward",
		skills: ["Go", "PostgreSQL", "Docker", "Drizzle ORM", "MongoDB"],
	},
	{
		label: "AI & agents",
		key: "ai_agents",
		description: "agentic product tooling",
		skills: ["Claude Code", "Mastra AI", "Vercel AI SDK", "OpenCode"],
	},
];

export const contactLinks: ContactLink[] = [
	{
		key: "email",
		label: "Email",
		href: "mailto:pratikdevofficial1@gmail.com",
		display: "pratikdevofficial1@gmail.com",
	},
	{
		key: "github",
		label: "GitHub",
		href: "https://github.com/PratikDev",
		display: "github.com/PratikDev",
	},
	{
		key: "linkedin",
		label: "LinkedIn",
		href: "https://linkedin.com/in/pratik-and-dev",
		display: "linkedin.com/in/pratik-and-dev",
	},
	{
		key: "x",
		label: "X",
		href: "https://x.com/pratik_and_dev",
		display: "x.com/pratik_and_dev",
	},
];

export const resumeItems: ResumeItem[] = [
	{
		key: "pdf",
		label: "Resume PDF",
		format: "PDF",
		href: resumePdfUrl,
		fileName: "pratik-resume.pdf",
		description: "Polished resume version for recruiters, hiring managers, and quick sharing.",
	},
	{
		key: "markdown",
		label: "Resume Markdown",
		format: "Markdown",
		href: resumeMarkdownUrl,
		fileName: "pratik-resume.md",
		description: "Plain-text resume source for terminals, agents, and easy parsing.",
	},
];
