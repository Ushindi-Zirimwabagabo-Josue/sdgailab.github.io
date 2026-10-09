// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { createClientMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(() => ({ auth: { getSession: vi.fn() } })),
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: createClientMock,
}));

describe('getSupabaseAuth', () => {
  beforeEach(() => {
    vi.resetModules();
    createClientMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('reports auth configuration based on public env vars', async () => {
    vi.stubEnv('PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('PUBLIC_SUPABASE_ANON_KEY', 'anon-key');

    const mod = await import('./supabase-auth');
    expect(mod.isSupabaseAuthConfigured).toBe(true);
  });

  it('creates an auth client with session persistence options', async () => {
    vi.stubEnv('PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('PUBLIC_SUPABASE_ANON_KEY', 'anon-key');

    const mod = await import('./supabase-auth');
    const first = mod.getSupabaseAuth();
    const second = mod.getSupabaseAuth();

    expect(createClientMock).toHaveBeenCalledTimes(1);
    expect(createClientMock).toHaveBeenCalledWith('https://example.supabase.co', 'anon-key', {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
    expect(first).toBe(second);
  });

  it('throws when called outside the browser', async () => {
    vi.stubEnv('PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('PUBLIC_SUPABASE_ANON_KEY', 'anon-key');

    const originalWindow = globalThis.window;
    // @ts-expect-error simulate non-browser runtime
    delete globalThis.window;

    const mod = await import('./supabase-auth');
    expect(() => mod.getSupabaseAuth()).toThrow('Supabase auth client is only available in the browser');

    globalThis.window = originalWindow;
  });
});
