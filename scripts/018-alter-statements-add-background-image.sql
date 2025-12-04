begin;

alter table public.statements
  add column if not exists background_image text;

commit;

