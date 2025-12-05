-- Create join_applications table for membership applications
create table if not exists public.join_applications (
  id uuid default gen_random_uuid() primary key,
  
  -- البيانات الشخصية
  national_id text not null,
  phone text not null,
  title text,
  full_name text not null,
  birth_date date,
  gender text,
  marital_status text,
  id_expiry date,
  email text,
  governorate text,
  district text,
  election_district text,
  address text,
  
  -- التعليم والوظيفة
  qualification text,
  major text,
  university text,
  graduation_year text,
  profession text,
  workplace text,
  job_title text,
  experience text,
  
  -- الانتماء الحزبي
  party_membership text,
  previous_party text,
  resignation_date date,
  
  -- المرفقات (URLs to uploaded files in Supabase Storage)
  id_front_url text,
  id_back_url text,
  resignation_url text,
  clearance_url text,
  photo_url text,
  
  -- Metadata
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  submitted_at timestamp with time zone default now(),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamp with time zone,
  notes text,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.join_applications enable row level security;

-- Policy: Anyone can submit applications (insert)
create policy "Anyone can submit join applications"
  on public.join_applications
  for insert
  with check (true);

-- Policy: Admins can view all applications
create policy "Admins can view join applications"
  on public.join_applications
  for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Policy: Admins can update applications (status, notes, etc.)
create policy "Admins can update join applications"
  on public.join_applications
  for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Create indexes for better query performance
create index if not exists idx_join_applications_status on public.join_applications(status);
create index if not exists idx_join_applications_submitted_at on public.join_applications(submitted_at desc);
create index if not exists idx_join_applications_national_id on public.join_applications(national_id);

-- Create trigger to auto-update updated_at
create or replace function public.update_join_applications_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_join_applications_updated_at on public.join_applications;

create trigger set_join_applications_updated_at
  before update on public.join_applications
  for each row
  execute function public.update_join_applications_updated_at();

-- Grant access to anon role for insert
grant insert on public.join_applications to anon;

