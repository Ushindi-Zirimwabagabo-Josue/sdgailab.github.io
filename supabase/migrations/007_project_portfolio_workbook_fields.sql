-- Add workbook-backed portfolio fields for the definitive SDG AI Lab project portfolio.
-- These columns preserve fields from UNDP Project Portfolio.xlsx that are not
-- already covered by the public project template.

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS project_year integer,
  ADD COLUMN IF NOT EXISTS capabilities_involved text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS reusable_components text,
  ADD COLUMN IF NOT EXISTS current_client_segments text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS future_client_segments text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS business_model text,
  ADD COLUMN IF NOT EXISTS project_category text,
  ADD COLUMN IF NOT EXISTS work_stream text;

CREATE INDEX IF NOT EXISTS idx_projects_work_stream ON projects (work_stream)
WHERE status = 'published';

COMMENT ON COLUMN projects.project_year IS 'Year the project started or was delivered, from the definitive portfolio workbook.';
COMMENT ON COLUMN projects.capabilities_involved IS 'High-level capability areas involved in the project, from the portfolio workbook.';
COMMENT ON COLUMN projects.reusable_components IS 'Scalability or reusable component description from the portfolio workbook.';
COMMENT ON COLUMN projects.current_client_segments IS 'Current client segments served by the project.';
COMMENT ON COLUMN projects.future_client_segments IS 'Future addressable client segments for the project.';
COMMENT ON COLUMN projects.business_model IS 'Business model label from the portfolio workbook.';
COMMENT ON COLUMN projects.project_category IS 'Project category label from the portfolio workbook.';
COMMENT ON COLUMN projects.work_stream IS 'Raw work stream label from the portfolio workbook.';
