-- SDG AI Lab impact statistics
-- Run this in Supabase SQL editor to align the public Statistics section with the approved About slide.
-- It archives the previous published statistics and inserts the current impact-oriented figures.

UPDATE statistics
SET status = 'archived', updated_at = now()
WHERE status = 'published'
  AND label IN (
    'Technical Advisors',
    'Full-Time Data Scientists',
    'Volunteer Data Scientists',
    'Partnership & Outreach Analysts',
    'Impact areas',
    'Service lines',
    'Established',
    'Sustainable Development Goals',
    'Digital projects',
    'Learners',
    'Knowledge products',
    'Online UN Volunteers',
    'Countries reached'
  );

INSERT INTO statistics (label, value, icon_name, display_order, status, published_at)
VALUES
  ('Digital projects', '50+', 'projects', 1, 'published', now()),
  ('Learners', '3,000+', 'learners', 2, 'published', now()),
  ('Knowledge products', '15', 'knowledge', 3, 'published', now()),
  ('Online UN Volunteers', '3,500+', 'volunteers', 4, 'published', now()),
  ('Countries reached', '25', 'countries', 5, 'published', now());
