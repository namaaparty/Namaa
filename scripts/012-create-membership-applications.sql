-- Scripts: Membership applications + storage policies
-- Run in Supabase SQL Editor

begin;

-- Main table to store join requests
create table if not exists public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz not null default timezone('utc', now()),
  status text not null default 'pending' check (status in ('pending', 'reviewing', 'approved', 'rejected')),

  -- Personal info
  national_id text not null,
  phone text not null,
  title text,
  full_name text not null,
  birth_date date,
  gender text,
  marital_status text,
  id_expiry date,
  email text not null,
  governorate text,
  district text,
  election_district text,
  address text,

  -- Education / job
  qualification text,
  major text,
  university text,
  graduation_year smallint,
  profession text,
  workplace text,
  job_title text,
  experience_years smallint,

  -- Political background
  party_membership boolean default false,
  previous_party text,
  resignation_date date,

  -- Attachments (Supabase Storage URLs)
  id_front_url text,
  id_back_url text,
  photo_url text,
  resignation_file_url text,
  clearance_file_url text,

  notes text
);

comment on table public.membership_applications is
  'Stores membership/join requests submitted from the public form.';

alter table public.membership_applications enable row level security;

-- Allow anonymous/guest submissions (public website visitors)
drop policy if exists "membership_public_insert" on public.membership_applications;
create policy "membership_public_insert"
  on public.membership_applications
  for insert
  with check (auth.role() in ('anon', 'authenticated'));

-- Allow admins to read every request
drop policy if exists "membership_admin_read" on public.membership_applications;
create policy "membership_admin_read"
  on public.membership_applications
  for select
  using (
    auth.uid() in (
      select id from public.profiles where role = 'admin'
    ) or auth.role() = 'service_role'
  );

-- Allow admins to update status/notes
drop policy if exists "membership_admin_update" on public.membership_applications;
create policy "membership_admin_update"
  on public.membership_applications
  for update
  using (
    auth.uid() in (
      select id from public.profiles where role = 'admin'
    ) or auth.role() = 'service_role'
  )
  with check (
    auth.uid() in (
      select id from public.profiles where role = 'admin'
    ) or auth.role() = 'service_role'
  );

-- Allow admins to delete records if needed
drop policy if exists "membership_admin_delete" on public.membership_applications;
create policy "membership_admin_delete"
  on public.membership_applications
  for delete
  using (
    auth.uid() in (
      select id from public.profiles where role = 'admin'
    ) or auth.role() = 'service_role'
  );

-- Storage bucket for uploaded documents
insert into storage.buckets (id, name, public)
values ('membership_uploads', 'membership_uploads', false)
on conflict (id) do nothing;

-- Public visitors can upload files into the bucket but only into their own paths.
drop policy if exists "membership_files_public_upload" on storage.objects;
create policy "membership_files_public_upload"
  on storage.objects
  for insert
  with check (
    bucket_id = 'membership_uploads'
    and auth.role() in ('anon', 'authenticated')
  );

-- Admins can view/download any uploaded document.
drop policy if exists "membership_files_admin_read" on storage.objects;
create policy "membership_files_admin_read"
  on storage.objects
  for select
  using (
    bucket_id = 'membership_uploads'
    and (
      auth.uid() in (select id from public.profiles where role = 'admin')
      or auth.role() = 'service_role'
    )
  );

-- Admins can delete files (cleanup).
drop policy if exists "membership_files_admin_delete" on storage.objects;
create policy "membership_files_admin_delete"
  on storage.objects
  for delete
  using (
    bucket_id = 'membership_uploads'
    and (
      auth.uid() in (select id from public.profiles where role = 'admin')
      or auth.role() = 'service_role'
    )
  );

commit;

