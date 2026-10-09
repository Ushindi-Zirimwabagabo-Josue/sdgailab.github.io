-- Definitive SDG AI Lab project portfolio generated from UNDP Project Portfolio.xlsx.
-- Run 004, 006, and 007 migrations before this upsert.

INSERT INTO projects (
  title,
  slug,
  summary,
  description,
  project_status,
  deployment_status,
  is_deployed,
  is_featured,
  image_url,
  display_order,
  status,
  published_at,
  project_year,
  impact_area,
  timeline,
  best_fit,
  core_capabilities,
  problem,
  solution,
  how_it_works,
  features,
  tech_stack,
  collaboration_network,
  implementation_countries,
  resource_links,
  video_url,
  media_caption,
  capabilities_involved,
  reusable_components,
  current_client_segments,
  future_client_segments,
  business_model,
  project_category,
  work_stream
) VALUES
  ('Land Use Analysis Tool', 'land-use-analysis-tool', 'A GIS- and AI-powered tool that maps and monitors land-use and deforestation changes over time and simulates future land-use scenarios, helping governments make data-driven decisions for sustainable land management.', '## Overview

A GIS- and AI-powered tool that maps and monitors land-use and deforestation changes over time and simulates future land-use scenarios, helping governments make data-driven decisions for sustainable land management.

## Scalability and reusable components

Built as a modular, open-source system, so the same AI/ML models, three-stage simulation engine, and web-GIS components can be re-applied and customized to new countries and land-use questions.

## Client segments

**Current:** UNDP Country Offices; Governments (national ministries and agencies)

**Future:** Other national and local governments; UN entities; environmental and forestry agencies; research and academic institutions

## Delivery model

**Business model:** Cost Recovery

**Project category:** Tailored', 'active', 'prototype', false, true, NULL, 1, 'published', now(), 2025, 'GIS / Remote Sensing', '3–6 months', ARRAY['UNDP Country Offices', 'Governments (national ministries and agencies)']::text[], ARRAY['AI/ML', 'GIS', 'remote sensing / satellite imagery', 'predictive and scenario modeling', 'web-based data visualization']::text[], 'Land and forests face growing pressure from urbanization and climate change, but traditional land-use monitoring is often slow, fragmented, and lacks the precision and predictive power needed for timely, data-driven decisions.', 'SDG AI Lab built an open-source tool that combines satellite imagery, machine learning, and web-based GIS to map land-use and deforestation changes, predict high-risk areas, and simulate future land-use scenarios for sustainable planning.', ARRAY['• Ingest multi-source satellite imagery (optical + radar) plus terrain, climate, and socio-economic data', '• Classify land cover and detect change with machine-learning models', '• Predict high-risk areas and future land-use trends', '• Simulate policy options through a three-stage simulation engine', '• Visualize results on an interactive web-GIS dashboard with automated reports']::text[], ARRAY['• Land-cover mapping and multi-temporal change monitoring', '• Deforestation detection and alerts', '• Predictive modeling of land-use change and risk', '• Scenario builder for policy simulation', '• Interactive web-GIS dashboards and automated reporting', '• Open-source, customizable, and multilingual']::text[], ARRAY['Python', 'Google Earth Engine', 'Sentinel-1 (SAR), Sentinel-2 (optical), Landsat 8/9, MODIS imagery', 'SRTM DEM', 'NDVI/EVI indices', 'Random Forest, CNN (ResNet18), ANN, Markov Chain and Cellular Automata models', 'Django REST Framework', 'PostgreSQL/PostGIS', 'Redis/Celery', 'GDAL', 'Docker', 'React.js', 'Leaflet/MapLibre', 'WMS and GeoJSON REST APIs']::text[], 'Collaborated with UNDP Country Offices (Guinea, Kazakhstan, Peru, Ecuador, Nepal, and Kyrgyzstan) and, in Kazakhstan, with National Information Technologies JSC (NIT); designed to align with national systems such as Guinea''s National Forest and Land Use Monitoring System (SNSF), with habitat-monitoring data input from the Connected Conservation Foundation.', ARRAY['Piloted in Kazakhstan (North Kazakhstan Region)', 'Basic implementations also run for Guinea, Kyrgyzstan, Ecuador']::text[], '{}'::text[], NULL, NULL, ARRAY['AI/ML', 'GIS', 'remote sensing / satellite imagery', 'predictive and scenario modeling', 'web-based data visualization']::text[], 'Built as a modular, open-source system, so the same AI/ML models, three-stage simulation engine, and web-GIS components can be re-applied and customized to new countries and land-use questions.', ARRAY['UNDP Country Offices', 'Governments (national ministries and agencies)']::text[], ARRAY['Other national and local governments', 'UN entities', 'environmental and forestry agencies', 'research and academic institutions']::text[], 'Cost Recovery', 'Tailored', 'GIS'),
  ('Audit Recommendation Tracking Tool (ARTT)', 'audit-recommendation-tracking-tool-artt', 'ARTT is a web platform that helps national audit institutions track what happens after an audit report is published. It follows each recommendation from issuance to verified implementation and formal closure, so corrective actions are recorded, evidenced, and reported.', '## Overview

ARTT is a web platform that helps national audit institutions track what happens after an audit report is published. It follows each recommendation from issuance to verified implementation and formal closure, so corrective actions are recorded, evidenced, and reported.

## Scalability and reusable components

A single deployment serves multiple countries through country-scoped data isolation, with country-specific ministries and sectors loaded as configuration. The AI extraction pipeline, recommendation workflow engine, dashboards, and report templates are reusable for any audit or oversight body that follows up on recommendations.

## Client segments

**Current:** UNDP Multi-Country Offices, Governments (Supreme Audit Institutions and audited entities)

**Future:** UNDP Country Offices, Regional Offices, Governments, UN entities

## Delivery model

**Business model:** Cost Recovery

**Project category:** Standard', 'completed', 'internal', true, true, NULL, 2, 'published', now(), 2024, 'Natural Language Processing', '9–12 months', ARRAY['UNDP Multi-Country Offices, Governments (Supreme Audit Institutions and audited entities)']::text[], ARRAY['AI/ML, NLP, Generative AI (LLM), OCR and document extraction, Web development, Data visualisation']::text[], 'Audit institutions issue reports with findings and recommendations, but follow-up is handled manually through spreadsheets, letters, and email. There is no standard way to confirm whether corrective actions were implemented.', 'A remediation platform that ingests published audit reports, extracts recommendations with AI, assigns ownership to audited entities, and enforces an evidence-based workflow through verification and final closure.', ARRAY['• Auditor uploads the audit report PDF', '• AI extracts metadata, findings, recommendations, and management responses', '• Auditor reviews and approves the extracted data', '• Audited entity responds, submits an action plan, and uploads evidence', '• Auditor verifies evidence; Head of SAI signs off final closure']::text[], ARRAY['• AI-assisted extraction of audit findings and recommendations', '• Five-state recommendation lifecycle with enforced transitions', '• Management Action Plans with locked target dates and change requests', '• Evidence upload required before verification', '• Role-based dashboards, tracker, and filtering for seven user roles', '• AI-generated stakeholder reports for citizens, media, parliament, and audited entities']::text[], ARRAY['React 18 + TypeScript, Tailwind CSS, D3.js, Django 5.1 + Django REST Framework, Python 3.12, PostgreSQL 15, Redis 7, Django Q2, LangGraph with Azure OpenAI (GPT-4), PyMuPDF4LLM, Tesseract OCR, Docker Compose']::text[], 'Designed, developed, and delivered by the SDG AI Lab in collaboration with the UNDP Pacific Multi-Country Office, under the Vaka Pasifika initiative supported by the European Union.', ARRAY['Pacific Islands: Cook Islands, Fiji, Federated States of Micronesia, Marshall Islands, Palau, Solomon Islands']::text[], '{}'::text[], NULL, NULL, ARRAY['AI/ML, NLP, Generative AI (LLM), OCR and document extraction, Web development, Data visualisation']::text[], 'A single deployment serves multiple countries through country-scoped data isolation, with country-specific ministries and sectors loaded as configuration. The AI extraction pipeline, recommendation workflow engine, dashboards, and report templates are reusable for any audit or oversight body that follows up on recommendations.', ARRAY['UNDP Multi-Country Offices, Governments (Supreme Audit Institutions and audited entities)']::text[], ARRAY['UNDP Country Offices, Regional Offices, Governments, UN entities']::text[], 'Cost Recovery', 'Standard', 'NLP'),
  ('Tensions Monitoring System (TMS) Portal Upgrade', 'tensions-monitoring-system-tms-portal-upgrade', 'An upgrade of Lebanon''s Tensions Monitoring System that adds interactive maps, AI tools, and automated reporting to the existing platform, making data on social tensions and vulnerability easier to explore and act on.', '## Overview

An upgrade of Lebanon''s Tensions Monitoring System that adds interactive maps, AI tools, and automated reporting to the existing platform, making data on social tensions and vulnerability easier to explore and act on.

## Scalability and reusable components

Built on the Lab''s open-source DSVI tool and vulnerability-index methodology, so the mapping components and index approach can be re-applied and customized for other countries and monitoring platforms.

## Client segments

**Current:** UNDP Country Office

**Future:** UNDP Country Offices; Regional Offices; Government; UN entities

## Delivery model

**Business model:** Cost Recovery

**Project category:** standard', 'active', 'prototype', false, true, NULL, 3, 'published', now(), 2026, 'GIS / Remote Sensing', '6 months', ARRAY['UNDP Country Office']::text[], ARRAY['AI/ML', 'GIS', 'NLP', 'remote sensing / satellite imagery', 'web development', 'RAG']::text[], 'Lebanon''s existing Tensions Monitoring System offers valuable data but lacks a holistic view of social, economic, and environmental responses; its static, report-style outputs limit the fast, granular, scenario-based analysis needed for early, preventive action.', 'SDG AI Lab is upgrading the platform (TMS 2.0) by adding an interactive mapping tool, social-vulnerability indices, AI tools, a chatbot, and automated reporting, so users can explore layered data and run "what-if" scenarios in one portal.', ARRAY['• Calculate social-vulnerability and other indices from survey and socio-economic data', '• Collect and integrate geospatial data into high-resolution heatmaps', '• Build an interactive mapping tool with layering, split-view, and "what-if" scenarios', '• Add AI tools, a chatbot, and automated report generation', '• Integrate into the existing TMS and hand over to UNDP Lebanon']::text[], ARRAY['• Interactive, layered map visualizations', '• Split-mapping ("before/after") views', '• Scenario editing ("what-if") functions', '• High-resolution vulnerability heatmaps', '• Chatbot and automated report generation', '• Open-source, low-maintenance, integrated into the existing platform']::text[], ARRAY['HTML, JavaScript, Leaflet (interactive maps)', 'Principal Component Analysis and machine-learning regression', 'GIS and remote sensing (incl. nightlight data)', 'NLP and RAG (chatbot)', 'open datasets such as OpenStreetMap and the Humanitarian Data Exchange']::text[], 'Collaborated with the UNDP Lebanon Country Office. The broader Tensions Monitoring System is run jointly by UNDP and UNHCR in Lebanon, in collaboration with the Ministry of Social Affairs (MoSA) and the Ministry of Interior and Municipalities (MoIM).', ARRAY['Lebanon']::text[], '{}'::text[], NULL, NULL, ARRAY['AI/ML', 'GIS', 'NLP', 'remote sensing / satellite imagery', 'web development', 'RAG']::text[], 'Built on the Lab''s open-source DSVI tool and vulnerability-index methodology, so the mapping components and index approach can be re-applied and customized for other countries and monitoring platforms.', ARRAY['UNDP Country Office']::text[], ARRAY['UNDP Country Offices', 'Regional Offices', 'Government', 'UN entities']::text[], 'Cost Recovery', 'standard', 'GIS'),
  ('INFF II (Financing Strategy Database Automation)', 'inff-ii-financing-strategy-database-automation', 'A tool that automatically pulls data from countries'' national financing-strategy documents into a structured, searchable database with real-time dashboards, making it easier to track and compare how countries plan to finance their development goals.', '## Overview

A tool that automatically pulls data from countries'' national financing-strategy documents into a structured, searchable database with real-time dashboards, making it easier to track and compare how countries plan to finance their development goals.

## Scalability and reusable components

The automation pipeline, taxonomy/ontology, and Power BI dashboards are built to scale — new countries, data sources, and document types can be added, and the setup can support future AI-powered analytics.

## Client segments

**Current:** UNDP HQ (Sustainable Finance Hub / INFF Facility)

**Future:** UNDP Country Offices; Regional Offices; Government; UN entities

## Delivery model

**Business model:** Cost Recovery

**Project category:** Standard', 'active', 'prototype', false, true, NULL, 4, 'published', now(), 2025, 'Natural Language Processing', '3-4 months', ARRAY['UNDP HQ (Sustainable Finance Hub / INFF Facility)']::text[], ARRAY['AI/ML', 'data engineering', 'document/PDF data extraction', 'taxonomy/ontology', 'data visualization (Power BI)', 'RAG']::text[], 'As Integrated National Financing Frameworks expand across many countries, key information sits in scattered, document-heavy reports that are hard to compare and track, making it difficult to manage financing-strategy data consistently or use it for evidence-based policy.', 'SDG AI Lab expanded the financing-strategy database and built an end-to-end pipeline that extracts data from PDF reports into structured datasets, feeding a centralized database and real-time Power BI dashboards for easier analysis and comparison across countries.', ARRAY['• Collect national financing-strategy documents (e.g. PDF reports)', '• Extract and structure the data into standardized datasets', '• Tag entries against a shared taxonomy (categories, markers, regions)', '• Feed outputs into a centralized database', '• Visualize and compare in real-time Power BI dashboards']::text[], ARRAY['• Automated extraction from PDF and other documents', '• Structured, standardized financing-strategy dataset', '• Shared taxonomy for consistent classification', '• Covers 30+ countries'' financing strategies', '• Real-time Power BI dashboards', '• Scalable to new data sources and AI analytics']::text[], ARRAY['Power BI', 'Excel (structured outputs and ontology)', 'automated PDF/document data extraction', 'RAG', 'AI/ML models', 'data pipelines and connectors']::text[], 'Collaborated with the INFF Facility and the UNDP Sustainable Finance Hub (SFH), building on earlier joint work; designed to also incorporate data from ministries and INFF partners.', ARRAY['Global (developed with the INFF Facility)', 'The database compiles national financing strategies from 30+ countries']::text[], '{}'::text[], NULL, NULL, ARRAY['AI/ML', 'data engineering', 'document/PDF data extraction', 'taxonomy/ontology', 'data visualization (Power BI)', 'RAG']::text[], 'The automation pipeline, taxonomy/ontology, and Power BI dashboards are built to scale — new countries, data sources, and document types can be added, and the setup can support future AI-powered analytics.', ARRAY['UNDP HQ (Sustainable Finance Hub / INFF Facility)']::text[], ARRAY['UNDP Country Offices', 'Regional Offices', 'Government', 'UN entities']::text[], 'Cost Recovery', 'Standard', 'NLP'),
  ('Public Finance Simplification App', 'public-finance-simplification-app', 'An AI-powered platform that turns complex government budget and audit documents into clear, interactive dashboards and plain-language reports, helping citizens, civil society, and officials understand and monitor public finances.', '## Overview

An AI-powered platform that turns complex government budget and audit documents into clear, interactive dashboards and plain-language reports, helping citizens, civil society, and officials understand and monitor public finances.

## Scalability and reusable components

Built for multi-country reuse — the same platform runs on different national datasets, and its dashboards, AI report generation, and role-based workflows can be adapted to other countries and, in future, a regional app.

## Client segments

**Current:** UNDP Pacific Multi-Country Office; Government

**Future:** Other UNDP Country and Regional Offices; other governments / ministries of finance; UN entities; development partners; civil society

## Delivery model

**Business model:** Cost Recovery

**Project category:** Standard', 'completed', 'internal', true, true, NULL, 5, 'published', now(), 2024, 'Natural Language Processing', '9–12 months', ARRAY['UNDP Pacific Multi-Country Office', 'Government']::text[], ARRAY['AI/ML', 'GenAI and Large Language Models', 'NLP', 'data visualization', 'web and mobile development', 'RAG']::text[], 'Government budget and audit documents are large, technical, and buried in spreadsheets, making it hard to compare spending across years, sectors, and ministries — and leaving citizens, civil society, and media without accessible information to engage in fiscal oversight.', 'SDG AI Lab built an AI-powered platform that analyzes public finance documents, generates plain-language reports, and presents budget and expenditure data as interactive dashboards, with community features and multi-language support so citizens can explore and discuss national finances.', ARRAY['• Upload public finance documents (budget, expenditure, audit)', '• AI/LLMs extract data and generate plain-language reports', '• Present budget vs. expenditure as interactive dashboards', '• Drill down by ministry, sector, and year; export to PDF/CSV', '• Engage via forum, comments, and chatbot, in local languages']::text[], ARRAY['• Interactive budget & expenditure dashboards with ministry/sector/year drill-down', '• AI-generated narrative reports from structured data', '• Multi-year comparison and multi-country support', '• Export suite (PDF, CSV, charts)', '• Community forum, comments, and moderation tools', '• Multi-language support, chatbot, and mobile app']::text[], ARRAY['Power BI', 'machine learning', 'Large Language Models / GenAI', 'RAG', 'chatbot', 'cloud hosting', 'web and mobile app (OpenAI API and open-source LLM options evaluated)']::text[], 'Collaborated with the UNDP Pacific Multi-Country Office as part of its Vaka Pasifika project (supported by the European Union), engaging Fiji government stakeholders, civil society, and media.', ARRAY['Fiji (with planned replication to other Pacific countries)']::text[], '{}'::text[], NULL, NULL, ARRAY['AI/ML', 'GenAI and Large Language Models', 'NLP', 'data visualization', 'web and mobile development', 'RAG']::text[], 'Built for multi-country reuse — the same platform runs on different national datasets, and its dashboards, AI report generation, and role-based workflows can be adapted to other countries and, in future, a regional app.', ARRAY['UNDP Pacific Multi-Country Office', 'Government']::text[], ARRAY['Other UNDP Country and Regional Offices', 'other governments / ministries of finance', 'UN entities', 'development partners', 'civil society']::text[], 'Cost Recovery', 'Standard', 'NLP'),
  ('Madagascar Multihazard Early Warning System', 'madagascar-multihazard-early-warning-system', 'The Madagascar Multihazard Early Warning Dashboard integrates multiple hazards—including drought, floods, cyclones, landslides, and epidemics—into a unified early warning platform combining real-time data, predictive analytics, and interactive mapping for improved preparedness and response.', '## Overview

The Madagascar Multihazard Early Warning Dashboard integrates multiple hazards—including drought, floods, cyclones, landslides, and epidemics—into a unified early warning platform combining real-time data, predictive analytics, and interactive mapping for improved preparedness and response.

## Scalability and reusable components

The system''s modular design and use of open-source components allow for scalability. The approach can be adapted to other countries facing similar multi-hazard risks by integrating local data sources and risk models.

## Client segments

**Current:** UNDP, UN Entities, Government

**Future:** UNDP, UN Entities, Government

## Delivery model

**Business model:** Cost Recovery

**Project category:** Standard', 'active', 'prototype', false, true, NULL, 6, 'published', now(), 2025, 'GIS / Remote Sensing', '9–12 Months', ARRAY['UNDP, UN Entities, Government']::text[], ARRAY['Risk analytics, Data integration, Dashboards, AI, GIS']::text[], 'Madagascar lacks a harmonized system to manage multiple, cascading hazards like droughts, cyclones, and floods. This fragmentation leads to inefficient, reactive responses, worsening socioeconomic impacts on vulnerable populations.', 'A unified digital platform was built to integrate real-time data and predictive analytics for multiple hazards. The system provides a single, authoritative source for early warnings, supporting coordinated and proactive risk management.', ARRAY['• Integrates data from multiple sources (weather, satellite, community).', '• Uses AI and predictive models to forecast hazard impacts.', '• Disseminates automated alerts via SMS, WhatsApp, and radio.', '• Generates accessible reports for stakeholders.', '• Embeds a multilingual chatbot for user support.']::text[], ARRAY['• Multi-hazard integration (drought, floods, cyclones).', '• Real-time data and predictive analytics.', '• Interactive mapping and visualization dashboards.', '• Automated reporting and alerts.', '• Multilingual chatbot for non-technical users.', '• Community-level data reporting.']::text[], ARRAY['AI/ML, Generative AI, GIS, satellite imagery (ECMWF, CFS), Python, web development, SMS, WhatsApp']::text[], 'Collaborated with UNDP Madagascar, the National Office for Risk and Disaster Management (BNGRC), the General Directorate of Meteorology (DGM), the Prevention and Emergency Management Unit (CPGU), and UN entities.', ARRAY['Madagascar']::text[], '{}'::text[], NULL, NULL, ARRAY['Risk analytics, Data integration, Dashboards, AI, GIS']::text[], 'The system''s modular design and use of open-source components allow for scalability. The approach can be adapted to other countries facing similar multi-hazard risks by integrating local data sources and risk models.', ARRAY['UNDP, UN Entities, Government']::text[], ARRAY['UNDP, UN Entities, Government']::text[], 'Cost Recovery', 'Standard', 'GIS'),
  ('Socioeconomic Peace Index', 'socioeconomic-peace-index', 'The Socioeconomic Peacebuilding Index (SEPI) is an interactive dashboard that measures and visualizes the structural socioeconomic conditions linked to conflict. It helps development actors, governments, and donors identify where integrated peacebuilding and development investments are most needed to foster sustained peace.', '## Overview

The Socioeconomic Peacebuilding Index (SEPI) is an interactive dashboard that measures and visualizes the structural socioeconomic conditions linked to conflict. It helps development actors, governments, and donors identify where integrated peacebuilding and development investments are most needed to foster sustained peace.

## Scalability and reusable components

The SEPI framework is modular and can be adapted to other countries by substituting indicators while keeping the core pillar structure. The methodology allows for downscaling to finer administrative levels as more granular data becomes available.

## Client segments

**Current:** UNDP CO

**Future:** UNDP CO, Regional Office, Government, UN entities

## Delivery model

**Business model:** Cost Recovery

**Project category:** Standard', 'completed', 'internal', true, false, NULL, 7, 'published', now(), 2025, 'GIS / Remote Sensing', '3–4 Months', ARRAY['UNDP CO']::text[], ARRAY['Data integration, Dashboards, GIS, ML']::text[], 'National-level data often hides the sub-national inequalities that drive conflict. Without a clear view of how socioeconomic deprivation and conflict are linked at a local level, it''s difficult to target peacebuilding and development investments effectively.', 'An interactive dashboard was developed to measure and map socioeconomic deprivation at the sub-national level. The index links deprivation to conflict data, enabling users to explore regional disparities and analyze the root causes of instability.', ARRAY['• Measures socio-economic deprivation across five pillars: Education, Health, Food Security, Poverty, and Climate Resilience.', '• Aggregates indicators into a single composite score using a two-stage process.', '• Validates deprivation scores against observed conflict data from ACLED.', '• Visualizes regional disparities on an interactive digital dashboard.']::text[], ARRAY['• Five-pillar framework for measuring deprivation.', '• Sub-national analysis at the Admin 1 level.', '• Two-stage aggregation logic (arithmetic and geometric mean).', '• Validation against empirical conflict data.', '• Interactive digital dashboard for data exploration.']::text[], ARRAY['R, Python, Power BI, GIS']::text[], 'Collaborated with the Armed Conflict Location and Event Data Project (ACLED) for conflict data.', ARRAY['Somalia, Kenya, South Sudan']::text[], '{}'::text[], NULL, NULL, ARRAY['Data integration, Dashboards, GIS, ML']::text[], 'The SEPI framework is modular and can be adapted to other countries by substituting indicators while keeping the core pillar structure. The methodology allows for downscaling to finer administrative levels as more granular data becomes available.', ARRAY['UNDP CO']::text[], ARRAY['UNDP CO, Regional Office, Government, UN entities']::text[], 'Cost Recovery', 'Standard', 'GIS'),
  ('Tech Volunteers for Resilience (Tech4R)', 'tech-volunteers-for-resilience-tech4r', 'The Tech4R initiative mobilizes a global network of technology-skilled volunteers to co-create practical, inclusive, and open-source digital tools for disaster resilience, empowering local actors to respond swiftly and effectively to emergencies.', '## Overview

The Tech4R initiative mobilizes a global network of technology-skilled volunteers to co-create practical, inclusive, and open-source digital tools for disaster resilience, empowering local actors to respond swiftly and effectively to emergencies.

## Scalability and reusable components

The model is designed to be scaled globally, mobilizing trained tech volunteers to co-create practical digital solutions for disaster resilience in different contexts. The open-source tools developed are reusable and adaptable.

## Client segments

**Current:** UN COs, Regional Offices, UN Entities, NGOs

**Future:** UNDP CO, Regional Office, Government, UN entities

## Delivery model

**Business model:** UN Volunteers Recruitment/Cost Recovery

**Project category:** Standard', 'completed', 'internal', true, false, NULL, 8, 'published', now(), 2023, 'Capacity Building', '1 Month', ARRAY['UN COs, Regional Offices, UN Entities, NGOs']::text[], ARRAY['Digital volunteering, Open-source development, Low-Code/No-Code, Crowdsourcing']::text[], 'Disasters are becoming more frequent and complex, creating critical digital gaps. Local communities and responders often lack the real-time data, inclusive technologies, and agile digital tools needed for effective disaster management.', 'A global network of trained tech volunteers is mobilized to rapidly co-develop open-source digital solutions with local partners. The initiative provides an immediate, coordinated, and innovative response to emergencies.', ARRAY['• Partners submit digital challenges related to disaster resilience.', '• Tech4R analyzes requests and defines project requirements.', '• Online UN Volunteers are selected and trained.', '• Volunteers develop and deliver functional digital solution prototypes.', '• Ongoing support is provided to scale or customize solutions.']::text[], ARRAY['• Rapid mobilization of a global tech volunteer network', '.• Co-creation of open-source digital tools', '.• Focus on Low-Code/No-Code solutions.', '• Crowdsourced data collection.', '• Includes the Frontier Technologies Radar for Disaster Risk Reduction (FTR4DRR).']::text[], ARRAY['Discord, Slack, WhatsApp, JIRA, GitHub, Microsoft Power BI, Power Automate, Kobo Toolbox, QGIS']::text[], 'The initiative is a partnership between UNDP ICPSD SDG AI Lab and UN Volunteers (UNV). It also involves collaboration with host entities, UN agencies, governmental agencies, NGOs, civil society organizations, and the private sector.', ARRAY['Global (Pilot in Türkiye)']::text[], '{}'::text[], NULL, NULL, ARRAY['Digital volunteering, Open-source development, Low-Code/No-Code, Crowdsourcing']::text[], 'The model is designed to be scaled globally, mobilizing trained tech volunteers to co-create practical digital solutions for disaster resilience in different contexts. The open-source tools developed are reusable and adaptable.', ARRAY['UN COs, Regional Offices, UN Entities, NGOs']::text[], ARRAY['UNDP CO, Regional Office, Government, UN entities']::text[], 'UN Volunteers Recruitment/Cost Recovery', 'Standard', 'Open-source development'),
  ('Data Science Fellowship Programme', 'data-science-fellowship-programme', 'This fellowship empowers early-career data scientists to lead inclusive digital transformation by providing practical experience on real-world projects. Fellows apply AI, machine learning, and geospatial technologies to sustainable development challenges, supported by mentoring and technical training.', '## Overview

This fellowship empowers early-career data scientists to lead inclusive digital transformation by providing practical experience on real-world projects. Fellows apply AI, machine learning, and geospatial technologies to sustainable development challenges, supported by mentoring and technical training.

## Scalability and reusable components

The fellowship model is designed to be scaled and replicated, as demonstrated by its expansion to different regions and partnerships. The framework for recruiting, training, and managing fellows to develop digital solutions is a reusable component for various UNDP offices.

## Client segments

**Current:** Internal UNDP

**Future:** Country Offices, Regional Offices

## Delivery model

**Business model:** R&D

**Project category:** Self-Service', 'active', 'prototype', false, false, NULL, 9, 'published', now(), 2022, 'Digital Skills Development', '3 Months', ARRAY['Internal UNDP']::text[], ARRAY['AI, ML, NLP, GIS, Data Science training, Mentoring, Data Visualization, Blockchain']::text[], 'A digital and talent divide hinders developing countries from harnessing technologies like AI and data science for sustainable development. A lack of diversity in the tech field also risks perpetuating biases in digital solutions.', 'A fellowship programme was created to host cohorts of young data scientists, empowering them to become agents of change. The program provides advanced training, mentorship, and hands-on experience in developing digital solutions for the SDGs.', ARRAY['• Mobilizes highly qualified young data scientists as on-site UN Youth and Specialist Volunteers.', '• Fellows lead and manage teams of online volunteers to augment project efforts.', '• Provides fellows with comprehensive training, mentorship, and coaching from leading tech companies.', '• Fellows develop and implement digital solutions to address development challenges like poverty and disaster response.']::text[], ARRAY['• Development of digital solutions for SDGs.', '• Advanced training in AI, ML, GIS, and other frontier technologies.', '• Mentorship from leading tech companies.', '• Experience leading teams of online volunteers.', '• International work experience on development issues.', '• Focus on empowering women and youth from the Global South.']::text[], ARRAY['Python, R, Git, GitHub, TensorFlow, Scikit-Learn, Pandas, NLTK, ArcGIS, QGIS, Power BI, D3.js, AWS, Google Cloud, Azure DevOps, JIRA']::text[], 'The programme is a partnership between UNDP IICPSD SDG AI Lab and UN Volunteers. It also involves collaboration with private sector tech companies, academic institutions, and various UNDP Country and Regional Offices.', ARRAY['Global (Initial fellows from/in Türkiye, Serbia, France, USA, DRC, Ghana, Uganda, Russia, Brazil, China)']::text[], '{}'::text[], NULL, NULL, ARRAY['AI, ML, NLP, GIS, Data Science training, Mentoring, Data Visualization, Blockchain']::text[], 'The fellowship model is designed to be scaled and replicated, as demonstrated by its expansion to different regions and partnerships. The framework for recruiting, training, and managing fellows to develop digital solutions is a reusable component for various UNDP offices.', ARRAY['Internal UNDP']::text[], ARRAY['Country Offices, Regional Offices']::text[], 'R&D', 'Self-Service', 'Training'),
  ('Vertical Funds Portfolio Analysis', 'vertical-funds-portfolio-analysis', 'A data science pipeline that reads large collections of development-finance project documents and turns their unstructured text into a searchable, structured resource. It helps teams explore the portfolio, classify projects by theme, and find connections and lessons learned.', '## Overview

A data science pipeline that reads large collections of development-finance project documents and turns their unstructured text into a searchable, structured resource. It helps teams explore the portfolio, classify projects by theme, and find connections and lessons learned.

## Scalability and reusable components

The extraction, classification, and graph pipeline are reusable for any large document portfolio. The classification model can automatically tag future or unseen projects without manual keyword matching.

## Client segments

**Current:** UNDP CO

**Future:** UNDP CO

## Delivery model

**Business model:** Cost Recovery

**Project category:** Standard', 'completed', 'internal', true, false, NULL, 10, 'published', now(), 2019, 'Natural Language Processing', '9–12 months', ARRAY['UNDP CO']::text[], ARRAY['NLP, Machine Learning / Deep Learning, Information retrieval, Knowledge graphs, Network analysis']::text[], 'UNDP''s vertical funds portfolio holds thousands of project documents with unstructured text. Searching, comparing, and classifying projects across the whole portfolio is slow, manual, and hard to do consistently.', 'An NLP pipeline that extracts key entities from project documents, stores them in a searchable graph database, automatically classifies projects into thematic categories, and answers open questions about the portfolio.', ARRAY['• Pull project text and metadata from PIMS+', '• Extract keywords, entities, and relations (NER + rules)', '• Store in a graph database for structured queries', '• Auto-classify projects into thematic tags', '• Explore via search, network views, or question-answering']::text[], ARRAY['• Entity and keyword extraction from project documents', '• Graph database for structured portfolio queries', '• Automatic multi-label project classification', '• Network visualisation of project connections and clusters', '• Question-answering over project documents']::text[], ARRAY['Python, Neo4j, Named Entity Recognition models,', 'NetworkX, Gephi, DeepPavlov (OpenQA), PIMS+ API']::text[], 'Collaborated with the UNDP Nature, Climate & Energy Cluster on the vertical funds project portfolio.', ARRAY['Global / portfolio-wide (UNDP vertical funds portfolio)']::text[], '{}'::text[], NULL, NULL, ARRAY['NLP, Machine Learning / Deep Learning, Information retrieval, Knowledge graphs, Network analysis']::text[], 'The extraction, classification, and graph pipeline are reusable for any large document portfolio. The classification model can automatically tag future or unseen projects without manual keyword matching.', ARRAY['UNDP CO']::text[], ARRAY['UNDP CO']::text[], 'Cost Recovery', 'Standard', 'NLP'),
  ('Digital Social Vulnerability Index (DSVI)', 'digital-social-vulnerability-index-dsvi', 'The Digital Social Vulnerability Index (DSVI) is an innovative tool that uses machine learning and geographic information systems (GIS) to automate the analysis of social vulnerability, producing high-resolution maps that help governments and development partners identify at-risk populations.', '## Overview

The Digital Social Vulnerability Index (DSVI) is an innovative tool that uses machine learning and geographic information systems (GIS) to automate the analysis of social vulnerability, producing high-resolution maps that help governments and development partners identify at-risk populations.

## Scalability and reusable components

The DSVI methodology is designed as a tiered, reproducible system. The automated data science pipeline and modeling framework can be adapted to different countries and contexts by integrating local datasets and hazard parameters.

## Client segments

**Current:** UNDP CO, Regional Office, Government, UN entities

**Future:** UNDP CO, Regional Office, Government, UN entities, NGOs

## Delivery model

**Business model:** Сost Recovery

**Project category:** Standard', 'completed', 'internal', true, false, NULL, 11, 'published', now(), 2022, 'GIS / Remote Sensing', '3–4 months', ARRAY['UNDP CO, Regional Office, Government, UN entities']::text[], ARRAY['AI/ML, GIS, Data pipelines, Interactive mapping, Principal Component Analysis (PCA)']::text[], 'Traditional social vulnerability assessments are often costly, time-consuming, and limited to coarse administrative boundaries. This results in a loss of granular detail, making it difficult to precisely target interventions for the most vulnerable communities.', 'An automated digital solution was developed to calculate social vulnerability using machine learning and geospatial data. This creates high-resolution, interactive maps that reveal vulnerability patterns beyond administrative borders, enabling more effective and targeted planning.', ARRAY['• Gathers and processes geocoded household survey data (DHS, MICS).', '• Uses Principal Component Analysis (PCA) to identify and weight key vulnerability indicators.', '• Trains machine learning models on survey scores and geospatial data (e.g., nightlights, climate data).', '• Predicts and visualizes vulnerability on high-resolution maps.', '• Deploys results in an interactive online tool.']::text[], ARRAY['• High-resolution vulnerability heatmaps.', '• Automated data science pipeline for SV score calculation.', '• Integration of household survey and geospatial data.', '• Interactive online platform for data exploration.', '• Customizable methodology for different contexts and hazards.']::text[], ARRAY['Python, Machine Learning (Scikit-Learn), GIS (QGIS, ArcGIS), Principal Component Analysis (PCA), Geographically Weighted Regression (GWR), Power BI']::text[], 'The DSVI is a collaborative effort involving the UNDP ICPSD SDG AI Lab, UNDP Disaster Risk Reduction and Recovery Team (DRT), and various UNDP Country Offices and Accelerator Labs (e.g., Côte d''Ivoire, Mali, Mauritania, Niger, Tajikistan).', ARRAY['Global (Piloted and implemented in Albania, Burkina Faso, Côte d''Ivoire, Ethiopia, Kenya, Lebanon, Mali, Mauritania, Niger, Somalia, Tajikistan)']::text[], '{}'::text[], NULL, NULL, ARRAY['AI/ML, GIS, Data pipelines, Interactive mapping, Principal Component Analysis (PCA)']::text[], 'The DSVI methodology is designed as a tiered, reproducible system. The automated data science pipeline and modeling framework can be adapted to different countries and contexts by integrating local datasets and hazard parameters.', ARRAY['UNDP CO, Regional Office, Government, UN entities']::text[], ARRAY['UNDP CO, Regional Office, Government, UN entities, NGOs']::text[], 'Сost Recovery', 'Standard', 'GIS'),
  ('Digital Solutions for SDGs (DS4SDGs) Course', 'digital-solutions-for-sdgs-ds4sdgs-course', 'This course introduces learners to frontier technologies like AI, machine learning, and GIS, connecting them to real-world SDG challenges. Through practical case studies and project work, it equips development practitioners, students, and government officials with the skills to apply data science for social good.', '## Overview

This course introduces learners to frontier technologies like AI, machine learning, and GIS, connecting them to real-world SDG challenges. Through practical case studies and project work, it equips development practitioners, students, and government officials with the skills to apply data science for social good.

## Scalability and reusable components

The course curriculum is designed to be open-source and is being adapted into a Massive Open Online Course (MOOC) to provide a globally accessible, scalable, and certified learning platform for a wider audience.

## Client segments

**Current:** UNDP CO, Universities

**Future:** UNDP CO, Regional Office, Government, UN entities, Universities

## Delivery model

**Business model:** R&D

**Project category:** Self-Service', 'active', 'prototype', false, false, NULL, 12, 'published', now(), 2021, 'Digital Skills Development', '3 Months', ARRAY['UNDP CO, Universities']::text[], ARRAY['AI, ML, NLP, GIS, Curriculum design, E-learning/MOOC']::text[], 'There is a significant gap between the potential of frontier technologies and their practical application to sustainable development challenges. Many practitioners and students lack the specific skills to leverage data science for the SDGs.', 'A practical, hands-on course was created that teaches participants how to use AI, Machine Learning, and GIS for sustainable development. The curriculum uses SDG-related datasets and case studies to build relevant, real-world skills.', ARRAY['• Consists of 12 modules covering topics from Python to GIS and NLP.', '• Uses SDG-related datasets for practical exercises.', '• Engages learners through instructor-led training and webinars.', '• Concludes with a capstone project applying skills to a development problem.', '• A MOOC version with certification is in development.']::text[], ARRAY['• 12-module curriculum.', '• Focus on Python, ML, NLP, and GIS.', '• Real-world SDG case studies and datasets.', '• Open-source and community-driven content.', '• Capstone project for practical application.', '• MOOC with certification pathway.']::text[], ARRAY['Python, Twitter API, Tableau, AWS, Jupyter Notebooks']::text[], 'The course has been delivered in collaboration with academic institutions such as Koç University, Yıldız Technical University, and Istanbul University, as well as partners like the Samsung Innovation Campus and Frontier Tech Leaders.', ARRAY['(Delivered online and in partnership with universities in Turkey)']::text[], '{}'::text[], NULL, NULL, ARRAY['AI, ML, NLP, GIS, Curriculum design, E-learning/MOOC']::text[], 'The course curriculum is designed to be open-source and is being adapted into a Massive Open Online Course (MOOC) to provide a globally accessible, scalable, and certified learning platform for a wider audience.', ARRAY['UNDP CO, Universities']::text[], ARRAY['UNDP CO, Regional Office, Government, UN entities, Universities']::text[], 'R&D', 'Self-Service', 'Training'),
  ('Reef2Resilience – Coral Reef Health Assessment with Remote Sensing', 'reef2resilience-coral-reef-health-assessment-with-remote-sensing', 'Uses satellite imagery and machine learning to map coral reef habitats and flag suspected bleaching, supporting the monitoring and protection of marine ecosystems.', '## Overview

Uses satellite imagery and machine learning to map coral reef habitats and flag suspected bleaching, supporting the monitoring and protection of marine ecosystems.

## Scalability and reusable components

The classification and bleaching-detection workflow is automated (Python / Google Earth Engine) and reusable across reef locations. It runs on freely available Sentinel-2 imagery and public reference maps, keeping it low-cost to repeat.

## Client segments

**Current:** UNDP

**Future:** UNDP CO, Regional Office, Government, UN entities

## Delivery model

**Business model:** Cost Recovery

**Project category:** Standard', 'completed', 'internal', true, false, NULL, 13, 'published', now(), 2019, 'GIS / Remote Sensing', '6 months', ARRAY['UNDP']::text[], ARRAY['AI/ML, Remote sensing, GIS, Satellite imagery']::text[], 'Coral reefs are declining from warming and bleaching, but monitoring reef extent and bleaching across wide, remote areas is slow and costly using field surveys alone.', 'A remote-sensing workflow that classifies coral reef habitats from satellite imagery and detects suspected bleaching through change analysis, giving a repeatable way to monitor reef condition.', ARRAY['• Collect Sentinel-2 satellite imagery for the reef area', '• Preprocess (atmospheric and sun-glint correction)', '• Classify habitats with ML and spectral indices', '• Detect suspected bleaching via change analysis between dates', '• Validate maps with expert review']::text[], ARRAY['• Coral reef habitat mapping from satellite imagery', '• Suspected bleaching detection through change analysis', '• Bathymetry estimation for shallow reef areas', '• Automated, reusable Python / Google Earth Engine workflow', '• Built on free Sentinel-2 data and public reference maps']::text[], ARRAY['Sentinel-2 (MSI) imagery, SEN2COR, Google Earth Engine, Python, machine learning (Random Forest, K-means, Hartigan-Wong, decision/classification trees), PCA, spectral indices (CTVI), Allen Coral Atlas reference maps']::text[], 'Collabrated with UNDP', ARRAY[]::text[], '{}'::text[], NULL, NULL, ARRAY['AI/ML, Remote sensing, GIS, Satellite imagery']::text[], 'The classification and bleaching-detection workflow is automated (Python / Google Earth Engine) and reusable across reef locations. It runs on freely available Sentinel-2 imagery and public reference maps, keeping it low-cost to repeat.', ARRAY['UNDP']::text[], ARRAY['UNDP CO, Regional Office, Government, UN entities']::text[], 'Cost Recovery', 'Standard', 'GIS'),
  ('Frontier Technology Radar for Disaster Risk Reduction (FTR4DRR)', 'frontier-technology-radar-for-disaster-risk-reduction-ftr4drr', 'An online knowledge platform that tracks emerging technologies relevant to disaster management. It aims to increase stakeholders'' visibility of and access to newly-developed digital solutions to unleash their potential in Disaster Risk Reduction (DRR).', '## Overview

An online knowledge platform that tracks emerging technologies relevant to disaster management. It aims to increase stakeholders'' visibility of and access to newly-developed digital solutions to unleash their potential in Disaster Risk Reduction (DRR).

## Scalability and reusable components

The online platform is a reusable knowledge base for disaster management stakeholders. It encourages the adoption of proven solutions in new contexts.

## Client segments

**Current:** UNDP HQ

**Future:** UNDP CO, Regional Office, UN entities

## Delivery model

**Business model:** Cost Recovery

**Project category:** Standard', 'active', 'prototype', false, false, NULL, 14, 'published', now(), 2021, 'GIS / Remote Sensing', '9–12 months', ARRAY['UNDP HQ']::text[], ARRAY['AI/ML, GIS, Web development, Tech mapping']::text[], 'Development stakeholders struggle to navigate the fast-growing tech industry and understand which digital solutions can most effectively support disaster risk management programs.', 'An online tool was developed to monitor and track existing and emerging digital solutions for anticipatory risk, risk reduction, and crisis recovery.', ARRAY['• Tracks digital solutions for disaster management', '• Categorizes technologies by application, maturity, and crisis context', '• Visualizes use cases on an interactive radar and map']::text[], ARRAY['• Interactive radar visualization', '• Maps technology maturity and disaster management phase', '• Filters by technology, disaster type, and country', '• Map view of project locations', '• Searchable use case database']::text[], ARRAY['Typescript, React, D3.js, sass']::text[], 'Collaborated with UNDP’s Disaster Risk Reduction and Recovery for Building Resilience Team (DRT), the Connecting Business Initiative (CBi), and online UN Volunteers.', ARRAY['Global (knowledge platform)']::text[], '{}'::text[], NULL, NULL, ARRAY['AI/ML, GIS, Web development, Tech mapping']::text[], 'The online platform is a reusable knowledge base for disaster management stakeholders. It encourages the adoption of proven solutions in new contexts.', ARRAY['UNDP HQ']::text[], ARRAY['UNDP CO, Regional Office, UN entities']::text[], 'Cost Recovery', 'Standard', 'GIS'),
  ('OSDG (Open SDG Data and Text Classification Initiative)', 'osdg-open-sdg-data-and-text-classification-initiative', 'OSDG provides open-source tools and datasets to classify and analyze text related to the Sustainable Development Goals. It helps researchers, governments, and other organizations align their work with the 2030 Agenda.', '## Overview

OSDG provides open-source tools and datasets to classify and analyze text related to the Sustainable Development Goals. It helps researchers, governments, and other organizations align their work with the 2030 Agenda.

## Scalability and reusable components

The open-source tool, API, and volunteer-annotated datasets are reusable components that allow researchers and institutions to build their own SDG-related analysis and machine learning solutions.

## Client segments

**Current:** UNDP CO, Regional Office, Government, UN entities, Universities

**Future:** UNDP CO, Regional Office, Government, UN entities

## Delivery model

**Business model:** R&D

**Project category:** Self-Service', 'active', 'prototype', false, false, NULL, 15, 'published', now(), 2021, 'Natural Language Processing', '1 Month', ARRAY['UNDP CO, Regional Office, Government, UN entities, Universities']::text[], ARRAY['NLP, ML, Open-source datasets, API, volunteer mobilization and management']::text[], 'Organizations lack a standardized, transparent, and accessible way to classify documents and research according to the Sustainable Development Goals, leading to duplication of effort and difficulty in tracking contributions to the 2030 Agenda.', 'An open-source, multilingual tool and API were developed to automatically classify text and documents by their relevance to the SDGs, supported by a comprehensive, volunteer-created dataset and ontology.', ARRAY['• User submits text or a PDF document.', '• Machine learning models perform initial SDG screening.', '• A keyword-based ontology verifies the preliminary labels.', '• Final SDG labels are assigned based on agreement between both methods.']::text[], ARRAY['• Open-source text classification tool', '• Multilingual support for 19 languages', '• Free API for large-scale analysis', '• Publicly available, citizen-science dataset', '• PDF document upload and classification']::text[], ARRAY['Python, Machine Learning (BERT), Prodigy (for labeling), GitHub, Zenodo']::text[], 'Collaborated with PPMI, Dr. Nuria Bautista Puig and a global research network, and over 2,700 UN Online Volunteers from more than 130 countries.', ARRAY['Global (open-source tool and dataset)']::text[], '{}'::text[], NULL, NULL, ARRAY['NLP, ML, Open-source datasets, API, volunteer mobilization and management']::text[], 'The open-source tool, API, and volunteer-annotated datasets are reusable components that allow researchers and institutions to build their own SDG-related analysis and machine learning solutions.', ARRAY['UNDP CO, Regional Office, Government, UN entities, Universities']::text[], ARRAY['UNDP CO, Regional Office, Government, UN entities']::text[], 'R&D', 'Self-Service', 'NLP'),
  ('Poverty Prediction', 'poverty-prediction', 'Uses satellite imagery and other open data to estimate poverty levels in areas where survey data is scarce, producing poverty maps that help target development support.', '## Overview

Uses satellite imagery and other open data to estimate poverty levels in areas where survey data is scarce, producing poverty maps that help target development support.

## Scalability and reusable components

Built as a reusable data-ingestion and modelling pipeline. Because it relies on free, globally available datasets (nightlights, OpenStreetMap, satellite imagery), the approach can be repeated for other countries.

## Client segments

**Current:** UNDP

**Future:** UNDP CO, Regional Office, Government, UN entities

## Delivery model

**Business model:** R&D

**Project category:** Standard', 'completed', 'internal', true, false, NULL, 16, 'published', now(), 2019, 'GIS / Remote Sensing', '6 months', ARRAY['UNDP']::text[], ARRAY['Computer vision, Satellite imagery, AI/ML, Data integration']::text[], 'Reliable poverty data is scarce and quickly outdated in many regions, and traditional household surveys are slow and costly. This makes it hard to see where poverty is concentrated and to direct support effectively.', 'Machine-learning models that estimate local poverty from satellite imagery, nightlight data, and crowdsourced map data, checked against survey wealth indicators, to produce poverty maps.', ARRAY['• Gather satellite imagery, nightlights, and OpenStreetMap data', '• Filter to populated areas and clean the data', '• Extract features (nightlight metrics, roads, buildings, points of interest)', '• Train ML models against DHS survey wealth indicators', '• Produce poverty maps and accuracy comparisons']::text[], ARRAY['• Poverty estimation from satellite and open data', '• Two complementary models (deep learning and random forest)', '• Built on free global datasets (nightlights, OSM, satellite)', '• Validated against DHS survey wealth indicators', '• Poverty maps and data visualisations as output']::text[], ARRAY['Python, CNN (VGG16 / ImageNet transfer learning), ridge regression, random forest, XGBoost', 'Google Maps Static API imagery, NASA VIIRS nightlights, Facebook/Meta High Resolution Settlement Data (HRSL), OpenStreetMap, DHS survey data']::text[], NULL, ARRAY['Philippines']::text[], '{}'::text[], NULL, NULL, ARRAY['Computer vision, Satellite imagery, AI/ML, Data integration']::text[], 'Built as a reusable data-ingestion and modelling pipeline. Because it relies on free, globally available datasets (nightlights, OpenStreetMap, satellite imagery), the approach can be repeated for other countries.', ARRAY['UNDP']::text[], ARRAY['UNDP CO, Regional Office, Government, UN entities']::text[], 'R&D', 'Standard', 'GIS'),
  ('Volunteer Data Scientists Initiative', 'volunteer-data-scientists-initiative', 'This initiative mobilizes a global network of online data science volunteers to collaborate with UNDP teams on developing digital solutions for sustainable development, addressing challenges from poverty to disaster response.', '## Overview

This initiative mobilizes a global network of online data science volunteers to collaborate with UNDP teams on developing digital solutions for sustainable development, addressing challenges from poverty to disaster response.

## Scalability and reusable components

The initiative''s model for mobilizing, managing, and collaborating with online volunteers is a scalable and reusable framework for digital transformation projects across the UN system and other development organizations.

## Client segments

**Current:** UNDP CO, Regional Office, Government, UN entities

**Future:** UNDP CO, Regional Office, Government, UN entities

## Delivery model

**Business model:** UN Volunteers Recruitment/Cost Recovery

**Project category:** Standard', 'active', 'prototype', false, false, NULL, 17, 'published', now(), 2019, 'Capacity Building', '2 Months', ARRAY['UNDP CO, Regional Office, Government, UN entities']::text[], ARRAY['Digital volunteering, Data science, AI/ML, GIS, NLP']::text[], 'Development organizations often lack the specific technical talent required to leverage frontier technologies like AI and machine learning for solving complex sustainable development challenges.', 'A global network of online volunteers with expertise in data science is mobilized to collaborate on agile, task-based projects that create innovative digital solutions for the SDGs.', ARRAY['• UNDP teams identify a development challenge.', '• SDG AI Lab recruits and coordinates skilled online volunteers.', '• Volunteers work in small teams on time-boxed sprints.', '• Teams deliver prototypes, reports, and code.']::text[], ARRAY['• Access to a global talent pool of data scientists', '• Agile project management framework', '• Asynchronous, remote team collaboration', '• Networking and leadership opportunities for volunteers', '• Development of tailored digital solutions']::text[], ARRAY['Microsoft Teams, GitHub, Jira, Slack']::text[], 'Collaborated with United Nations Volunteers (UNV).', ARRAY['Global (Online volunteers from 45+ countries)']::text[], '{}'::text[], NULL, NULL, ARRAY['Digital volunteering, Data science, AI/ML, GIS, NLP']::text[], 'The initiative''s model for mobilizing, managing, and collaborating with online volunteers is a scalable and reusable framework for digital transformation projects across the UN system and other development organizations.', ARRAY['UNDP CO, Regional Office, Government, UN entities']::text[], ARRAY['UNDP CO, Regional Office, Government, UN entities']::text[], 'UN Volunteers Recruitment/Cost Recovery', 'Standard', 'Digital volunteering'),
  ('PISTA - water efficiency and emissions reductions in cold-chain logistics', 'pista-water-efficiency-and-emissions-reductions-in-cold-chain-logistics', 'This research project develops AI-based methodologies to measure water efficiency and quantify emission reductions in agricultural cold-chain logistics. The work supports the development of climate-resilient food supply chains in North and West Africa.', '## Overview

This research project develops AI-based methodologies to measure water efficiency and quantify emission reductions in agricultural cold-chain logistics. The work supports the development of climate-resilient food supply chains in North and West Africa.

## Scalability and reusable components

The open-source methodologies for calculating water efficiency and avoided emissions are designed to be used by governments, businesses, and farm-level networks to enhance sustainability along agricultural value chains.

## Client segments

**Current:** UNDP CO, Private Sector

**Future:** UNDP CO, Regional Office, Government, UN entities, Private Sector

## Delivery model

**Business model:** Cost Recovery

**Project category:** Standard', 'completed', 'internal', true, false, NULL, 18, 'published', now(), 2025, 'Research & Advisory', '6 months', ARRAY['UNDP CO, Private Sector']::text[], ARRAY['AI/ML, GIS, Research analytics, Remote sensing']::text[], 'High water stress and significant post-harvest food losses in North and West Africa contribute to food insecurity and GHG emissions. Stakeholders lack standardized methods to measure and improve water efficiency and quantify the climate benefits of cold-chain infrastructure.', 'Developed two open-source, AI-enhanced methodologies: one for promoting water efficiency in the agriculture sector and another for calculating the baseline and impact of avoided emissions from preventing post-harvest food loss.', ARRAY['• Use satellite imagery and GIS to map irrigation and land use.', '• Analyze water footprints by overlaying crop, yield, and climate data.', '• Model water savings and emission reductions under different cold storage scenarios.', '• Publish open-source methodologies and reports.']::text[], ARRAY['• AI-enhanced water efficiency methodology', '• GIS-based baseline assessment for emissions', '• Scenario modeling for water and emission savings', '• Open-source reports and recommendations', '• Focus on data-scarce environments']::text[], ARRAY['AI/ML, GIS, Remote Sensing (NDVI), FAOSTAT, Gold Standard Methodology']::text[], 'Collaborated with Pegasus Capital Advisors (manager of the Subnational Climate Fund), Ifria Cold Chain Development Company, and the Government of Italy (funder of PISTA).', ARRAY['Morocco, Senegal']::text[], '{}'::text[], NULL, NULL, ARRAY['AI/ML, GIS, Research analytics, Remote sensing']::text[], 'The open-source methodologies for calculating water efficiency and avoided emissions are designed to be used by governments, businesses, and farm-level networks to enhance sustainability along agricultural value chains.', ARRAY['UNDP CO, Private Sector']::text[], ARRAY['UNDP CO, Regional Office, Government, UN entities, Private Sector']::text[], 'Cost Recovery', 'Standard', 'Research analytics'),
  ('AI Value Chain Tool', 'ai-value-chain-tool', 'An AI-powered knowledge management tool that enables UNDP teams and partners in Afghanistan to quickly search, summarize, and analyze internal policy and project documents related to agricultural value chains.', '## Overview

An AI-powered knowledge management tool that enables UNDP teams and partners in Afghanistan to quickly search, summarize, and analyze internal policy and project documents related to agricultural value chains.

## Scalability and reusable components

The tool''s architecture, including the RAG approach and vector database integration, provides a reusable model for developing similar knowledge management systems in other contexts or sectors.

## Client segments

**Current:** UNDP CO

**Future:** UNDP CO, Regional Office, Government, UN entities

## Delivery model

**Business model:** Cost Recovery

**Project category:** Standard', 'completed', 'internal', false, false, NULL, 19, 'archived', now(), 2025, 'Natural Language Processing', '3–4 months', ARRAY['UNDP CO']::text[], ARRAY['NLP, GenAI, RAG, Chatbot']::text[], 'Development teams working on Afghanistan''s agricultural sector lack a quick and efficient way to access and synthesize information from a fragmented collection of internal policy documents, hindering strategic planning and program design.', 'A digital knowledge tool was built to provide AI-powered search and summarization of internal reports. This enables users to get reliable, document-based insights for program planning, research, and evidence-based policymaking.', ARRAY['• Collects and validates critical UNDP and partner documents', '.• Ingests documents into a vector database.', '• Uses a RAG model with an LLM to answer queries', '.• Users interact via a web interface for Q&A, summarization, and drafting.']::text[], ARRAY['• Semantic search across documents', '• AI-powered document summarization', '• Q&A and chatbot interface', '• Assists in drafting proposals and concept notes', '• Power BI integration for dashboards']::text[], ARRAY['Power BI, Azure, Vector Database, Retrieval-Augmented Generation (RAG), GPT models']::text[], NULL, ARRAY['Afghanistan']::text[], '{}'::text[], NULL, NULL, ARRAY['NLP, GenAI, RAG, Chatbot']::text[], 'The tool''s architecture, including the RAG approach and vector database integration, provides a reusable model for developing similar knowledge management systems in other contexts or sectors.', ARRAY['UNDP CO']::text[], ARRAY['UNDP CO, Regional Office, Government, UN entities']::text[], 'Cost Recovery', 'Standard', 'NLP'),
  ('UNDP Portfolio Sensemaking', 'undp-portfolio-sensemaking', 'Uses natural language processing to analyse hundreds of UNDP Country Programme Documents and surface hidden themes, patterns, and connections across the project portfolio, helping teams see how projects relate and where they overlap.', '## Overview

Uses natural language processing to analyse hundreds of UNDP Country Programme Documents and surface hidden themes, patterns, and connections across the project portfolio, helping teams see how projects relate and where they overlap.

## Scalability and reusable components

The NLP workflow (preprocessing, topic modelling, clustering, NER) is reusable on any large set of project documents, at country or regional level. It runs on openly available UNDP documents, keeping it low-barrier to repeat.

## Client segments

**Current:** N/A (internal research project)

**Future:** UNDP, UN Entities, Governments

## Delivery model

**Business model:** R&D

**Project category:** Standard', 'completed', 'internal', true, false, NULL, 20, 'published', now(), 2020, NULL, '3 months', ARRAY['N/A (internal research project)']::text[], ARRAY['NLP, Machine Learning, Topic modelling, Clustering, Network analysis, Portfolio analytics']::text[], 'UNDP runs a very large portfolio of projects, but the knowledge inside project documents is unstructured and hard to search. It is difficult to see how projects connect, overlap, or what can be learned across them.', 'An NLP workflow that processes hundreds of Country Programme Documents to surface hidden topics, cluster similar projects, and map connections, presented in an interactive dashboard and a research brief.', ARRAY['• Collect and preprocess UNDP Country Programme Documents', '• Apply topic modelling and clustering to find themes', '• Use named-entity recognition to extract recurring themes', '• Map connections and clusters via network analysis', '• Present findings in an interactive dashboard and research brief']::text[], ARRAY['• Topic modelling across 300+ programme documents', '• Country and regional project clustering', '• Named-entity recognition for recurring themes', '• Network analysis of project connections', '• Interactive visualisation dashboard and research brief', '• Built on openly available UNDP documents']::text[], ARRAY['Python, NLP, topic modelling (LDA, PLSA, LSA), unsupervised clustering, Named Entity Recognition (NER), text classification, network/topological analysis, data-visualisation dashboard']::text[], 'Informed by the UNDP RIC Bangkok portfolio-analysis workstream', ARRAY['Portfolio-wide (UNDP Country Programme Documents)']::text[], '{}'::text[], NULL, NULL, ARRAY['NLP, Machine Learning, Topic modelling, Clustering, Network analysis, Portfolio analytics']::text[], 'The NLP workflow (preprocessing, topic modelling, clustering, NER) is reusable on any large set of project documents, at country or regional level. It runs on openly available UNDP documents, keeping it low-barrier to repeat.', ARRAY['N/A (internal research project)']::text[], ARRAY['UNDP, UN Entities, Governments']::text[], 'R&D', 'Standard', NULL),
  ('Innovation in Disaster Management: Leveraging Technology to Save More Lives Report', 'innovation-in-disaster-management-leveraging-technology-to-save-more-lives-report', 'This study analyzes emerging technologies used in disaster preparedness and response, highlighting opportunities, limitations, and policy considerations to help guide humanitarian and development practitioners in strengthening resilience.', '## Overview

This study analyzes emerging technologies used in disaster preparedness and response, highlighting opportunities, limitations, and policy considerations to help guide humanitarian and development practitioners in strengthening resilience.

## Scalability and reusable components

The report serves as a reusable knowledge product and practical guide. Its findings and recommendations can be applied globally by practitioners to better integrate technology into disaster management.

## Client segments

**Current:** UNDP, UN Entities

**Future:** UNDP, UN Entities

## Delivery model

**Business model:** Cost Recovery

**Project category:** Standard', 'completed', 'internal', true, false, NULL, 21, 'published', now(), 2024, 'Research & Advisory', '9–12 months', ARRAY['UNDP, UN Entities']::text[], ARRAY['AI/ML research, Tech scouting, Disaster risk analytics']::text[], 'Humanitarian and development practitioners need a better understanding of how to leverage emerging technologies and engage the private sector to improve disaster preparedness, response, and recovery.', 'A comprehensive report was produced to introduce key technologies, illustrate their use cases, and outline the main challenges and opportunities for their implementation in disaster management.', ARRAY['• Researched 13 key frontier technologies.', '• Analyzed their application across the disaster management cycle', '.• Mapped technologies to private sector networks.', '• Provided recommendations for practitioners.']::text[], ARRAY['• Landscape analysis of 13 key technologies', '• Case studies on technology use in disasters', '• Assessment of implementation challenges and risks', '• Framework for private sector engagement', '• Recommendations for humanitarian practitioners']::text[], ARRAY['Not applicable (Research Report)']::text[], 'Collaborated with the United Nations Office for the Coordination of Humanitarian Affairs (OCHA) and the Connecting Business initiative (CBi).', ARRAY['Global (Report)']::text[], '{}'::text[], NULL, NULL, ARRAY['AI/ML research, Tech scouting, Disaster risk analytics']::text[], 'The report serves as a reusable knowledge product and practical guide. Its findings and recommendations can be applied globally by practitioners to better integrate technology into disaster management.', ARRAY['UNDP, UN Entities']::text[], ARRAY['UNDP, UN Entities']::text[], 'Cost Recovery', 'Standard', 'Research'),
  ('Gender Equality and Public Finance (FFD papers analysis)', 'gender-equality-and-public-finance-ffd-papers-analysis', 'This study analyzes submissions from governments and stakeholders to the Financing for Development (FfD) process to assess how gender equality is addressed in public finance discussions, identifying key trends, gaps, and policy tensions.', '## Overview

This study analyzes submissions from governments and stakeholders to the Financing for Development (FfD) process to assess how gender equality is addressed in public finance discussions, identifying key trends, gaps, and policy tensions.

## Scalability and reusable components

The analytical framework and NLP pipeline can be adapted to analyze other large document sets, allowing for similar thematic and trend analysis on different policy topics.

## Client segments

**Current:** UN Entity

**Future:** UNDP, UN Entities, Governments

## Delivery model

**Business model:** R&D

**Project category:** Standard', 'completed', 'internal', true, false, NULL, 22, 'published', now(), 2024, 'Natural Language Processing', '1 Month', ARRAY['UN Entity']::text[], ARRAY['NLP, text mining, stance/regression detection, topic modeling, country/entity extraction, thematic analysis']::text[], 'Policymakers and development practitioners need to understand the extent to which gender equality is integrated into global public finance discussions to identify gaps and advocate for more effective, gender-responsive policies.', 'An NLP-powered analysis of official submissions to the Financing for Development (FfD) process was conducted to systematically map how different stakeholders address gender equality, providing evidence-based insights into policy trends.', ARRAY['• Collected and processed official submissions from Member States, CSOs, and International Organizations.', '• Used NLP and text mining to identify mentions and themes related to gender equality', '.• Analyzed the data to identify progressive and regressive policy tensions', '.• Visualized findings to compare stakeholder focus on gender issues.']::text[], ARRAY['• Stakeholder-level analysis of gender equality focus', '• Identification of 32 progressive themes', '• Identification of 42 regressive tensions', '• Word count and percentage analysis of gender content', '• Visualization of trends and disparities']::text[], ARRAY['Python, NLP libraries, Text Mining tools, Data Visualization libraries']::text[], 'The analysis was part of the EQUANOMICS initiative, in which UNDP collaborated with Norway and the Brookings Institution to influence the Financing for Development process.', ARRAY['Global (Policy Analysis)']::text[], '{}'::text[], NULL, NULL, ARRAY['NLP, text mining, stance/regression detection, topic modeling, country/entity extraction, thematic analysis']::text[], 'The analytical framework and NLP pipeline can be adapted to analyze other large document sets, allowing for similar thematic and trend analysis on different policy topics.', ARRAY['UN Entity']::text[], ARRAY['UNDP, UN Entities, Governments']::text[], 'R&D', 'Standard', 'NLP'),
  ('UNDP Jobs & Skills Trend Analysis', 'undp-jobs-and-skills-trend-analysis', 'Uses natural language processing to analyse UNDP''s public job postings over time, revealing how the organisation''s demand for skills and expertise has shifted and how it relates to its strategy, the SDGs, and wider employment trends.', '## Overview

Uses natural language processing to analyse UNDP''s public job postings over time, revealing how the organisation''s demand for skills and expertise has shifted and how it relates to its strategy, the SDGs, and wider employment trends.

## Scalability and reusable components

The text-analysis workflow (clustering, topic modelling, NER) is reusable on any large collection of job postings or descriptions. It runs on openly available data, keeping it low-barrier to repeat for other organisations or periods.

## Client segments

**Current:** N/A (internal research project)

**Future:** UNDP, UN Entities, Governments

## Delivery model

**Business model:** R&D

**Project category:** Standard', 'completed', 'internal', true, false, NULL, 23, 'published', now(), 2020, 'Natural Language Processing', '3 months', ARRAY['N/A (internal research project)']::text[], ARRAY['NLP, Machine Learning, Labour-market analytics, Trend analysis, Data visualisation']::text[], 'An organisation''s job postings reflect its strategic priorities, but that signal is buried in years of unstructured text. It is hard to see how demand for skills has changed over time or how it maps to strategy and the SDGs.', 'An NLP pipeline that analyses UNDP''s public job postings to cluster roles, extract themes, and track how skills demand has shifted, comparing it against UNDP strategy, the SDGs, and global and regional employment trends.', ARRAY['• Collect UNDP job postings and descriptions from the public site', '• Explore and categorise fields (job family, grade, location, contract)', '• Run time-series analysis on jobs by location, level, and type', '• Cluster postings and apply topic modelling and NER', '• Visualise trends and compare against strategy, SDGs, and market']::text[], ARRAY['• Trend analysis of skills demand over time and by location', '• Clustering of similar job postings', '• Topic modelling to surface in-demand themes', '• Named-entity recognition and a job-classification ontology', '• Comparison against UNDP strategy, SDGs, and employment trends', '• Data visualisations and a research brief']::text[], ARRAY['Python, NLP, topic modelling (LDA, PLSA, LSA), unsupervised clustering (K-means, agglomerative, DBSCAN), Named Entity Recognition (NER), time-series analysis, Jupyter notebook, data visualisation']::text[], NULL, ARRAY['portfolio-wide / internal']::text[], '{}'::text[], NULL, NULL, ARRAY['NLP, Machine Learning, Labour-market analytics, Trend analysis, Data visualisation']::text[], 'The text-analysis workflow (clustering, topic modelling, NER) is reusable on any large collection of job postings or descriptions. It runs on openly available data, keeping it low-barrier to repeat for other organisations or periods.', ARRAY['N/A (internal research project)']::text[], ARRAY['UNDP, UN Entities, Governments']::text[], 'R&D', 'Standard', 'NLP'),
  ('Illegal Dumpsite Detection', 'illegal-dumpsite-detection', 'This project uses satellite imagery, machine learning, and geospatial analysis to detect and monitor illegal waste disposal sites, supporting environmental enforcement and cleanup prioritization by local authorities.', '## Overview

This project uses satellite imagery, machine learning, and geospatial analysis to detect and monitor illegal waste disposal sites, supporting environmental enforcement and cleanup prioritization by local authorities.

## Scalability and reusable components

The machine learning model, developed using transfer learning, offers a cost-effective and adaptable method for identifying illegal dumpsites. It has been successfully piloted in Guatemala and is designed for replication in other contexts like Peru and Libya.

## Client segments

**Current:** UNDP CO, Government

**Future:** UNDP CO, Regional Office, Government, UN entities

## Delivery model

**Business model:** Cost Recovery

**Project category:** Standard', 'completed', 'internal', true, false, NULL, 24, 'published', now(), 2023, 'GIS / Remote Sensing', '6 Months', ARRAY['UNDP CO, Government']::text[], ARRAY['Computer vision, Satellite imagery, ML, GIS']::text[], 'Local authorities in countries like Guatemala, Peru, and Libya lack timely and cost-effective methods for detecting and monitoring the growing number of illegal dumpsites, which pose serious environmental and public health risks.', 'An AI-powered tool was developed to automatically analyze high-resolution satellite imagery and identify potential illegal dumpsites, enabling authorities to target interventions and streamline monitoring efforts.', ARRAY['• Collect satellite imagery and ground-truth data from known dumpsites.', '• Pre-train a computer vision model on an open-source waste dataset.', '• Fine-tune the model using local data from the target country via transfer learning.', '• Deploy the model to identify and flag potential new dumpsites on a map.']::text[], ARRAY['• Machine learning model for image classification', '• Uses publicly available satellite imagery', '• Differentiates between evident and non-evident dumpsites', '• Scalable to new geographical areas', '• Potential for a "human-in-the-loop" monitoring system']::text[], ARRAY['Python, Convolutional Neural Networks (CNN), ResNet50, Feature Pyramid Network (FPN), Google Maps Static API, GIS']::text[], 'Collaborated with UNDP Guatemala Accelerator Lab and the Ministry of Environment and Natural Resources (MARN) of Guatemala. The model was adapted from work by Politecnico di Milano. Planned collaborations include UNDP country offices in Peru and Libya.', ARRAY['Guatemala (completed), Peru (planned), Libya (planned)']::text[], '{}'::text[], NULL, NULL, ARRAY['Computer vision, Satellite imagery, ML, GIS']::text[], 'The machine learning model, developed using transfer learning, offers a cost-effective and adaptable method for identifying illegal dumpsites. It has been successfully piloted in Guatemala and is designed for replication in other contexts like Peru and Libya.', ARRAY['UNDP CO, Government']::text[], ARRAY['UNDP CO, Regional Office, Government, UN entities']::text[], 'Cost Recovery', 'Standard', 'GIS'),
  ('SupTech for Fair Digital Finance – Morocco', 'suptech-for-fair-digital-finance-morocco', 'This social listening platform analyzes social media discussions in Morocco to identify emerging risks, trends, and public concerns related to digital finance, providing authorities with timely insights for policy responses.', '## Overview

This social listening platform analyzes social media discussions in Morocco to identify emerging risks, trends, and public concerns related to digital finance, providing authorities with timely insights for policy responses.

## Scalability and reusable components

The data analysis pipeline for Arabic and French, along with the web application architecture and custom taxonomy framework, can be adapted for use by other central banks or financial regulators in different countries.

## Client segments

**Current:** UNDP CO, Government

**Future:** UNDP CO, Regional Office, Government, UN entities

## Delivery model

**Business model:** Cost Recovery

**Project category:** Standard', 'completed', 'internal', true, false, NULL, 25, 'published', now(), 2023, 'Natural Language Processing', '9–12 months', ARRAY['UNDP CO, Government']::text[], ARRAY['NLP, ML, Knowledge graphs, Sentiment Analysis, Web Development']::text[], 'Financial authorities need a way to understand consumer experiences and sentiments in real time, especially for vulnerable groups, but lack the tools to analyze vast amounts of social media data to inform consumer protection policies.', 'An AI-powered Supervisory Technology (SupTech) platform was developed to collect and analyze social media data in Arabic and French, offering insights on financial stability, inclusion, and market conduct to inform regulation.', ARRAY['• Collects data from Twitter, Facebook, and Instagram.', '• Applies NLP for sentiment analysis, keyword extraction, and topic modeling in Arabic and French.', '• Uses a custom taxonomy co-designed with the Central Bank.', '• Visualizes insights and generates reports via a web application.']::text[], ARRAY['Real-time social media analysis in Arabic and French', '• Interactive visualizations and dashboards', '• Custom financial taxonomy for high accuracy', '• Sentiment, keyword, and topic trend analysis', '• PDF report generation', '• Online complaints page with speech-to-text']::text[], ARRAY['Python, Django']::text[], 'Collaborated with UNDP Morocco''s Accelerator Lab and the Central Bank of Morocco. Planned future collaboration includes the Qatar Computing Research Institute (QCRI) and Cambridge SupTech Lab.', ARRAY['Morocco']::text[], '{}'::text[], NULL, NULL, ARRAY['NLP, ML, Knowledge graphs, Sentiment Analysis, Web Development']::text[], 'The data analysis pipeline for Arabic and French, along with the web application architecture and custom taxonomy framework, can be adapted for use by other central banks or financial regulators in different countries.', ARRAY['UNDP CO, Government']::text[], ARRAY['UNDP CO, Regional Office, Government, UN entities']::text[], 'Cost Recovery', 'Standard', 'NLP'),
  ('AI for Tourism', 'ai-for-tourism', 'This web-based analytics platform analyzes tourism data from government agencies, tourism operators, and online platforms to generate real-time insights on visitor behavior, destinations, and economic opportunities through interactive dashboards.', '## Overview

This web-based analytics platform analyzes tourism data from government agencies, tourism operators, and online platforms to generate real-time insights on visitor behavior, destinations, and economic opportunities through interactive dashboards.

## Scalability and reusable components

The platform is a modular, AI-powered system designed for replication. Its architecture and data analysis pipeline can be adapted to serve other countries by integrating different data sources, as demonstrated by planned collaborations.

## Client segments

**Current:** UNDP CO, Government

**Future:** UNDP CO, Regional Office, Government, UN entities, Universities

## Delivery model

**Business model:** Cost Recovery

**Project category:** Standard', 'completed', 'internal', true, false, NULL, 26, 'published', now(), 2023, 'Natural Language Processing', '9–12 Months', ARRAY['UNDP CO, Government']::text[], ARRAY['NLP, Data integration, Web development, Visualization, Data scrapping, Social Listening']::text[], 'Governments and tourism operators in developing countries lack access to integrated, real-time data on visitor trends and preferences. This data gap hinders strategic planning, marketing, and investment, limiting the sector''s economic potential.', 'An AI-powered decision support system was developed to integrate and analyze data from multiple sources. It provides tourism authorities with actionable intelligence for planning, marketing, and investment decisions through interactive dashboards.', ARRAY['• Scrapes data from online platforms (e.g., Booking.com, TripAdvisor)', '.• Uses NLP and ML to perform sentiment and aspect-based analysis on reviews.', '• Integrates aviation data and other digital sources for demand signals', '.• Presents findings via interactive dashboards, charts, and maps.']::text[], ARRAY['• Automated data collection from major travel platforms', '• Aspect-based sentiment analysis', '• Interactive data visualizations and dashboards', '• Geographic analysis with interactive maps', '• Keyword extraction and trend analysis', '• Demographic and seasonal trend analysis']::text[], ARRAY['Django, React, Celery, Redis, PostgreSQL, Docker, Apify, Azure']::text[], 'Collaborated with the Ministry of Tourism in Malawi, Mzuzu University, and the Malawi Tourism Council. The initiative also involves partnerships with flydubai and UNDP Accelerator Labs.', ARRAY['Malawi, Tanzania (Zanzibar)']::text[], '{}'::text[], NULL, NULL, ARRAY['NLP, Data integration, Web development, Visualization, Data scrapping, Social Listening']::text[], 'The platform is a modular, AI-powered system designed for replication. Its architecture and data analysis pipeline can be adapted to serve other countries by integrating different data sources, as demonstrated by planned collaborations.', ARRAY['UNDP CO, Government']::text[], ARRAY['UNDP CO, Regional Office, Government, UN entities, Universities']::text[], 'Cost Recovery', 'Standard', 'NLP'),
  ('Crises Informatics for Social Media Analysis', 'crises-informatics-for-social-media-analysis', 'Uses social media data to support disaster preparedness, response, and recovery. It analyses posts such as tweets to surface crisis signals and presents them through an interactive dashboard.', '## Overview

Uses social media data to support disaster preparedness, response, and recovery. It analyses posts such as tweets to surface crisis signals and presents them through an interactive dashboard.

## Scalability and reusable components

The data-gathering, processing, and classification workflow is reusable across different crisis types and data sources. The approach is designed to be replicated for future cases and run in-house on new datasets.

## Client segments

**Current:** N/A (internal research project)

**Future:** UNDP, UN Entities, Governments

## Delivery model

**Business model:** R&D

**Project category:** Standard', 'completed', 'internal', true, false, NULL, 27, 'published', now(), 2020, 'Natural Language Processing', '3 months', ARRAY['N/A (internal research project)']::text[], ARRAY['NLP, Machine Learning, Social media analytics, Crisis informatics, Data visualisation']::text[], 'Social media holds real-time, on-the-ground information during emergencies, but it is noisy and hard to use. Separating relevant crisis signals from the flood of user-generated posts is a major barrier to reliable insight.', 'A proof-of-concept workflow and microsite that collect crisis-related social media posts, classify which ones are about real disasters, and present the results as an interactive, dashboard-style view.', ARRAY['• Collect crisis-related posts via the social media API', '• Clean data and remove identifiable information', '• Annotate and train a classifier on relevant posts', '• Run exploratory and time-based analysis (trends, sentiment)', '• Present insights in a microsite dashboard']::text[], ARRAY['• Crisis-related social media data collection', '• Machine-learning classifier for real vs. non-disaster posts', '• Exploratory text analysis (n-grams, word clouds, common terms)', '• Temporal trend and sentiment analysis', '• Interactive microsite dashboard with visualisations']::text[], ARRAY['Python, Twitter API, NLP, machine-learning classifiers, exploratory data analysis', 'web app / dashboard tools (Dash/Plotly, Streamlit, Flask, d3.js)']::text[], NULL, '{}'::text[], '{}'::text[], NULL, NULL, ARRAY['NLP, Machine Learning, Social media analytics, Crisis informatics, Data visualisation']::text[], 'The data-gathering, processing, and classification workflow is reusable across different crisis types and data sources. The approach is designed to be replicated for future cases and run in-house on new datasets.', ARRAY['N/A (internal research project)']::text[], ARRAY['UNDP, UN Entities, Governments']::text[], 'R&D', 'Standard', 'NLP'),
  ('Coral Reef Mapping & Bleaching Monitoring', 'coral-reef-mapping-and-bleaching-monitoring', 'This project uses machine learning and satellite imagery to develop a model that evaluates coral reef health and estimates the coastal protection services provided by healthy reef ecosystems.', '## Overview

This project uses machine learning and satellite imagery to develop a model that evaluates coral reef health and estimates the coastal protection services provided by healthy reef ecosystems.

## Scalability and reusable components

The classification model and geospatial workflows developed for this project are reusable and can be adapted to monitor coral reefs in other regions.

## Client segments

**Current:** N/A ???

**Future:** UNDP CO, Regional Office, Government, UN entities, Private Sector

## Delivery model

**Business model:** Cost Recovery

**Project category:** Standard', 'completed', 'internal', true, false, NULL, 28, 'published', now(), 2022, 'GIS / Remote Sensing', '3–4 months', ARRAY['N/A ???']::text[], ARRAY['GIS, AI, Remote sensing, Machine Learning']::text[], 'Publicly available datasets for coral reefs are often outdated and have low resolution, making it difficult for stakeholders to monitor reef health and bleaching events effectively.', 'A classifier was built using satellite data to correctly classify coral reef habitats. This allows for the creation of updated habitat maps and the identification of coral bleaching events to enable faster in-situ response.', ARRAY['• Process Sentinel-2 satellite data using atmospheric correction and deglinting.', '• Apply a classifier (e.g., Random Forest, SVM) to identify coral reef habitats.', '• Use the classification to create updated habitat and geomorphology maps.', '• Apply change detection algorithms to identify bleaching events.']::text[], ARRAY['• Automated coral reef habitat classification', '• Bleaching event detection', '• Bathymetry estimation', '• Change detection mapping over time', '• Uses publicly available satellite data']::text[], ARRAY['Python, Sentinel-2, K-means, Random Forest, SVM, XGBoost']::text[], 'Collaborated with the United Nations Environment Programme – World Conservation Monitoring Centre (UNEP-WCMC) for data and research insights.', ARRAY['Global (Methodology Development)']::text[], '{}'::text[], NULL, NULL, ARRAY['GIS, AI, Remote sensing, Machine Learning']::text[], 'The classification model and geospatial workflows developed for this project are reusable and can be adapted to monitor coral reefs in other regions.', ARRAY['N/A ???']::text[], ARRAY['UNDP CO, Regional Office, Government, UN entities, Private Sector']::text[], 'Cost Recovery', 'Standard', 'GIS'),
  ('Automated Decision-Making Support System for BCtA Membership Applications', 'automated-decision-making-support-system-for-bcta-membership-applications', 'An AI-powered system that uses Natural Language Processing (NLP) to support and partially automate the validation process for Business Call to Action (BCtA) membership application documents.', '## Overview

An AI-powered system that uses Natural Language Processing (NLP) to support and partially automate the validation process for Business Call to Action (BCtA) membership application documents.

## Scalability and reusable components

Trained models and automated validation pilots can be adapted for new membership documents. A GitHub repository of the code was created for future use.

## Client segments

**Current:** UN entities (BCtA Secretariat)

**Future:** UNDP CO, UN Entities

## Delivery model

**Business model:** Cost Recovery

**Project category:** Standard', 'completed', 'internal', true, false, NULL, 29, 'published', now(), 2020, 'Natural Language Processing', '8 months', ARRAY['UN entities (BCtA Secretariat)']::text[], ARRAY['AI/ML, NLP']::text[], 'The validation process for new BCtA members is time-consuming, relying on manual review of unstructured application documents to ensure they meet specific criteria.', 'The project developed and piloted a solution using Natural Language Processing (NLP) to automate information retrieval and support the decision-making process for membership applications.', ARRAY['Conduct NLP research and case studies for information retrieval.Develop NLP models using BCtA membership application data.Pilot trained models and automated validation for new membership documents.']::text[], ARRAY['Automated information retrieval from application documentsAutomated validation pilotsTrained NLP models']::text[], ARRAY['NLP, GitHub']::text[], 'This project was a collaboration between the SDG AI Lab and the Business Call to Action (BCtA) initiative. The SDG AI Lab also partnered with United Nations Volunteers (UNV) to engage volunteer data scientists.', '{}'::text[], '{}'::text[], NULL, NULL, ARRAY['AI/ML, NLP']::text[], 'Trained models and automated validation pilots can be adapted for new membership documents. A GitHub repository of the code was created for future use.', ARRAY['UN entities (BCtA Secretariat)']::text[], ARRAY['UNDP CO, UN Entities']::text[], 'Cost Recovery', 'Standard', 'NLP'),
  ('Data Visualization for Annual Report (BCtA)', 'data-visualization-for-annual-report-bcta', 'Organizes structured and unstructured data from Business Call to Action (BCtA) into clear data visualizations and insights for the BCtA 2020 Annual Report, helping show how member companies'' inclusive businesses impact people at the Base of the Pyramid.', '## Overview

Organizes structured and unstructured data from Business Call to Action (BCtA) into clear data visualizations and insights for the BCtA 2020 Annual Report, helping show how member companies'' inclusive businesses impact people at the Base of the Pyramid.

## Scalability and reusable components

Unstructured data is reshaped into a structured format that can be reused for future research and analysis. The work feeds into a follow-on project building web-based, interactive data visualization tools (including Impact Lab data). Code delivered via GitHub repository for future use.

## Client segments

**Current:** UNDP CO

**Future:** UNDP CO, UN Entities

## Delivery model

**Business model:** Cost Recovery

**Project category:** Standard', 'completed', 'internal', true, false, NULL, 30, 'published', now(), 2020, 'Natural Language Processing', '6 Months', ARRAY['UNDP CO']::text[], ARRAY['Data visualization', 'data structuring/analysis', 'AI/ML (as part of the wider partnership, alongside NLP)']::text[], 'BCtA holds large volumes of unstructured and partially structured data across member applications, progress reports, the Impact Lab and its CRM, making it hard to extract insights and clearly communicate members'' inclusive-business impact.', 'The team gathered and structured this data, then produced visualizations and insights for the BCtA 2020 Annual Report, showing how members serve the Base of the Pyramid and where their impact is concentrated.', ARRAY['Gather data from member applications, progress reports, Impact Lab and CRM', 'Organize retrieved data into a structured format', 'Produce visualizations and insights', 'Feed outputs into the BCtA Annual Report', 'Deliver code and project report for reuse']::text[], ARRAY['Standardized dashboards and visualization assets', 'Aggregated visualizations of member impact data', 'Structuring of unstructured/partially-structured data', 'Insights on how members serve the Base of the Pyramid', 'Reusable structured dataset', 'GitHub repository of code']::text[], ARRAY['GitHub (code repository)', 'data visualization/analytics methods.']::text[], 'N/A', ARRAY['N/A']::text[], '{}'::text[], NULL, NULL, ARRAY['Data visualization', 'data structuring/analysis', 'AI/ML (as part of the wider partnership, alongside NLP)']::text[], 'Unstructured data is reshaped into a structured format that can be reused for future research and analysis. The work feeds into a follow-on project building web-based, interactive data visualization tools (including Impact Lab data). Code delivered via GitHub repository for future use.', ARRAY['UNDP CO']::text[], ARRAY['UNDP CO, UN Entities']::text[], 'Cost Recovery', 'Standard', 'NLP??'),
  ('Madagascar Drought Early Warning System (EWS Maturity Analysis and Integration)', 'madagascar-drought-early-warning-system-ews-maturity-analysis-and-integration', 'A drought early warning dashboard for Madagascar that brings scattered climate and risk information into one place, helping authorities and communities anticipate droughts and act earlier to protect vulnerable populations.', '## Overview

A drought early warning dashboard for Madagascar that brings scattered climate and risk information into one place, helping authorities and communities anticipate droughts and act earlier to protect vulnerable populations.

## Scalability and reusable components

The dashboard architecture, EWS maturity-assessment approach, and reusable vulnerability data layers (built with the DSVI initiative) can be applied to other countries and hazards such as tropical cyclones.

## Client segments

**Current:** UNDP Country Office, Government of Madagascar, national stakeholders and NGOs

**Future:** UNDP, UN Entities, Governments

## Delivery model

**Business model:** Cost Recovery

**Project category:** Standard', 'completed', 'internal', true, false, NULL, 31, 'published', now(), 2024, 'GIS / Remote Sensing', '6–7 months', ARRAY['UNDP Country Office, Government of Madagascar, national stakeholders and NGOs']::text[], ARRAY['AI/ML, GIS, geospatial data integration, data visualisation, vulnerability mapping']::text[], 'Madagascar faces recurring humanitarian crises with over 30 uncoordinated early warning systems. Most lack compatibility and interoperability, so the government has no central tool to combine their information and act early on disasters.', 'A drought early warning dashboard plus an EWS maturity assessment and high-resolution vulnerability layers, integrating existing and new data sources into one platform to support faster, better-informed decisions.', ARRAY['• Assess maturity and gaps of existing national and regional EWS', '• Integrate real-time climate and risk data into one dashboard', '• Visualise rainfall, soil moisture and drought indicators', '• Add high-resolution vulnerability layers to pinpoint at-risk communities', '• Hand over tool and training, with a roadmap for next steps']::text[], ARRAY['• Real-time climate and drought monitoring', '• Rainfall, soil moisture and drought indicators', '• Integration of multiple existing EWS sources', '• High-resolution social vulnerability mapping', '• Regularly updated, interactive dashboard', '• User-friendly interface shaped through stakeholder design workshops']::text[], ARRAY['Dashboard/dynamic online tool, API integration, GIS and geospatial data layers, machine learning', 'satellite and open UN/scientific datasets. (Specific named tools/models not stated in input)']::text[], 'Collaborated with UNDP Madagascar Country Office, the INFORM Risk team, national consultants and government institutions, and NGOs; developed with the SDG AI Lab''s DSVI initiative. Context also references WFP, ECHO and bilateral partners active in Madagascar''s EWS landscape.', ARRAY['Madagascar']::text[], '{}'::text[], NULL, NULL, ARRAY['AI/ML, GIS, geospatial data integration, data visualisation, vulnerability mapping']::text[], 'The dashboard architecture, EWS maturity-assessment approach, and reusable vulnerability data layers (built with the DSVI initiative) can be applied to other countries and hazards such as tropical cyclones.', ARRAY['UNDP Country Office, Government of Madagascar, national stakeholders and NGOs']::text[], ARRAY['UNDP, UN Entities, Governments']::text[], 'Cost Recovery', 'Standard', 'GIS'),
  ('INFF AI-powered Data Management and Analysis for SDG Finance', 'inff-ai-powered-data-management-and-analysis-for-sdg-finance', 'Turns national financing-strategy documents into structured data and visualises financing trends for the INFF Facility, helping teams track reforms and compare progress across countries.', '## Overview

Turns national financing-strategy documents into structured data and visualises financing trends for the INFF Facility, helping teams track reforms and compare progress across countries.

## Scalability and reusable components

The ontology and data pipeline are reusable as new countries and categories are added. The Power BI prototype provides a repeatable way to visualise financing trends across the INFF portfolio.

## Client segments

**Current:** UNDP

**Future:** UNDP, UN Entities

## Delivery model

**Business model:** Cost Recovery

**Project category:** Standard', 'completed', 'internal', true, false, NULL, 32, 'published', now(), 2023, 'Natural Language Processing', '6 months', ARRAY['UNDP']::text[], ARRAY['NLP, Data structuring, Ontology/taxonomy, Data visualisation (Power BI)']::text[], 'Integrated National Financing Frameworks generate a growing volume of policy documents and financing strategies. Keeping this information structured and comparable across countries is difficult with manual processes.', 'An Excel-based ontology and a Power BI prototype that organise INFF financing-strategy data into a consistent structure and visualise financing trends for analysis.', ARRAY['• Define an ontology for financing-strategy data', '• Structure information from INFF documents against it', '• Consolidate into a central dataset', '• Visualise financing trends in a Power BI prototype']::text[], ARRAY['• Structured ontology for INFF financing data', '• Standardised data pipeline', '• Power BI dashboard prototype for financing trends', '• Cross-country comparison of financing strategies']::text[], ARRAY['Excel-based ontology, Power BI, NLP, structured data pipelines']::text[], 'Developed with the INFF Facility.', '{}'::text[], '{}'::text[], NULL, NULL, ARRAY['NLP, Data structuring, Ontology/taxonomy, Data visualisation (Power BI)']::text[], 'The ontology and data pipeline are reusable as new countries and categories are added. The Power BI prototype provides a repeatable way to visualise financing trends across the INFF portfolio.', ARRAY['UNDP']::text[], ARRAY['UNDP, UN Entities']::text[], 'Cost Recovery', 'Standard', 'NLP'),
  ('Earthquake Safety Routing', 'earthquake-safety-routing', 'Uses satellite imagery and street data to find safer routes through a city after an earthquake, by mapping building risk and identifying streets that are less likely to be blocked by debris.', '## Overview

Uses satellite imagery and street data to find safer routes through a city after an earthquake, by mapping building risk and identifying streets that are less likely to be blocked by debris.

## Scalability and reusable components

The routing approach uses reusable algorithms adaptable to multiple cities. Because it runs on open building and street data (SpaceNet, OpenStreetMap), it can be repeated for other earthquake-exposed urban areas.

## Client segments

**Current:** University

**Future:** UNDP CO, Regional Office, Government, UN entities, Private Sector

## Delivery model

**Business model:** Cost Recovery

**Project category:** Self-Service', 'completed', 'internal', true, false, NULL, 33, 'published', now(), 2022, 'GIS / Remote Sensing', '3–4 months', ARRAY['University']::text[], ARRAY['AI/ML, Computer vision, GIS, Hazard modeling']::text[], 'Earthquakes can block streets with collapsed buildings and debris, making it hard to move safely through a city. Turkey is among the countries most exposed to earthquake hazard.', 'A GIS and machine-learning workflow that maps building risk from satellite imagery, builds a risk heatmap over the street network, and identifies safer paths after an earthquake event.', ARRAY['• Detect building footprints from satellite imagery', '• Map the street network from OpenStreetMap', '• Build a distance/risk heatmap around buildings and streets', '• Run a path-finding algorithm to identify safer routes']::text[], ARRAY['• Building risk exposure mapping', '• Risk heatmap over the urban area', '• Street network graph for routing', '• Safer-path identification after an earthquake', '• Approach adaptable to multiple cities']::text[], ARRAY['Python, U-Net segmentation (computer vision), PyTorch / TensorFlow / Keras, OpenStreetMap street graph, Dijkstra''s algorithm, SpaceNet building-footprint data, Google Maps Satellite / Mapbox imagery']::text[], 'Collaborated with Bilkent University (Industrial Engineering).', ARRAY['Türkiye (Istanbul – Fatih district)']::text[], '{}'::text[], NULL, NULL, ARRAY['AI/ML, Computer vision, GIS, Hazard modeling']::text[], 'The routing approach uses reusable algorithms adaptable to multiple cities. Because it runs on open building and street data (SpaceNet, OpenStreetMap), it can be repeated for other earthquake-exposed urban areas.', ARRAY['University']::text[], ARRAY['UNDP CO, Regional Office, Government, UN entities, Private Sector']::text[], 'Cost Recovery', 'Self-Service', 'GIS')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  description = EXCLUDED.description,
  project_status = EXCLUDED.project_status,
  deployment_status = EXCLUDED.deployment_status,
  is_deployed = EXCLUDED.is_deployed,
  is_featured = EXCLUDED.is_featured,
  image_url = EXCLUDED.image_url,
  display_order = EXCLUDED.display_order,
  status = EXCLUDED.status,
  project_year = EXCLUDED.project_year,
  impact_area = EXCLUDED.impact_area,
  timeline = EXCLUDED.timeline,
  best_fit = EXCLUDED.best_fit,
  core_capabilities = EXCLUDED.core_capabilities,
  problem = EXCLUDED.problem,
  solution = EXCLUDED.solution,
  how_it_works = EXCLUDED.how_it_works,
  features = EXCLUDED.features,
  tech_stack = EXCLUDED.tech_stack,
  collaboration_network = EXCLUDED.collaboration_network,
  implementation_countries = EXCLUDED.implementation_countries,
  resource_links = EXCLUDED.resource_links,
  video_url = EXCLUDED.video_url,
  media_caption = EXCLUDED.media_caption,
  capabilities_involved = EXCLUDED.capabilities_involved,
  reusable_components = EXCLUDED.reusable_components,
  current_client_segments = EXCLUDED.current_client_segments,
  future_client_segments = EXCLUDED.future_client_segments,
  business_model = EXCLUDED.business_model,
  project_category = EXCLUDED.project_category,
  work_stream = EXCLUDED.work_stream,
  updated_at = now();
