# Supabase Integration Guide

This frontend integrates with Supabase using environment variables:
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

Provide these in a `.env` file at the project root (do not commit secrets). You can copy `.env.example` to `.env` and fill values from your Supabase project.

## Table Schema

Create a `notes` table in Supabase with the following columns:

- id: uuid (primary key, default: `gen_random_uuid()`)
- title: text (not null)
- content: text (not null)
- created_at: timestamptz (not null, default: `now()`)
- updated_at: timestamptz (not null, default: `now()`)

Because some projects do not have the `uuid-ossp` extension available by default, this setup uses `gen_random_uuid()` from the `pgcrypto` extension.

Authoritative SQL executed by this automation:

```sql
-- Use pgcrypto for UUID generation
create extension if not exists pgcrypto;

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS and open policy for development
alter table public.notes enable row level security;

drop policy if exists "Allow read/write during development" on public.notes;

create policy "Allow read/write during development"
on public.notes
for all
using (true)
with check (true);
```

For production, replace the open policy with user-scoped policies (for example, via auth.uid()).

## Running SQL via CLI (optional)

If you need to run the SQL from a CLI, ensure you have:
- psql installed
- A Postgres connection URI for your Supabase project (Session pooler), e.g. stored in SUPABASE_DB_URL:
  postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=verify-full

Then run one statement at a time:
psql "$SUPABASE_DB_URL" -c 'create extension if not exists pgcrypto;'
psql "$SUPABASE_DB_URL" -c 'create table if not exists public.notes (id uuid primary key default gen_random_uuid(), title text not null, content text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now());'
psql "$SUPABASE_DB_URL" -c 'alter table public.notes enable row level security;'
psql "$SUPABASE_DB_URL" -c 'drop policy if exists "Allow read/write during development" on public.notes;'
psql "$SUPABASE_DB_URL" -c 'create policy "Allow read/write during development" on public.notes for all using (true) with check (true);'

## Client

The client is initialized in `src/supabaseClient.js` using `@supabase/supabase-js`.
All CRUD operations are encapsulated in `src/services/notesService.js`.

## Auth and URLs

In Supabase Dashboard > Authentication > URL Configuration:
- Set Site URL to your app url (development and production).
- Add redirect allowlist entries:
  - http://localhost:3000/**
  - https://yourapp.com/**
