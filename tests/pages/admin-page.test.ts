import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('admin page source', () => {
  const source = readFileSync(resolve(process.cwd(), 'src/pages/admin.astro'), 'utf8');

  it('includes a CSP meta tag for the admin shell', () => {
    expect(source).toContain('Content-Security-Policy');
    expect(source).toContain("script-src 'self' 'unsafe-inline'");
    expect(source).toContain("connect-src 'self' https://*.supabase.co");
  });

  it('marks the admin surface as noindex with strict referrer policy', () => {
    expect(source).toContain('name="robots" content="noindex, nofollow"');
    expect(source).toContain('name="referrer" content="strict-origin-when-cross-origin"');
  });
});
