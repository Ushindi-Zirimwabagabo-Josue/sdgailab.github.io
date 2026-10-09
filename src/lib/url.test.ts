import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('withBase', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('prefixes a leading slash when BASE_URL is root', async () => {
    vi.stubEnv('BASE_URL', '/');
    const { withBase } = await import('./url');

    expect(withBase('/admin')).toBe('/admin');
    expect(withBase('news')).toBe('/news');
  });

  it('prefixes the configured staging base path', async () => {
    vi.stubEnv('BASE_URL', '/sdgailab.github.io/');
    const { withBase } = await import('./url');

    expect(withBase('/admin')).toBe('/sdgailab.github.io/admin');
    expect(withBase('news')).toBe('/sdgailab.github.io/news');
  });
});
