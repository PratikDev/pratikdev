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

export type ProjectType = "backend" | "fullstack";

export type ProjectItem = {
	name: string;
	slug: string;
	description: string;
	stack: string[];
	url?: string;
	source?: string;
	status: "shipped" | "learning";
	type: "fullstack" | "frontend" | "backend" | "cli" | "systems";
};

export type ProjectSection = {
	title: string;
	type: ProjectType;
	projects: ProjectItem[];
};

export type SkillGroup = {
	label: string;
	key: "primary" | "frontend" | "backend" | "ai_agents";
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
		"Backend engineer building Golang systems - 4+ years of fullstack experience across React, Next.js, and TS.",
	subheading:
		"I build backend systems in Go and ship production interfaces in React — currently focused on the backend side.",
	logLine:
		`[${new Date().toISOString()}] INFO role="backend_engineer" status="open_to_work" focus="golang"`,
};

export const currentlyContent = {
	prose:
		"Deepening Go and backend systems knowledge — recently built a production-style URL shortener API, async job queue system, and a high-throughput Redis-backed result lookup API load tested at 31k+ RPS.",
	logLine:
		`[${new Date().toISOString()}] INFO currently="deepening_go_backend_systems" recent="result_lookup" topics=["redis","precompute_pipeline","high_throughput","load_testing","postgres_fallback","connection_limiting"]`,
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
		title: "Backend & systems",
		type: "backend",
		projects: [
			{
				name: "Result Lookup",
				slug: "result-lookup",
				description:
					"High-throughput exam result API simulating Bangladesh's SSC like result publishing infrastructure — 31,910 RPS peak on a single instance, zero errors",
				stack: ["Go", "PostgreSQL", "Redis", "pgx/v5", "Docker"],
				status: "shipped",
				type: "backend",
				source: "https://github.com/PratikDev/result-lookup"
			},
			{
				name: "URL Health Checker",
				slug: "url-health-checker",
				description:
					"Background job queue in Go — URL health checker with worker-based processing, retry logic, and exponential backoff.",
				stack: ["Go", "PostgreSQL", "pgx/v5", "Docker"],
				status: "shipped",
				type: "backend",
				source: "https://github.com/PratikDev/url-health-checker"
			},
			{
				name: "URL Shortener (Go rebuild)",
				slug: "url-shortener-go-rebuild",
				description:
					"Production-style API with structured logging (slog), pgxpool, Docker multi-stage builds, schema migrations.",
				stack: ["Go", "PostgreSQL", "pgxpool", "Docker", "slog"],
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
				status: "learning",
				type: "cli",
				source: "https://github.com/PratikDev/url-scrapper"
			},
		],
	},
	{
		title: "Full-stack & Frontend",
		type: "fullstack",
		projects: [
			{
				name: "Narrative Guard",
				slug: "narrative-guard",
				description:
					"AI brand voice coherence agent. Audits content against brand guidelines before publishing.",
				stack: ["Next.js", "Convex", "Gemini"],
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
				status: "shipped",
				type: "frontend",
				url: "https://karcommunication.com",
			},
		],
	},
];

export const skillGroups: SkillGroup[] = [
	{
		label: "Primary",
		key: "primary",
		skills: ["Go", "PostgreSQL", "Redis", "pgx/v5", "Docker"],
	},
	{
		label: "Backend & infra",
		key: "backend",
		skills: ["golang-migrate", "slog", "pgxpool", "REST APIs", "Job Queues", "Worker Patterns", "Load Testing"],
	},
	{
		label: "Frontend",
		key: "frontend",
		skills: ["React", "Next.js", "TypeScript", "Tailwind", "ShadcnUI"],
	},
	{
		label: "AI & agents",
		key: "ai_agents",
		skills: ["Claude Code", "Codex", "OpenCode", "Vercel AI SDK", "Mastra AI"],
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
