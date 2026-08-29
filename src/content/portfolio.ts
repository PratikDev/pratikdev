import resumeMarkdownUrl from "@/assets/pratik-resume.md?url";
import resumePdfUrl from "@/assets/pratik-resume.pdf?url";

export type NavItem = {
	id: "about" | "experience" | "projects" | "resume" | "contact";
	label: string;
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

export type AboutChapter = {
	key: string;
	label: string;
	heading: string;
	body: string;
	emphasis?: string;
	tags?: string[];
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
	{ id: "about", label: "About" },
	{ id: "experience", label: "Experience" },
	{ id: "projects", label: "Projects" },
	{ id: "resume", label: "Resume" },
	{ id: "contact", label: "Contact" },
];

export const heroContent = {
	headline: "Pratik Dev",
	highlight: "Go, React, TypeScript.",
};

export const aboutChapters: AboutChapter[] = [
	{
		key: "frontend",
		label: "Since the start",
		heading: "Years in the browser.",
		body: "React, Next.js, and Tailwind have been the constant since day one.",
		tags: ["React", "Next.js", "Tailwind"],
	},
	{
		key: "backend",
		label: "Lately",
		heading: "Now going deep.",
		body: "Go, system design, and databases are where my attention lives these days.",
		tags: ["Go", "System Design", "Databases"],
	},
	{
		key: "philosophy",
		label: "How I think about it",
		heading: "Built to survive contact.",
		body: "A system isn't done when it works. It's done when it survives real traffic, bad input, and 3AM failures.",
		emphasis: "3AM failures",
	},
	{
		key: "personal",
		label: "Off the clock",
		heading: "Maps and stars.",
		body: "Travel and astronomy are the two curiosities that never run out.",
	},
];

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

export const projects: ProjectItem[] = [
	{
		name: "Narrative Guard",
		slug: "narrative-guard",
		description:
			"An AI agent that audits content against your brand guidelines before it publishes.",
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
			"A roadmap tool people can vote on, filter, sort, and discuss.",
		stack: ["Next.js", "Drizzle", "PostgreSQL"],
		status: "shipped",
		type: "fullstack",
		url: "https://bitcode-roadmap-app.vercel.app",
		source: "https://github.com/pratikDev/roadmap-app"
	},
	{
		name: "Kar Comm",
		slug: "kar-comm",
		description:
			"Dynamic landing page for an IT solutions company, built on Next.js and Firebase.",
		stack: ["Next.js", "Firebase", "React Query"],
		status: "shipped",
		type: "frontend",
		url: "https://karcommunication.com",
	},
	{
		name: "Result Lookup",
		slug: "result-lookup",
		description:
			"An exam result API built to serve 2 million users on a single instance with zero errors.",
		stack: ["Go", "PostgreSQL", "Redis", "pgx/v5", "Docker"],
		status: "shipped",
		type: "backend",
		source: "https://github.com/PratikDev/result-lookup"
	},
	{
		name: "URL Health",
		slug: "url-health",
		description:
			"A Go job queue that checks URL health with worker-based processing, retries, and exponential backoff.",
		stack: ["Go", "PostgreSQL", "pgx/v5", "Docker"],
		status: "shipped",
		type: "backend",
		source: "https://github.com/PratikDev/url-health-checker"
	},
	{
		name: "URL Shortener",
		slug: "url-shortener-go-rebuild",
		description:
			"A URL shortener rebuilt in Go with structured logging, connection pooling, and schema migrations.",
		stack: ["Go", "PostgreSQL", "pgxpool", "Docker", "slog"],
		status: "learning",
		type: "backend",
		source: "https://github.com/PratikDev/url-shortener-api"
	},
	{
		name: "Tiny Compiler",
		slug: "tiny-compiler",
		description:
			"A minimal compiler built from scratch in Go that tokenizes, parses, and transforms source code.",
		stack: ["Go", "Compiler basics", "Parsing"],
		status: "learning",
		type: "systems",
		source: "https://github.com/PratikDev/the-super-tiny-compiler-go"
	},
	{
		name: "URL Scraper",
		slug: "url-scraper",
		description:
			"A concurrent URL scraper in Go, built with goroutines and mutex locks.",
		stack: ["Go", "Goroutines", "Mutexes", "CLI"],
		status: "learning",
		type: "cli",
		source: "https://github.com/PratikDev/url-scrapper"
	},
];

export const skillGroups: SkillGroup[] = [
	{
		label: "Primary",
		key: "primary",
		skills: ["Go", "TypeScript", "React", "PostgreSQL", "Docker"],
	},
	{
		label: "Frontend",
		key: "frontend",
		skills: ["React", "Next.js", "TypeScript", "Tailwind", "ShadcnUI"],
	},
	{
		label: "Backend & Databases",
		key: "backend",
		skills: ["Golang", "Bun", "NextJS", "Node.js", "Express.js", "PostgreSQL", "MySQL", "SQLite", "Redis"]
	},
	{
		label: "AI & agents",
		key: "ai_agents",
		skills: ["Claude Code", "Codex", "OpenCode", "Vercel AI SDK"],
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
		description: "For recruiters and quick sharing.",
	},
	{
		key: "markdown",
		label: "Resume Markdown",
		format: "Markdown",
		href: resumeMarkdownUrl,
		fileName: "pratik-resume.md",
		description: "Plain text, easy to parse.",
	},
];
