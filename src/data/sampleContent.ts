import type { FeaturedProjectCard, NewsArticle, NewsListItem, PartnerLogo, Project, StatisticCard } from '../lib/types';

export type SampleProject = Project & {
  summary: string;
  deployment_status: 'live' | 'prototype' | 'internal';
  sdgs: number[];
  is_sample: true;
  impact_area: string;
  timeline: string;
  best_fit: string[];
  core_capabilities: string[];
};

export const labServiceLines = [
  { title: 'Development', body: 'Custom digital solutions and applications, from prototype to deployment.' },
  { title: 'Research', body: 'Frontier technology research and analysis for sustainable development use cases.' },
  { title: 'Advisory', body: 'Technical guidance, strategic consulting and responsible AI support.' },
  { title: 'Training', body: 'Capacity-building programmes, bootcamps, fellowships and practical workshops.' },
  { title: 'Partnerships & collaboration', body: 'Facilitating collaborations with the technology sector, development partners and the Lab network.' },
] as const;

export const impactAreas = [
  {
    title: 'GIS / Remote Sensing',
    timeline: '6â€“18 months',
    summary: 'Satellite imagery and geospatial intelligence for climate resilience, vulnerability mapping and sustainable development planning.',
    examples: ['Digital Social Vulnerability Index', 'Land Use Analysis Tool', 'Deforestation Monitoring and Prediction', 'Illegal Dumpsites Detection'],
  },
  {
    title: 'Natural Language Processing',
    timeline: '3â€“12 months',
    summary: 'Agentic AI, machine learning and LLM-enabled tools that transform complex public data into actionable insight.',
    examples: ['AI for Tourism Platform', 'Audit Recommendation Tracking Tool', 'Public Finance Simplification Platform', 'AI-Powered Knowledge Base'],
  },
  {
    title: 'Digital Skills Development',
    timeline: '3â€“12 months',
    summary: 'Hands-on AI, data science, entrepreneurship and frontier-tech programmes for youth and professionals.',
    examples: ['Innovation Campus', 'Frontier & Future Tech Leaders Programmes', 'Game Development Bootcamps', 'Volunteer Data Scientists Initiative'],
  },
  {
    title: 'Resilience',
    timeline: '6â€“15 months',
    summary: 'Frontier technologies for disaster management, early warning, real-time risk data and coordinated volunteer support.',
    examples: ['Madagascar Multi-Hazard Early Warning System', 'Tech4R â€” Tech Volunteers for Resilience', 'Frontier Technologies Radar for DRR', 'Earthquake Safety Routing'],
  },
  {
    title: 'FinTech & Digital Finance',
    timeline: '6â€“15 months',
    summary: 'AI and supervisory technology that support financial inclusion, consumer protection and responsible digital finance.',
    examples: ['SupTech for Fair Digital Finance'],
  },
  {
    title: 'Research & Advisory',
    timeline: '3â€“12 months',
    summary: 'Technical assessments, project briefs, white papers, datasets, ToRs and partnership facilitation.',
    examples: ['Academic papers', 'Project briefs', 'White papers', 'Datasets'],
  },
] as const;

export const sampleStats: StatisticCard[] = [
  { id: 'sample-digital-projects', label: 'Digital projects', value: '50+', icon_name: 'projects', display_order: 1 },
  { id: 'sample-learners', label: 'Learners', value: '3,000+', icon_name: 'learners', display_order: 2 },
  { id: 'sample-knowledge-products', label: 'Knowledge products', value: '15', icon_name: 'knowledge', display_order: 3 },
  { id: 'sample-online-volunteers', label: 'Online UN Volunteers', value: '3,500+', icon_name: 'volunteers', display_order: 4 },
  { id: 'sample-countries-reached', label: 'Countries reached', value: '25', icon_name: 'countries', display_order: 5 },
];

