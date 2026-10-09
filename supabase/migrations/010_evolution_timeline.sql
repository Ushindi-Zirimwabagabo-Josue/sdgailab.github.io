-- CMS-managed evolution timeline entries for the About page.
create table if not exists public.evolution_timeline (
  id uuid primary key default gen_random_uuid(),
  period text not null,
  title text not null,
  body text,
  display_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_evolution_timeline_period_unique
  on public.evolution_timeline(lower(period));

create index if not exists idx_evolution_timeline_status_order
  on public.evolution_timeline(status, display_order, period);

alter table public.evolution_timeline enable row level security;

drop policy if exists "Published evolution timeline is public" on public.evolution_timeline;
create policy "Published evolution timeline is public"
  on public.evolution_timeline for select
  using (status = 'published');

drop policy if exists "Editors can manage evolution timeline" on public.evolution_timeline;
create policy "Editors can manage evolution timeline"
  on public.evolution_timeline for all
  using (is_admin_user())
  with check (is_admin_user());

drop trigger if exists evolution_timeline_set_updated_at on public.evolution_timeline;
create trigger evolution_timeline_set_updated_at
  before update on public.evolution_timeline
  for each row execute function update_updated_at();

comment on table public.evolution_timeline is 'CMS-managed timeline entries for the About page Lab evolution section.';
comment on column public.evolution_timeline.period is 'Public period label, for example 2019-2020 or 2026.';
comment on column public.evolution_timeline.title is 'Short public title for the timeline stage.';
comment on column public.evolution_timeline.body is 'Optional supporting copy shown below the timeline stage.';
