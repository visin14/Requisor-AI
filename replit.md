# Requisor AI

AI-powered resume analyser and hiring intelligence platform. Candidates upload resumes for AI analysis and score tracking; recruiters use JD intelligence, semantic matching, and hiring decision tools.

## Run & Operate

- `pnpm --filter @workspace/requisor run dev` — run the frontend (port 25359, preview path `/`)
- `pnpm --filter @workspace/api-server run dev` — build + run the API server (port 8080, preview path `/api`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-server exec prisma generate` — regenerate Prisma client after schema changes
- `pnpm --filter @workspace/api-server exec prisma migrate deploy` — apply pending migrations
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Required Secrets

- `GROQ_API_KEY` — AI features (resume analysis, JD analysis, matching, decisions)
- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk public key for the frontend Vite app
- `CLERK_PUBLISHABLE_KEY` — Clerk public key for the Express backend
- `CLERK_SECRET_KEY` — Clerk secret key for the Express backend
- `DATABASE_URL` — auto-provided by Replit (PostgreSQL)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4, shadcn/ui, Clerk auth, Wouter routing
- API: Express 5, Clerk middleware, pino logging
- DB: PostgreSQL + Prisma ORM (v7) — config in `artifacts/api-server/prisma.config.ts`
- AI: Groq SDK (llama-3.3-70b-versatile)
- PDF parsing: pdfjs-dist (client-side)

## Where things live

- `artifacts/requisor/src/pages/` — all page components
- `artifacts/requisor/src/components/dashboard/` — candidate dashboard widgets (fetch real data from API)
- `artifacts/api-server/src/routes/` — Express routes: `ai`, `candidate`, `recruiter`, `user`, `health`
- `artifacts/api-server/src/lib/` — prisma client, Clerk currentUser helper, logger
- `artifacts/api-server/prisma/schema.prisma` — DB schema
- `artifacts/api-server/prisma.config.ts` — Prisma 7 config (datasource URL goes here, not in schema)

## Architecture decisions

- All API calls from the frontend use relative `/api/...` paths (not `localhost:5000`) — Replit's reverse proxy routes `/api` to port 8080.
- Resume analysis results are saved to DB via `POST /api/candidate/save-analysis` immediately after AI returns, keyed to the authenticated user.
- Full analysis JSON is stored in `ResumeAnalysis.summary` (as JSON string) so the dashboard widgets can reconstruct scores and roadmap without schema changes.
- Prisma 7 requires datasource URL in `prisma.config.ts` — the schema's `datasource db` block intentionally has no `url` field.
- API server has no hot-reload in dev: `npm run dev` = build (esbuild) + start. Restart the workflow after code changes.

## Product

**Candidate flow**: Sign in → Candidate Dashboard → Analyze New Resume → upload PDF or paste text → AI analysis (score, strengths, gaps, roadmap) → saved to history automatically.

**Recruiter flow**: Sign in → Recruiter Dashboard → choose tool:
- Resume + JD Matching (`/recruiter/match`) — compare resume vs JD, get match score
- Semantic Matching (`/recruiter/semantic-match`) — deep similarity analysis
- AI Hiring Decision (`/recruiter/decision`) — recommendation with pros/cons/next step
- Full suite also available at `/recruiter` (multi-tab)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After any API server code change, restart the `artifacts/api-server: API Server` workflow (it compiles with esbuild).
- `VITE_CLERK_PUBLISHABLE_KEY` and `CLERK_PUBLISHABLE_KEY` are the same value — both needed because Vite only exposes `VITE_`-prefixed vars to the browser.
- Prisma 7 datasource: never add `url = env("DATABASE_URL")` to `schema.prisma`; put it only in `prisma.config.ts`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
