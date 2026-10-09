// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

type SessionLike = { user: { email?: string | null } } | null;
type AuthCallback = (event: string, session: SessionLike) => void;

const {
  getAuthorizedAdminMock,
  clearAuthorizedAdminCacheMock,
  normalizeAdminEmailMock,
  signOutMock,
  getSessionMock,
  onAuthStateChangeMock,
  subscriptionUnsubscribeMock,
} = vi.hoisted(() => ({
  getAuthorizedAdminMock: vi.fn(),
  clearAuthorizedAdminCacheMock: vi.fn(),
  normalizeAdminEmailMock: vi.fn((email: string) => email.trim().toLowerCase()),
  signOutMock: vi.fn().mockResolvedValue({ error: null }),
  getSessionMock: vi.fn(),
  onAuthStateChangeMock: vi.fn(),
  subscriptionUnsubscribeMock: vi.fn(),
}));

let authStateChangeCallback: AuthCallback | null = null;

vi.mock('../../../lib/admin-security', () => ({
  getAuthorizedAdmin: getAuthorizedAdminMock,
  clearAuthorizedAdminCache: clearAuthorizedAdminCacheMock,
  normalizeAdminEmail: normalizeAdminEmailMock,
}));

vi.mock('../../../lib/supabase-auth', () => ({
  getSupabaseAuth: () => ({
    auth: {
      signOut: signOutMock,
      getSession: getSessionMock,
      onAuthStateChange: onAuthStateChangeMock,
    },
  }),
}));

import { AuthProvider, useAuth } from './AuthProvider';

function Harness() {
  const auth = useAuth();
  return (
    <div
      data-testid="auth-state"
      data-loading={String(auth.loading)}
      data-is-editor={String(auth.isEditor)}
      data-user-email={auth.user?.email ?? ''}
      data-admin-email={auth.adminUser?.email ?? ''}
      data-error={auth.authorizationError ?? ''}
    />
  );
}

