import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

function readSource(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8');
}

describe('BaseLayout.astro integration', () => {
  const baseLayout = readSource('src/components/layout/BaseLayout.astro');
  const header = readSource('src/components/layout/Header.astro');
  const footer = readSource('src/components/layout/Footer.astro');

  it('composes Header and Footer into the public document shell', () => {
    expect(baseLayout).toContain("import Header from './Header.astro'");
    expect(baseLayout).toContain("import Footer from './Footer.astro'");
    expect(baseLayout).toContain('<Header />');
    expect(baseLayout).toContain('<Footer />');
    expect(baseLayout).toContain('<main id="main-content">');
    expect(baseLayout).toContain('<slot />');
  });

  it('wires skip-link navigation between header and main content', () => {
    expect(baseLayout).toContain('href="#main-content"');
    expect(header).toContain('aria-label="Main navigation"');
    expect(footer).toContain('<footer');
  });

  it('is used across public pages for consistent layout composition', () => {
    const indexPage = readSource('src/pages/index.astro');
    const aboutPage = readSource('src/pages/about.astro');
    expect(indexPage).toContain("import BaseLayout from '../components/layout/BaseLayout.astro'");
    expect(aboutPage).toContain("import BaseLayout from '../components/layout/BaseLayout.astro'");
  });
});

describe('Header.astro integration', () => {
  const header = readSource('src/components/layout/Header.astro');
  const baseLayout = readSource('src/components/layout/BaseLayout.astro');

  it('is mounted by BaseLayout for every public page', () => {
    expect(baseLayout).toContain('<Header />');
    expect(header).toContain('aria-label="Toggle navigation menu"');
    expect(header).toContain("label: 'Solutions'");
  });
});

describe('Footer.astro integration', () => {
  const footer = readSource('src/components/layout/Footer.astro');
  const baseLayout = readSource('src/components/layout/BaseLayout.astro');

  it('is mounted by BaseLayout with essential links', () => {
    expect(baseLayout).toContain('<Footer />');
    expect(footer).toContain('<h4>Lab</h4>');
    expect(footer).toContain('<h4>Work</h4>');
    expect(footer).toContain('© {currentYear} SDG AI Lab');
    expect(footer).not.toContain('marina-footer-brand');
  });
});

describe('Homepage Marina composition integration', () => {
  const indexPage = readSource('src/pages/index.astro');

  it('composes the Marina homepage hero, impact, portfolio and partner sections', () => {
    expect(indexPage).toContain('Digital technologies');
    expect(indexPage).toContain('marina-live-impact');
    expect(indexPage).toContain('marina-live-gallery');
    expect(indexPage).toContain('<PartnerLogos client:load variant="home" />');
  });
});

describe('EmptyState.astro integration', () => {
  const emptyState = readSource('src/components/ui/EmptyState.astro');

  it('exposes a message prop contract for island empty-result states', () => {
    expect(emptyState).toContain('message: string');
    expect(emptyState).toContain('{message}');
    expect(emptyState).toContain('aria-hidden="true"');
  });

  it('matches the empty-state copy used by public islands', () => {
    const peopleGrid = readSource('src/islands/PeopleGrid.tsx');
    const pageContent = readSource('src/islands/PageContent.tsx');
    expect(peopleGrid).toContain('No members listed yet.');
    expect(pageContent).toContain('No content available yet.');
  });
});

describe('LoadingSpinner.astro integration', () => {
  const spinner = readSource('src/components/ui/LoadingSpinner.astro');

  it('exposes accessible loading semantics for composed fetch states', () => {
    expect(spinner).toContain('role="status"');
    expect(spinner).toContain('aria-label="Loading"');
    expect(spinner).toContain('sr-only');
  });

  it('aligns with loading markup patterns in public islands', () => {
    const newsDetail = readSource('src/islands/NewsDetail.tsx');
    const projectDetail = readSource('src/islands/ProjectDetail.tsx');
    expect(newsDetail).toContain('role="status"');
    expect(projectDetail).toContain('role="status"');
  });
});
