# ApplyX Growth Engine

Standalone Next.js 14 growth service for ApplyX. This project is designed to run independently from the main product and later integrate with ApplyX over HTTP APIs.

## Features

- Public ATS resume checker at `/ats-check`
- Shareable ATS score pages at `/score/[slug]`
- Programmatic SEO resume guides at `/resume/[role]`
- Growth event tracking and internal analytics at `/admin/growth`
- PostgreSQL-ready schema with a development-safe in-memory fallback

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

The PostgreSQL schema lives in `db/schema.sql`, with the initial migration in `db/migrations/001_growth_engine.sql`.

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

Behavior:

- Stores the event in `growth_events`
- If `slug` is present, the service looks up the matching ATS result and records the ATS association in event metadata

Success response:

```json
{
  "success": true,
  "event": {
    "eventType": "signup",
    "source": "score-page",
    "slug": "a82fj2",
    "userId": "user_123",
    "associatedAtsResultId": "9f712b1b-6ae9-4db7-8219-7f7c4cdb3fd3"
  }
}
```
