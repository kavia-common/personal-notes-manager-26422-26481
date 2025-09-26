# Supabase Integration Guide

This frontend integrates with Supabase using environment variables:
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

Provide these in a `.env` file at the project root (do not commit secrets). You can copy `.env.example` to `.env` and fill values from your Supabase project.

## Table Schema

Create a `notes` table in Supabase with the following columns:

- id: uuid (primary key, default: `uuid_generate_v4()`)
- title: text (not null)
- content: text (not null)
- created_at: timestamptz (not null, default: `now()`)
- updated_at: timestamptz (not null, default: `now()`)

Example SQL:

```sql
create extension if not exists "uuid-ossp";

create table public.notes (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Optional: enable row level security and a permissive policy for anon usage during development
alter table public.notes enable row level security;

create policy "Allow read/write during development"
on public.notes
for all
using (true)
with check (true);
```

For production, tighten RLS policies to your auth model.

## Running SQL via CLI (optional)

If you need to run the SQL from a CLI, ensure you have:
- psql installed
- A Postgres connection URI for your Supabase project (Session pooler), e.g. stored in SUPABASE_DB_URL:
  postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=verify-full

Then run one statement at a time:
psql "$SUPABASE_DB_URL" -c 'create extension if not exists "uuid-ossp";'
psql "$SUPABASE_DB_URL" -c 'create table public.notes (id uuid primary key default uuid_generate_v4(), title text not null, content text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now());'
psql "$SUPABASE_DB_URL" -c 'alter table public.notes enable row level security;'
psql "$SUPABASE_DB_URL" -c 'create policy "Allow read/write during development" on public.notes for all using (true) with check (true);'

## Client

The client is initialized in `src/supabaseClient.js` using `@supabase/supabase-js`.
All CRUD operations are encapsulated in `src/services/notesService.js`.
