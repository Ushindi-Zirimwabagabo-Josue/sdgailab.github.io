-- Allow the Interns team section title on people.team_group.

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
