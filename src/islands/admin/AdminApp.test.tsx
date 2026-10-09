// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const authState = vi.hoisted(() => ({
  session: null as { user: { email: string } } | null,
  isEditor: false,
  loading: false,
  user: null as { email: string } | null,
  authorizationError: null as string | null,
  signOut: vi.fn(),
}));

const lazyPage = (testId: string) => ({
  default: () => <div data-testid={testId}>{testId}</div>,
});

vi.mock('./auth/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({
    session: authState.session,
    isEditor: authState.isEditor,
    loading: authState.loading,
    user: authState.session?.user ?? null,
    authorizationError: authState.authorizationError,
    signOut: authState.signOut,
  }),
}));

vi.mock('./auth/LoginPage', () => ({
  default: () => <div data-testid="login-page">Login</div>,
}));

vi.mock('./auth/AuthCallback', () => ({
  default: () => <div data-testid="auth-callback">Signing you in...</div>,
}));

vi.mock('./layout/AdminLayout', () => ({
  default: ({
    children,
    currentPath,
  }: {
    children: React.ReactNode;
    currentPath: string;
  }) => (
    <div data-testid="admin-layout" data-path={currentPath}>
      {children}
    </div>
  ),
}));

vi.mock('./dashboard/DashboardPage', () => lazyPage('dashboard-page'));
vi.mock('./statistics/StatisticsListPage', () => lazyPage('statistics-list-page'));
vi.mock('./statistics/StatisticFormPage', () => lazyPage('statistic-form-page'));
vi.mock('./projects/ProjectsListPage', () => lazyPage('projects-list-page'));
vi.mock('./projects/ProjectFormPage', () => lazyPage('project-form-page'));
vi.mock('./news/NewsListPage', () => lazyPage('news-list-page'));
vi.mock('./news/NewsFormPage', () => lazyPage('news-form-page'));
vi.mock('./people/PeopleListPage', () => lazyPage('people-list-page'));
vi.mock('./people/PersonFormPage', () => lazyPage('person-form-page'));
vi.mock('./partners/PartnersListPage', () => lazyPage('partners-list-page'));
vi.mock('./partners/PartnerFormPage', () => lazyPage('partner-form-page'));
vi.mock('./page-content/PageContentListPage', () => lazyPage('page-content-list-page'));
vi.mock('./page-content/PageContentFormPage', () => lazyPage('page-content-form-page'));

import AdminApp from './AdminApp';

async function flushSuspense() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe('AdminApp', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    authState.session = null;
    authState.isEditor = false;
    authState.loading = false;
    authState.authorizationError = null;
    window.history.replaceState({}, '', '/');
    window.location.hash = '#/';
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

  async function renderApp() {
    await act(async () => {
      root.render(<AdminApp />);
    });
    await flushSuspense();
  }

  it('shows a loading spinner while auth state is loading', async () => {
    authState.loading = true;
    await renderApp();

    expect(container.querySelector('[aria-label="Loading"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="login-page"]')).toBeNull();
  });

  it('renders the login page when there is no session', async () => {
    await renderApp();

    expect(container.querySelector('[data-testid="login-page"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="admin-layout"]')).toBeNull();
  });

  it('renders the unauthorized page for signed-in non-editors', async () => {
    authState.session = { user: { email: 'reviewer@example.org' } };
    authState.authorizationError = 'This account is not approved for editor access.';

    await renderApp();

    expect(container.textContent).toContain('Editor access required');
    expect(container.textContent).toContain('reviewer@example.org');
    expect(container.textContent).toContain('not approved for editor access');
  });

  it('renders the admin shell and dashboard route for authorized editors', async () => {
    authState.session = { user: { email: 'editor@example.org' } };
    authState.isEditor = true;
    window.location.hash = '#/';

    await renderApp();

    const layout = container.querySelector('[data-testid="admin-layout"]');
    expect(layout).not.toBeNull();
    expect(layout?.getAttribute('data-path')).toBe('/');
    expect(container.querySelector('[data-testid="dashboard-page"]')).not.toBeNull();
  });

  it('routes hash paths to the matching admin page', async () => {
    authState.session = { user: { email: 'editor@example.org' } };
    authState.isEditor = true;
    window.location.hash = '#/projects';

    await renderApp();

    const layout = container.querySelector('[data-testid="admin-layout"]');
    expect(layout?.getAttribute('data-path')).toBe('/projects');
    expect(container.querySelector('[data-testid="projects-list-page"]')).not.toBeNull();
  });

  it('renders the auth callback when magic-link params are present', async () => {
    window.history.replaceState({}, '', '/admin?code=test-code');

    await renderApp();

    expect(container.querySelector('[data-testid="auth-callback"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="login-page"]')).toBeNull();
  });

  it('signs out from the unauthorized page', async () => {
    authState.session = { user: { email: 'reviewer@example.org' } };
    authState.authorizationError = 'This account is not approved for editor access.';

    await renderApp();

    const signOutButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Sign out')
    ) as HTMLButtonElement;

    await act(async () => {
      signOutButton.click();
    });

    expect(authState.signOut).toHaveBeenCalled();
  });
});
