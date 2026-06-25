create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cellar_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- TODO future schema normalization:
-- Keep cellar_snapshots as the minimal cloud backup layer for now.
-- Later migrations can split payload into normalized tables:
-- wines, tasting_notes, wishlist_items, cellar_layouts, cellar_slots,
-- wine_photos, sync_events.

create table if not exists public.wine_references (
  id uuid primary key default gen_random_uuid(),
  domain text not null,
  cuvee text not null,
  appellation text,
  region text,
  country text not null default 'France',
  color text not null default 'Inconnu',
  grape_varieties text[] not null default '{}',
  source text not null default 'user' check (source in ('seed', 'user', 'scan', 'import')),
  review_status text not null default 'community' check (review_status in ('pending', 'community', 'verified', 'rejected')),
  confidence_score numeric(4,3) not null default 0.5 check (confidence_score >= 0 and confidence_score <= 1),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reference_key text generated always as (
    lower(trim(domain)) || '|' ||
    lower(trim(cuvee)) || '|' ||
    lower(trim(coalesce(appellation, ''))) || '|' ||
    lower(trim(coalesce(region, '')))
  ) stored
);

alter table public.wine_references
  drop constraint if exists wine_references_review_status_check;

alter table public.wine_references
  add constraint wine_references_review_status_check
  check (review_status in ('pending', 'pending_review', 'community', 'verified', 'rejected', 'duplicate'));

alter table public.wine_references
  add column if not exists food_pairings text[] not null default '{}',
  add column if not exists serving_temperature text,
  add column if not exists opening_advice text,
  add column if not exists decanting_time integer not null default 0,
  add column if not exists drink_from integer,
  add column if not exists drink_to integer,
  add column if not exists aging_potential text,
  add column if not exists body text not null default 'unknown',
  add column if not exists tannins text not null default 'unknown',
  add column if not exists acidity text not null default 'unknown',
  add column if not exists sweetness text not null default 'unknown',
  add column if not exists best_occasions text[] not null default '{}',
  add column if not exists data_source text not null default 'user',
  add column if not exists last_reviewed_at timestamptz,
  add column if not exists verified_by uuid references auth.users(id) on delete set null;

