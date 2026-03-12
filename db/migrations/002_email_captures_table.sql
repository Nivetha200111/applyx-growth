create table if not exists email_captures (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  context text not null default 'unknown',
  created_at timestamp with time zone not null default now()
);

create index if not exists idx_email_captures_created_at on email_captures (created_at desc);

