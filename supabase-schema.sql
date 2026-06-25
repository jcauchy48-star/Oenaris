-- Cave a vin - minimal cloud schema for the first account-enabled web beta.
-- Run this in the Supabase SQL editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cellar_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

-- TODO future schema normalization:
-- Keep cellar_snapshots as the minimal cloud backup layer for now.
-- Later migrations can split payload into normalized tables:
-- wines, tasting_notes, wishlist_items, cellar_layouts, cellar_slots,
-- wine_photos, sync_events.

alter table public.profiles enable row level security;
alter table public.cellar_snapshots enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "Users can read their own cellar snapshot" on public.cellar_snapshots;
create policy "Users can read their own cellar snapshot"
on public.cellar_snapshots for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own cellar snapshot" on public.cellar_snapshots;
create policy "Users can insert their own cellar snapshot"
on public.cellar_snapshots for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own cellar snapshot" on public.cellar_snapshots;
create policy "Users can update their own cellar snapshot"
on public.cellar_snapshots for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email, updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
