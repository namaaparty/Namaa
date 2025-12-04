-- Budgets table stores metadata about uploaded PDF files

create table if not exists public.budget_documents (
  id uuid primary key default uuid_generate_v4(),
  year integer not null,
  title text not null,
  description text,
  file_url text not null,
  file_size integer,
  uploaded_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create index if not exists idx_budget_documents_year on public.budget_documents (year desc);

create trigger update_budget_documents_updated_at
before update on public.budget_documents
for each row execute function update_updated_at_column();

alter table public.budget_documents enable row level security;

drop policy if exists "budgets_public_read" on public.budget_documents;
create policy "budgets_public_read"
  on public.budget_documents
  for select
  using (true);

drop policy if exists "budgets_admin_write" on public.budget_documents;
create policy "budgets_admin_write"
  on public.budget_documents
  for all
  using (
    auth.uid() in (select id from public.profiles where role = 'admin')
  )
  with check (
    auth.uid() in (select id from public.profiles where role = 'admin')
  );

