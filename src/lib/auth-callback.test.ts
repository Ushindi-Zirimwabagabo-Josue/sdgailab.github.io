// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { setSessionMock, exchangeCodeForSessionMock } = vi.hoisted(() => ({
  setSessionMock: vi.fn(),
  exchangeCodeForSessionMock: vi.fn(),
}));

vi.mock('./supabase-auth', () => ({
  getSupabaseAuth: () => ({
    auth: {
      setSession: setSessionMock,
      exchangeCodeForSession: exchangeCodeForSessionMock,
    },
  }),
}));

import {
  clearAuthCallbackQueryParams,
  completeAuthCallback,
  hasAuthCallbackParams,
} from './auth-callback';

describe('auth-callback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setSessionMock.mockResolvedValue({ error: null });
    exchangeCodeForSessionMock.mockResolvedValue({ error: null });
    window.history.replaceState({}, '', '/admin');
  });

  afterEach(() => {
    window.history.replaceState({}, '', '/');
    window.location.hash = '';
  });

  it('detects hash-based magic link tokens', () => {
    window.location.hash = '#access_token=abc&refresh_token=def&type=magiclink';
    expect(hasAuthCallbackParams()).toBe(true);
  });

  it('detects PKCE code query parameters', () => {
    window.history.replaceState({}, '', '/admin?code=pkce-code');
    expect(hasAuthCallbackParams()).toBe(true);
  });

  it('exchanges hash tokens via setSession', async () => {
    window.location.hash = '#access_token=abc&refresh_token=def&type=magiclink';

    const result = await completeAuthCallback();

    expect(result.error).toBeNull();
    expect(setSessionMock).toHaveBeenCalledWith({
      access_token: 'abc',
      refresh_token: 'def',
    });
  });

  it('exchanges PKCE codes via exchangeCodeForSession', async () => {
    window.history.replaceState({}, '', '/admin?code=pkce-code');

    const result = await completeAuthCallback();

    expect(result.error).toBeNull();
    expect(exchangeCodeForSessionMock).toHaveBeenCalledWith('pkce-code');
  });

  it('returns an error when no callback params are present', async () => {
    const result = await completeAuthCallback();
    expect(result.error?.message).toBe('No auth callback parameters found');
  });

  it('clears callback query params from the URL', () => {
    window.history.replaceState({}, '', '/admin?code=pkce-code&error=fail');
    window.location.hash = '#/';

    clearAuthCallbackQueryParams();

    expect(window.location.pathname).toBe('/admin');
    expect(window.location.search).toBe('');
    expect(window.location.hash).toBe('#/');
  });
});
