-- Team members seed
-- Uses the people table schema including team_group. Run in Supabase SQL Editor
-- to populate editable CMS records. Existing records are updated by name;
-- missing records are inserted.

CREATE TEMP TABLE seed_team_members (
  name text,
  role_title text,
  team_group text,
  display_order integer
) ON COMMIT DROP;

INSERT INTO seed_team_members (name, role_title, team_group, display_order) VALUES
  ('Gokhan Dikmener', 'Chief Technology Advisor', 'Coordination · Research & Advisory', 1),
  ('Dina Akylbekova', 'Programme Specialist', 'Coordination · Research & Advisory', 2),
  ('Cansu Ozgur', 'Programme Analyst', 'Coordination · Research & Advisory', 3),
  ('Luka Ozay', 'Research Intern', 'Interns', 4),
  ('Ihsan Bilgin', 'Research Intern', 'Interns', 5),
  ('Alper Dincer', 'GIS Analyst', 'GIS & GeoAI · Software Development', 6),
  ('Salsabila Prasetya', 'GIS Analyst', 'GIS & GeoAI · Software Development', 7),
  ('Aykut Sevim', 'Software Development Specialist', 'GIS & GeoAI · Software Development', 8),
  ('Jackson Onyango', 'Full Stack Developer', 'GIS & GeoAI · Software Development', 9),
  ('Josue Ushindi', 'Full Stack Developer', 'GIS & GeoAI · Software Development', 10),
  ('Muhammed Suleman', 'Data Scientist Fellow', 'NLP / LLM · Training & Data Science', 11),
  ('Mert Atay', 'Data Science Analyst', 'NLP / LLM · Training & Data Science', 12),
  ('Cristovao Cacombe', 'Data Science Analyst', 'NLP / LLM · Training & Data Science', 13),
  ('Ipek Beril Benli', 'Programme Analyst', 'NLP / LLM · Training & Data Science', 14),
  ('Alamou Shola Mouhsine Daouda', 'Data Science Analyst', 'NLP / LLM · Training & Data Science', 15),
  ('Eda Nur Saruhan', 'Data Science Analyst', 'NLP / LLM · Training & Data Science', 16);

UPDATE people
SET
  role_title = seed_team_members.role_title,
  team_group = seed_team_members.team_group,
  group_type = 'team',
  display_order = seed_team_members.display_order,
  status = 'published',
  published_at = COALESCE(people.published_at, now()),
  updated_at = now()
FROM seed_team_members
WHERE people.name = seed_team_members.name;

INSERT INTO people (
  name,
  role_title,
  photo_url,
  group_type,
  team_group,
  biography,
  display_order,
  status,
  published_at
)
SELECT
  seed_team_members.name,
  seed_team_members.role_title,
  null,
  'team',
  seed_team_members.team_group,
  null,
  seed_team_members.display_order,
  'published',
  now()
FROM seed_team_members
WHERE NOT EXISTS (
  SELECT 1
  FROM people
  WHERE people.name = seed_team_members.name
);
