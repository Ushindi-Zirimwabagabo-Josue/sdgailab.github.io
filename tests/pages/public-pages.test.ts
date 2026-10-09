import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

function readSource(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8');
}

describe('Public Astro pages', () => {
  it('news index composes the NewsList island', () => {
    const source = readSource('src/pages/news/index.astro');
    expect(source).toContain('BaseLayout');
    expect(source).toContain('NewsList');
    expect(source).toContain('client:load');
  });

  it('projects index composes the CMS-driven portfolio island', () => {
    const source = readSource('src/pages/projects/index.astro');
    expect(source).toContain('BaseLayout');
    expect(source).toContain('PortfolioGrid');
    expect(source).toContain('client:load');
    expect(source).not.toContain('23 products, seven years of delivery.');
    expect(source).toContain('signature programmes');
    expect(source).not.toContain('Featured initiative: Tech4R');
  });

  it('tech4r page presents the featured resilience initiative', () => {
    const source = readSource('src/pages/tech4r.astro');
    expect(source).toContain('Tech4R: Technology for Rescue, Response, Recovery and Resilience');
    expect(source).toContain('Software planning and design');
    expect(source).toContain('Ecosystem facilitation');
    expect(source).toContain('https://tech4r.org/');
  });

  it('team page follows the Marina team layout', () => {
    const source = readSource('src/pages/team.astro');
    expect(source).toContain('marina-team-page');
    expect(source).toContain('Six working groups');
    expect(source).toContain('person-avatar');
    expect(source).toContain('TeamRoster');
  });

  it('contact page uses Marina mailto request form', () => {
    const source = readSource('src/pages/contact.astro');
    expect(source).toContain('mailto:dina.akylbekova@undp.org');
    expect(source).toContain('nothing is stored on this site');
  });

  it('about page uses the shared base layout and Marina about structure', () => {
    const source = readSource('src/pages/about.astro');
    expect(source).toContain('BaseLayout');
    expect(source).toContain('marina-about');
    expect(source).toContain('Seven years of building');
    expect(source).toContain('AI and data tools inside');
  });

  it('volunteer page uses the shared base layout', () => {
    const source = readSource('src/pages/volunteer.astro');
    expect(source).toContain('BaseLayout');
  });

  it('404 page provides a recovery link', () => {
    const source = readSource('src/pages/404.astro');
    expect(source).toContain('404');
    expect(source).toContain('withBase');
  });

  it('news detail page composes the NewsDetail island', () => {
    const source = readSource('src/pages/news/detail.astro');
    expect(source).toContain('NewsDetail');
    expect(source).toContain('client:load');
  });

  it('project detail page composes the ProjectDetail island', () => {
    const source = readSource('src/pages/projects/detail.astro');
    expect(source).toContain('ProjectDetail');
    expect(source).toContain('client:load');
  });

  it('launch-readiness page is a noindex internal review tracker', () => {
    const source = readSource('src/pages/launch-readiness.astro');
    expect(source).toContain('BaseLayout');
    expect(source).toContain('noindex={true}');
    expect(source).toContain('aria-labelledby="criteria-heading"');
    expect(source).toContain('withBase');
  });

  it('services page exposes requestable support pathways', () => {
    const source = readSource('src/pages/services.astro');
    expect(source).toContain('BaseLayout');
    expect(source).toContain('What a partner can commission from the Lab.');
    expect(source).toContain('offer-grid');
    expect(source).toContain('Artificial Intelligence');
    expect(source).toContain('Agile, aligned with UNDP practice, enhanced by AI.');
  });

  it('about page includes Marina evolution, team, figures, and CTA sections', () => {
    const source = readSource('src/pages/about.astro');
    expect(source).toContain('marina-about-timeline');
    expect(source).toContain('marina-about-team');
    expect(source).toContain('marina-about-pillars');
    expect(source).toContain('Have a development challenge?');
  });

  it('publications page is reserved for publication content only', () => {
    const source = readSource('src/pages/resources.astro');
    expect(source).toContain('BaseLayout');
    expect(source).toContain('Publications - SDG AI Lab');
    expect(source).toContain('PublicationsList');
    expect(source).not.toContain('Knowledge hub');
    expect(source).not.toContain("withBase('/news')");
    expect(source).not.toContain("withBase('/projects')");
  });

  it('research page exposes research and advisory content', () => {
    const source = readSource('src/pages/research.astro');
    expect(source).toContain('Research & Advisory - SDG AI Lab');
    expect(source).toContain('Key outputs from technical assessments');
    expect(source).toContain('marina-research');
    expect(source).toContain('research-intro');
    expect(source).toContain('ResearchOutputs');
  });

  it('expertise page exposes Marina expertise domains', () => {
    const source = readSource('src/pages/expertise.astro');
    expect(source).toContain('marina-focus-page');
    expect(source).toContain('Our areas of expertise');
    expect(source).toContain('Natural Language Processing');
    expect(source).toContain('GIS / Remote Sensing');
  });

  it('how-we-work page remains a published public route', () => {
    const source = readSource('src/pages/how-we-work.astro');
    expect(source).toContain('BaseLayout');
  });

  it('capacity building page exposes learning pathways, not volunteer-only content', () => {
    const source = readSource('src/pages/capacity-building.astro');
    expect(source).toContain('Capacity building');
    expect(source).toContain('Training, mentorship');
    expect(source).toContain("withBase('/volunteer')");
  });

  it('programmes page follows Marina’s three-cohort layout', () => {
    const source = readSource('src/pages/programmes.astro');
    expect(source).toContain('Where digital skills training actually lands.');
    expect(source).toContain('prog-ftl.jpg');
    expect(source).toContain('prog-innovation-campus-ad.jpg');
    expect(source).toContain('prog-gamedev.jpg');
    expect(source).toContain("withBase('/projects')");
  });
});
