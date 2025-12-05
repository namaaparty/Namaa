-- Add application_number column with auto-increment
-- This creates unique sequential numbers like NAM0001, NAM0002, etc.

-- Create sequence for application numbers
create sequence if not exists join_application_number_seq start with 1 increment by 1;

-- Add application_number column
alter table public.join_applications
add column if not exists application_number text unique;

-- Create function to generate application number
create or replace function generate_application_number()
returns text as $$
declare
  next_num integer;
  app_number text;
begin
  next_num := nextval('join_application_number_seq');
  app_number := 'NAM' || lpad(next_num::text, 4, '0');
  return app_number;
end;
$$ language plpgsql;

-- Set default value for new rows
alter table public.join_applications
alter column application_number set default generate_application_number();

-- Backfill existing rows with application numbers
update public.join_applications
set application_number = generate_application_number()
where application_number is null;