export const sampleProjects: SampleProject[] = [
  {
    id: 'sample-osdg', title: 'Open SDG Classification', slug: 'open-sdg-classification',
    summary: 'Exploring machine learning approaches that help researchers map text and evidence to the Sustainable Development Goals.',
    description: `> **Project profile:** An applied AI solution from the SDG AI Lab portfolio.

## The challenge

Development organisations work with large collections of policies, reports and research. Finding which Sustainable Development Goals a document addresses can be slow and inconsistent.

## Methodology

The illustrative workflow combines a human-labelled training set with multi-label natural language processing. Subject-matter experts review model outputs, document limitations and refine the taxonomy before any operational use.

## Datasets and safeguards

- Publicly available UN and development-sector documents
- Human-reviewed SDG labels and taxonomy guidance
- Bias, language-coverage and error analysis before deployment

## Intended outcomes

The prototype would help analysts discover relevant evidence faster while keeping final classification decisions with people. Metrics, partners, publications and repository links can be added here as they become available.

## Open resources

Code, model cards, data statements and related papers can be linked in this section when available.`,
    project_status: 'active', deployment_status: 'prototype', is_deployed: false, is_featured: true,
    image_url: null, sdgs: [9, 16, 17], is_sample: true, display_order: 1, status: 'published',
    impact_area: 'Natural Language Processing', timeline: '6â€“18 months', best_fit: [], core_capabilities: [],
    published_at: null, created_at: '', updated_at: '',
  },
  {
    id: 'sample-disaster', title: 'AI for Disaster Preparedness', slug: 'ai-for-disaster-preparedness',
    summary: 'Investigating responsible data and AI methods that could strengthen preparedness, response and recovery planning.',
    description: `> **Project profile:** An applied AI solution from the SDG AI Lab portfolio.

## The challenge

Decision-makers need timely, local and reliable information before and after a disaster. Useful signals often sit across fragmented datasets and formats.

## Methodology

This example project combines geospatial analysis, risk indicators and participatory validation with local stakeholders. The approach starts with the decision needâ€”not the modelâ€”and includes human review throughout.

## Potential datasets

- Open hazard and exposure data
- Administrative and geospatial reference data
- Partner-provided operational information with appropriate governance

## Intended outcomes

A decision-support prototype, documented validation process and reusable technical guidance. Deployment status, evidence and links can be published here when available.`,
    project_status: 'under_development', deployment_status: 'prototype', is_deployed: false, is_featured: true,
    image_url: null, sdgs: [11, 13, 17], is_sample: true, display_order: 2, status: 'published',
    impact_area: 'Resilience', timeline: '6â€“15 months', best_fit: [], core_capabilities: [],
    published_at: null, created_at: '', updated_at: '',
  },
  {
    id: 'sample-portfolio', title: 'Development Portfolio Sensemaking', slug: 'development-portfolio-sensemaking',
    summary: 'Using natural language processing to help teams navigate programme documents and identify thematic connections.',
    description: `> **Project profile:** An applied AI solution from the SDG AI Lab portfolio.

## The challenge

Large programme portfolios contain valuable lessons, but their volume makes comparison and synthesis difficult.

## Methodology

The illustrative approach uses information retrieval, topic exploration and expert-led evaluation. Outputs are designed to support analysts rather than automate programme judgement.

## Potential datasets

- Public country programme documents
- Evaluation summaries and programme metadata
- Controlled development-sector vocabularies

## Intended outcomes

Search and exploration tools, transparent evaluation notes and reusable methods for responsible portfolio analysis.`,
    project_status: 'completed', deployment_status: 'internal', is_deployed: false, is_featured: true,
    image_url: null, sdgs: [16, 17], is_sample: true, display_order: 3, status: 'published',
    impact_area: 'Natural Language Processing', timeline: '3â€“12 months', best_fit: [], core_capabilities: [],
    published_at: null, created_at: '', updated_at: '',
  },
];

