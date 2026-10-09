-- Drop unused geographic_reach CMS table.
-- App wiring was removed; historical migration 008 is retained for chronology.
-- Safe to re-run: drops policies/trigger/indexes before the table.

drop policy if exists "Published geographic reach is public" on public.geographic_reach;
drop policy if exists "Editors can manage geographic reach" on public.geographic_reach;
drop trigger if exists geographic_reach_set_updated_at on public.geographic_reach;
drop index if exists public.idx_geographic_reach_country_name_unique;
drop index if exists public.idx_geographic_reach_status_order;
drop table if exists public.geographic_reach;
