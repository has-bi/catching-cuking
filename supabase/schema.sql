-- Jakarta Cats — run this once in Supabase Dashboard → SQL Editor.

-- 1. Table ---------------------------------------------------------------
create table if not exists public.cats (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text,                      -- nickname, e.g. "Oyen"
  area        text,                      -- free text, e.g. "Blok M"
  notes       text,
  lat         double precision,
  lng         double precision,
  taken_at    timestamptz,               -- from photo EXIF when available
  photo_path  text not null,             -- path inside the cat-photos bucket
  thumb_path  text not null
);

create index if not exists cats_created_at_idx on public.cats (created_at desc);

-- 2. Row Level Security -------------------------------------------------
-- Everyone can view. Only signed-in users can write. Sign-ups must be
-- disabled (Authentication → Sign In / Providers → "Allow new users to sign up" OFF)
-- so Nadya's account is the only signed-in user.
alter table public.cats enable row level security;

drop policy if exists "cats are public" on public.cats;
create policy "cats are public" on public.cats
  for select to anon, authenticated using (true);

drop policy if exists "owner can insert" on public.cats;
create policy "owner can insert" on public.cats
  for insert to authenticated with check (true);

drop policy if exists "owner can update" on public.cats;
create policy "owner can update" on public.cats
  for update to authenticated using (true) with check (true);

drop policy if exists "owner can delete" on public.cats;
create policy "owner can delete" on public.cats
  for delete to authenticated using (true);

-- 3. Storage bucket -----------------------------------------------------
insert into storage.buckets (id, name, public)
values ('cat-photos', 'cat-photos', true)
on conflict (id) do nothing;

drop policy if exists "owner can upload photos" on storage.objects;
create policy "owner can upload photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'cat-photos');

drop policy if exists "owner can delete photos" on storage.objects;
create policy "owner can delete photos" on storage.objects
  for delete to authenticated using (bucket_id = 'cat-photos');
