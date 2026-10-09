import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('index page source', () => {
  const source = readFileSync(resolve(process.cwd(), 'src/pages/index.astro'), 'utf8');

  it('composes the public homepage with the base layout and Marina hero', () => {
    expect(source).toContain('BaseLayout');
    expect(source).toContain('marina-live-hero');
    expect(source).toContain('Digital technologies');
    expect(source).toContain('marina-live-title-line');
    expect(source).toContain('Sustainable');
    expect(source).toContain('Sustainable');
    expect(source).toContain('Development Goals.');
  });

  it('includes the supplied work gallery, impact indicators, and partner marks', () => {
    expect(source).toContain('PartnerLogos');
    expect(source).toContain('variant="home"');
    expect(source).toContain('marina-live-gallery');
    expect(source).toContain('impactStats');
  });

  it('keeps the supplied hero accessible without a how-we-work CTA', () => {
    expect(source).not.toContain("withBase('/solutions')");
    expect(source).not.toContain('How we work');
    expect(source).not.toContain('marina-live-watch-link');
    expect(source).toContain('aria-labelledby="home-hero-heading"');
  });
});
