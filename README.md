# NextStep MM

AI-powered career roadmaps, internship guidance, and market-aware learning paths for junior developers in Myanmar.

NextStep MM is not a generic job board or tutorial list. It combines curated learning paths, internship prep checklists, approved local job listings, trend analytics, and a BYOK AI advisor grounded in the user's roadmap progress and market data.

## Features

- **Home dashboard** — roadmap progress, next topic, internship prep counts, and top market skills
- **Learning roadmaps** — Frontend, Backend, and Fullstack paths with stages, projects, resources, and progress tracking
- **Market demand view** — sort roadmap topics by skills seen in approved job listings
- **Internship prep hub** — resume, portfolio, GitHub, and interview checklists
- **Trends dashboard** — filterable skill/stack snapshots from approved listings
- **Jobs listing** — paginated approved jobs with infinite scroll
- **AI career advisor** — chat grounded in profile, roadmap progress, and market signals (BYOK via OpenRouter or Gemini)
- **Job refresh** — crawl approved sources from Settings, extract skills with OpenRouter, and publish to Trends/Jobs
- **Localization** — English and Burmese UI (`src/i18n/messages.ts`)
- **PWA-friendly** — install prompt, splash screen, and offline shell

## Tech stack

| Layer | Choice |
| --- | --- |
| App | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL + Prisma 7 |
| AI | OpenRouter (default), Google Gemini (optional BYOK) |
| Rate limiting | Upstash Redis (falls back to in-memory when unset) |
| Hosting | Vercel-ready |

## Prerequisites

- Node.js 20+
- PostgreSQL database
- Optional: [OpenRouter](https://openrouter.ai/keys) API key for advisor chat and job skill extraction
- Optional: [Upstash Redis](https://console.upstash.com/) for distributed API rate limits in production

## Getting started

```bash
git clone <repo-url>
cd NextStep-MM
npm install
cp .env.example .env
```

Edit `.env` with your database URL and any optional keys (see [Environment variables](#environment-variables)).

```bash
# Apply migrations and generate the Prisma client
npx prisma migrate dev

# Validate curated JSON and seed roadmaps, prep hub, and advisor templates
npm run content:validate
npm run db:seed

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Complete onboarding, then explore roadmaps, trends, and settings.

## Environment variables

Copy `.env.example` to `.env`. Never commit `.env`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `DIRECT_URL` | Yes | Direct Postgres URL (Prisma migrations) |
| `OPENROUTER_API_KEY` | No | Server-side ingest scripts; users can also save a key in Settings |
| `GEMINI_API_KEY` | No | Optional advisor provider (may be geo-blocked in some regions) |
| `INGEST_AI_PROVIDER` | No | Default `openrouter` |
| `INGEST_AI_MODEL` | No | Default `openrouter/free` |
| `INGEST_LIMIT` | No | Max listings per source during crawl (default `8`) |
| `CRAWL_SECRET` | No | If set, `POST /api/jobs/crawl` requires `x-crawl-secret` header |
| `UPSTASH_REDIS_REST_URL` | No | Distributed rate limits (recommended for production) |
| `UPSTASH_REDIS_REST_TOKEN` | No | Upstash REST token |

For Vercel, add the same variables under **Project → Settings → Environment Variables**. The build script runs `prisma generate && next build`.

## Curated content workflow

Roadmaps, internship prep, and advisor templates live in `/content` as JSON. The app reads from PostgreSQL at runtime, not from these files directly.

```bash
# 1. Edit JSON under content/
# 2. Validate schemas
npm run content:validate

# 3. Upsert into the database
npm run db:seed
```

See [content/README.md](content/README.md) for layout and rules (stable slugs, checklist IDs, etc.). UI labels and chrome stay in `src/i18n/messages.ts`.

## Job pipeline

1. **Sources** — JobNet and TechCareer fetchers (`src/lib/jobs/fetchers/`)
2. **Ingest** — normalize listings, deduplicate, extract skills (OpenRouter or dictionary fallback)
3. **Review** — new jobs start as `PENDING`; Settings crawl can auto-approve
4. **Publish** — `APPROVED` jobs power `/trends`, `/jobs`, home highlights, and roadmap demand badges

**From the UI:** Settings → **Refresh now** (requires onboarding profile; uses your saved OpenRouter key).

**From the CLI:**

```bash
npm run jobs:ingest          # Fetch and ingest (uses .env keys)
npm run jobs:approve-pending # Promote pending jobs to approved
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Generate Prisma client and production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run content:validate` | Validate `/content` JSON with Zod |
| `npm run db:seed` | Seed database from content |
| `npm run jobs:ingest` | CLI job ingest |
| `npm run jobs:approve-pending` | Approve pending jobs |

## Project structure

```
content/                 Curated JSON (roadmaps, prep hub, advisor templates)
prisma/                  Schema, migrations, seed
scripts/                 Content validation and job CLI tools
src/
  app/                   Routes, API handlers, server actions
  components/            UI by feature (advisor, roadmap, trends, settings, …)
  i18n/messages.ts       English + Burmese UI strings
  lib/                   Domain logic (jobs, roadmaps, profile, rate limits, …)
  generated/prisma/      Prisma client (generated; not committed)
```

## Main routes

| Route | Description |
| --- | --- |
| `/` | Home dashboard |
| `/onboarding` | First-time profile setup |
| `/roadmaps` | Roadmap catalog |
| `/roadmaps/[path]` | Roadmap detail (`frontend`, `backend`, `fullstack`) |
| `/internship-prep` | Internship checklists |
| `/trends` | Market trend dashboard |
| `/jobs` | Approved job listings |
| `/advisor` | AI career advisor (BYOK) |
| `/settings` | API keys, job refresh, preferences |
| `/profile` | Profile summary and edit |

## AI and privacy

- Advisor and crawl skill extraction use **Bring Your Own Key** — API keys are stored in the browser's `localStorage`, not on the server.
- Advisor replies are sanitized; chat history is cached locally per device.
- Crawl uses OpenRouter by default (recommended for Myanmar). Without a key, skill extraction falls back to a built-in keyword list.

## Deployment notes

1. Provision PostgreSQL and run migrations (`npx prisma migrate deploy`).
2. Set environment variables on Vercel (at minimum `DATABASE_URL`, `DIRECT_URL`).
3. Add Upstash Redis vars for shared rate limits across serverless instances.
4. Run `npm run db:seed` against the production database after deploy (or from CI).
5. Users add their own OpenRouter key in Settings for advisor chat and richer crawl extraction.

## Documentation

- [prd.md](prd.md) — product requirements and MVP scope
- [implementation.md](implementation.md) — phased delivery plan and architecture
- [AGENTS.md](AGENTS.md) — contributor conventions for AI-assisted development
- [content/README.md](content/README.md) — content authoring guide

## License

Private project (`"private": true` in `package.json`). Add a license file if you open-source this repository.
