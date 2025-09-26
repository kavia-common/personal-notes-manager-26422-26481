# Supabase Integration Guide

This frontend integrates with Supabase using environment variables:
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

Provide these in a `.env` file at the project root (do not commit secrets). You can copy `.env.example` to `.env` and fill values from your Supabase project.

## Table Schema

Create a `notes` table in Supabase with the following columns:

- id: uuid (primary key, default: `uuid_generate_v4()`)
- title: text
- content: text
- created_at: timestamptz (default: `now()`)
- updated_at: timestamptz (default: `now()`)

Example SQL:

```sql
create extension if not exists "uuid-ossp";

create table public.notes (
  id uuid primary key default uuid_generate_v4(),
  title text,
  content text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
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

## Client

The client is initialized in `src/supabaseClient.js` using `@supabase/supabase-js`.
All CRUD operations are encapsulated in `src/services/notesService.js`.
