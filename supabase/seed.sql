-- SDG AI Lab CMS - Seed Data
-- All rows have status='published' and published_at=now()

-- =============================================================================
-- Statistics (4 rows)
-- =============================================================================
INSERT INTO statistics (label, value, icon_name, display_order, status, published_at) VALUES
  ('Digital projects', '50+', 'projects', 1, 'published', now()),
  ('Learners', '3,000+', 'learners', 2, 'published', now()),
  ('Knowledge products', '15', 'knowledge', 3, 'published', now()),
  ('Online UN Volunteers', '3,500+', 'volunteers', 4, 'published', now()),
  ('Countries reached', '25', 'countries', 5, 'published', now());
-- =============================================================================
-- Projects (10 rows) - first 3 is_featured=true, all project_status='active', is_deployed=false
-- =============================================================================
INSERT INTO projects (title, slug, description, project_status, is_deployed, is_featured, display_order, status, published_at) VALUES
  ('Large-scale Multi-label Document Classification', 'multi-label-classification', 'Working with the Nature, Energy, Climate Cluster on large-scale multi-label document classification for sustainable development goals.', 'active', false, true, 1, 'published', now()),
  ('NLP for Vertical Fund Portfolio', 'nlp-vertical-fund', 'Information retrieval, extraction and aggregation for Vertical Fund Portfolio using NLP and graphical databases.', 'active', false, true, 2, 'published', now()),
  ('AI for Disaster Preparedness', 'ai-disaster-preparedness', 'AI R&D for private sector disaster preparedness, response, and recovery with the Connecting Business initiative.', 'active', false, true, 3, 'published', now()),
  ('Technology Landscaping Study', 'technology-landscaping', 'Technology landscaping and mapping study for the Connecting Business initiative.', 'active', false, false, 4, 'published', now()),
  ('GIS Disaster Prototype', 'gis-disaster-prototype', 'GIS prototype for disaster preparedness, response, and recovery.', 'active', false, false, 5, 'published', now()),
  ('NLP Information Retrieval', 'nlp-information-retrieval', 'NLP prototype for information retrieval and classification.', 'active', false, false, 6, 'published', now()),
  ('BCtA Data Visualization', 'bcta-data-visualization', 'Data visualization for Business Call to Action flagship report.', 'active', false, false, 7, 'published', now()),
  ('OSDG ML Research', 'osdg-ml-research', 'Machine learning research for SDG Classifier as part of the PPMI/OSDG collaboration.', 'active', false, false, 8, 'published', now()),
  ('Country Programme Document Analysis', 'cpd-analysis', 'UNDP country programme document portfolio sense-making using NLP techniques.', 'active', false, false, 9, 'published', now()),
  ('Twitter Analysis for Covid-19', 'twitter-covid-analysis', 'Twitter analysis framework for Covid-19 response studies and crisis informatics.', 'active', false, false, 10, 'published', now());

-- =============================================================================
-- People - Advisory Board (8 rows)
-- =============================================================================
INSERT INTO people (name, role_title, group_type, display_order, status, published_at) VALUES
  ('Boris Alberda', 'Innovation Manager at Oxfam Novib', 'advisory_board', 1, 'published', now()),
  ('Hande Bilir', 'Strategy and Business Development Director at ESRI Turkey', 'advisory_board', 2, 'published', now()),
  ('Samira Khan', 'Senior Manager, Global Impact Engagement at Salesforce.org', 'advisory_board', 3, 'published', now()),
  ('Soonson Kwon', 'Global Machine Learning Ecosystem Programs Lead, Developer Relations at Google', 'advisory_board', 4, 'published', now()),
  ('Prof. Ebru Akçapınar Sezer', 'Professor of Computer Engineering, Hacettepe University', 'advisory_board', 5, 'published', now()),
  ('Dr. Serdar Türkeli', 'Researcher, Lecturer, and Coordinator at UNU-MERIT and Maastricht University', 'advisory_board', 6, 'published', now()),
  ('Natalia Villalobos', 'Team Lead, Racial Equity Commitment at Google', 'advisory_board', 7, 'published', now()),
  ('Prof. Deniz Yüret', 'Professor of Computer Engineering, Director of AI Laboratory at Koç University', 'advisory_board', 8, 'published', now());

-- =============================================================================
-- Partners (14 rows)
-- =============================================================================
INSERT INTO partners (name, website_url, display_order, status, published_at) VALUES
  ('Global Environment Facility', 'https://www.thegef.org/', 1, 'published', now()),
  ('The Global Fund', 'https://www.theglobalfund.org/en/', 2, 'published', now()),
  ('UNDP', 'https://www.undp.org/', 3, 'published', now()),
  ('Green Climate Fund', 'https://www.greenclimate.fund/', 4, 'published', now()),
  ('Connecting Business initiative', 'https://www.connectingbusiness.org/', 5, 'published', now()),
  ('Business Call to Action', 'https://www.businesscalltoaction.org/', 6, 'published', now()),
  ('UNOCHA', 'https://www.unocha.org/', 7, 'published', now()),
  ('PPMI', 'https://www.ppmi.lt/', 8, 'published', now()),
  ('UN Volunteers', 'https://www.unv.org/', 9, 'published', now()),
  ('IICPSD', 'https://www.iicpsd.undp.org/', 10, 'published', now()),
  ('China Ministry of Foreign Affairs', 'https://www.fmprc.gov.cn/mfa_eng/', 11, 'published', now()),
  ('Kazakhstan Ministry of Foreign Affairs', 'https://www.gov.kz/memleket/entities/mfa', 12, 'published', now()),
  ('South Korea Ministry of Foreign Affairs', 'http://www.mofa.go.kr/eng/index.do', 13, 'published', now()),
  ('Turkey Ministry of Foreign Affairs', 'http://www.mfa.gov.tr/', 14, 'published', now());

-- =============================================================================
-- Page Content (2 rows)
-- =============================================================================
INSERT INTO page_content (page_slug, section_slug, body, status, published_at) VALUES
  ('about', 'our-approach', 'The SDG AI Lab provides a one-stop solution approach for AI/ML advisory and research support. We utilize an agile, gig-based approach to leverage global talent for sustainable development goals.', 'published', now()),
  ('volunteer', 'main', '## Volunteer Data Scientist Initiative

The UNV-ICPSD Digital Transformation Partnership brings together volunteer data scientists from around the world to contribute to sustainable development through AI and machine learning. Volunteers work on real-world projects that support UNDP''s mission.

### How It Works

- **Apply**: Submit your application through the UN Volunteers platform
- **Match**: Get matched to projects based on your skills
- **Contribute**: Work remotely on meaningful data science projects
- **Impact**: Help advance the Sustainable Development Goals', 'published', now());
