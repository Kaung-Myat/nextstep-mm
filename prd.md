# NextStep MM Product Requirements Document

## 1. Overview

**Product Name:** NextStep MM

**Product Type:** AI-powered career roadmap and internship guidance platform for Myanmar junior developers

**Vision:** Help Myanmar junior developers understand what to learn next, prepare for internships, and align their learning with real job-market demand.

**Product Positioning:** NextStep MM is not just a job board or a generic roadmap site. It is a localized career copilot that combines curated learning paths, internship preparation guidance, and AI-powered recommendations based on Myanmar market needs.

## 2. Problem Statement

Many junior developers and students in Myanmar face the same set of problems:

- They finish learning HTML, CSS, and JavaScript but do not know what to study next.
- They feel overwhelmed by the number of frameworks, libraries, and tools.
- They do not understand which skills are actually used in real jobs.
- They want internships but do not know how to prepare a portfolio, GitHub profile, resume, or project set.
- They often consume random tutorials without having a clear roadmap.

## 3. Goals

### Primary Goals

- Provide clear and structured learning roadmaps for junior developers.
- Help students and juniors prepare for internships with practical checklists and guidance.
- Show real Myanmar job-market trends so users can make informed learning decisions.
- Offer AI-powered personalized recommendations for next learning steps and skill-gap analysis.

### Secondary Goals

- Build trust through localized and beginner-friendly guidance.
- Create a foundation for future features such as resume review, notifications, and deeper personalization.

## 4. Non-Goals for MVP

- Becoming a full job-board competitor
- Supporting automated job application flows
- Crawling every possible job source in real time
- Building a complete resume builder
- Supporting every tech role from day one

## 5. Target Users

### Primary Users

- First-year to third-year CS students
- Self-taught junior developers
- Students searching for internships
- Users interested in frontend, backend, or fullstack development

### Secondary Users

- Early-career developers switching stacks
- Mentors who want to share structured guidance with juniors

## 6. User Personas

### Persona A: Confused Junior Developer

- Knows HTML, CSS, JavaScript, and a bit of React
- Can build a small project but does not know the next step
- Wants a guided plan instead of random tutorials

### Persona B: Internship Seeker

- University student preparing for internship opportunities
- Has some personal projects but no strong portfolio strategy
- Needs help with resume, GitHub, interview prep, and project selection

### Persona C: Career Explorer

- Not sure whether to focus on frontend, backend, or fullstack
- Wants to compare paths before choosing one

## 7. Core Value Proposition

NextStep MM helps Myanmar junior developers:

- discover the right learning path,
- understand real market demand,
- prepare for internships,
- and get AI-supported recommendations tailored to their current skill level.

## 8. Core Features

### 8.1 Learning Roadmaps

Provide curated roadmaps for:

- Frontend
- Backend
- Fullstack

Each roadmap should include:

- Beginner stage
- Intermediate stage
- Job-ready stage
- Required concepts
- Recommended frameworks and tools
- Suggested projects
- Common mistakes
- Learning outcomes

### 8.2 Internship Prep Hub

Provide structured guidance for:

- Resume checklist
- Portfolio checklist
- GitHub checklist
- Interview preparation topics
- Communication and self-introduction tips
- A suggested 2-month to 3-month intern prep plan

### 8.3 Myanmar Job Trend Dashboard

Aggregate and analyze job postings to show:

- Most requested skills
- Most requested frameworks and stacks
- Internship versus junior role trends
- Role-based demand by category
- Example requirement summaries

### 8.4 AI Career Advisor

Allow users to ask questions such as:

- What should I learn after React?
- I want to become a fullstack developer. What is my next step?
- What skills do I need before applying for internships?
- What kind of projects should I build for my portfolio?

The AI advisor should provide:

- Personalized next-step recommendations
- Skill-gap analysis
- Suggested projects
- Learning plans
- Internship preparation advice

### 8.5 Progress Tracking

Users should be able to:

- Select a target path
- Mark completed roadmap items
- Save their current skill level
- See their current position in a roadmap
- Get recommended next actions

## 9. Why AI Matters in This Product

AI should be used as an intelligence layer, not as the crawler itself.

### AI Use Cases

- Extract skills from job descriptions
- Classify job level and role type
- Summarize requirements
- Generate personalized learning guidance
- Identify skill gaps between user profile and market demand
- Suggest project ideas for portfolio growth

### AI Should Not Be Used For

- Blind crawling
- Unverified job discovery
- Replacing content strategy with generic responses

## 10. MVP Scope

### Included in MVP

