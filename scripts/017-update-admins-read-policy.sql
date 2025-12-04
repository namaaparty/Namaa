-- Allow authenticated super admins to read admins table

begin;

drop policy if exists "admins_admin_read" on public.admins;
create policy "admins_admin_read"
  on public.admins
  for select
  using (
    auth.role() = 'service_role'
    or auth.uid() in (
      select id from public.profiles where role = 'admin'
    )
  );

commit;

