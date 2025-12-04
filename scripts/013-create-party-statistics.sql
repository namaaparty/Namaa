-- Script: party statistics table + policies
-- Run in Supabase SQL Editor

begin;

create table if not exists public.party_statistics (
  id uuid primary key default gen_random_uuid(),
  total_members integer not null default 0,
  female_members integer not null default 0,
  male_members integer not null default 0,
  youth_members integer not null default 0,
  last_updated timestamptz not null default timezone('utc', now())
);

comment on table public.party_statistics is
  'Stores snapshots of membership statistics displayed on the public site.';

alter table public.party_statistics enable row level security;

-- Allow anyone (including anonymous visitors) to read the latest stats
drop policy if exists "party_stats_public_read" on public.party_statistics;
create policy "party_stats_public_read"
  on public.party_statistics
  for select
  using (true);

-- Allow admins (and service role) to insert new snapshots
drop policy if exists "party_stats_admin_insert" on public.party_statistics;
create policy "party_stats_admin_insert"
  on public.party_statistics
  for insert
  with check (
    auth.uid() in (select id from public.profiles where role = 'admin')
    or auth.role() = 'service_role'
  );

-- Allow admins to delete/clean up rows if needed
drop policy if exists "party_stats_admin_delete" on public.party_statistics;
create policy "party_stats_admin_delete"
  on public.party_statistics
  for delete
  using (
    auth.uid() in (select id from public.profiles where role = 'admin')
    or auth.role() = 'service_role'
  );

-- (Optional) allow admins to edit an existing snapshot instead of inserting a new one
drop policy if exists "party_stats_admin_update" on public.party_statistics;
create policy "party_stats_admin_update"
  on public.party_statistics
  for update
  using (
    auth.uid() in (select id from public.profiles where role = 'admin')
    or auth.role() = 'service_role'
  )
  with check (
    auth.uid() in (select id from public.profiles where role = 'admin')
    or auth.role() = 'service_role'
  );

commit;