- Landing page
- Frontend, backend, and fullstack roadmaps
- Internship prep hub
- User profile setup
- Progress tracking
- AI advisor
- Basic jobs list from approved sources
- Job trend dashboard with extracted skill data

### Deferred to Later Phases

- Resume review with file upload
- Auto notifications for matching internships
- Community discussions
- Mentor matching
- Deep analytics for every region or company

## 11. Information Architecture

- `/`
- `/roadmaps`
- `/roadmaps/frontend`
- `/roadmaps/backend`
- `/roadmaps/fullstack`
- `/internship-prep`
- `/jobs`
- `/trends`
- `/advisor`
- `/dashboard`
- `/profile`
- `/admin`

## 12. User Flows

### Flow 1: Choose a Learning Path

1. User visits homepage
2. User selects frontend, backend, or fullstack
3. User sees roadmap stages and learning steps
4. User marks completed topics
5. User receives suggested next steps

### Flow 2: Prepare for Internship

1. User opens internship prep page
2. User checks resume, portfolio, GitHub, and interview requirements
3. User enters current skills and goals
4. AI suggests a practical action plan

### Flow 3: Understand Market Demand

1. User opens trends dashboard
2. User explores top requested skills and stacks
3. User compares internship and junior role requirements
4. User uses insights to choose roadmap priorities

### Flow 4: Ask the AI Advisor

1. User opens advisor page
2. User enters a question or profile info
3. AI returns structured guidance
4. User saves advice or uses it to continue roadmap progress

## 13. Functional Requirements

### Roadmaps

- Admin can create and update roadmap content
- Users can browse roadmaps without logging in
- Logged-in users can save progress
- Roadmap items support title, description, level, and resource links

### Internship Prep

- Checklist items can be grouped by category
- Users can mark completed items
- Platform can suggest projects and preparation focus areas

### Jobs and Trends

- Platform stores raw and normalized job data
- Platform deduplicates similar jobs
- Platform extracts skills from job descriptions
- Platform categorizes jobs by role and level
- Dashboard shows aggregated insights

### AI Advisor

- User can ask open-ended career questions
- Advisor responses should be grounded in roadmap and market data
- Conversations can be stored for logged-in users

### Progress Tracking

- Users can set target role
- Users can mark roadmap steps complete
- Users can view completion percentage

## 14. Content Strategy

The product depends heavily on strong curated content.

Each roadmap item should include:

- Why this topic matters
- What the user should be able to do after learning it
- A mini project suggestion
- Common mistakes
- Recommended next topic

Internship prep content should include:

- Strong versus weak project examples
- GitHub profile expectations
- Resume structure tips
- Interview question starter pack
- Self-introduction guidance

## 15. Data Strategy

### Job Sources

Start with safe and approved sources such as:

- Public company career pages
- Public job boards that allow indexing or scraping
- Manually curated entries if automation is not yet stable

### Constraints

- Respect robots.txt and source terms
- Rate-limit fetch jobs
- Attribute original sources
- Store last-checked timestamps
- Avoid duplicated listings

## 16. Success Metrics

### Product Metrics

- Weekly active users
- Roadmap completion starts
- Progress saves
- Internship prep checklist completion rate
- AI advisor sessions per week
- Dashboard engagement rate

### Outcome Metrics

- Percentage of users who report clearer learning direction
- Percentage of users who complete an internship prep plan
- Percentage of users who return to continue progress

## 17. Risks and Mitigation

### Risk: Weak content quality

Mitigation:

- Start with fewer paths but higher-quality roadmap content
- Review content with real juniors and mentors

### Risk: AI advice becomes generic

Mitigation:

- Ground AI responses with structured roadmap data and extracted market data
- Use response templates and output schemas

### Risk: Job crawling becomes unstable or legally risky

Mitigation:

- Start with semi-automated ingestion
- Only use approved public sources
- Add clear source attribution

### Risk: MVP scope becomes too large

Mitigation:

- Launch with the minimum valuable combination of roadmap, prep hub, and advisor

## 18. Future Opportunities

- Resume review
- Portfolio scoring
- Personalized notifications
- Scholarship and training recommendations
- Mentorship matching
- Burmese and English bilingual support

## 19. Product Recommendation Summary

NextStep MM should be built as an AI-powered career guidance platform for Myanmar juniors, not just as an AI job crawler. The strongest early product value comes from combining:

- curated roadmaps,
- internship preparation support,
- Myanmar job-market insights,
- and personalized AI guidance.

This positioning creates a more useful, focused, and impactful platform for the target audience.
