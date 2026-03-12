# ApplyX Growth Engine

Standalone Next.js 14 growth service for ApplyX — pure SEO content that funnels organic traffic to the main product.

## Features

- Programmatic SEO pages for 130+ job roles (resume guides, interview Qs, salary data, ATS keywords)
- Blog articles on career topics
- Competitor comparison pages
- Email capture for audience building
- Growth event tracking and internal analytics at `/admin/growth`
- Automated posting bots for Bluesky and Reddit

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

## Environment variables

- `APPLYX_API_BASE_URL`
- `APPLYX_INTERNAL_API_KEY`
- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`

## Local development

```bash
npm install
npm run dev
```

## Database

The PostgreSQL schema lives in `db/schema.sql`, with migrations in `db/migrations/`.

## Internal conversion callback

The main ApplyX app can report downstream conversions back into this growth service through:

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
