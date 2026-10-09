-- Clean portfolio placeholder values that show on the public Solutions page.

-- Drop "MISSING … needs input" (and variants) from country arrays.
UPDATE public.projects
SET implementation_countries = COALESCE((
  SELECT ARRAY_AGG(country ORDER BY ordinality)
  FROM unnest(implementation_countries) WITH ORDINALITY AS t(country, ordinality)
  WHERE country IS NOT NULL
    AND btrim(country) <> ''
    AND country !~* 'missing|needs input'
), ARRAY[]::text[])
WHERE implementation_countries IS NOT NULL
  AND EXISTS (
    SELECT 1
    FROM unnest(implementation_countries) AS country
    WHERE country ~* 'missing|needs input'
  );

-- Normalize known country labels with broken accents / dashes.
UPDATE public.projects
SET implementation_countries = (
  SELECT ARRAY_AGG(
    CASE
      WHEN country ~* 'istanbul' AND country ~* 'fatih'
        THEN 'Türkiye (Istanbul – Fatih district)'
      WHEN country ~* 'ivoire'
        THEN 'Côte d''Ivoire'
      ELSE country
    END
    ORDER BY ordinality
  )
  FROM unnest(implementation_countries) WITH ORDINALITY AS t(country, ordinality)
)
WHERE implementation_countries IS NOT NULL
  AND EXISTS (
    SELECT 1
    FROM unnest(implementation_countries) AS country
    WHERE (country ~* 'istanbul' AND country ~* 'fatih')
       OR country ~* 'ivoire'
  );

-- Normalize inconsistent Solutions filter tags.
UPDATE public.projects
SET implementation_countries = COALESCE((
  SELECT ARRAY_AGG(normalized ORDER BY ordinality)
  FROM (
    SELECT
      ordinality,
      CASE
        WHEN country ~* '^Global\s*[-–—]\s*developed with the INFF Facility'
          THEN 'Global (developed with the INFF Facility)'
        WHEN lower(btrim(country)) = 'the database compiles national financing strategies from 30+ countries'
          THEN 'The database compiles national financing strategies from 30+ countries'
        WHEN country ~* '^basic implementations also run for'
          THEN 'Basic implementations also run for Guinea, Kyrgyzstan, Ecuador'
        WHEN lower(btrim(country)) IN ('kyrgyzstan', 'and ecuador', 'ecuador')
          AND EXISTS (
            SELECT 1
            FROM unnest(implementation_countries) AS sibling
            WHERE sibling ~* 'basic implementations also run for'
          )
          THEN NULL
        ELSE country
      END AS normalized
    FROM unnest(implementation_countries) WITH ORDINALITY AS t(country, ordinality)
  ) normalized_countries
  WHERE normalized IS NOT NULL
    AND btrim(normalized) <> ''
), ARRAY[]::text[])
WHERE implementation_countries IS NOT NULL
  AND EXISTS (
    SELECT 1
    FROM unnest(implementation_countries) AS country
    WHERE country ~* '^Global\s*[-–—]\s*developed with the INFF Facility'
       OR lower(btrim(country)) = 'the database compiles national financing strategies from 30+ countries'
       OR country ~* '^basic implementations also run for'
       OR (
         lower(btrim(country)) IN ('kyrgyzstan', 'and ecuador', 'ecuador')
         AND EXISTS (
           SELECT 1
           FROM unnest(implementation_countries) AS sibling
           WHERE sibling ~* 'basic implementations also run for'
         )
       )
  );

-- Clear collaboration placeholder stubs so they do not surface in CMS exports.
UPDATE public.projects
SET collaboration_network = NULL
WHERE collaboration_network ~* 'missing|needs input';

-- ARTT: Chuuk and Pohnpei are states of the Federated States of Micronesia — drop the double-count.
UPDATE public.projects
SET implementation_countries = ARRAY[
  'Pacific Islands: Cook Islands, Fiji, Federated States of Micronesia, Marshall Islands, Palau, Solomon Islands'
]
WHERE slug = 'audit-recommendation-tracking-tool-artt';
