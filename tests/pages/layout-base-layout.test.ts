import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('BaseLayout.astro source', () => {
  const source = readFileSync(
    resolve(process.cwd(), 'src/components/layout/BaseLayout.astro'),
    'utf8'
  );

  it('sets document metadata and canonical URL fields', () => {
    expect(source).toContain('<title>{title}</title>');
    expect(source).toContain('name="description"');
    expect(source).toContain('rel="canonical"');
  });

  it('includes a content security policy and referrer policy', () => {
    expect(source).toContain('Content-Security-Policy');
    expect(source).toContain("script-src 'self' 'unsafe-inline'");
    expect(source).toContain("connect-src 'self' https://*.supabase.co");
    expect(source).toContain('name="referrer" content="strict-origin-when-cross-origin"');
  });

  it('loads analytics only when a measurement id is configured', () => {
    expect(source).toContain('PUBLIC_GA_MEASUREMENT_ID');
    expect(source).toContain('analytics.js');
  });
});
