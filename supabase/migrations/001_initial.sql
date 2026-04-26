-- ============================================================
-- Paste this SQL into your Supabase project's SQL editor
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Projects ────────────────────────────────────────────────
create table public.projects (
  id             uuid        primary key default uuid_generate_v4(),
  name           text        not null,
  description    text        not null default '',
  long_description text      not null default '',
  video_url      text        not null default '',
  github_url     text,
  live_url       text,
  tech_stack     text[]      not null default '{}',
  featured       boolean     not null default false,
  display_order  int         not null default 0,
  created_at     timestamptz not null default now()
);

-- ── Tech Stack ───────────────────────────────────────────────
create table public.tech_stack (
  id            uuid  primary key default uuid_generate_v4(),
  name          text  not null,
  color         text  not null default '#ffffff',
  row_number    int   not null default 1,
  display_order int   not null default 0
);

-- ── Experiences ──────────────────────────────────────────────
create table public.experiences (
  id            uuid  primary key default uuid_generate_v4(),
  company       text  not null,
  role          text  not null,
  period        text  not null,
  description   text[] not null default '{}',
  type          text  not null default 'work',
  display_order int   not null default 0
);

-- ── Row Level Security ───────────────────────────────────────
-- Public can READ all tables (portfolio is public)
-- Writes only go through service_role key (admin server actions)

alter table public.projects     enable row level security;
alter table public.tech_stack   enable row level security;
alter table public.experiences  enable row level security;

create policy "public_read_projects"
  on public.projects for select to anon using (true);

create policy "public_read_tech_stack"
  on public.tech_stack for select to anon using (true);

create policy "public_read_experiences"
  on public.experiences for select to anon using (true);

-- Service role bypasses RLS automatically (no extra policy needed)
