export type PageSectionKind = 'text' | 'lines' | 'rich';

export interface PageSectionDef {
  pageSlug: string;
  pageLabel: string;
  sectionSlug: string;
  label: string;
  kind: PageSectionKind;
  /** Current public copy. Lists and line breaks use newline-separated text. Rich text may use **bold**. */
  fallback: string;
}

export const PAGE_SECTIONS: PageSectionDef[] = [
  {
    pageSlug: 'home',
    pageLabel: 'Home',
    sectionSlug: 'hero-title',
    label: 'Hero title',
    kind: 'lines',
    fallback: 'Digital technologies\nfor the\nSustainable\nDevelopment Goals.',
  },
  {
    pageSlug: 'home',
    pageLabel: 'Home',
    sectionSlug: 'hero-intro',
    label: 'Hero introduction',
    kind: 'text',
    fallback:
      'The SDG AI Lab helps UNDP units and development partners turn emerging technologies into practical solutions for real-world development challenges.',
  },
  {
    pageSlug: 'home',
    pageLabel: 'Home',
    sectionSlug: 'hero-note',
    label: 'Hero note',
    kind: 'rich',
    fallback:
      'A joint initiative of the **UNDP BPPS Data, AI & Innovation Hub** and the **Sustainable Finance Hub**, hosted under ICPSD.',
  },
  {
    pageSlug: 'home',
    pageLabel: 'Home',
    sectionSlug: 'mission',
    label: 'Mission statement',
    kind: 'rich',
    fallback:
      "We believe technology only counts once it's **running inside the institution that owns the problem.**",
  },
  {
    pageSlug: 'home',
    pageLabel: 'Home',
    sectionSlug: 'partners-heading',
    label: 'Partners heading',
    kind: 'text',
    fallback: 'Who we build with.',
  },
  {
    pageSlug: 'about',
    pageLabel: 'About',
    sectionSlug: 'intro-heading',
    label: 'Intro heading',
    kind: 'lines',
    fallback: 'Seven years of building\nAI and data tools inside\ngovernment',
  },
  {
    pageSlug: 'about',
    pageLabel: 'About',
    sectionSlug: 'intro-body',
    label: 'Intro text',
    kind: 'text',
    fallback:
      'A joint initiative of the UNDP BPPS Data, AI & Innovation Hub and the Sustainable Finance Hub, hosted under ICPSD and based in Istanbul. Since 2019 the Lab has shipped Geographic Information Systems (GIS), Natural Language Processing (NLP) and digital-skills products that country offices and national institutions run themselves — not one-off pilots left behind after the mission ends.',
  },
  {
    pageSlug: 'about',
    pageLabel: 'About',
    sectionSlug: 'pillars-heading',
    label: 'Pillars heading',
    kind: 'lines',
    fallback: "A small senior team\nwith UNDP’s network\nbehind it",
  },
  {
    pageSlug: 'about',
    pageLabel: 'About',
    sectionSlug: 'pillars-intro',
    label: 'Pillars introduction',
    kind: 'text',
    fallback:
      'We work the way a product team does — fast, focused, accountable — inside the world’s largest development network.',
  },
  {
    pageSlug: 'about',
    pageLabel: 'About',
    sectionSlug: 'pillar-1-title',
    label: 'Pillar 1 title',
    kind: 'text',
    fallback: 'Built inside UNDP',
  },
  {
    pageSlug: 'about',
    pageLabel: 'About',
    sectionSlug: 'pillar-1-body',
    label: 'Pillar 1 text',
    kind: 'text',
    fallback:
      'Part of the BPPS Data, AI & Innovation Hub and the Sustainable Finance Hub, hosted under ICPSD in Istanbul.',
  },
  {
    pageSlug: 'about',
    pageLabel: 'About',
    sectionSlug: 'pillar-2-title',
    label: 'Pillar 2 title',
    kind: 'text',
    fallback: 'Shipped, not piloted',
  },
  {
    pageSlug: 'about',
    pageLabel: 'About',
    sectionSlug: 'pillar-2-body',
    label: 'Pillar 2 text',
    kind: 'text',
    fallback:
      'Tools that country offices and national institutions run themselves — maintained, documented and handed over, not left behind.',
  },
  {
    pageSlug: 'about',
    pageLabel: 'About',
    sectionSlug: 'pillar-3-title',
    label: 'Pillar 3 title',
    kind: 'text',
    fallback: 'For governments, by practitioners',
  },
  {
    pageSlug: 'about',
    pageLabel: 'About',
    sectionSlug: 'pillar-3-body',
    label: 'Pillar 3 text',
    kind: 'text',
    fallback:
      'A compact senior team of data scientists, engineers and GIS specialists working directly with country offices.',
  },
  {
    pageSlug: 'about',
    pageLabel: 'About',
    sectionSlug: 'pillar-4-title',
    label: 'Pillar 4 title',
    kind: 'text',
    fallback: 'From pilot to mainstream',
  },
  {
    pageSlug: 'about',
    pageLabel: 'About',
    sectionSlug: 'pillar-4-body',
    label: 'Pillar 4 text',
    kind: 'text',
    fallback:
      'One product line at a time, then several running in parallel — a repeatable path from first use case to country-wide practice.',
  },
  {
    pageSlug: 'about',
    pageLabel: 'About',
    sectionSlug: 'team-heading',
    label: 'Team heading',
    kind: 'text',
    fallback: 'Built by the SDG AI Lab team',
  },
  {
    pageSlug: 'about',
    pageLabel: 'About',
    sectionSlug: 'team-body',
    label: 'Team text',
    kind: 'text',
    fallback:
      'A compact team of data scientists, engineers and GIS specialists working directly with UNDP country offices and national partners.',
  },
  {
    pageSlug: 'about',
    pageLabel: 'About',
    sectionSlug: 'team-link',
    label: 'Team link label',
    kind: 'text',
    fallback: 'Meet the full team →',
  },
  {
    pageSlug: 'about',
    pageLabel: 'About',
    sectionSlug: 'cta-heading',
    label: 'Call to action heading',
    kind: 'text',
    fallback: 'Have a development challenge?',
  },
  {
    pageSlug: 'about',
    pageLabel: 'About',
    sectionSlug: 'cta-body',
    label: 'Call to action text',
    kind: 'text',
    fallback: 'Tell us what you’re trying to solve — we’ll tell you honestly whether we can help.',
  },
  {
    pageSlug: 'expertise',
    pageLabel: 'Expertise',
    sectionSlug: 'heading',
    label: 'Page heading',
    kind: 'text',
    fallback: 'Our areas of expertise — delivering solutions across six domains.',
  },
  {
    pageSlug: 'expertise',
    pageLabel: 'Expertise',
    sectionSlug: 'nlp-title',
    label: 'NLP title',
    kind: 'text',
    fallback: 'Natural Language Processing',
  },
  {
    pageSlug: 'expertise',
    pageLabel: 'Expertise',
    sectionSlug: 'nlp-body',
    label: 'NLP text',
    kind: 'text',
    fallback:
      'Agentic AI and machine learning that turn complex public data into actionable insight — supporting transparency and decision-making across government sectors.',
  },
  {
    pageSlug: 'expertise',
    pageLabel: 'Expertise',
    sectionSlug: 'nlp-items',
    label: 'NLP examples',
    kind: 'lines',
    fallback:
      'AI for Tourism Platform\nPublic Finance Simplification App\nAudit Recommendation Tracking Tool\nSupTech for Fair Digital Finance\nAI-Powered Knowledge Base\nUNDP CPD Analyzer\nUN Social Listening',
  },
  {
    pageSlug: 'expertise',
    pageLabel: 'Expertise',
    sectionSlug: 'gis-title',
    label: 'GIS title',
    kind: 'text',
    fallback: 'GIS / Remote Sensing',
  },
  {
    pageSlug: 'expertise',
    pageLabel: 'Expertise',
    sectionSlug: 'gis-body',
    label: 'GIS text',
    kind: 'text',
    fallback:
      'Satellite imagery and geospatial intelligence for climate resilience and sustainable development, from vulnerability mapping to land-use forecasting.',
  },
  {
    pageSlug: 'expertise',
    pageLabel: 'Expertise',
    sectionSlug: 'gis-items',
    label: 'GIS examples',
    kind: 'lines',
    fallback:
      'Illegal Dumpsites Detection\nDeforestation Monitoring & Prediction\nDigital Social Vulnerability Index\nAdvanced Land Use Analysis\nCoral Reef Health Monitoring & Insurance',
  },
  {
    pageSlug: 'expertise',
    pageLabel: 'Expertise',
    sectionSlug: 'skills-title',
    label: 'Digital skills title',
    kind: 'text',
    fallback: 'Digital Skills Development',
  },
  {
    pageSlug: 'expertise',
    pageLabel: 'Expertise',
    sectionSlug: 'skills-body',
    label: 'Digital skills text',
    kind: 'text',
    fallback:
      'Capacity-building programmes equipping youth and professionals with AI, data science and entrepreneurship skills through hands-on fellowships.',
  },
  {
    pageSlug: 'expertise',
    pageLabel: 'Expertise',
    sectionSlug: 'skills-items',
    label: 'Digital skills examples',
    kind: 'lines',
    fallback:
      'Frontier & Future Tech Leaders Programme\nInnovation Campus\nGame Development Bootcamps\nData Science Fellowship\nVolunteer Data Scientists Initiative\nDigital Solutions for SDGs (DS4SDGs)',
  },
  {
    pageSlug: 'expertise',
    pageLabel: 'Expertise',
    sectionSlug: 'resilience-title',
    label: 'Resilience title',
    kind: 'text',
    fallback: 'Resilience',
  },
  {
    pageSlug: 'expertise',
    pageLabel: 'Expertise',
    sectionSlug: 'resilience-body',
    label: 'Resilience text',
    kind: 'text',
    fallback:
      'Disaster management and response tech — early warnings, real-time data, and coordinated volunteer support to save lives and reduce impact.',
  },
  {
    pageSlug: 'expertise',
    pageLabel: 'Expertise',
    sectionSlug: 'resilience-items',
    label: 'Resilience examples',
    kind: 'lines',
    fallback:
      'Frontier Technologies Radar for DRR (FTR4DRR)\nTech Volunteers for Resilience (Tech4R)\nMadagascar Multi-Hazard Early Warning System\nEarthquake Safety Routing',
  },
  {
    pageSlug: 'expertise',
    pageLabel: 'Expertise',
    sectionSlug: 'fintech-title',
    label: 'FinTech title',
    kind: 'text',
    fallback: 'FinTech & Digital Finance',
  },
  {
    pageSlug: 'expertise',
    pageLabel: 'Expertise',
    sectionSlug: 'fintech-body',
    label: 'FinTech text',
    kind: 'text',
    fallback:
      'AI and supervisory technology that make financial services more accessible, supporting regulators on consumer protection and inclusion.',
  },
  {
    pageSlug: 'expertise',
    pageLabel: 'Expertise',
    sectionSlug: 'fintech-items',
    label: 'FinTech examples',
    kind: 'lines',
    fallback:
      'SupTech for Fair Digital Finance\nPublic Finance Simplification App\nAudit Recommendation Tracking Tool',
  },
  {
    pageSlug: 'expertise',
    pageLabel: 'Expertise',
    sectionSlug: 'advisory-title',
    label: 'Research & advisory title',
    kind: 'text',
    fallback: 'Research & Advisory',
  },
  {
    pageSlug: 'expertise',
    pageLabel: 'Expertise',
    sectionSlug: 'advisory-body',
    label: 'Research & advisory text',
    kind: 'text',
    fallback:
      'Technical assessments, white papers, digital solution development, and private-sector partnership facilitation.',
  },
  {
    pageSlug: 'expertise',
    pageLabel: 'Expertise',
    sectionSlug: 'advisory-items',
    label: 'Research & advisory examples',
    kind: 'lines',
    fallback:
      'Academic Papers & White Papers\nProject Briefs & Terms of Reference\nOpen Datasets\nPartnership Agreements',
  },
  {
    pageSlug: 'expertise',
    pageLabel: 'Expertise',
    sectionSlug: 'examples-heading',
    label: 'Examples heading',
    kind: 'text',
    fallback: "What some of this looks like once it's running.",
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'heading',
    label: 'Page heading',
    kind: 'text',
    fallback: 'What a partner can commission from the Lab.',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'intro',
    label: 'Page introduction',
    kind: 'text',
    fallback: 'Eight practice areas, from AI development to volunteer talent — mixed and matched per engagement.',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'offer-ai-title',
    label: 'AI offer title',
    kind: 'text',
    fallback: 'Artificial Intelligence',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'offer-ai-items',
    label: 'AI offer items',
    kind: 'lines',
    fallback:
      'Machine learning solutions\nLLM fine-tuning, prompt engineering, RAG, adapters\nAgentic AI systems and multi-agent architectures\nSentiment analysis',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'offer-geo-title',
    label: 'Geospatial offer title',
    kind: 'text',
    fallback: 'Geospatial Solutions',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'offer-geo-items',
    label: 'Geospatial offer items',
    kind: 'lines',
    fallback: 'GeoAI services\nGIS mapping platforms\nMaps generation',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'offer-data-title',
    label: 'Data science offer title',
    kind: 'text',
    fallback: 'Data Science Solutions',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'offer-data-items',
    label: 'Data science offer items',
    kind: 'lines',
    fallback:
      'Custom data visualization dashboards\nPower BI dashboards\nData collection, cleaning and processing',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'offer-apps-title',
    label: 'Apps offer title',
    kind: 'text',
    fallback: 'Web & Mobile Applications',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'offer-apps-items',
    label: 'Apps offer items',
    kind: 'lines',
    fallback: 'Web platform development\nPower Platform solutions\nChatbots and agents\nMobile apps',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'offer-skills-title',
    label: 'Skills offer title',
    kind: 'text',
    fallback: 'AI Solutions for Skills',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'offer-skills-items',
    label: 'Skills offer items',
    kind: 'lines',
    fallback:
      'Digital Solutions for SDGs (DS4SDGs) MOOC\nAI job-matching solutions\nMentorship and career coaching\nGamification of skills development',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'offer-research-title',
    label: 'Research offer title',
    kind: 'text',
    fallback: 'Research & Advisory',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'offer-research-items',
    label: 'Research offer items',
    kind: 'lines',
    fallback:
      'Academic research and insights\nMethodology and framework development\nTechnical ToRs and scoping documents\nReview of digital technologies\nAI audit',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'offer-community-title',
    label: 'Community offer title',
    kind: 'text',
    fallback: 'Community',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'offer-community-items',
    label: 'Community offer items',
    kind: 'lines',
    fallback: 'SDG AI Lab Fellowship\nVolunteer management\nVolunteer Data Scientists\nTech4R community',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'offer-domain-title',
    label: 'Domain expertise title',
    kind: 'text',
    fallback: 'Domain Expertise',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'offer-domain-items',
    label: 'Domain expertise items',
    kind: 'lines',
    fallback: 'Resilience\nFinTech / SupTech\nTourism\nEntrepreneurship\nLow-code / no-code',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'approach-heading',
    label: 'Approach heading',
    kind: 'text',
    fallback: 'Agile, aligned with UNDP practice, enhanced by AI.',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'approach-intro',
    label: 'Approach introduction',
    kind: 'text',
    fallback:
      "Every engagement runs the same way, whether it's a two-week diagnostic or a year-long build: short cycles, work reviewed inside the counterpart institution as it happens, and a handover the team can actually operate without us.",
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'approach-1-title',
    label: 'Approach 1 title',
    kind: 'text',
    fallback: 'Agile Software Development',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'approach-1-body',
    label: 'Approach 1 text',
    kind: 'text',
    fallback:
      'Short, iterative builds tested against the conditions a government system actually runs in — patchy connectivity, incomplete records, non-technical end users.',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'approach-2-title',
    label: 'Approach 2 title',
    kind: 'text',
    fallback: 'Aligned with UNDP Best Practices',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'approach-2-body',
    label: 'Approach 2 text',
    kind: 'text',
    fallback:
      "Every deployment fits inside UNDP's standards for data, procurement, and partner handover, so the counterpart team can actually run it once we're gone.",
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'approach-3-title',
    label: 'Approach 3 title',
    kind: 'text',
    fallback: 'Enhanced by AI',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'approach-3-body',
    label: 'Approach 3 text',
    kind: 'text',
    fallback:
      'Agentic AI and machine learning applied where they remove real friction for the institutions we build with.',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'cta-heading',
    label: 'Call to action heading',
    kind: 'text',
    fallback: 'Have a challenge in mind?',
  },
  {
    pageSlug: 'services',
    pageLabel: 'Services',
    sectionSlug: 'cta-body',
    label: 'Call to action text',
    kind: 'text',
    fallback: 'Tell us what you’re trying to solve — we’ll tell you honestly whether we can help.',
  },
  {
    pageSlug: 'projects',
    pageLabel: 'Solutions',
    sectionSlug: 'heading',
    label: 'Page heading',
    kind: 'text',
    fallback: '{count}, seven years of delivery.',
  },
  {
    pageSlug: 'projects',
    pageLabel: 'Solutions',
    sectionSlug: 'intro',
    label: 'Page introduction',
    kind: 'text',
    fallback:
      'Explore a range of projects addressing real-world challenges across different focus areas. Each case highlights the problem, the solution delivered, and where it runs. Filter by focus area, country or year, then open a card to explore the full story.',
  },
  {
    pageSlug: 'research',
    pageLabel: 'Research',
    sectionSlug: 'heading',
    label: 'Page heading',
    kind: 'text',
    fallback: 'Key outputs from technical assessments, advisory work, and partnership facilitation.',
  },
  {
    pageSlug: 'research',
    pageLabel: 'Research',
    sectionSlug: 'intro',
    label: 'Page introduction',
    kind: 'text',
    fallback:
      'Explore the Lab’s outputs across technical assessments, advisory work, and partnership facilitation. Filter by format or year to focus on the materials most relevant to your work.',
  },
  {
    pageSlug: 'team',
    pageLabel: 'Team',
    sectionSlug: 'heading',
    label: 'Page heading',
    kind: 'text',
    fallback: 'Six working groups, one lab.',
  },
  {
    pageSlug: 'contact',
    pageLabel: 'Contact',
    sectionSlug: 'heading',
    label: 'Page heading',
    kind: 'text',
    fallback: 'Leave a request, or just email us directly.',
  },
  {
    pageSlug: 'contact',
    pageLabel: 'Contact',
    sectionSlug: 'intro',
    label: 'Page introduction',
    kind: 'text',
    fallback: 'Tell us what you’re trying to solve and we’ll follow up.',
  },
  {
    pageSlug: 'contact',
    pageLabel: 'Contact',
    sectionSlug: 'ways-label',
    label: 'Sidebar label',
    kind: 'text',
    fallback: 'Ways to work with us',
  },
  {
    pageSlug: 'contact',
    pageLabel: 'Contact',
    sectionSlug: 'ways-items',
    label: 'Ways to work with us',
    kind: 'lines',
    fallback:
      'Co-develop AI, GIS and data tools with our development team\nCommission research, white papers or technical advisory\nTrain your staff through bootcamps and fellowships\nRecruit vetted AI, data science and GIS talent',
  },
];

export function pageOptions(): Array<{ slug: string; label: string }> {
  const seen = new Map<string, string>();
  for (const section of PAGE_SECTIONS) {
    if (!seen.has(section.pageSlug)) seen.set(section.pageSlug, section.pageLabel);
  }
  return Array.from(seen, ([slug, label]) => ({ slug, label }));
}

export function sectionsForPage(pageSlug: string): PageSectionDef[] {
  return PAGE_SECTIONS.filter((section) => section.pageSlug === pageSlug);
}

export function findPageSection(pageSlug: string, sectionSlug: string): PageSectionDef | undefined {
  return PAGE_SECTIONS.find(
    (section) => section.pageSlug === pageSlug && section.sectionSlug === sectionSlug
  );
}

export function sectionFallback(pageSlug: string, sectionSlug: string): string {
  return findPageSection(pageSlug, sectionSlug)?.fallback ?? '';
}

export function sectionLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}
