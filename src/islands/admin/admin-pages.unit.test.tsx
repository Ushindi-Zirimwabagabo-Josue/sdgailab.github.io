// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { emptyList, emptyCounts } = vi.hoisted(() => ({
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

vi.mock('../../lib/admin-queries', () => ({
  getDashboardCounts: vi.fn().mockResolvedValue(emptyCounts),
  listStatistics: vi.fn().mockResolvedValue(emptyList),
  listProjects: vi.fn().mockResolvedValue(emptyList),
  listNewsArticles: vi.fn().mockResolvedValue(emptyList),
  listPublications: vi.fn().mockResolvedValue(emptyList),
  listPeople: vi.fn().mockResolvedValue(emptyList),
  listPartners: vi.fn().mockResolvedValue(emptyList),
  listEvolutionTimeline: vi.fn().mockResolvedValue(emptyList),
  listPageContent: vi.fn().mockResolvedValue(emptyList),
  getStatistic: vi.fn().mockResolvedValue({ data: null, error: null }),
  getProject: vi.fn().mockResolvedValue({ data: null, error: null }),
  getNewsArticle: vi.fn().mockResolvedValue({ data: null, error: null }),
  getPublication: vi.fn().mockResolvedValue({ data: null, error: null }),
  getPerson: vi.fn().mockResolvedValue({ data: null, error: null }),
  getPartner: vi.fn().mockResolvedValue({ data: null, error: null }),
  getEvolutionTimelineItem: vi.fn().mockResolvedValue({ data: null, error: null }),
  getPageContent: vi.fn().mockResolvedValue({ data: null, error: null }),
  archiveStatistic: vi.fn().mockResolvedValue({ error: null }),
  archiveProject: vi.fn().mockResolvedValue({ error: null }),
  archiveNewsArticle: vi.fn().mockResolvedValue({ error: null }),
  archivePublication: vi.fn().mockResolvedValue({ error: null }),
  archivePerson: vi.fn().mockResolvedValue({ error: null }),
  archivePartner: vi.fn().mockResolvedValue({ error: null }),
  archiveEvolutionTimelineItem: vi.fn().mockResolvedValue({ error: null }),
  archivePageContent: vi.fn().mockResolvedValue({ error: null }),
  deleteStatistic: vi.fn().mockResolvedValue({ error: null }),
  deleteProject: vi.fn().mockResolvedValue({ error: null }),
  deleteNewsArticle: vi.fn().mockResolvedValue({ error: null }),
  deletePublication: vi.fn().mockResolvedValue({ error: null }),
  deletePerson: vi.fn().mockResolvedValue({ error: null }),
  deletePartner: vi.fn().mockResolvedValue({ error: null }),
  deleteEvolutionTimelineItem: vi.fn().mockResolvedValue({ error: null }),
  createEvolutionTimelineItem: vi.fn().mockResolvedValue({ data: null, error: null }),
  updateEvolutionTimelineItem: vi.fn().mockResolvedValue({ data: null, error: null }),
  createPublication: vi.fn().mockResolvedValue({ data: null, error: null }),
  updatePublication: vi.fn().mockResolvedValue({ data: null, error: null }),
  deletePageContent: vi.fn().mockResolvedValue({ error: null }),
}));

