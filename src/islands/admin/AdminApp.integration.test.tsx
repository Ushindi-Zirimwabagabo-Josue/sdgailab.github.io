// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { authState, emptyList, emptyCounts } = vi.hoisted(() => ({
  authState: {
    session: { user: { email: 'editor@example.org' } } as { user: { email: string } } | null,
    isEditor: true,
    loading: false,
    user: { email: 'editor@example.org' } as { email: string } | null,
    authorizationError: null as string | null,
    signOut: vi.fn(),
  },
  emptyList: {
    data: [] as unknown[],
    error: null as string | null,
    page: 1,
    pageSize: 50,
    hasMore: false,
  },
  emptyCounts: {
    data: {
      statistics: { total: 0, draft: 0, published: 0, archived: 0 },
      projects: { total: 0, draft: 0, published: 0, archived: 0 },
      news_articles: { total: 0, draft: 0, published: 0, archived: 0 },
      publications: { total: 0, draft: 0, published: 0, archived: 0 },
      people: { total: 0, draft: 0, published: 0, archived: 0 },
      partners: { total: 0, draft: 0, published: 0, archived: 0 },
      evolution_timeline: { total: 0, draft: 0, published: 0, archived: 0 },
      page_content: { total: 0, draft: 0, published: 0, archived: 0 },
    },
    error: null as string | null,
  },
}));

vi.mock('./auth/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({
    session: authState.session,
    isEditor: authState.isEditor,
    loading: authState.loading,
    user: authState.user,
    authorizationError: authState.authorizationError,
    signOut: authState.signOut,
  }),
}));

vi.mock('../../lib/admin-queries', () => ({
  getDashboardCounts: vi.fn().mockResolvedValue(emptyCounts),
  listStatistics: vi.fn().mockResolvedValue(emptyList),
  listProjects: vi.fn().mockResolvedValue(emptyList),
  listNewsArticles: vi.fn().mockResolvedValue(emptyList),
  listPeople: vi.fn().mockResolvedValue(emptyList),
  listPartners: vi.fn().mockResolvedValue(emptyList),
  listPageContent: vi.fn().mockResolvedValue(emptyList),
  getStatistic: vi.fn().mockResolvedValue({ data: null, error: null }),
  getProject: vi.fn().mockResolvedValue({ data: null, error: null }),
  getNewsArticle: vi.fn().mockResolvedValue({ data: null, error: null }),
  getPerson: vi.fn().mockResolvedValue({ data: null, error: null }),
  getPartner: vi.fn().mockResolvedValue({ data: null, error: null }),
  getPageContent: vi.fn().mockResolvedValue({ data: null, error: null }),
  archiveStatistic: vi.fn().mockResolvedValue({ error: null }),
  archiveProject: vi.fn().mockResolvedValue({ error: null }),
  archiveNewsArticle: vi.fn().mockResolvedValue({ error: null }),
  archivePerson: vi.fn().mockResolvedValue({ error: null }),
  archivePartner: vi.fn().mockResolvedValue({ error: null }),
  archivePageContent: vi.fn().mockResolvedValue({ error: null }),
  deleteStatistic: vi.fn().mockResolvedValue({ error: null }),
  deleteProject: vi.fn().mockResolvedValue({ error: null }),
  deleteNewsArticle: vi.fn().mockResolvedValue({ error: null }),
  deletePerson: vi.fn().mockResolvedValue({ error: null }),
  deletePartner: vi.fn().mockResolvedValue({ error: null }),
  deletePageContent: vi.fn().mockResolvedValue({ error: null }),
}));

vi.mock('./layout/Toast', () => ({
  ToastProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useToast: () => ({ showToast: vi.fn() }),
}));

import AdminApp from './AdminApp';

async function flushSuspense() {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
  }
}

describe('AdminApp (integration)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    authState.session = { user: { email: 'editor@example.org' } };
    authState.isEditor = true;
    authState.loading = false;
    authState.user = { email: 'editor@example.org' };
    window.location.hash = '#/projects';
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  async function renderApp() {
    await act(async () => {
      root.render(<AdminApp />);
    });
    await flushSuspense();
  }

  it('lazy-loads the projects list route with real page modules', async () => {
    await renderApp();
    expect(container.textContent).toContain('Projects');
  });

  it('lazy-loads the dashboard route with real page modules', async () => {
    window.location.hash = '#/';
    await renderApp();
    expect(container.textContent).toContain('Dashboard');
  });

  it('lazy-loads the news list route with real page modules', async () => {
    window.location.hash = '#/news';
    await renderApp();
    expect(container.textContent).toContain('News');
  });
});

