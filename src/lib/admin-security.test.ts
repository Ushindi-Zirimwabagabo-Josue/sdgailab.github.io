// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getSessionMock, maybeSingleMock, fromMock } = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  maybeSingleMock: vi.fn(),
  fromMock: vi.fn(),
}));

fromMock.mockReturnValue({
  select: vi.fn().mockReturnThis(),
  ilike: vi.fn().mockReturnThis(),
  maybeSingle: maybeSingleMock,
});

vi.mock('./supabase-auth', () => ({
  getSupabaseAuth: () => ({
    auth: {
      getSession: getSessionMock,
    },
    from: fromMock,
  }),
}));

import {
  clearAuthorizedAdminCache,
  consumeRateLimit,
  formatRetryDelay,
  getAuthorizedAdmin,
  normalizeAdminEmail,
  runProtectedAdminAction,
} from './admin-security';

describe('admin-security helpers', () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    clearAuthorizedAdminCache();
    localStorage.clear();
  });

  it('normalizes admin emails', () => {
    expect(normalizeAdminEmail('  Person@Example.COM ')).toBe('person@example.com');
  });

  it('formats retry delays in seconds and minutes', () => {
    expect(formatRetryDelay(1500)).toBe('2 seconds');
    expect(formatRetryDelay(61_000)).toBe('2 minutes');
  });

  it('allows requests until the rate limit is reached', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-15T00:00:00Z'));

    const config = {
      key: 'test-limit',
      limit: 2,
      windowMs: 60_000,
      message: 'Too many requests.',
    };

    expect(consumeRateLimit(config)).toEqual({ allowed: true });
    expect(consumeRateLimit(config)).toEqual({ allowed: true });

    const blocked = consumeRateLimit(config);
    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) {
      expect(blocked.error).toContain('Too many requests.');
      expect(blocked.retryAfterMs).toBeGreaterThan(0);
    }
  });

  it('applies cooldowns between rapid requests', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-15T00:00:00Z'));

    const config = {
      key: 'test-cooldown',
      limit: 10,
      windowMs: 60_000,
      cooldownMs: 5_000,
      message: 'Slow down.',
    };

    expect(consumeRateLimit(config)).toEqual({ allowed: true });

    const blocked = consumeRateLimit(config);
    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) {
      expect(blocked.error).toContain('Slow down.');
      expect(blocked.retryAfterMs).toBeGreaterThan(0);
    }
  });
});

describe('getAuthorizedAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearAuthorizedAdminCache();
    localStorage.clear();
  });

  it('returns a cached actor without re-querying Supabase', async () => {
    getSessionMock.mockResolvedValue({
      data: { session: { user: { email: 'editor@example.org' } } },
      error: null,
    });
    maybeSingleMock.mockResolvedValue({
      data: { email: 'editor@example.org', role: 'admin' },
      error: null,
    });

    const first = await getAuthorizedAdmin(true);
    const second = await getAuthorizedAdmin();

    expect(first).toEqual({ email: 'editor@example.org', role: 'admin' });
    expect(second).toEqual(first);
    expect(getSessionMock).toHaveBeenCalledTimes(1);
    expect(maybeSingleMock).toHaveBeenCalledTimes(1);
  });

  it('throws when the session lookup fails', async () => {
    getSessionMock.mockResolvedValue({
      data: { session: null },
      error: { message: 'session lookup failed' },
    });

    await expect(getAuthorizedAdmin(true)).rejects.toThrow('session lookup failed');
  });

  it('throws when the signed-in user has no email', async () => {
    getSessionMock.mockResolvedValue({
      data: { session: { user: { email: null } } },
      error: null,
    });

    await expect(getAuthorizedAdmin(true)).rejects.toThrow(
      'You must be signed in to perform this action.'
    );
  });

  it('throws when the user is not on the editor allowlist', async () => {
    getSessionMock.mockResolvedValue({
      data: { session: { user: { email: 'reviewer@example.org' } } },
      error: null,
    });
    maybeSingleMock.mockResolvedValue({ data: null, error: null });

    await expect(getAuthorizedAdmin(true)).rejects.toThrow(
      'This account is not approved for editor access.'
    );
  });

  it('throws when the allowlist query fails', async () => {
    getSessionMock.mockResolvedValue({
      data: { session: { user: { email: 'editor@example.org' } } },
      error: null,
    });
    maybeSingleMock.mockResolvedValue({
      data: null,
      error: { message: 'permission denied for table admin_users' },
    });

    await expect(getAuthorizedAdmin(true)).rejects.toThrow(
      'permission denied for table admin_users'
    );
  });
});

describe('runProtectedAdminAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearAuthorizedAdminCache();
    localStorage.clear();
  });

  it('blocks actions when the rate limit is exceeded', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-15T00:00:00Z'));

    getSessionMock.mockResolvedValue({
      data: { session: { user: { email: 'editor@example.org' } } },
      error: null,
    });
    maybeSingleMock.mockResolvedValue({
      data: { email: 'editor@example.org', role: 'editor' },
      error: null,
    });

    const config = {
      key: 'protected-action',
      limit: 1,
      windowMs: 60_000,
      message: 'Too many protected actions.',
    };

    await runProtectedAdminAction(config, async () => 'ok');

    await expect(runProtectedAdminAction(config, async () => 'blocked')).rejects.toThrow(
      'Too many protected actions.'
    );
    expect(getSessionMock).toHaveBeenCalledTimes(1);
  });

  it('runs the action after authorization succeeds', async () => {
    getSessionMock.mockResolvedValue({
      data: { session: { user: { email: 'editor@example.org' } } },
      error: null,
    });
    maybeSingleMock.mockResolvedValue({
      data: { email: 'editor@example.org', role: 'editor' },
      error: null,
    });

    const result = await runProtectedAdminAction(
      {
        key: 'protected-success',
        limit: 3,
        windowMs: 60_000,
        message: 'Too many protected actions.',
      },
      async () => 'saved'
    );

    expect(result).toBe('saved');
    expect(getSessionMock).toHaveBeenCalled();
    expect(maybeSingleMock).toHaveBeenCalled();
  });
});