vi.mock('./layout/Toast', () => ({
  useToast: () => ({ showToast: vi.fn() }),
  ToastProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('./AdminApp', () => ({
  useNavigationGuard: () => ({ setIsDirty: vi.fn() }),
}));

vi.mock('./shared/ContentTable', () => ({
  ContentTable: () => <div data-testid="content-table">table</div>,
}));

vi.mock('./shared/ContentForm', () => ({
  ContentForm: ({
    children,
    onSubmit,
  }: {
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent) => void;
  }) => (
    <form onSubmit={onSubmit}>
      {children}
      <button type="submit">Save</button>
    </form>
  ),
}));

vi.mock('./shared/SlugField', () => ({
  SlugField: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <input aria-label="Slug" value={value} onChange={(e) => onChange(e.target.value)} />
  ),
}));

vi.mock('./shared/StatusSelect', () => ({
  StatusSelect: ({ value, onChange, label }: { value: string; onChange: (v: string) => void; label?: string }) => (
    <select aria-label={label ?? 'Status'} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="draft">Draft</option>
    </select>
  ),
  StatusBadge: ({ status }: { status: string }) => <span>{status}</span>,
}));

vi.mock('./shared/MarkdownField', () => ({
  MarkdownField: ({ value, onChange, label }: { value: string; onChange: (v: string) => void; label?: string }) => (
    <textarea aria-label={label ?? 'Body'} value={value} onChange={(e) => onChange(e.target.value)} />
  ),
}));

vi.mock('./shared/ImageUpload', () => ({
  ImageUpload: () => <div data-testid="image-upload">upload</div>,
}));

vi.mock('./shared/FormFeedback', () => ({
  FormFeedback: () => null,
}));

import DashboardPage from './dashboard/DashboardPage';
import EvolutionTimelineFormPage from './evolution-timeline/EvolutionTimelineFormPage';
import EvolutionTimelineListPage from './evolution-timeline/EvolutionTimelineListPage';
import NewsFormPage from './news/NewsFormPage';
import NewsListPage from './news/NewsListPage';
import PageContentFormPage from './page-content/PageContentFormPage';
import PageContentListPage from './page-content/PageContentListPage';
import PartnerFormPage from './partners/PartnerFormPage';
import PartnersListPage from './partners/PartnersListPage';
import PeopleListPage from './people/PeopleListPage';
import PersonFormPage from './people/PersonFormPage';
import ProjectFormPage from './projects/ProjectFormPage';
import ProjectsListPage from './projects/ProjectsListPage';
import PublicationFormPage from './publications/PublicationFormPage';
import PublicationsListPage from './publications/PublicationsListPage';
import StatisticFormPage from './statistics/StatisticFormPage';
import StatisticsListPage from './statistics/StatisticsListPage';

describe('admin pages (unit)', () => {
  let container: HTMLDivElement;
  let root: Root;

  async function renderPage(Component: React.ComponentType<{ id?: string | null }>) {
    await act(async () => {
      root.render(<Component />);
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('DashboardPage renders the dashboard heading', async () => {
    await renderPage(DashboardPage);
    expect(container.textContent).toContain('Dashboard');
  });

  it('StatisticsListPage renders the statistics list shell', async () => {
    await renderPage(StatisticsListPage);
    expect(container.textContent).toContain('Statistics');
    expect(container.querySelector('[data-testid="content-table"]')).not.toBeNull();
  });

  it('StatisticFormPage renders the create form heading', async () => {
    await renderPage(StatisticFormPage);
    expect(container.textContent).toContain('New Statistic');
  });

  it('ProjectsListPage renders the projects list shell', async () => {
    await renderPage(ProjectsListPage);
    expect(container.textContent).toContain('Projects');
  });

  it('ProjectFormPage renders the create form heading', async () => {
    await renderPage(ProjectFormPage);
    expect(container.textContent).toContain('New Project');
  });

  it('NewsListPage renders the news list shell', async () => {
    await renderPage(NewsListPage);
    expect(container.textContent).toContain('News');
  });

  it('NewsFormPage renders the create form heading', async () => {
    await renderPage(NewsFormPage);
    expect(container.textContent).toContain('New Article');
  });

  it('PeopleListPage renders the people list shell', async () => {
    await renderPage(PeopleListPage);
    expect(container.textContent).toContain('People');
  });

  it('PersonFormPage renders the create form heading', async () => {
    await renderPage(PersonFormPage);
    expect(container.textContent).toContain('New Person');
  });

  it('PartnersListPage renders the partners list shell', async () => {
    await renderPage(PartnersListPage);
    expect(container.textContent).toContain('Partners');
  });

  it('PartnerFormPage renders the create form heading', async () => {
    await renderPage(PartnerFormPage);
    expect(container.textContent).toContain('New Partner');
  });

  it('EvolutionTimelineListPage renders the timeline list shell', async () => {
    await renderPage(EvolutionTimelineListPage);
    expect(container.textContent).toContain('Evolution Timeline');
  });

  it('EvolutionTimelineFormPage renders the create form heading', async () => {
    await renderPage(EvolutionTimelineFormPage);
    expect(container.textContent).toContain('New Timeline Entry');
  });

  it('PageContentListPage renders the page content list shell', async () => {
    await renderPage(PageContentListPage);
    expect(container.textContent).toContain('Page Content');
  });

  it('PageContentFormPage renders the create form heading', async () => {
    await renderPage(PageContentFormPage);
    expect(container.textContent).toContain('New Page Content');
  });

  it('PublicationsListPage renders the publications list shell', async () => {
    await renderPage(PublicationsListPage);
    expect(container.textContent).toContain('Research publications');
  });

  it('PublicationFormPage renders the create form heading', async () => {
    await renderPage(PublicationFormPage);
    expect(container.textContent).toContain('New publication');
  });
});
