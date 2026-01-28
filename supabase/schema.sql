-- Create the videos table
create table public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  channel_name text,
  thumbnail_url text,
  original_url text,
  summary text,
  detailed_script text,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.videos enable row level security;

-- Create a policy that allows anyone to read videos
create policy "Allow public read access"
on public.videos
for select
to public
using (true);

-- Create a policy that allows only authenticated users to insert videos
create policy "Allow authenticated insert access"
on public.videos
for insert
to authenticated
with check (true);

-- Create a policy that allows only authenticated users to update videos
create policy "Allow authenticated update access"
on public.videos
for update
to authenticated
using (true);

-- Create a policy that allows only authenticated users to delete videos
create policy "Allow authenticated delete access"
on public.videos
for delete
to authenticated
using (true);
