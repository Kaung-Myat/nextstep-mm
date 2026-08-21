# AGENTS.md

## Project goal
Build NextStep MM, an AI-powered career roadmap and internship guidance platform for Myanmar junior developers.

## Working rules
- Read `prd.md` and `implementation.md` before making major changes.
- Prefer TypeScript and clear component boundaries.
- Preserve MVP scope.
- Ask before adding large dependencies.
- After code changes, run relevant lint/typecheck/tests.
- Keep UI clean, modern, and mobile-friendly.
- Use PostgreSQL + Prisma for persistence.
- Keep AI features grounded in internal roadmap/job data.
- Curated curriculum lives in `/content` JSON; edit there, then `npm run content:validate` and `npm run db:seed`. UI chrome stays in `src/i18n/messages.ts`.