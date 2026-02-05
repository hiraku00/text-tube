-- Create the videos table
create table public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  channel_name text,
  thumbnail_url text,
  original_url text,
  summary text,
  detailed_script text,
  published_at timestamptz,
  view_count bigint,
  channel_thumbnail_url text,
  duration text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger to update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_videos_updated_at
    before update on public.videos
    for each row
    execute function update_updated_at_column();

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


-- 緊急: updated_at カラムが存在しない場合の復旧コマンド
-- 以下のSQLを順に実行することで、カラム追加・データ補完・トリガー設定が行われます。

-- 1. カラムを追加 (存在しない場合のみ)
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 2. 既存データのデータ補完 (created_atの日時をコピー)
UPDATE public.videos SET updated_at = created_at;

-- 3. 自動更新トリガーの作成 (未作成の場合)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_videos_updated_at ON public.videos;
CREATE TRIGGER update_videos_updated_at
    BEFORE UPDATE ON public.videos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
