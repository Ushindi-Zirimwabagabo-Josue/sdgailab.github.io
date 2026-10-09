// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const {
  getSessionMock,
  onAuthStateChangeMock,
  signInWithOtpMock,
  getAuthorizedAdminMock,
} = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  onAuthStateChangeMock: vi.fn(),
  signInWithOtpMock: vi.fn(),
  getAuthorizedAdminMock: vi.fn(),
}));

vi.mock('../../../lib/supabase-auth', () => ({
  getSupabaseAuth: () => ({
    auth: {
      getSession: getSessionMock,
      onAuthStateChange: onAuthStateChangeMock,
      signInWithOtp: signInWithOtpMock,
      signOut: vi.fn(),
    },
  }),
}));

vi.mock('../../../lib/admin-security', async () => {
  const actual = await vi.importActual<typeof import('../../../lib/admin-security')>(
    '../../../lib/admin-security'
  );
  return {
    ...actual,
    getAuthorizedAdmin: getAuthorizedAdminMock,
    clearAuthorizedAdminCache: vi.fn(),
  };
});

import LoginPage from './LoginPage';
import { AuthProvider } from './AuthProvider';

describe('Auth stack integration', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    getSessionMock.mockResolvedValue({ data: { session: null }, error: null });
    onAuthStateChangeMock.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
    signInWithOtpMock.mockResolvedValue({ error: null });
    getAuthorizedAdminMock.mockResolvedValue({ email: 'editor@example.org', role: 'editor' });

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

  it('renders the login page inside the auth provider without a session', async () => {
    await act(async () => {
      root.render(
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      );
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(container.querySelector('input[type="email"]')).not.toBeNull();
    expect(container.textContent).toContain('Send Magic Link');
    expect(getSessionMock).toHaveBeenCalled();
  });
});
