-- Add structured project content fields requested for the SDG AI Lab
-- website refresh. These fields support the standardized project/solution
-- template discussed for public project pages while keeping editorial content
-- manageable through the CMS.

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS problem text,
  ADD COLUMN IF NOT EXISTS solution text,
  ADD COLUMN IF NOT EXISTS how_it_works text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS features text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS tech_stack text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS collaboration_network text,
  ADD COLUMN IF NOT EXISTS implementation_countries text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS resource_links text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS media_caption text;

COMMENT ON COLUMN projects.problem IS 'Public-facing problem statement for the standardized project template.';
COMMENT ON COLUMN projects.solution IS 'Public-facing solution statement for the standardized project template.';
COMMENT ON COLUMN projects.how_it_works IS 'Short ordered steps explaining how the project or product works.';
COMMENT ON COLUMN projects.features IS 'Key public-facing features or capabilities shown on project pages.';
COMMENT ON COLUMN projects.tech_stack IS 'Technologies, models, tools, datasets, or platforms used by the project.';
COMMENT ON COLUMN projects.collaboration_network IS 'Public collaboration/network wording. Avoid formal partner language unless approved.';
COMMENT ON COLUMN projects.implementation_countries IS 'Countries or territories where the project has been implemented or piloted.';
COMMENT ON COLUMN projects.resource_links IS 'Public links to downloads, repositories, reports, or approved resources.';
COMMENT ON COLUMN projects.video_url IS 'Approved external video/media URL, such as YouTube, Vimeo, or a public media page.';
COMMENT ON COLUMN projects.media_caption IS 'Optional caption or context for the project video/media block.';
