# NextStep MM Implementation Plan

## 1. Delivery Strategy

Build NextStep MM in phases so the product becomes useful before job crawling and advanced AI are fully mature.

### Recommended Principle

- Deliver value early with curated content
- Add AI after the content foundation is ready
- Add job ingestion after the core guidance experience works
- Keep the first release focused and maintainable

## 2. Recommended Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui or a lightweight custom component system
- Recharts or Nivo for charts

### Backend

- Next.js App Router
- Server Actions and Route Handlers
- Background jobs later if needed

### Database

- PostgreSQL
- Prisma ORM

### Authentication

- NextAuth or Clerk

### AI Layer

- OpenAI API
- Structured outputs for extraction and recommendation generation

### Hosting

- Vercel for web app hosting
- Managed PostgreSQL or Supabase Postgres

## 3. System Architecture

### High-Level Components

- Marketing and onboarding frontend
- Authenticated user dashboard
- Curated roadmap content system
- Internship prep checklist system
- AI advisor service
- Job ingestion pipeline
- Skill extraction and trend aggregation pipeline
- Admin tools for content and job review

### Architecture Flow

1. Users browse curated roadmaps and internship prep guidance
2. Logged-in users save profile and progress
3. AI advisor uses user profile, roadmap content, and trend data to generate advice
4. Job ingestion pipeline collects raw postings from approved sources
5. Extraction pipeline normalizes jobs and maps skills
6. Dashboard surfaces aggregated market demand insights

## 4. Feature Phases

## Phase 1: Foundation and Core Content

### Objective

Launch a valuable product without depending on fully automated job crawling.

### Scope

- Brand setup for NextStep MM
- Landing page
- Roadmaps for frontend, backend, and fullstack
- Internship prep hub
- User profile setup
- Progress tracking

### Deliverables

- Responsive landing page
- Roadmap pages
- Internship prep page
- Login-ready profile flow
- Saved progress basics

### Why This Comes First

This phase already solves the core pain point: users do not know what to learn next or how to prepare for internships.

## Phase 2: AI Advisor

### Objective

Turn the platform from a static guide into a personalized assistant.

### Scope

- Advisor chat UI
- Prompt framework
- Skill-gap analysis flow
- Personalized learning plan output
- Saved advisor history

### Deliverables

- Working advisor page
- Structured recommendation responses
- User-specific next-step suggestions

### Recommendation

Ground AI responses using:

- selected user path,
- saved progress,
- roadmap data,
- and curated internship prep content.

This prevents generic advice and improves user trust.

## Phase 3: Jobs and Trend Data

### Objective

Add real Myanmar market insight to strengthen roadmap relevance.

### Scope

- Manual and semi-automated job ingestion
- Job normalization
- Skill extraction
- Job categorization
- Trend dashboard

### Deliverables

- Jobs table with approved listings
- Extracted skills data
- Dashboard with top trends
- Role and stack comparisons

### Recommendation

Do not begin with aggressive crawling. Start with:

- approved company career pages,
- public job boards that allow indexing,
- and manual job import if needed.

## Phase 4: Admin and Quality Tools

### Objective

Make the platform easier to maintain and improve content quality.

### Scope

- Admin review of jobs
- Admin management of roadmap content
- Duplicate resolution
- AI response quality checks
- Basic analytics

### Deliverables

- Admin dashboard
- Job approval flow
- Roadmap editing flow
- Content update workflow

## 5. Recommended Build Order

1. Project setup
2. Design system foundation
3. Landing page
4. Roadmap data model and UI
5. Internship prep module
6. User profile and progress tracking
7. AI advisor
8. Jobs ingestion pipeline
9. Trend dashboard
10. Admin tools and polish

This order ensures the product is useful from the earliest stages.

## 6. Proposed Project Structure

```text
src/
  app/
    page.tsx
    roadmaps/
    internship-prep/
    jobs/
    trends/
    advisor/
    dashboard/
    profile/
    admin/
    api/
  components/
    layout/
    roadmap/
    advisor/
    dashboard/
    forms/
    shared/
  lib/
    ai/
    content/          # Zod schemas + loaders for curated JSON
    db/
    jobs/
    analytics/
    auth/
    utils/
  # (repo root) content/  — authoritative curated JSON (seed source of truth)
  #   internship-prep.json → AppContent
  #   advisor-templates.json → AppContent
  #   roadmaps/*.json → Roadmap tables via seed
  prisma/
    schema.prisma
    seed.ts           # upserts from /content after Zod validation
```

## 7. Database Design Plan

### Core Tables

- `users`
- `user_profiles`
- `roadmaps`
- `roadmap_sections`
- `roadmap_items`
- `skills`
- `user_skills`
- `projects`
- `jobs`
- `companies`
- `job_skills`
- `advisor_sessions`
- `advisor_messages`

### Important Data Relationships

- A roadmap has many sections
- A section has many items
- A user profile belongs to one user
- A user can save many completed roadmap items
- A job can map to many skills
- A skill can belong to many jobs

## 8. Data Model Recommendations

### Roadmap Content

Each roadmap item should store:

