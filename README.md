# ApplyX Growth Engine

Standalone Next.js 14 growth service for ApplyX — a story-driven, retro-themed content hub that funnels organic traffic to the main product at `applyx.space`.

Live at: `grow.applyx.space`

## Features

### Programmatic SEO (130+ roles)

- **Interview questions** — behavioral, technical & situational Q&A
- **Salary data** — bands by experience level with negotiation tips
- **ATS keywords** — exact resume keywords ranked by priority
- **Resume guides** — role-specific structure, bullet examples, best practices

### Content pages

- Blog articles on career topics (ATS optimization, resume writing, job search strategy)
- Competitor comparison pages (ApplyX vs Jobscan, Resume Worded, Teal, Kickresume)

### Conversion & analytics

- Email capture for audience building
- Growth event tracking and internal analytics dashboard at `/admin/growth`
- Internal conversion callback API for the main ApplyX app

### 90s retro UI theme

- Story-driven homepage with quest/arcade framing
- Space Mono (headings) + Space Grotesk (body) font pairing
- CRT scanline overlay, floating grid, ambient orbs
- Cursor-tracking glow effect and HUD overlay
- Smooth hover transitions and scroll animations across all cards and panels
- Retro marquee ticker in the header

### Automated social bots

- **Bluesky bot** — 150-post content pool, posts every 3 hours, 100% free
- **Reddit bot** — 15-post pool of genuinely helpful career content, posts every 4 hours (requires Reddit API credentials)

## Social Bots

### Bluesky Bot (FREE — no API costs)

```bash
# 1. Set up credentials
cp env.bluesky.example .env.bluesky
# Edit .env.bluesky with your handle + app password

# 2. Run
npm run post           # Start loop (every 3 hours)
npm run post:dry       # Preview posts without sending
npm run post:once      # Send one post and exit
```

### Reddit Bot (FREE Reddit API)

```bash
# 1. Create a Reddit "script" app at https://www.reddit.com/prefs/apps
# 2. Set up credentials
cp env.reddit.example .env.reddit
# Edit .env.reddit with your client ID, secret, username, and password

# 3. Run
npm run reddit         # Start loop (every 4 hours)
npm run reddit:dry     # Preview posts without sending
npm run reddit:once    # Post once and exit
```

**Reddit strategy:** Text-heavy, genuinely helpful posts in career subreddits (r/resumes, r/jobs, r/careerguidance, r/cscareerquestions, r/GetEmployed, r/jobsearchhacks). Links are embedded naturally as sources.

**Note:** Reddit requires a "script" app to be created via an established account. New accounts may be blocked by Reddit's Responsible Builder Policy. You can create the app from a main account and still have the bot post as a separate account.

## Tech stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + custom retro CSS system
- **Fonts:** Space Grotesk (body), Space Mono (display) via `next/font/google`
- **Database:** PostgreSQL (schema in `db/schema.sql`, migrations in `db/migrations/`)
- **Social APIs:** `@atproto/api` (Bluesky), `snoowrap` (Reddit)
- **Language:** TypeScript

## Environment variables

- `APPLYX_API_BASE_URL` — main ApplyX product URL
- `APPLYX_INTERNAL_API_KEY` — shared secret for conversion callback API
- `DATABASE_URL` — PostgreSQL connection string
- `NEXT_PUBLIC_APP_URL` — public URL of this growth site

## Local development

```bash
npm install
npm run dev
```

## Project structure

```
app/                    # Next.js App Router pages
  admin/growth/         # Internal analytics dashboard
  api/                  # API routes (email capture, conversion callback)
  blog/[slug]/          # Blog article pages
  compare/[slug]/       # Competitor comparison pages
  interview/[role]/     # Interview question pages (130+ roles)
  keywords/[role]/      # ATS keyword pages
  resume/[role]/        # Resume guide pages
  salary/[role]/        # Salary data pages
components/             # Shared React components
  retro-effects.tsx     # Cursor glow, scanlines, grid, HUD overlay
  email-capture.tsx     # Email subscription form
  json-ld.tsx           # Structured data component
lib/                    # Business logic & data
  seo/                  # Role data, salary data, interview data, structured data
  blog/                 # Blog article content
  growth/               # Event tracking
db/                     # PostgreSQL schema & migrations
scripts/                # Social bot scripts
  post-bot.ts           # Bluesky automation bot
  reddit-bot.ts         # Reddit automation bot
```

## Internal conversion callback

The main ApplyX app can report downstream conversions back into this growth service:

`POST /api/internal/conversion`

Authentication:

- Send `APPLYX_INTERNAL_API_KEY` in the `x-applyx-internal-api-key` request header

Request body:

```json
{
  "eventType": "signup",
  "source": "score-page",
  "slug": "a82fj2",
  "userId": "user_123",
  "metadata": {
    "plan": "pro"
  }
}
```

Allowed `eventType` values:

- `signup`
- `resume_tailored`
- `payment_completed`