create table if not exists public.wine_aliases (
  id uuid primary key default gen_random_uuid(),
  reference_id uuid not null references public.wine_references(id) on delete cascade,
  alias text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.wine_vintages (
  id uuid primary key default gen_random_uuid(),
  reference_id uuid not null references public.wine_references(id) on delete cascade,
  vintage integer not null check (vintage between 1800 and 2200),
  drink_from integer,
  drink_to integer,
  estimated_value numeric(10,2),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (reference_id, vintage)
);

create table if not exists public.wine_contributions (
  id uuid primary key default gen_random_uuid(),
  reference_id uuid references public.wine_references(id) on delete set null,
  user_id uuid references auth.users(id) on delete cascade default auth.uid(),
  contribution_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.wine_label_scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  wine_reference_id uuid references public.wine_references(id) on delete set null,
  image_hash text,
  extracted_text text,
  result_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.wine_import_batches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  file_name text,
  row_count integer not null default 0,
  status text not null default 'completed' check (status in ('pending', 'completed', 'failed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.cellar_layouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name text not null default 'Cave principale',
  layout_type text not null default 'cellar',
  layout_mode text not null default 'grid',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_enrichment_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade default auth.uid(),
  wine_reference_id uuid references public.wine_references(id) on delete cascade,
  request_type text not null default 'complete_reference',
  requested_fields text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  result_payload jsonb,
  error text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.advice_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade default auth.uid(),
  advice_id text,
  wine_id text,
  feedback_type text not null check (feedback_type in ('useful', 'not_useful', 'followed')),
  context text,
  created_at timestamptz not null default now()
);

create unique index if not exists wine_references_reference_key_idx on public.wine_references(reference_key);
create index if not exists wine_references_domain_idx on public.wine_references(lower(domain));
create index if not exists wine_references_cuvee_idx on public.wine_references(lower(cuvee));
create index if not exists wine_references_region_idx on public.wine_references(lower(region));
create index if not exists wine_references_status_idx on public.wine_references(review_status);
create index if not exists wine_references_created_by_idx on public.wine_references(created_by);
create unique index if not exists wine_aliases_reference_alias_idx on public.wine_aliases(reference_id, lower(alias));
create index if not exists wine_vintages_reference_idx on public.wine_vintages(reference_id);
create index if not exists wine_contributions_reference_idx on public.wine_contributions(reference_id);
create index if not exists wine_contributions_user_idx on public.wine_contributions(user_id);
create index if not exists wine_label_scans_user_idx on public.wine_label_scans(user_id);
create index if not exists wine_import_batches_user_idx on public.wine_import_batches(user_id);
create index if not exists cellar_layouts_user_idx on public.cellar_layouts(user_id);
create index if not exists ai_enrichment_queue_user_idx on public.ai_enrichment_queue(user_id);
create index if not exists ai_enrichment_queue_status_idx on public.ai_enrichment_queue(status);
create index if not exists advice_feedback_user_idx on public.advice_feedback(user_id);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists cellar_snapshots_set_updated_at on public.cellar_snapshots;
create trigger cellar_snapshots_set_updated_at before update on public.cellar_snapshots
for each row execute function public.set_updated_at();

drop trigger if exists wine_references_set_updated_at on public.wine_references;
create trigger wine_references_set_updated_at before update on public.wine_references
for each row execute function public.set_updated_at();

drop trigger if exists wine_vintages_set_updated_at on public.wine_vintages;
create trigger wine_vintages_set_updated_at before update on public.wine_vintages
for each row execute function public.set_updated_at();

drop trigger if exists cellar_layouts_set_updated_at on public.cellar_layouts;
create trigger cellar_layouts_set_updated_at before update on public.cellar_layouts
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do update
    set email = excluded.email,
        display_name = coalesce(public.profiles.display_name, excluded.display_name),
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.cellar_snapshots enable row level security;
alter table public.wine_references enable row level security;
alter table public.wine_aliases enable row level security;
alter table public.wine_vintages enable row level security;
alter table public.wine_contributions enable row level security;
alter table public.wine_label_scans enable row level security;
alter table public.wine_import_batches enable row level security;
alter table public.cellar_layouts enable row level security;
alter table public.ai_enrichment_queue enable row level security;
alter table public.advice_feedback enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
for insert with check (auth.uid() = id);

drop policy if exists "snapshots_select_own" on public.cellar_snapshots;
create policy "snapshots_select_own" on public.cellar_snapshots
for select using (auth.uid() = user_id);

drop policy if exists "snapshots_upsert_own" on public.cellar_snapshots;
create policy "snapshots_upsert_own" on public.cellar_snapshots
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "wine_references_public_read" on public.wine_references;
create policy "wine_references_public_read" on public.wine_references
for select using (review_status in ('verified', 'community') or created_by = auth.uid());

drop policy if exists "wine_references_insert_authenticated" on public.wine_references;
create policy "wine_references_insert_authenticated" on public.wine_references
for insert with check (
  auth.role() = 'authenticated'
  and created_by = auth.uid()
  and source in ('user', 'scan', 'import')
  and review_status in ('pending', 'community')
);

drop policy if exists "wine_references_update_own" on public.wine_references;
create policy "wine_references_update_own" on public.wine_references
for update using (created_by = auth.uid()) with check (created_by = auth.uid());

drop policy if exists "wine_aliases_read_visible_refs" on public.wine_aliases;
create policy "wine_aliases_read_visible_refs" on public.wine_aliases
for select using (
  exists (
    select 1 from public.wine_references wr
    where wr.id = reference_id
    and (wr.review_status in ('verified', 'community') or wr.created_by = auth.uid())
  )
);

drop policy if exists "wine_aliases_insert_own" on public.wine_aliases;
create policy "wine_aliases_insert_own" on public.wine_aliases
for insert with check (auth.role() = 'authenticated' and created_by = auth.uid());

drop policy if exists "wine_vintages_read_visible_refs" on public.wine_vintages;
create policy "wine_vintages_read_visible_refs" on public.wine_vintages
for select using (
  exists (
    select 1 from public.wine_references wr
    where wr.id = reference_id
    and (wr.review_status in ('verified', 'community') or wr.created_by = auth.uid())
  )
);

drop policy if exists "wine_vintages_insert_authenticated" on public.wine_vintages;
create policy "wine_vintages_insert_authenticated" on public.wine_vintages
for insert with check (
  auth.role() = 'authenticated'
  and exists (
    select 1 from public.wine_references wr
    where wr.id = reference_id
    and (wr.created_by = auth.uid() or wr.review_status in ('verified', 'community'))
  )
);

drop policy if exists "wine_vintages_update_own_or_ref" on public.wine_vintages;
create policy "wine_vintages_update_own_or_ref" on public.wine_vintages
for update using (
  created_by = auth.uid()
  or exists (select 1 from public.wine_references wr where wr.id = reference_id and wr.created_by = auth.uid())
) with check (
  created_by = auth.uid()
  or exists (select 1 from public.wine_references wr where wr.id = reference_id and wr.created_by = auth.uid())
);

drop policy if exists "wine_contributions_select_own_or_visible" on public.wine_contributions;
create policy "wine_contributions_select_own_or_visible" on public.wine_contributions
for select using (
  user_id = auth.uid()
  or exists (
    select 1 from public.wine_references wr
    where wr.id = reference_id
    and wr.review_status in ('verified', 'community')
  )
);

drop policy if exists "wine_contributions_insert_own" on public.wine_contributions;
create policy "wine_contributions_insert_own" on public.wine_contributions
for insert with check (auth.role() = 'authenticated' and user_id = auth.uid());

drop policy if exists "wine_label_scans_all_own" on public.wine_label_scans;
create policy "wine_label_scans_all_own" on public.wine_label_scans
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "wine_import_batches_all_own" on public.wine_import_batches;
create policy "wine_import_batches_all_own" on public.wine_import_batches
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "cellar_layouts_all_own" on public.cellar_layouts;
create policy "cellar_layouts_all_own" on public.cellar_layouts
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "ai_enrichment_queue_all_own" on public.ai_enrichment_queue;
create policy "ai_enrichment_queue_all_own" on public.ai_enrichment_queue
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "advice_feedback_all_own" on public.advice_feedback;
create policy "advice_feedback_all_own" on public.advice_feedback
for all using (user_id = auth.uid()) with check (user_id = auth.uid());
