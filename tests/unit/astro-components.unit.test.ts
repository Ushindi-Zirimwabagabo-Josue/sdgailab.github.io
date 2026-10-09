import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

function readSource(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8');
}

describe('BaseLayout.astro (unit)', () => {
  const source = readSource('src/components/layout/BaseLayout.astro');

  it('defines document metadata slots', () => {
    expect(source).toContain('<title>{title}</title>');
    expect(source).toContain('name="description"');
    expect(source).toContain('<slot />');
  });

  it('applies sitewide security headers', () => {
    expect(source).toContain('Content-Security-Policy');
    expect(source).toContain("connect-src 'self' https://*.supabase.co");
  });
});

describe('Header.astro (unit)', () => {
  const source = readSource('src/components/layout/Header.astro');

  it('declares accessible navigation landmarks', () => {
    expect(source).toContain('aria-label="Main navigation"');
    expect(source).toContain('aria-label="Toggle navigation menu"');
    expect(source).toContain('aria-expanded');
  });

  it('links to Marina primary public sections', () => {
    expect(source).toContain("label: 'About'");
    expect(source).toContain("label: 'Expertise'");
    expect(source).toContain("label: 'Services'");
    expect(source).toContain("label: 'Solutions'");
    expect(source).toContain("label: 'Research'");
    expect(source).toContain("label: 'Contact'");
  });
});

describe('Footer.astro (unit)', () => {
  const source = readSource('src/components/layout/Footer.astro');

  it('declares essential links and connect sections', () => {
    expect(source).toContain('<footer');
    expect(source).toContain('<h4>Lab</h4>');
    expect(source).toContain('<h4>Work</h4>');
    expect(source).toContain("withBase('/research')");
    expect(source).toContain("withBase('/programmes')");
  });

  it('renders the current-year copyright notice', () => {
    expect(source).toContain('currentYear');
    expect(source).toContain('SDG AI Lab');
  });
});

describe('ParticlesHero.astro (unit)', () => {
  const source = readSource('src/components/sections/ParticlesHero.astro');

  it('loads particles only when reduced motion is not preferred', () => {
    expect(source).toContain('prefers-reduced-motion');
    expect(source).toContain('particlesJS.load');
    expect(source).toContain('particlesConfigPath');
  });

  it('exposes a hero content slot', () => {
    expect(source).toContain('<slot />');
    expect(source).toContain('id="particles-hero"');
  });
});

describe('EmptyState.astro (unit)', () => {
  const source = readSource('src/components/ui/EmptyState.astro');

  it('marks decorative icons as hidden from assistive tech', () => {
    expect(source).toContain('aria-hidden="true"');
    expect(source).toContain('{message}');
  });
});

describe('LoadingSpinner.astro (unit)', () => {
  const source = readSource('src/components/ui/LoadingSpinner.astro');

  it('exposes loading status semantics', () => {
    expect(source).toContain('role="status"');
    expect(source).toContain('aria-label="Loading"');
    expect(source).toContain('sr-only');
  });
});

describe('SDGWheel.astro (unit)', () => {
  const source = readSource('src/components/ui/SDGWheel.astro');

  it('describes the SDG wheel for screen readers', () => {
    expect(source).toContain('aria-label');
    expect(source).toContain('SDG AI Lab applies AI and data for development impact');
  });
});
