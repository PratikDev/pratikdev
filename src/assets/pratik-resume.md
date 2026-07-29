**PRATIK DEV**

pratikdevofficial1@gmail.com  •  \+880-1537220785  •  Dhaka, Bangladesh

[GitHub](https://github.com/PratikDev)  •  [LinkedIn](https://linkedin.com/in/pratik-and-dev)  •  [Portfolio](https://iam-pratik.vercel.app)

**PROFILE**

Backend Engineer (Go) with a full-stack background \- 4+ years of production experience across Go backend systems and React/TypeScript interfaces. Recently built three production-style Go systems covering REST APIs, async job queues, Redis-backed high-throughput serving, and distributed systems patterns. Strong frontend depth makes cross-functional collaboration and API integration second nature.

**SKILLS**

**Languages:**  Golang, TypeScript, JavaScript, Node.js

**Backend:**  pgx/v5, PostgreSQL, Redis, Docker, golang-migrate, slog, REST APIs

**Frontend:**  React.js, Next.js, Tailwind CSS, ShadcnUI, Framer Motion

**Databases:**  PostgreSQL, Redis, MongoDB, MySQL, SQLite

**Fundamentals:**  Data Structures, Algorithms, System Design, Concurrency Patterns

**AI Tools:**  Claude Code, Codex, Opencode

**Tools:**  Git, GitHub, Docker, Postman, Linear, Figma

**BACKEND & SYSTEM PROJECTS**

[**Result Lookup**](https://github.com/PratikDev/result-lookup)

* High-throughput exam result API simulating Bangladesh's SSC-like result publishing infrastructure, designed to serve 2M student results at a single fixed publish moment. Precomputes all results into Redis as pre-serialized JSON before T0, uses a publish gate for atomic release, and falls back to Postgres under Redis failure with connection limitation.

* Load tested with hey — 31,910 RPS peak on a single instance, zero errors across 615,000 total requests. p99 under 105ms at 1,000 concurrent connections.

* Tech: Golang, PostgreSQL, Redis, pgx/v5, Docker, golang-migrate

[**URL Health Checker**](https://github.com/PratikDev/url-health-checker)

* Async job processing system — background worker claims jobs via SELECT ... FOR UPDATE SKIP LOCKED, performs HTTP health checks, retries on failure with exponential backoff. Two binaries (API \+ worker) sharing a PostgreSQL-backed queue with no external message broker.

* Stale-job recovery baked into the claim query (staleness threshold replacing a heartbeat process); exponential backoff written in SQL for atomic retry state; graceful shutdown via signal.NotifyContext.

* Tech: Golang, PostgreSQL, pgx/v5, Docker, golang-migrate

[**URL Shortener API**](https://url-shortener-api-xiyp.onrender.com) | [Source](https://github.com/PratikDev/url-shortener-api)

* Production-style REST API with raw SQL (no ORM), versioned migrations, structured logging, and full unit \+ integration test suite. Deployed live on Render.

* Per-IP token bucket rate limiter built from scratch using a generic mutex-protected SafeMap — refill/consume logic runs inside a single locked Update call, verified with Go race detector (-race) under concurrent load.

* Tech: Golang, PostgreSQL, pgx/v5, Docker, golang-migrate

**EDUCATION**

**BGC Trust University**, Chattogram, Bangladesh	2022–2023

B.Sc. in Computer Science and Engineering (Dropout)

**PROFESSIONAL EXPERIENCE**

**Devspace**	March 2026 – Present

**Software Engineer**

* Building AI-powered product features, integrating agentic AI workflows (Mastra AI, Vercel AI SDK) into a production React/TypeScript application.

* Tech: React, TypeScript, Mastra AI, Convex, Vercel AI SDK, Gemini

**Osilion**	Oct 2025 – Feb 2026

**Full-Stack Engineer**

* Developed and maintained full-stack features for an intelligent recruitment platform, contributing to technical architecture decisions and component design patterns.

* Tech: Next.js, TypeScript, Azure, PostgreSQL, Tailwind CSS, ShadcnUI

**Hone**	Aug 2025 – Sep 2025

**Frontend Engineer**

* Built and maintained user interfaces for Web and Desktop applications, focusing on clean UI, performance, and scalable component architecture.

* Tech: React, TypeScript, Tailwind CSS, ShadcnUI

**Hello World Communications**	Sep 2024 – Jul 2025

**Full-Stack Engineer**

* Built and maintained frontend applications, backend services, and APIs across multiple concurrent client projects for a software development agency.

* Tech: Next.js, TypeScript, Drizzle ORM, Appwrite, Firebase, Docker

**Bilsida**	Oct 2023 – Aug 2024

**Full-Stack Engineer**

* Built core product UI and backend integrations from scratch for a Swedish car marketplace startup, helping take the product from early development to investor-ready state.

* Tech: Next.js, TypeScript, Appwrite, Docker

**Freelancer (Fiverr)**	2021 – Oct 2023

**Full-Stack Developer**

* Built and delivered full-stack web applications and APIs for multiple clients across frontend, backend, and deployment workflows.

**ADDITIONAL INFORMATION**

**Languages:**  English (professional), Bengali (native)

**Interests:**  Distributed systems, open source, astronomy, philosophy