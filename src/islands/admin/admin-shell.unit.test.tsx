// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { signInWithOtpMock, getSessionMock, onAuthStateChangeMock, setSessionMock, exchangeCodeForSessionMock } = vi.hoisted(() => ({
  signInWithOtpMock: vi.fn(),
  getSessionMock: vi.fn(),
  onAuthStateChangeMock: vi.fn(),
  setSessionMock: vi.fn().mockResolvedValue({ error: null }),
  exchangeCodeForSessionMock: vi.fn().mockResolvedValue({ error: null }),
}));

vi.mock('../../lib/supabase-auth', () => ({
  getSupabaseAuth: () => ({
    auth: {
      getSession: getSessionMock,
      onAuthStateChange: onAuthStateChangeMock,
      signInWithOtp: signInWithOtpMock,
      signOut: vi.fn(),
      setSession: setSessionMock,
      exchangeCodeForSession: exchangeCodeForSessionMock,
    },
  }),
}));

vi.mock('../../lib/admin-security', () => ({
  getAuthorizedAdmin: vi.fn(),
  clearAuthorizedAdminCache: vi.fn(),
  normalizeAdminEmail: (email: string) => email.trim().toLowerCase(),
}));

import AdminApp from './AdminApp';
import AdminLayout from './layout/AdminLayout';
import AuthCallback from './auth/AuthCallback';
import { AuthProvider } from './auth/AuthProvider';
import LoginPage from './auth/LoginPage';

vi.mock('./layout/Sidebar', () => ({
  default: ({ currentPath }: { currentPath: string }) => (
    <nav aria-label="Admin navigation">Sidebar {currentPath}</nav>
  ),
}));

vi.mock('./layout/Toast', () => ({
  ToastProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useToast: () => ({ showToast: vi.fn() }),
}));

describe('admin shell (unit)', () => {
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
    window.location.hash = '#/';
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  async function render(ui: React.ReactNode) {
    await act(async () => {
      root.render(ui);
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  it('LoginPage renders the magic-link form', async () => {
    await render(<LoginPage />);
    expect(container.querySelector('input[type="email"]')).not.toBeNull();
  });

  it('AuthProvider renders children after session bootstrap', async () => {
    await render(
      <AuthProvider>
        <div>Protected child</div>
      </AuthProvider>
    );
    expect(container.textContent).toContain('Protected child');
  });

  it('AuthCallback renders the signing-in state for token hashes', async () => {
    window.location.hash = '#access_token=test-token&refresh_token=refresh&type=magiclink';
    await render(
      <AuthProvider>
        <AuthCallback />
      </AuthProvider>
    );
    expect(container.textContent).toContain('Signing you in...');
  });

  it('AdminLayout renders the shell around children', async () => {
    await render(
      <AuthProvider>
        <AdminLayout currentPath="/projects">
          <div>Workspace</div>
        </AdminLayout>
      </AuthProvider>
    );
    expect(container.textContent).toContain('Workspace');
    expect(container.textContent).toContain('Sidebar /projects');
  });

  it('AdminApp renders the login gate without a session', async () => {
    await render(<AdminApp />);
    expect(container.querySelector('input[type="email"]')).not.toBeNull();
  });
});
