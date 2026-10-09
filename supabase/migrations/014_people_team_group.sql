-- Add explicit marina team section titles for people (CMS-editable).
-- group_type stays team | advisory_board; team_group is the page section title.

ALTER TABLE people
  ADD COLUMN IF NOT EXISTS team_group text;

ALTER TABLE people
  DROP CONSTRAINT IF EXISTS people_team_group_check;

ALTER TABLE people
  ADD CONSTRAINT people_team_group_check
  CHECK (
    team_group IS NULL
    OR team_group IN (
      'Coordination · Research & Advisory',
      'GIS & GeoAI · Software Development',
      'NLP / LLM · Training & Data Science',
      'Interns'
    )
  );

COMMENT ON COLUMN people.team_group IS
  'Marina team page section title when group_type = team.';

-- Backfill from legacy biography section labels used by the old seed.
UPDATE people
SET team_group = CASE biography
  WHEN 'Coordination Team' THEN 'Coordination · Research & Advisory'
  WHEN 'Research & Advisory Team' THEN 'Coordination · Research & Advisory'
  WHEN 'GIS & GeoAI Team' THEN 'GIS & GeoAI · Software Development'
  WHEN 'Software Development Team' THEN 'GIS & GeoAI · Software Development'
  WHEN 'NLP/LLM Team' THEN 'NLP / LLM · Training & Data Science'
  WHEN 'Training Team' THEN 'NLP / LLM · Training & Data Science'
  ELSE team_group
END
WHERE group_type = 'team'
  AND team_group IS NULL
  AND biography IS NOT NULL;