- title
- slug
- level
- description
- why_it_matters
- expected_outcome
- mini_project
- common_mistakes
- next_topic
- resource_links

### User Profile

Recommended fields:

- target_role
- current_level
- university_year
- internship_goal_date
- interested_stack

### Jobs

Recommended fields:

- title
- company_name
- source_url
- source_name
- location
- level
- job_type
- raw_description
- normalized_description
- posted_at
- last_checked_at

## 9. AI Implementation Recommendation

### AI Responsibilities

- Parse job descriptions into structured skills
- Generate personalized learning paths
- Identify missing skills for internship readiness
- Suggest portfolio projects
- Explain learning priorities in simple language

### AI Safety and Quality Rules

- Use structured prompts
- Require JSON or schema-based outputs where possible
- Ground responses with internal roadmap data
- Avoid unsupported claims about hiring outcomes
- Add fallback responses if profile data is missing

### Suggested AI Flows

#### Flow A: Learning Plan

Input:

- target role
- known skills
- available time

Output:

- current level summary
- next 3 priorities
- 4-week or 8-week plan
- project recommendations

#### Flow B: Internship Gap Analysis

Input:

- user profile
- saved projects
- selected role

Output:

- strengths
- missing areas
- suggested actions
- internship readiness score

## 10. Job Ingestion Strategy

### Step 1: Approved Source Collection

Start with:

- company career pages
- public listings with clear access permissions
- manual imports when necessary

### Step 2: Raw Job Storage

Store fetched data as raw records first.

### Step 3: Normalization

Normalize:

- title
- company
- level
- description
- source metadata

### Step 4: Skill Extraction

Use AI or rules to extract:

- frameworks
- languages
- databases
- tools
- soft skills

### Step 5: Trend Aggregation

Build periodic summaries:

- top skills by role
- most common stacks
- internship versus junior comparison

## 11. UI Pages Breakdown

### Landing Page

Sections:

- Hero
- Problem and solution
- Choose your path
- Internship prep highlight
- Market trends highlight
- AI advisor highlight
- Call to action

### Roadmap Pages

Components:

- Progress bar
- Stage tabs
- Roadmap cards
- Recommended project section
- Common mistakes section

### Internship Prep Page

Components:

- Checklist groups
- Suggested timeline
- Portfolio guide
- GitHub guide
- Interview prep cards

### Advisor Page

Components:

- Chat interface
- Quick prompts
- Profile summary
- Suggested action panel

### Trends Dashboard

Components:

- Top skills chart
- Role comparison chart
- Latest jobs preview
- Filter panel

## 12. Week-by-Week Plan

## Week 1

- Finalize brand direction
- Finalize sitemap
- Draft roadmap content
- Draft internship prep content
- Define database schema

## Week 2

- Setup Next.js project
- Setup Tailwind and component system
- Setup Prisma and database connection
- Build global layout and navigation

## Week 3

- Build landing page
- Build roadmap list and roadmap detail pages
- Add progress-tracking UI

## Week 4

- Build internship prep hub
- Build user profile flow
- Save user progress

## Week 5

- Implement AI advisor page
- Build prompt templates
- Save advisor sessions

## Week 6

- Build initial job ingestion scripts
- Store and normalize jobs
- Extract skills

## Week 7

- Build trends dashboard
- Add filters and summaries
- QA all major flows

## Week 8

- Add admin tools
- Improve copy and onboarding
- Deploy MVP
- Collect feedback

## 13. Testing Strategy

### Functional Testing

- Roadmap display and progression
- Profile creation and persistence
- Checklist completion
- Advisor response flow
- Jobs ingestion and deduplication
- Dashboard rendering

### Content Testing

- Roadmap clarity
- Internship prep usefulness
- AI recommendation relevance
- Burmese copy quality if included

### UX Testing

- Mobile responsiveness
- Navigation clarity
- Time to first value

## 14. Analytics and Measurement

Track:

- selected learning path
- roadmap progress start rate
- roadmap completion events
- advisor prompt usage
- internship prep completion
- jobs page engagement
- trend dashboard engagement

Use analytics to identify:

- where users drop off
- which paths are most popular
- which AI prompts are most useful

## 15. Launch Recommendation

### MVP Launch Criteria

- Landing page is production-ready
- At least 3 curated roadmaps are complete
- Internship prep hub is complete
- Profile and progress save correctly
- AI advisor gives grounded responses
- Trend dashboard works with a small but clean dataset

### Launch Message

Promote NextStep MM as:

“A platform for Myanmar junior developers to discover what to learn next, prepare for internships, and understand job-market demand.”

## 16. Post-Launch Priorities

- Improve roadmap depth
- Add more role paths
- Expand job sources carefully
- Add resume and portfolio feedback
- Add notifications for new internships
- Add bilingual content support

## 17. Final Implementation Recommendation

Do not treat the project as a crawler-first product.

Build it in this order:

- content foundation first,
- personalized AI second,
- market intelligence third,
- automation and polish after that.

This approach gives NextStep MM a clearer identity, faster time to value, and a stronger chance of becoming genuinely useful for Myanmar junior developers.
