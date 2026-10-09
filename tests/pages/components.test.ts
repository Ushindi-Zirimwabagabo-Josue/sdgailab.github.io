import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

function readSource(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8');
}

describe('Astro UI components', () => {
  it('EmptyState exposes decorative icon and message text', () => {
    const source = readSource('src/components/ui/EmptyState.astro');
    expect(source).toContain('aria-hidden="true"');
    expect(source).toContain('{message}');
  });

  it('LoadingSpinner exposes status semantics', () => {
    const source = readSource('src/components/ui/LoadingSpinner.astro');
    expect(source).toContain('role="status"');
    expect(source).toContain('aria-label="Loading"');
    expect(source).toContain('sr-only');
  });

  it('SDGWheel renders with an accessible image label', () => {
    const source = readSource('src/components/ui/SDGWheel.astro');
    expect(source).toContain('aria-label');
    expect(source).toContain('SDG AI Lab applies AI and data for development impact');
  });

  it('StatusBadge maps known status labels', () => {
    const source = readSource('src/components/ui/StatusBadge.astro');
    expect(source).toContain('Under Development');
    expect(source).toContain('active');
  });
});

describe('Astro layout and section components', () => {
  it('Footer includes essential links and branding', () => {
    const source = readSource('src/components/layout/Footer.astro');
    expect(source).toContain('<footer');
    expect(source).toContain('<h4>Lab</h4>');
    expect(source).toContain('<h4>Work</h4>');
    expect(source).toContain('SDG AI Lab on LinkedIn');
    expect(source).toContain('SDG AI Lab on GitHub');
  });

  it('ParticlesHero respects reduced motion and renders a hero slot', () => {
    const source = readSource('src/components/sections/ParticlesHero.astro');
    expect(source).toContain('prefers-reduced-motion');
    expect(source).toContain('<slot />');
    expect(source).toContain('particles-js');
  });
});
