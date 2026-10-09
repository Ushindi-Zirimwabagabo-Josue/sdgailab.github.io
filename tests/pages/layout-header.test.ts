import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Header.astro source', () => {
  const source = readFileSync(
    resolve(process.cwd(), 'src/components/layout/Header.astro'),
    'utf8'
  );

  it('includes accessible main navigation markup', () => {
    expect(source).toContain('aria-label="Main navigation"');
    expect(source).toContain('SDG AI Lab');
  });

  it('includes a mobile menu toggle with an accessible label', () => {
    expect(source).toContain('aria-label="Toggle navigation menu"');
    expect(source).toContain('aria-expanded');
  });

  it('links to Marina primary public sections without service subnavigation', () => {
    expect(source).not.toContain("label: 'Home'");
    expect(source).toContain("label: 'About'");
    expect(source).toContain("label: 'Expertise'");
    expect(source).toContain("label: 'Services'");
    expect(source).toContain("label: 'Solutions'");
    expect(source).toContain("label: 'Research'");
    expect(source).toContain("label: 'Contact'");
    expect(source).toContain('aria-label="SDG AI Lab homepage"');
    expect(source).not.toContain('serviceSubLinks');
    expect(source).not.toContain('aria-haspopup');
    expect(source).not.toContain('Header request support');
    expect(source).not.toContain("label: 'Team'");
  });
});
