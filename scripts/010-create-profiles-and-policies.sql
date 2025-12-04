-- Creates a shared profiles table that stores the role for each Supabase user.
-- Run this script after the base tables have been provisioned.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'news_statements', 'activities')),
  created_at timestamptz default timezone('utc', now())
);

comment on table public.profiles is 'Stores the role of each authenticated admin user.';

alter table public.profiles enable row level security;

drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Allow the service role (used by server-side Admin API calls) to manage roles.
drop policy if exists "profiles_service_role_all" on public.profiles;
create policy "profiles_service_role_all"
  on public.profiles
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Helper upsert statement:
-- Replace the UUID with the value from Authentication -> Users in Supabase.
-- insert into public.profiles (id, role)
-- values ('00000000-0000-0000-0000-000000000000', 'admin')
-- on conflict (id) do update set role = excluded.role;