async function flushEffects() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe('AuthProvider', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    authStateChangeCallback = null;

    getSessionMock.mockResolvedValue({
      data: {
        session: null,
      },
    });

    onAuthStateChangeMock.mockImplementation((callback: AuthCallback) => {
      authStateChangeCallback = callback;
      return {
        data: {
          subscription: {
            unsubscribe: subscriptionUnsubscribeMock,
          },
        },
      };
    });

    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('authorizes an allowlisted editor session', async () => {
    getSessionMock.mockResolvedValue({
      data: {
        session: {
          user: { email: 'Editor@Example.org' },
        },
      },
    });
    getAuthorizedAdminMock.mockResolvedValue({
      email: 'editor@example.org',
      role: 'editor',
    });

    await act(async () => {
      root.render(
        <AuthProvider>
          <Harness />
        </AuthProvider>
      );
    });
    await flushEffects();

    const node = container.querySelector('[data-testid="auth-state"]');
    expect(node?.getAttribute('data-loading')).toBe('false');
    expect(node?.getAttribute('data-is-editor')).toBe('true');
    expect(node?.getAttribute('data-user-email')).toBe('Editor@Example.org');
    expect(node?.getAttribute('data-admin-email')).toBe('editor@example.org');
    expect(node?.getAttribute('data-error')).toBe('');
    expect(getAuthorizedAdminMock).toHaveBeenCalledWith(true);
  });

  it('rejects signed-in users whose allowlisted email does not match the active session', async () => {
    getSessionMock.mockResolvedValue({
      data: {
        session: {
          user: { email: 'reviewer@example.org' },
        },
      },
    });
    getAuthorizedAdminMock.mockResolvedValue({
      email: 'other-user@example.org',
      role: 'editor',
    });

    await act(async () => {
      root.render(
        <AuthProvider>
          <Harness />
        </AuthProvider>
      );
    });
    await flushEffects();

    const node = container.querySelector('[data-testid="auth-state"]');
    expect(node?.getAttribute('data-loading')).toBe('false');
    expect(node?.getAttribute('data-is-editor')).toBe('false');
    expect(node?.getAttribute('data-admin-email')).toBe('');
    expect(node?.getAttribute('data-error')).toBe('This account is not approved for editor access.');
    expect(clearAuthorizedAdminCacheMock).toHaveBeenCalled();
  });

  it('signs out and clears local auth state', async () => {
    getSessionMock.mockResolvedValue({
      data: {
        session: {
          user: { email: 'editor@example.org' },
        },
      },
    });
    getAuthorizedAdminMock.mockResolvedValue({
      email: 'editor@example.org',
      role: 'admin',
    });

    let capturedSignOut: null | (() => Promise<void>) = null;

    function SignOutHarness() {
      const auth = useAuth();
      capturedSignOut = auth.signOut;
      return <Harness />;
    }

    await act(async () => {
      root.render(
        <AuthProvider>
          <SignOutHarness />
        </AuthProvider>
      );
    });
    await flushEffects();

    expect(capturedSignOut).toBeTypeOf('function');

    await act(async () => {
      await capturedSignOut?.();
    });

    const node = container.querySelector('[data-testid="auth-state"]');
    expect(signOutMock).toHaveBeenCalled();
    expect(clearAuthorizedAdminCacheMock).toHaveBeenCalled();
    expect(node?.getAttribute('data-is-editor')).toBe('false');
    expect(node?.getAttribute('data-user-email')).toBe('');
    expect(node?.getAttribute('data-admin-email')).toBe('');
    expect(node?.getAttribute('data-error')).toBe('');
  });

  it('applies sessions delivered via INITIAL_SESSION', async () => {
    getSessionMock.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    getAuthorizedAdminMock.mockResolvedValue({
      email: 'editor@example.org',
      role: 'editor',
    });

    await act(async () => {
      root.render(
        <AuthProvider>
          <Harness />
        </AuthProvider>
      );
    });
    await flushEffects();

    await act(async () => {
      authStateChangeCallback?.('INITIAL_SESSION', {
        user: { email: 'editor@example.org' },
      });
    });
    await flushEffects();

    const node = container.querySelector('[data-testid="auth-state"]');
    expect(node?.getAttribute('data-is-editor')).toBe('true');
    expect(node?.getAttribute('data-user-email')).toBe('editor@example.org');
  });

  it('responds to auth state changes and tears down the subscription', async () => {
    await act(async () => {
      root.render(
        <AuthProvider>
          <Harness />
        </AuthProvider>
      );
    });
    await flushEffects();

    getAuthorizedAdminMock.mockResolvedValue({
      email: 'editor@example.org',
      role: 'editor',
    });

    await act(async () => {
      authStateChangeCallback?.('SIGNED_IN', {
        user: { email: 'editor@example.org' },
      });
    });
    await flushEffects();

    const node = container.querySelector('[data-testid="auth-state"]');
    expect(node?.getAttribute('data-is-editor')).toBe('true');

    act(() => {
      root.unmount();
    });

    expect(subscriptionUnsubscribeMock).toHaveBeenCalled();
  });

  it('keeps editor access mounted across TOKEN_REFRESHED', async () => {
    getSessionMock.mockResolvedValue({
      data: {
        session: {
          user: { email: 'editor@example.org' },
        },
      },
    });
    getAuthorizedAdminMock.mockResolvedValue({
      email: 'editor@example.org',
      role: 'editor',
    });

    await act(async () => {
      root.render(
        <AuthProvider>
          <Harness />
        </AuthProvider>
      );
    });
    await flushEffects();

    getAuthorizedAdminMock.mockClear();

    await act(async () => {
      authStateChangeCallback?.('TOKEN_REFRESHED', {
        user: { email: 'editor@example.org' },
      });
    });
    await flushEffects();

    const node = container.querySelector('[data-testid="auth-state"]');
    expect(node?.getAttribute('data-loading')).toBe('false');
    expect(node?.getAttribute('data-is-editor')).toBe('true');
    expect(node?.getAttribute('data-admin-email')).toBe('editor@example.org');
    expect(getAuthorizedAdminMock).not.toHaveBeenCalled();
  });

  it('does not flip loading when SIGNED_IN repeats for the same editor', async () => {
    getSessionMock.mockResolvedValue({
      data: {
        session: {
          user: { email: 'editor@example.org' },
        },
      },
    });
    getAuthorizedAdminMock.mockResolvedValue({
      email: 'editor@example.org',
      role: 'editor',
    });

    await act(async () => {
      root.render(
        <AuthProvider>
          <Harness />
        </AuthProvider>
      );
    });
    await flushEffects();

    let sawLoadingTrue = false;
    const observer = new MutationObserver(() => {
      const node = container.querySelector('[data-testid="auth-state"]');
      if (node?.getAttribute('data-loading') === 'true') {
        sawLoadingTrue = true;
      }
    });
    observer.observe(container, { attributes: true, subtree: true, childList: true });

    await act(async () => {
      authStateChangeCallback?.('SIGNED_IN', {
        user: { email: 'editor@example.org' },
      });
    });
    await flushEffects();
    observer.disconnect();

    const node = container.querySelector('[data-testid="auth-state"]');
    expect(sawLoadingTrue).toBe(false);
    expect(node?.getAttribute('data-loading')).toBe('false');
    expect(node?.getAttribute('data-is-editor')).toBe('true');
  });
});
