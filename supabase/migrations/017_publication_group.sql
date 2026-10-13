-- Lets editors place a publication in Official UNDP reports or Papers from the wider network.
-- Existing reports and briefs stay official; academic papers and datasets stay with the network.

ALTER TABLE publications
  ADD COLUMN IF NOT EXISTS publication_group text;

UPDATE publications
SET publication_group = CASE
  WHEN publication_type IN ('report', 'brief_white_paper') THEN 'official_undp'
  ELSE 'network'
END
WHERE publication_group IS NULL;

ALTER TABLE publications
  ALTER COLUMN publication_group SET DEFAULT 'official_undp';

ALTER TABLE publications
  ALTER COLUMN publication_group SET NOT NULL;

ALTER TABLE publications
  DROP CONSTRAINT IF EXISTS publications_publication_group_check;

ALTER TABLE publications
  ADD CONSTRAINT publications_publication_group_check
  CHECK (publication_group IN ('official_undp', 'network'));
