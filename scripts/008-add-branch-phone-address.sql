-- Add separate phone and address fields to page_sections (for branches)
-- This makes branches display cleaner without parsing issues

alter table public.page_sections
add column if not exists phone text,
add column if not exists address text;

-- Comment for clarity
comment on column public.page_sections.phone is 'Phone number for branch/location sections';
comment on column public.page_sections.address is 'Address for branch/location sections';

