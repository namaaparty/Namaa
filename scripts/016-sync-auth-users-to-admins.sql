-- Script: sync admin table with Supabase Auth users
-- Run inside Supabase SQL editor after creating public.admins

begin;

-- Helper function to map profile roles to admin roles
create or replace function public.map_profile_role_to_admin_role(role text)
returns text
language plpgsql
as $$
begin
  case role
    when 'admin' then
      return 'super_admin';
    when 'news_statements' then
      return 'news_admin';
    when 'activities' then
      return 'activities_admin';
    else
      return null;
  end case;
end;
$$;

-- Upsert admins from auth.users + profiles
insert into public.admins (id, username, password_hash, full_name, email, role, created_at, updated_at)
select
  u.id,
  coalesce(nullif(trim(lower(u.raw_user_meta_data->> 'username')), ''), split_part(u.email, '@', 1)) as username,
  u.encrypted_password,
  coalesce(nullif(u.raw_user_meta_data->> 'full_name', ''), u.email) as full_name,
  u.email,
  public.map_profile_role_to_admin_role(p.role) as role,
  coalesce(u.created_at, timezone('utc', now())),
  timezone('utc', now())
from auth.users u
join public.profiles p on p.id = u.id
where public.map_profile_role_to_admin_role(p.role) is not null
on conflict (id) do update set
  username = excluded.username,
  password_hash = excluded.password_hash,
  full_name = excluded.full_name,
  email = excluded.email,
  role = excluded.role,
  updated_at = timezone('utc', now());

-- Trigger function to keep admins table synced
create or replace function public.sync_admin_from_profiles()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  auth_user auth.users%rowtype;
  mapped_role text;
begin
  mapped_role := public.map_profile_role_to_admin_role(new.role);

  if tg_op = 'DELETE' or mapped_role is null then
    delete from public.admins where id = coalesce(old.id, new.id);
    return new;
  end if;

  select * into auth_user from auth.users where id = new.id;

  if auth_user.id is null then
    -- No auth user yet, skip but keep row for future
    return new;
  end if;

  insert into public.admins (id, username, password_hash, full_name, email, role, created_at, updated_at)
  values (
    auth_user.id,
    coalesce(nullif(trim(lower(auth_user.raw_user_meta_data->> 'username')), ''), split_part(auth_user.email, '@', 1)),
    auth_user.encrypted_password,
    coalesce(nullif(auth_user.raw_user_meta_data->> 'full_name', ''), auth_user.email),
    auth_user.email,
    mapped_role,
    coalesce(auth_user.created_at, timezone('utc', now())),
    timezone('utc', now())
  )
  on conflict (id) do update set
    username = excluded.username,
    password_hash = excluded.password_hash,
    full_name = excluded.full_name,
    email = excluded.email,
    role = excluded.role,
    updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists trg_sync_admins_from_profiles on public.profiles;
create trigger trg_sync_admins_from_profiles
after insert or update on public.profiles
for each row execute function public.sync_admin_from_profiles();

drop trigger if exists trg_remove_admin_when_profile_deleted on public.profiles;
create trigger trg_remove_admin_when_profile_deleted
after delete on public.profiles
for each row execute function public.sync_admin_from_profiles();

commit;