export const demoDayProjects: SampleProject[] = [
  {
    id: 'demo-ai-tourism',
    title: 'AI for Tourism Platform',
    slug: 'ai-for-tourism-platform',
    impact_area: 'Natural Language Processing',
    timeline: '3-12 months',
    summary: 'An AI-powered platform that helps governments and tourism stakeholders understand visitor trends, preferences and destination performance.',
    description: `> **Project profile:** An applied AI solution from the SDG AI Lab portfolio.

## The problem

Tourism information is spread across multiple platforms, making comprehensive analysis difficult. Governments often lack timely information on visitor preferences and emerging tourism trends.

## Our solution

The platform consolidates tourism data from multiple online sources into one interactive dashboard. It enables governments and tourism organizations to monitor visitor behavior, identify emerging trends and make evidence-based decisions that strengthen destination competitiveness.

## Core capabilities

- Tourism data integration
- Booking platform analytics
- Accommodation trend analysis
- Visitor activity insights
- Interactive dashboards
- Strategic tourism recommendations

## Best fit for

- Ministries of Tourism
- National Tourism Boards
- Local governments
- Destination management organizations
- Tourism businesses`,
    project_status: 'active',
    deployment_status: 'prototype',
    is_deployed: false,
    is_featured: true,
    image_url: null,
    sdgs: [8, 9, 17],
    is_sample: true,
    display_order: 1,
    status: 'published',
    published_at: null,
    created_at: '',
    updated_at: '',
    best_fit: ['Ministries of Tourism', 'Tourism Boards', 'Local Governments'],
    core_capabilities: ['Tourism analytics', 'Interactive dashboards', 'Policy insights'],
  },
  {
    id: 'demo-artt',
    title: 'Audit Recommendation Tracking Tool',
    slug: 'audit-recommendation-tracking-tool',
    impact_area: 'Natural Language Processing',
    timeline: '3-12 months',
    summary: 'A post-audit recommendation tracking and remediation platform for Supreme Audit Institutions, oversight bodies and audited entities.',
    description: `> **Project profile:** An applied AI solution from the SDG AI Lab portfolio.

## The problem

Audit recommendations are often tracked manually through spreadsheets, letters and fragmented follow-up processes. Ownership, action plans, evidence, verification and oversight reporting may not be managed in one workflow.

## Our solution

The Audit Recommendation Tracking Tool uses AI-assisted extraction and structured workflows to track recommendations, management action plans, evidence, verification, closure and oversight reporting in one system.

## Core capabilities

- AI-assisted extraction
- Human review
- Recommendation lifecycle tracking
- Management action plan workflow
- Evidence tracking
- Stakeholder reporting

## Best fit for

- Supreme Audit Institutions
- Audited entities
- Heads of SAI
- Parliamentarians
- Oversight bodies
- Development partners`,
    project_status: 'active',
    deployment_status: 'prototype',
    is_deployed: false,
    is_featured: true,
    image_url: null,
    sdgs: [16, 17],
    is_sample: true,
    display_order: 2,
    status: 'published',
    published_at: null,
    created_at: '',
    updated_at: '',
    best_fit: ['Supreme Audit Institutions', 'Oversight Bodies', 'Development Partners'],
    core_capabilities: ['AI extraction', 'Lifecycle tracking', 'Stakeholder reporting'],
  },
  {
    id: 'demo-public-finance',
    title: 'Public Finance Simplification Platform',
    slug: 'public-finance-simplification-platform',
    impact_area: 'Natural Language Processing',
    timeline: '3-12 months',
    summary: 'A digital platform that analyzes and visualizes public finance data to improve transparency and public understanding.',
    description: `> **Project profile:** An applied AI solution from the SDG AI Lab portfolio.

## The problem

Public finance information can be difficult for citizens and stakeholders to understand. Reviewing large financial documents requires significant manual effort and limited accessibility can reduce public engagement and accountability.

## Our solution

The platform uses generative AI to analyze financial documents, generate reports and visualize government budget and expenditure data through an interactive web platform.

## Core capabilities

- Document analysis
- Insight generation
- Financial visualization
- Analytical reporting
- Multi-country support
- Community engagement

## Best fit for

- Ministries of Finance
- Government agencies
- Development partners
- Civil society organizations
- Citizens`,
    project_status: 'active',
    deployment_status: 'prototype',
    is_deployed: false,
    is_featured: true,
    image_url: null,
    sdgs: [16, 17],
    is_sample: true,
    display_order: 3,
    status: 'published',
    published_at: null,
    created_at: '',
    updated_at: '',
    best_fit: ['Ministries of Finance', 'Civil Society', 'Citizens'],
    core_capabilities: ['Document analysis', 'Financial visualization', 'Reporting'],
  },
  {
    id: 'demo-dsvi',
    title: 'Digital Social Vulnerability Index',
    slug: 'digital-social-vulnerability-index',
    impact_area: 'GIS / Remote Sensing',
    timeline: '6-18 months',
    summary: 'An AI-powered platform using machine learning and GIS to map social vulnerability and help prioritize interventions.',
    description: `> **Project profile:** An applied AI solution from the SDG AI Lab portfolio.

## The problem

Many regions lack detailed and up-to-date social vulnerability assessments. Traditional vulnerability mapping can be resource-intensive and may miss local-level disparities.

## Our solution

The Digital Social Vulnerability Index automates social vulnerability analysis using machine learning, GIS and open datasets from UN and scientific sources. It generates high-resolution vulnerability maps and interactive visualizations.

## Core capabilities

- Automated data collection and processing
- Machine learning vulnerability analysis
- High-resolution GIS mapping
- Customizable risk and threat assessment
- Interactive vulnerability explorer
- Open data integration

## Best fit for

- Government agencies
- Disaster management authorities
- Development partners
- Humanitarian organizations
- Research institutions`,
    project_status: 'active',
    deployment_status: 'internal',
    is_deployed: false,
    is_featured: true,
    image_url: null,
    sdgs: [10, 11, 13, 17],
    is_sample: true,
    display_order: 4,
    status: 'published',
    published_at: null,
    created_at: '',
    updated_at: '',
    best_fit: ['Government Agencies', 'Humanitarian Organizations', 'Research Institutions'],
    core_capabilities: ['GIS mapping', 'Vulnerability analysis', 'Risk assessment'],
  },
  {
    id: 'demo-land-use',
    title: 'Land Use Analysis Tool',
    slug: 'land-use-analysis-tool',
    impact_area: 'GIS / Remote Sensing',
    timeline: '6-18 months',
    summary: 'A GIS and AI-powered platform for spatial analytics, predictive modeling and sustainable land-management planning.',
    description: `> **Project profile:** An applied AI solution from the SDG AI Lab portfolio.

## The problem

Understanding changing land use requires large volumes of spatial data. Decision-makers need reliable evidence to evaluate land-management strategies and future development scenarios.

## Our solution

The tool combines GIS, machine learning and predictive analytics to deliver spatial analysis, scenario modeling and interactive planning support.

## Core capabilities

- Comprehensive spatial analysis
- Predictive land use modeling
- Scenario modeling
- Interactive web platform
- AI and machine-learning analytics
- Sustainable land-management support`,
    project_status: 'under_development',
    deployment_status: 'prototype',
    is_deployed: false,
    is_featured: false,
    image_url: null,
    sdgs: [11, 13, 15, 17],
    is_sample: true,
    display_order: 5,
    status: 'published',
    published_at: null,
    created_at: '',
    updated_at: '',
    best_fit: ['Planning Authorities', 'Environmental Agencies', 'Development Partners'],
    core_capabilities: ['Spatial analysis', 'Predictive modeling', 'Scenario planning'],
  },
  {
    id: 'demo-madagascar-ews',
    title: 'Madagascar Multi-Hazard Early Warning System',
    slug: 'madagascar-multi-hazard-early-warning-system',
    impact_area: 'Resilience',
    timeline: '6-15 months',
    summary: 'An integrated early warning platform for droughts, floods, cyclones, landslides and epidemics in one system.',
    description: `> **Project profile:** An applied AI solution from the SDG AI Lab portfolio.

## The problem

Hazard information is often dispersed across multiple systems and institutions. Delayed risk information reduces preparedness, response capacity and targeted intervention.

## Our solution

The platform integrates multi-source hazard data, predictive analytics and interactive mapping into a single dashboard for disaster preparedness and humanitarian coordination.

## Core capabilities

- Multi-hazard monitoring
- Interactive GIS mapping
- Time-series visualization
- Socio-economic and vulnerability analysis
- Risk reports and alerts
- Multilingual interface`,
    project_status: 'active',
    deployment_status: 'prototype',
    is_deployed: false,
    is_featured: false,
    image_url: null,
    sdgs: [11, 13, 17],
    is_sample: true,
    display_order: 6,
    status: 'published',
    published_at: null,
    created_at: '',
    updated_at: '',
    best_fit: ['Disaster Management Agencies', 'UN Agencies', 'Humanitarian Organizations'],
    core_capabilities: ['Multi-hazard monitoring', 'GIS mapping', 'Risk alerts'],
  },
  {
    id: 'demo-tech4r',
    title: 'Tech4R â€” Tech Volunteers for Resilience',
    slug: 'tech4r-tech-volunteers-for-resilience',
    impact_area: 'Resilience',
    timeline: '6-15 months',
    summary: 'A global network of tech volunteers ready to mobilize reliable digital solutions during emergencies.',
    description: `> **Project profile:** An applied AI solution from the SDG AI Lab portfolio.

## The challenge

When disasters strike, humanitarian teams need digital tools quickly. Tech volunteers can be scattered across platforms, local capacity may be limited and emergency-built tools can be abandoned after the crisis.

## Our approach

Tech4R mobilizes a trained global community of tech volunteers who can deploy tailored digital tools within hours of a crisis in partnership with UN Volunteers.

## What we do

- Mobilize volunteers
- Build custom tools
- Respond immediately
- Maintain and sustain solutions
- Train communities
- Enable low-code and no-code builds

## Impact

Source materials reference 100 volunteers, 20 solutions and 10 countries across the initiative.`,
    project_status: 'active',
    deployment_status: 'internal',
    is_deployed: false,
    is_featured: false,
    image_url: null,
    sdgs: [11, 13, 17],
    is_sample: true,
    display_order: 7,
    status: 'published',
    published_at: null,
    created_at: '',
    updated_at: '',
    best_fit: ['UN Volunteers', 'Humanitarian Organizations', 'Tech Volunteers'],
    core_capabilities: ['Volunteer mobilization', 'Low-code builds', 'Crisis response'],
  },
  {
    id: 'demo-innovation-campus',
    title: 'Innovation Campus',
    slug: 'innovation-campus',
    impact_area: 'Digital Skills Development',
    timeline: '3-12 months',
    summary: 'A global education initiative in AI, IoT, Big Data and coding aligned with the Sustainable Development Goals.',
    description: `> **Programme profile:** A capacity-building initiative from the SDG AI Lab portfolio.

## The programme

Innovation Campus equips youth with skills in AI, IoT, Big Data and programming through practical learning and real-world capstone projects.

## Impact at a glance

- 436 graduates
- 90% employment rate
- 52% female participation
- 11 phases delivered since 2019

## Key achievements

- Real-world capstone projects
- International media recognition
- Featured in CSR reports
- Strong industry partnerships`,
    project_status: 'completed',
    deployment_status: 'live',
    is_deployed: true,
    is_featured: false,
    image_url: null,
    sdgs: [4, 5, 8, 9, 17],
    is_sample: true,
    display_order: 8,
    status: 'published',
    published_at: null,
    created_at: '',
    updated_at: '',
    best_fit: ['Youth', 'Education Partners', 'Private-sector Partners'],
    core_capabilities: ['AI training', 'Capstone projects', 'Employment pathways'],
  },
  {
    id: 'demo-frontier-leaders',
    title: 'Frontier & Future Tech Leaders Programmes',
    slug: 'frontier-future-tech-leaders-programmes',
    impact_area: 'Digital Skills Development',
    timeline: '3-12 months',
    summary: 'Programmes empowering youth from least developed and developing countries with frontier-tech and leadership skills.',
    description: `> **Programme profile:** A capacity-building initiative from the SDG AI Lab portfolio.

## The programme

The programmes build skills in machine learning, data science for SDGs, leadership and entrepreneurship.

## Impact at a glance

- 463 tech leaders trained
- 17 LDCs reached
- 54% women participation
- 580+ people trained through graduates
- 66 SDG-focused capstone projects

## Key achievements

- Community activities in 6 countries
- 2 graduates hired at SDG AI Lab
- Tech talent pipeline across LDCs`,
    project_status: 'active',
    deployment_status: 'live',
    is_deployed: true,
    is_featured: false,
    image_url: null,
    sdgs: [4, 5, 8, 9, 17],
    is_sample: true,
    display_order: 9,
    status: 'published',
    published_at: null,
    created_at: '',
    updated_at: '',
    best_fit: ['Youth', 'LDCs', 'Digital Skills Partners'],
    core_capabilities: ['Machine learning', 'Leadership', 'Entrepreneurship'],
  },
];

