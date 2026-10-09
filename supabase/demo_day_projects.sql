-- Project portfolio seed
-- Run this in the Supabase SQL Editor after confirming which profiles are approved
-- for publication. Apply migration 004_project_portfolio_metadata.sql first so
-- the metadata updates at the bottom can populate project cards and filters.

INSERT INTO projects (
  title,
  slug,
  description,
  project_status,
  is_deployed,
  is_featured,
  image_url,
  display_order,
  status,
  published_at
) VALUES
(
  'AI for Tourism Platform',
  'ai-for-tourism-platform',
  $$> **Project profile:** Confirm publication approval, live links and data-source details before public launch.

## Impact area
Natural Language Processing

## Typical timeline
3-12 months

## What it does
An AI-powered platform that helps governments and tourism stakeholders understand visitor trends, preferences and destination performance.

## Core capabilities
- Tourism data analysis and insight generation
- Destination and visitor-trend intelligence
- AI-assisted decision support for tourism planning

## Best fit
- Ministries of tourism
- Destination-management organizations
- UNDP country offices supporting digital tourism or economic diversification$$,
  'active',
  false,
  true,
  null,
  10,
  'published',
  now()
),
(
  'Audit Recommendation Tracking Tool',
  'audit-recommendation-tracking-tool',
  $$> **Project profile:** Confirm public rollout language and country references before launch.

## Impact area
Natural Language Processing

## Typical timeline
3-12 months

## What it does
A post-audit recommendation tracking and remediation platform for Supreme Audit Institutions, oversight bodies and audited entities.

## Core capabilities
- Audit recommendation tracking
- Remediation workflow support
- AI-assisted summarization and status monitoring

## Best fit
- Supreme Audit Institutions
- Oversight bodies
- Public-sector reform teams$$,
  'active',
  false,
  true,
  null,
  20,
  'published',
  now()
),
(
  'Public Finance Simplification Platform',
  'public-finance-simplification-platform',
  $$> **Project profile:** Confirm countries, datasets and public availability before publication.

## Impact area
Natural Language Processing

## Typical timeline
3-12 months

## What it does
A digital platform that analyzes and visualizes public finance data to improve transparency and public understanding.

## Core capabilities
- Public finance data processing
- Plain-language explanation of complex fiscal data
- Visualization and exploration of budget information

## Best fit
- Public finance teams
- Transparency and accountability programmes
- Country offices supporting budget openness$$,
  'active',
  false,
  true,
  null,
  30,
  'published',
  now()
),
(
  'Digital Social Vulnerability Index',
  'digital-social-vulnerability-index',
  $$> **Project profile:** Do not publish community/persona examples without explicit review and approval.

## Impact area
GIS / Remote Sensing

## Typical timeline
6-18 months

## What it does
An AI-powered platform using machine learning and GIS to map social vulnerability and help prioritize interventions.

## Core capabilities
- Social vulnerability mapping
- Geospatial analysis
- Intervention-prioritization support

## Best fit
- Disaster risk reduction teams
- Social inclusion and resilience programmes
- Municipal or national planning partners$$,
  'active',
  false,
  true,
  null,
  40,
  'published',
  now()
),
(
  'Land Use Analysis Tool',
  'land-use-analysis-tool',
  $$> **Project profile:** Confirm public access and implementation references before launch.

## Impact area
GIS / Remote Sensing

## Typical timeline
6-18 months

## What it does
A GIS and AI-powered platform for spatial analytics, predictive modeling and sustainable land-management planning.

## Core capabilities
- Land-use and land-cover analysis
- Predictive spatial modeling
- Sustainable planning support

## Best fit
- Environment and planning institutions
- Climate and land-management teams
- Country offices supporting geospatial decision-making$$,
  'under_development',
  false,
  false,
  null,
  50,
  'published',
  now()
),
(
  'Madagascar Multi-Hazard Early Warning System',
  'madagascar-multi-hazard-early-warning-system',
  $$> **Project profile:** Confirm publication scope, partners and operational status before launch.

## Impact area
Resilience

## Typical timeline
6-15 months

## What it does
An integrated early warning platform for droughts, floods, cyclones, landslides and epidemics in one system.

## Core capabilities
- Multi-hazard risk monitoring
- Early-warning data integration
- Decision support for preparedness and response

## Best fit
- Disaster management agencies
- Resilience and emergency-response programmes
- Country offices supporting early warning systems$$,
  'active',
  false,
  false,
  null,
  60,
  'published',
  now()
),
(
  'Tech4R — Tech Volunteers for Resilience',
  'tech4r-tech-volunteers-for-resilience',
  $$> **Project profile:** Confirm public metrics and partner references before launch.

## Impact area
Resilience

## Typical timeline
6-15 months

## What it does
A global network of tech volunteers ready to mobilize reliable digital solutions during emergencies.

## Core capabilities
- Technical volunteer coordination
- Rapid-response digital support
- Emergency technology matching

## Best fit
- Crisis response teams
- Disaster risk reduction portfolios
- Partners needing surge technical capacity$$,
  'active',
  false,
  false,
  null,
  70,
  'published',
  now()
),
(
  'Innovation Campus',
  'innovation-campus',
  $$> **Programme profile:** Confirm partner, metric and phase details before publication.

## Impact area
Digital Skills Development

## Typical timeline
3-12 months

## What it does
A global education initiative in AI, IoT, Big Data and coding aligned with the Sustainable Development Goals.

## Core capabilities
- Digital-skills learning pathways
- Hands-on frontier-technology training
- SDG-aligned innovation capacity building

## Best fit
- Youth skills programmes
- Innovation and entrepreneurship initiatives
- Partners investing in digital talent pipelines$$,
  'completed',
  true,
  false,
  null,
  80,
  'published',
  now()
),
(
  'Frontier & Future Tech Leaders Programmes',
  'frontier-future-tech-leaders-programmes',
  $$> **Programme profile:** Confirm public figures and country references before publication.

## Impact area
Digital Skills Development

## Typical timeline
3-12 months

## What it does
Programmes empowering youth from least developed and developing countries with frontier-tech and leadership skills.

## Core capabilities
- Frontier-tech training
- Leadership development
- Practical learning through projects and mentoring

## Best fit
- Youth leadership programmes
- Digital transformation portfolios
- Country offices supporting future-skills agendas$$,
  'active',
  true,
  false,
  null,
  90,
  'published',
  now()
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  project_status = EXCLUDED.project_status,
  is_deployed = EXCLUDED.is_deployed,
  is_featured = EXCLUDED.is_featured,
  image_url = EXCLUDED.image_url,
  display_order = EXCLUDED.display_order,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  updated_at = now();

UPDATE projects SET
  summary = 'An AI-powered platform that helps governments and tourism stakeholders understand visitor trends, preferences and destination performance.',
  deployment_status = 'prototype',
  impact_area = 'Natural Language Processing',
  timeline = '3-12 months',
  best_fit = ARRAY['Ministries of Tourism', 'Tourism Boards', 'Local Governments'],
  core_capabilities = ARRAY['Tourism analytics', 'Interactive dashboards', 'Policy insights'],
  sdgs = ARRAY[8, 9, 17],
  updated_at = now()
WHERE slug = 'ai-for-tourism-platform';

UPDATE projects SET
  summary = 'A post-audit recommendation tracking and remediation platform for Supreme Audit Institutions, oversight bodies and audited entities.',
  deployment_status = 'prototype',
  impact_area = 'Natural Language Processing',
  timeline = '3-12 months',
  best_fit = ARRAY['Supreme Audit Institutions', 'Oversight Bodies', 'Development Partners'],
  core_capabilities = ARRAY['AI extraction', 'Lifecycle tracking', 'Stakeholder reporting'],
  sdgs = ARRAY[16, 17],
  updated_at = now()
WHERE slug = 'audit-recommendation-tracking-tool';

UPDATE projects SET
  summary = 'A digital platform that analyzes and visualizes public finance data to improve transparency and public understanding.',
  deployment_status = 'prototype',
  impact_area = 'Natural Language Processing',
  timeline = '3-12 months',
  best_fit = ARRAY['Ministries of Finance', 'Civil Society', 'Citizens'],
  core_capabilities = ARRAY['Document analysis', 'Financial visualization', 'Reporting'],
  sdgs = ARRAY[16, 17],
  updated_at = now()
WHERE slug = 'public-finance-simplification-platform';

UPDATE projects SET
  summary = 'An AI-powered platform using machine learning and GIS to map social vulnerability and help prioritize interventions.',
  deployment_status = 'internal',
  impact_area = 'GIS / Remote Sensing',
  timeline = '6-18 months',
  best_fit = ARRAY['Government Agencies', 'Humanitarian Organizations', 'Research Institutions'],
  core_capabilities = ARRAY['GIS mapping', 'Vulnerability analysis', 'Risk assessment'],
  sdgs = ARRAY[10, 11, 13, 17],
  updated_at = now()
WHERE slug = 'digital-social-vulnerability-index';

UPDATE projects SET
  summary = 'A GIS and AI-powered platform for spatial analytics, predictive modeling and sustainable land-management planning.',
  deployment_status = 'prototype',
  impact_area = 'GIS / Remote Sensing',
  timeline = '6-18 months',
  best_fit = ARRAY['Planning Authorities', 'Environmental Agencies', 'Development Partners'],
  core_capabilities = ARRAY['Spatial analysis', 'Predictive modeling', 'Scenario planning'],
  sdgs = ARRAY[11, 13, 15, 17],
  updated_at = now()
WHERE slug = 'land-use-analysis-tool';

UPDATE projects SET
  summary = 'An integrated early warning platform for droughts, floods, cyclones, landslides and epidemics in one system.',
  deployment_status = 'prototype',
  impact_area = 'Resilience',
  timeline = '6-15 months',
  best_fit = ARRAY['Disaster Management Agencies', 'UN Agencies', 'Humanitarian Organizations'],
  core_capabilities = ARRAY['Multi-hazard monitoring', 'GIS mapping', 'Risk alerts'],
  sdgs = ARRAY[11, 13, 17],
  updated_at = now()
WHERE slug = 'madagascar-multi-hazard-early-warning-system';

UPDATE projects SET
  summary = 'A global network of tech volunteers ready to mobilize reliable digital solutions during emergencies.',
  deployment_status = 'internal',
  impact_area = 'Resilience',
  timeline = '6-15 months',
  best_fit = ARRAY['UN Volunteers', 'Humanitarian Organizations', 'Tech Volunteers'],
  core_capabilities = ARRAY['Volunteer mobilization', 'Low-code builds', 'Crisis response'],
  sdgs = ARRAY[11, 13, 17],
  updated_at = now()
WHERE slug = 'tech4r-tech-volunteers-for-resilience';

UPDATE projects SET
  summary = 'A global education initiative in AI, IoT, Big Data and coding aligned with the Sustainable Development Goals.',
  deployment_status = 'live',
  impact_area = 'Digital Skills Development',
  timeline = '3-12 months',
  best_fit = ARRAY['Youth', 'Education Partners', 'Private-sector Partners'],
  core_capabilities = ARRAY['AI training', 'Capstone projects', 'Employment pathways'],
  sdgs = ARRAY[4, 5, 8, 9, 17],
  updated_at = now()
WHERE slug = 'innovation-campus';

UPDATE projects SET
  summary = 'Programmes empowering youth from least developed and developing countries with frontier-tech and leadership skills.',
  deployment_status = 'live',
  impact_area = 'Digital Skills Development',
  timeline = '3-12 months',
  best_fit = ARRAY['Youth', 'LDCs', 'Digital Skills Partners'],
  core_capabilities = ARRAY['Machine learning', 'Leadership', 'Entrepreneurship'],
  sdgs = ARRAY[4, 5, 8, 9, 17],
  updated_at = now()
WHERE slug = 'frontier-future-tech-leaders-programmes';
