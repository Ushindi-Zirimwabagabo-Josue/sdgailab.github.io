-- Seed the About page Lab evolution timeline.
-- Run this after supabase/migrations/010_evolution_timeline.sql.
insert into public.evolution_timeline (period, title, body, display_order, status, published_at)
values
  ('2019-2020', 'Foundations', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 1, 'published', now()),
  ('2021', 'Scaling tools', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 2, 'published', now()),
  ('2022', 'Global expansion', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 3, 'published', now()),
  ('2023', 'Diversification', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 4, 'published', now()),
  ('2024', 'Consolidation', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 5, 'published', now()),
  ('2025', 'Innovation', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 6, 'published', now()),
  ('2026', 'Mainstreaming', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 7, 'published', now())
on conflict do nothing;