export const samplePortfolioProjects = demoDayProjects;

export const sampleFeaturedProjects: FeaturedProjectCard[] = demoDayProjects.filter((project) => project.is_featured);

export const sampleNews: NewsListItem[] = [
  {
    id: 'sample-research',
    title: 'From AI experiments to responsible development practice',
    slug: 'responsible-development-practice',
    summary:
      'Research notes, methods and lessons from applied AI work across the development sector. Applied AI work is most useful when teams share not only successful outputs, but also methods, limitations and lessons from the lab and its partners.',
    featured_image_url: null,
    author_name: 'SDG AI Lab',
    publish_date: '2026-01-15',
  },
  {
    id: 'sample-collective-rnd',
    title: 'Collective R&D: A Practice Guide for Sustainable Development',
    slug: 'collective-rnd-practice-guide',
    summary: null,
    featured_image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80',
    author_name: 'SDG AI Lab',
    publish_date: '2025-12-10',
  },
  {
    id: 'sample-ai-human-dev',
    title: 'AI and Human Development: A Qualitative Perspective from Bangladesh',
    slug: 'ai-human-development-bangladesh',
    summary: null,
    featured_image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
    author_name: 'SDG AI Lab',
    publish_date: '2025-11-06',
  },
];

export const samplePublications = sampleNews;

