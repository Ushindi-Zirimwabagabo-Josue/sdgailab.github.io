-- CMS-managed team page sections. people.team_group stores the section title.

create table if not exists public.team_groups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  display_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_team_groups_title_unique
  on public.team_groups (lower(title));

create index if not exists idx_team_groups_status_order
  on public.team_groups (status, display_order, title);

alter table public.team_groups enable row level security;

drop policy if exists "Published team groups are public" on public.team_groups;
create policy "Published team groups are public"
  on public.team_groups for select
  using (status = 'published');

drop policy if exists "Editors can manage team groups" on public.team_groups;
create policy "Editors can manage team groups"
  on public.team_groups for all
  using (is_admin_user())
  with check (is_admin_user());

drop trigger if exists team_groups_set_updated_at on public.team_groups;
create trigger team_groups_set_updated_at
  before update on public.team_groups
  for each row execute function update_updated_at();

insert into public.team_groups (title, display_order, status, published_at)
select seed.title, seed.display_order, 'published', now()
from (
  values
    ('Coordination · Research & Advisory', 1),
    ('GIS & GeoAI · Software Development', 2),
    ('NLP / LLM · Training & Data Science', 3),
    ('Interns', 4)
) as seed(title, display_order)
where not exists (
  select 1
  from public.team_groups existing
  where lower(existing.title) = lower(seed.title)
);

alter table public.people
  drop constraint if exists people_team_group_check;

comment on table public.team_groups is 'CMS-managed section titles for the public team page.';
comment on column public.team_groups.title is 'Public section heading. people.team_group stores the same title.';
