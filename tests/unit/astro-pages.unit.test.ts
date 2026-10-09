import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

function readSource(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8');
}

const pageSources: { path: string; checks: (source: string) => void }[] = [
  {
    path: 'src/pages/index.astro',
    checks: (source) => {
      expect(source).toContain('BaseLayout');
      expect(source).toContain('marina-live-hero');
      expect(source).toContain('Digital technologies');
      expect(source).toContain('impactStats');
      expect(source).toContain('PartnerLogos');
      expect(source).toContain('marina-live-gallery');
    },
  },
  {
    path: 'src/pages/admin.astro',
    checks: (source) => {
      expect(source).toContain('AdminApp');
      expect(source).toContain('client:only="react"');
      expect(source).toContain("'unsafe-inline'");
    },
  },
  {
    path: 'src/pages/about.astro',
    checks: (source) => {
      expect(source).toContain('BaseLayout');
      expect(source).toContain('marina-about');
      expect(source).toContain('Seven years of building');
      expect(source).toContain('marina-about-timeline');
      expect(source).toContain('marina-about-team');
      expect(source).toContain('Have a development challenge?');
    },
  },
  {
    path: 'src/pages/contact.astro',
    checks: (source) => {
      expect(source).toContain('mailto:dina.akylbekova@undp.org');
      expect(source).toContain('BaseLayout');
    },
  },
  {
    path: 'src/pages/team.astro',
    checks: (source) => {
      expect(source).toContain('marina-team-page');
      expect(source).toContain('Six working groups');
      expect(source).toContain('person-avatar');
      expect(source).toContain('TeamRoster');
    },
  },
  {
    path: 'src/pages/volunteer.astro',
    checks: (source) => {
      expect(source).toContain('BaseLayout');
    },
  },
  {
    path: 'src/pages/404.astro',
    checks: (source) => {
      expect(source).toContain('404');
      expect(source).toContain('withBase');
    },
  },
  {
    path: 'src/pages/news/index.astro',
    checks: (source) => {
      expect(source).toContain('NewsList');
      expect(source).toContain('client:load');
    },
  },
  {
    path: 'src/pages/news/detail.astro',
    checks: (source) => {
      expect(source).toContain('NewsDetail');
      expect(source).toContain('client:load');
    },
  },
  {
    path: 'src/pages/projects/index.astro',
    checks: (source) => {
      expect(source).toContain('PortfolioGrid');
      expect(source).toContain('client:load');
      expect(source).not.toContain('23 products, seven years of delivery.');
      expect(source).toContain('signature programmes');
    },
  },
  {
    path: 'src/pages/tech4r.astro',
    checks: (source) => {
      expect(source).toContain('BaseLayout');
      expect(source).toContain('Featured initiative');
      expect(source).toContain('serviceAreas');
    },
  },
  {
    path: 'src/pages/projects/detail.astro',
    checks: (source) => {
      expect(source).toContain('ProjectDetail');
      expect(source).toContain('client:load');
    },
  },
  {
    path: 'src/pages/launch-readiness.astro',
    checks: (source) => {
      expect(source).toContain('BaseLayout');
      expect(source).toContain('noindex={true}');
      expect(source).toContain('Website launch readiness');
      expect(source).toContain('launchCriteria');
    },
  },
  {
    path: 'src/pages/resources.astro',
    checks: (source) => {
      expect(source).toContain('BaseLayout');
      expect(source).toContain('PublicationsList');
      expect(source).toContain('client:load');
      expect(source).not.toContain('Knowledge hub');
    },
  },
  {
    path: 'src/pages/services.astro',
    checks: (source) => {
      expect(source).toContain('marina-services');
      expect(source).toContain('What a partner can commission from the Lab.');
      expect(source).toContain('offer-grid');
    },
  },
  {
    path: 'src/pages/research.astro',
    checks: (source) => {
      expect(source).toContain('marina-research');
      expect(source).toContain('ResearchOutputs');
      expect(source).toContain('client:load');
    },
  },
  {
    path: 'src/pages/programmes.astro',
    checks: (source) => {
      expect(source).toContain('BaseLayout');
      expect(source).toContain('prog-ftl.jpg');
    },
  },
  {
    path: 'src/pages/capacity-building.astro',
    checks: (source) => {
      expect(source).toContain('Capacity building');
      expect(source).toContain("withBase('/volunteer')");
    },
  },
  {
    path: 'src/pages/expertise.astro',
    checks: (source) => {
      expect(source).toContain('marina-focus-page');
      expect(source).toContain('Our areas of expertise');
    },
  },
  {
    path: 'src/pages/how-we-work.astro',
    checks: (source) => {
      expect(source).toContain('BaseLayout');
    },
  },
];

describe('Astro pages (unit source contracts)', () => {
  it.each(pageSources)('$path exposes expected structure', ({ path, checks }) => {
    checks(readSource(path));
  });
});
