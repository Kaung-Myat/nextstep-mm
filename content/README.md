# Curated content

Authoritative source for Prep Hub, Advisor templates, and Roadmaps.

## Layout

| Path | Published to |
|------|----------------|
| `internship-prep.json` | `AppContent` key `internship-prep` |
| `advisor-templates.json` | `AppContent` key `advisor-templates` |
| `roadmaps/*.json` | Relational `Roadmap` / `Section` / `Item` tables |

## Workflow

1. Edit JSON here (keep stable `slug` / checklist `id` + `itemCount` for progress).
2. Run `npm run db:seed` to validate (Zod) and upsert into PostgreSQL.
3. The app reads **from the database at runtime**, not these files directly.

## Rules

- Do not remove or rename roadmap item `slug`s lightly — user progress keys off them.
- Prep checklist progress keys are `{id}-{index}` (e.g. `resume-0`). Changing `itemCount` can orphan or shift progress.
- UI chrome (nav, buttons) stays in `src/i18n/messages.ts`, not here.
