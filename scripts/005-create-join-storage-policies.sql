-- Storage policies for join-applications bucket
-- Run this AFTER creating the 'join-applications' bucket in Supabase Storage UI

-- Policy 1: Allow anyone (including anonymous users) to upload files to join-applications bucket
create policy "Anyone can upload join application files"
on storage.objects
for insert
with check (bucket_id = 'join-applications');

-- Policy 2: Allow anyone to read files from join-applications bucket (for viewing attachments)
create policy "Anyone can read join application files"
on storage.objects
for select
using (bucket_id = 'join-applications');

-- Policy 3: Allow admins to delete files if needed
create policy "Admins can delete join application files"
on storage.objects
for delete
using (
  bucket_id = 'join-applications'
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

