-- Script: activities table + policies
-- Run in Supabase SQL Editor

begin;

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  content text,
  image text,
  date date not null,
  location text,
  views integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.activities is
  'Stores public activities/events shown on the Activities page.';

create trigger update_activities_updated_at
  before update on public.activities
  for each row
  execute function update_updated_at_column();

alter table public.activities enable row level security;

-- Everyone can read the activities list
drop policy if exists "activities_public_read" on public.activities;
create policy "activities_public_read"
  on public.activities
  for select
  using (true);

-- Admins and activities managers can insert
drop policy if exists "activities_write_insert" on public.activities;
create policy "activities_write_insert"
  on public.activities
  for insert
  with check (
    auth.uid() in (
      select id from public.profiles where role in ('admin', 'activities')
    )
    or auth.role() = 'service_role'
  );

-- Admins and activities managers can update
drop policy if exists "activities_write_update" on public.activities;
create policy "activities_write_update"
  on public.activities
  for update
  using (
    auth.uid() in (
      select id from public.profiles where role in ('admin', 'activities')
    )
    or auth.role() = 'service_role'
  )
  with check (
    auth.uid() in (
      select id from public.profiles where role in ('admin', 'activities')
    )
    or auth.role() = 'service_role'
  );

-- Admins and activities managers can delete
drop policy if exists "activities_write_delete" on public.activities;
create policy "activities_write_delete"
  on public.activities
  for delete
  using (
    auth.uid() in (
      select id from public.profiles where role in ('admin', 'activities')
    )
    or auth.role() = 'service_role'
  );

commit;

