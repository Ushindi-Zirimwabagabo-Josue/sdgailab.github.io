// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const {
  exchangeCodeForSessionMock,
  fromMock,
  getSupabaseAuthMock,
  getSupabaseMock,
  setSessionMock,
} = vi.hoisted(() => ({
  exchangeCodeForSessionMock: vi.fn(),
  fromMock: vi.fn(),
  getSupabaseAuthMock: vi.fn(),
  getSupabaseMock: vi.fn(),
  setSessionMock: vi.fn(),
}));

getSupabaseAuthMock.mockImplementation(() => ({
  auth: {
    setSession: setSessionMock,
    exchangeCodeForSession: exchangeCodeForSessionMock,
  },
  from: fromMock,
}));
getSupabaseMock.mockImplementation(() => ({ from: fromMock }));

vi.mock('./supabase-auth', () => ({
  getSupabaseAuth: getSupabaseAuthMock,
}));

vi.mock('./supabase', () => ({
  getSupabase: getSupabaseMock,
  isSupabaseConfigured: true,
}));

import {
  clearAuthCallbackQueryParams,
  completeAuthCallback,
  hasAuthCallbackParams,
} from './auth-callback';
import { listProjects } from './admin-queries';
import { consumeRateLimit, formatRetryDelay, normalizeAdminEmail } from './admin-security';
import { getMagicLinkRequestError } from './magic-link-errors';
import { renderMarkdown } from './markdown';
import { getPublishedProjects } from './queries';
import { withBase } from './url';

function createPublicProjectsBuilder(data: Record<string, unknown>[]) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockResolvedValue({ data, error: null }),
  };
}

function createAdminProjectsBuilder(data: Record<string, unknown>[]) {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockResolvedValue({ data, error: null }),
  };
}

describe('lib integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    window.history.replaceState({}, '', '/admin');
    window.location.hash = '';
    setSessionMock.mockResolvedValue({ error: null });
    exchangeCodeForSessionMock.mockResolvedValue({ error: null });
  });

  afterEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/');
    window.location.hash = '';
  });

  it('normalizes admin emails before applying login rate limits', () => {
    const email = normalizeAdminEmail('  Editor@Example.org ');
    const first = consumeRateLimit({
      key: `admin-login:${email}`,
      limit: 3,
      windowMs: 15 * 60 * 1000,
      message: 'Too many sign-in requests.',
    });

    expect(first.allowed).toBe(true);
    expect(email).toBe('editor@example.org');
    expect(formatRetryDelay(45_000)).toContain('second');
  });

  it('maps rate-limit auth errors to login guidance copy', () => {
    const message = getMagicLinkRequestError({
      code: 'over_email_send_rate_limit',
      message: 'email rate limit exceeded',
    });

    expect(message).toContain('hourly email limit');
    expect(message).not.toContain('not set up for editor access');
  });

  it('detects callback params and exchanges PKCE codes through Supabase auth', async () => {
    window.history.replaceState({}, '', '/admin?code=pkce-code');

    expect(hasAuthCallbackParams()).toBe(true);

    const result = await completeAuthCallback();

    expect(result.error).toBeNull();
    expect(exchangeCodeForSessionMock).toHaveBeenCalledWith('pkce-code');
    expect(setSessionMock).not.toHaveBeenCalled();
  });

  it('exchanges hash tokens and clears callback query params', async () => {
    window.history.replaceState({}, '', '/admin?code=stale-code');
    window.location.hash = '#access_token=abc&refresh_token=def&type=magiclink';

    const result = await completeAuthCallback();

    expect(result.error).toBeNull();
    expect(setSessionMock).toHaveBeenCalledWith({
      access_token: 'abc',
      refresh_token: 'def',
    });
    expect(exchangeCodeForSessionMock).not.toHaveBeenCalled();

    clearAuthCallbackQueryParams();
    expect(window.location.search).toBe('');
    expect(window.location.hash).toContain('access_token=abc');
  });

  it('renders markdown and preserves base-path aware links', async () => {
    const html = await renderMarkdown('Read more at [projects](/projects).');
    expect(html).toContain('projects');
    expect(withBase('/projects')).toMatch(/\/projects\/?$/);
  });

  it('loads public and admin project collections through the same Supabase client', async () => {
    const publicRow = {
      id: 'project-public',
      title: 'Public Project',
      slug: 'public-project',
      project_status: 'active',
      is_deployed: true,
      image_url: null,
      display_order: 1,
    };
    const adminRow = {
      id: 'project-admin',
      title: 'Admin Project',
      slug: 'admin-project',
      description: 'Admin listing row',
      project_status: 'active',
      is_deployed: false,
      is_featured: false,
      image_url: null,
      display_order: 2,
      status: 'published',
    };

    fromMock
      .mockReturnValueOnce(createPublicProjectsBuilder([publicRow]))
      .mockReturnValueOnce(createAdminProjectsBuilder([adminRow]));

    const publicResult = await getPublishedProjects();
    const adminResult = await listProjects();

    expect(getSupabaseMock).toHaveBeenCalled();
    expect(getSupabaseAuthMock).toHaveBeenCalled();
    expect(publicResult.data[0]?.slug).toBe('public-project');
    expect(adminResult.data[0]?.slug).toBe('admin-project');
  });
});
