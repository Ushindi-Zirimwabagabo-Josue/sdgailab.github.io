-- CMS-managed geographic reach entries for the homepage Where we work section.
create table if not exists public.geographic_reach (
  id uuid primary key default gen_random_uuid(),
  country_name text not null,
  iso_alpha3 text,
  latitude numeric,
  longitude numeric,
  region text,
  display_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.geographic_reach add column if not exists iso_alpha3 text;
alter table public.geographic_reach add column if not exists latitude numeric;
alter table public.geographic_reach add column if not exists longitude numeric;

create unique index if not exists idx_geographic_reach_country_name_unique
  on public.geographic_reach(lower(country_name));

create index if not exists idx_geographic_reach_status_order
  on public.geographic_reach(status, display_order, country_name);

alter table public.geographic_reach enable row level security;

drop policy if exists "Published geographic reach is public" on public.geographic_reach;
create policy "Published geographic reach is public"
  on public.geographic_reach for select
  using (status = 'published');

drop policy if exists "Editors can manage geographic reach" on public.geographic_reach;
create policy "Editors can manage geographic reach"
  on public.geographic_reach for all
  using (is_admin_user())
  with check (is_admin_user());

drop trigger if exists geographic_reach_set_updated_at on public.geographic_reach;
create trigger geographic_reach_set_updated_at
  before update on public.geographic_reach
  for each row execute function update_updated_at();

comment on table public.geographic_reach is 'CMS-managed country list for the homepage Where we work / Geographic reach section.';
comment on column public.geographic_reach.country_name is 'Public country or territory label shown on the website.';
comment on column public.geographic_reach.region is 'Optional region label for CMS organization and future filtering.';
comment on column public.geographic_reach.iso_alpha3 is 'Optional ISO 3166-1 alpha-3 code used for map matching.';
comment on column public.geographic_reach.latitude is 'Optional latitude used to place the country marker on the homepage map.';
comment on column public.geographic_reach.longitude is 'Optional longitude used to place the country marker on the homepage map.';
