create extension if not exists pgcrypto;

create table if not exists ats_results (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  score integer not null check (score >= 0 and score <= 100),
  missing_keywords jsonb not null default '[]'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone not null default now()
);

create index if not exists idx_ats_results_created_at on ats_results (created_at desc);

create table if not exists growth_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now()
);

create index if not exists idx_growth_events_event_type on growth_events (event_type);
create index if not exists idx_growth_events_created_at on growth_events (created_at desc);

create table if not exists email_captures (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  context text not null default 'unknown',
  created_at timestamp with time zone not null default now()
);

create index if not exists idx_email_captures_created_at on email_captures (created_at desc);