export const samplePartners: PartnerLogo[] = [
  { id: 'sample-undp', name: 'UNDP', logo_url: null, website_url: 'https://www.undp.org/', display_order: 1 },
  { id: 'sample-unv', name: 'UN Volunteers', logo_url: null, website_url: 'https://www.unv.org/', display_order: 2 },
  { id: 'sample-gef', name: 'Global Environment Facility', logo_url: null, website_url: 'https://www.thegef.org/', display_order: 3 },
  { id: 'sample-cbi', name: 'Connecting Business initiative', logo_url: null, website_url: 'https://www.connectingbusiness.org/', display_order: 4 },
];

const samplePageContentBodies: Record<string, Record<string, string>> = {
  about: {
    'about-sdgailab': `The SDG AI Lab was established in 2019 and is one of UNDP's specialized AI units. It is a joint initiative of the UNDP BPPS Data, AI & Innovation Hub and the Sustainable Finance Hub, hosted under ICPSD and based in Istanbul, Türkiye. The Lab advances frontier technologies for sustainable development through development, research, advisory, training and community-building services.`,
    'our-approach':
      'The SDG AI Lab provides a one-stop solution approach for AI/ML advisory and research support. We utilize an agile, gig-based approach to leverage global talent for sustainable development goals.',
  },
  volunteer: {
    main: `## Volunteer Data Scientist Initiative

The UNV-ICPSD Digital Transformation Partnership brings together volunteer data scientists from around the world to contribute to sustainable development through AI and machine learning. Volunteers work on real-world projects that support UNDP's mission.

### How It Works

- **Apply**: Submit your application through the UN Volunteers platform
- **Match**: Get matched to projects based on your skills
- **Contribute**: Work remotely on meaningful data science projects
- **Impact**: Help advance the Sustainable Development Goals`,
  },
};

export function getSamplePageContent(pageSlug: string, sectionSlug: string): string | null {
  return samplePageContentBodies[pageSlug]?.[sectionSlug] ?? null;
}

export function getSampleProject(slug: string): SampleProject | null {
  return samplePortfolioProjects.find((project) => project.slug === slug) ?? null;
}

export function getSampleNewsArticle(slug: string): NewsArticle | null {
  const item = sampleNews.find((article) => article.slug === slug);
  if (!item) return null;
  return {
    ...item,
    body: `> **Publication:** Research notes, methods and lessons from applied AI work across the development sector.

## Why this matters

Applied AI work is most useful when teams share not only successful outputs, but also methods, limitations and lessons. This space is designed for research notes, publications and practical guidance from the lab and its partners.

## What a complete publication should include

- The development challenge and intended audience
- Methods, data sources and responsible-use safeguards
- Findings, limitations and evidence of outcomes
- Links to papers, code, datasets or reusable tools

Future articles can use this structure to make the lab's work easier to discover, assess and build upon.`,
    status: 'published',
    published_at: null,
    created_at: '',
    updated_at: '',
  };
}
