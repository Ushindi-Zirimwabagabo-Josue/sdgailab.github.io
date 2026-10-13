-- News cards open the original story. Existing published items point at their UNDP pages.

ALTER TABLE news_articles
  ADD COLUMN IF NOT EXISTS source_url text;

UPDATE news_articles
SET source_url = 'https://www.undp.org/policy-centre/istanbul/news/iicpsd-unv-joint-webinar-showcased-digital-development-solutions-sdg-ai-lab-and-un-volunteers'
WHERE slug = 'iicpsd-unv-joint-webinar-showcased-digital-development-solutions-from-sdg-ai-lab-and-un-volunteers'
  AND source_url IS NULL;

UPDATE news_articles
SET source_url = 'https://www.undp.org/policy-centre/istanbul/news/sdg-ai-lab-and-un-volunteers-hosted-joint-annual-demo-day-event-showcase-volunteer-digital-solutions-sustainable'
WHERE slug = 'sdg-ai-lab-and-un-volunteers-hosted-joint-annual-demo-day-event-to-showcase-volunteer-digital-solutions-for-sustainable-development-and-sdgs'
  AND source_url IS NULL;

UPDATE news_articles
SET source_url = 'https://www.undp.org/policy-centre/istanbul/news/iicpsd-partners-ppmi-unleash-potential-frontier-technologies-sdgs-acceleration'
WHERE slug = 'iicpsd-partners-with-ppmi-to-unleash-the-potential-of-frontier-technologies-for-sdgs-acceleration'
  AND source_url IS NULL;
