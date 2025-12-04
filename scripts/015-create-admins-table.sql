-- Script: admins table for internal dashboard
-- Run this in Supabase SQL editor

begin;

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  full_name text not null,
  email text not null unique,
  role text not null check (role in ('super_admin', 'pages_admin', 'news_admin', 'activities_admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.admins is
  'Stores administrative users for the custom dashboard (separate from auth.users).';

create trigger update_admins_updated_at
  before update on public.admins
  for each row
  execute function update_updated_at_column();

alter table public.admins enable row level security;

-- Only service-role / backend processes may read admin rows
drop policy if exists "admins_service_read" on public.admins;
create policy "admins_service_read"
  on public.admins
  for select
  using (auth.role() = 'service_role');

drop policy if exists "admins_service_write" on public.admins;
create policy "admins_service_write"
  on public.admins
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

commit;

