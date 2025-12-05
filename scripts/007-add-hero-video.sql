-- Add hero_video column to page_content table for video backgrounds

alter table public.page_content
add column if not exists hero_video text;

-- Update home page to allow video upload
comment on column public.page_content.hero_video is 'URL to hero video (mp4) for autoplay background';

