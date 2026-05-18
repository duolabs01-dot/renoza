-- Run this in your Supabase project:
-- Dashboard → SQL Editor → New query → paste → Run

create table if not exists public.projects (
  id           text        primary key,
  session_id   text        not null,
  input        jsonb       not null,
  plan         jsonb       not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Index for fast session queries
create index if not exists projects_session_id_idx
  on public.projects (session_id, created_at desc);

-- Enable Row Level Security
alter table public.projects enable row level security;

-- Allow anonymous read/write (no auth required — keyed by session_id from browser)
create policy "Public access"
  on public.projects
  for all
  using (true)
  with check (true);
