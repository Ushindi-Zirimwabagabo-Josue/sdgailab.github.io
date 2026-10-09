import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('admin.astro source', () => {
  const source = readFileSync(resolve(process.cwd(), 'src/pages/admin.astro'), 'utf8');

  it('bootstraps the client-only admin app island', () => {
    expect(source).toContain('AdminApp');
    expect(source).toContain('client:only="react"');
    expect(source).toContain('id="admin-root"');
  });
});
