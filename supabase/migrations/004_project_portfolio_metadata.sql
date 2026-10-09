-- Add first-class portfolio metadata for project pages.
-- These fields support benchmark-style project cards, filtering/grouping by
-- impact area, and richer project detail sidebars without encoding everything
-- inside markdown descriptions.

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS summary text,
  ADD COLUMN IF NOT EXISTS deployment_status text CHECK (
    deployment_status IS NULL OR deployment_status IN ('live', 'prototype', 'internal')
  ),
  ADD COLUMN IF NOT EXISTS impact_area text,
  ADD COLUMN IF NOT EXISTS timeline text,
  ADD COLUMN IF NOT EXISTS best_fit text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS core_capabilities text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS sdgs integer[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_projects_impact_area ON projects (impact_area)
WHERE status = 'published';

COMMENT ON COLUMN projects.summary IS 'Short project summary shown on listing cards and detail page intros.';
COMMENT ON COLUMN projects.deployment_status IS 'Public-facing deployment label: live, prototype, or internal.';
COMMENT ON COLUMN projects.impact_area IS 'Portfolio grouping such as Natural Language Processing, GIS / Remote Sensing, or Resilience.';
COMMENT ON COLUMN projects.timeline IS 'Typical delivery or engagement timeline, e.g. 3-12 months.';
COMMENT ON COLUMN projects.best_fit IS 'Primary audiences or partners this project is best suited for.';
COMMENT ON COLUMN projects.core_capabilities IS 'Reusable technical or delivery capabilities demonstrated by the project.';
COMMENT ON COLUMN projects.sdgs IS 'SDG numbers associated with the project.';
