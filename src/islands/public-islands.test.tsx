// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import FeaturedProjects from './FeaturedProjects';
import NewsList from './NewsList';
import PageContent from './PageContent';
import PartnerLogos from './PartnerLogos';
import PeopleGrid from './PeopleGrid';
import ProjectList from './ProjectList';
import PublicationsList from './PublicationsList';
import StatsCards from './StatsCards';
import { expectAccessible } from '../test/axe';

const {
  getFeaturedProjectsMock,
  getPageContentMock,
  getPublishedNewsMock,
  getPublishedPartnersMock,
  getPublishedPeopleMock,
  getPublishedProjectsMock,
  getPublishedStatisticsMock,
  renderMarkdownMock,
} = vi.hoisted(() => ({
  getFeaturedProjectsMock: vi.fn(),
  getPageContentMock: vi.fn(),
  getPublishedNewsMock: vi.fn(),
  getPublishedPartnersMock: vi.fn(),
  getPublishedPeopleMock: vi.fn(),
  getPublishedProjectsMock: vi.fn(),
  getPublishedStatisticsMock: vi.fn(),
  renderMarkdownMock: vi.fn(),
}));

vi.mock('../lib/queries', () => ({
  getFeaturedProjects: getFeaturedProjectsMock,
  getPageContent: getPageContentMock,
  getPublishedNews: getPublishedNewsMock,
  getPublishedPartners: getPublishedPartnersMock,
  getPublishedPeople: getPublishedPeopleMock,
  getPublishedProjects: getPublishedProjectsMock,
  getPublishedStatistics: getPublishedStatisticsMock,
}));

vi.mock('../lib/markdown', () => ({
  renderMarkdown: renderMarkdownMock,
}));

describe('public islands', () => {
  let container: HTMLDivElement;
  let root: Root;

  async function render(ui: React.ReactNode) {
    await act(async () => {
      root.render(ui);
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
    vi.clearAllMocks();
    renderMarkdownMock.mockImplementation(async (markdown: string) => `<p>${markdown}</p>`);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  function remount() {
    act(() => {
      root.unmount();
    });
    root = createRoot(container);
  }

  it('renders live statistics returned from Supabase', async () => {
    getPublishedStatisticsMock.mockResolvedValue({
      data: [{ id: 'stat-1', label: 'Projects', value: '24', icon_name: null, display_order: 1 }],
      error: null,
    });

    await render(<StatsCards />);

    expect(container.textContent).toContain('24');
    expect(container.textContent).toContain('Projects');
    expect(container.querySelector('[aria-label="Projects: 24"]')).not.toBeNull();
  });

  it('falls back to sample statistics when live statistics fail', async () => {
    getPublishedStatisticsMock.mockResolvedValue({ data: [], error: 'network unavailable' });

    await render(<StatsCards />);

    expect(container.textContent).toContain('Live statistics are unavailable');
    expect(container.querySelectorAll('article').length).toBeGreaterThan(0);
  });

  it('renders featured projects from live data', async () => {
    getFeaturedProjectsMock.mockResolvedValue({
      data: [
        {
          id: 'project-1',
          title: 'Forecasting Platform',
          slug: 'forecasting-platform',
          project_status: 'active',
          is_deployed: true,
          image_url: 'https://example.com/forecast.png',
          display_order: 1,
          summary: 'Supports better planning.',
        },
      ],
      error: null,
    });
    getPublishedProjectsMock.mockResolvedValue({ data: [], error: null });

    await render(<FeaturedProjects />);

    expect(container.textContent).toContain('Forecasting Platform');
    expect(container.querySelector('a')?.getAttribute('href')).toContain(
      '/projects/detail/?slug=forecasting-platform'
    );
  });

  it('renders project list warning and empty state when live data errors', async () => {
    getPublishedProjectsMock.mockResolvedValue({ data: [], error: 'RLS denied' });

    await render(<ProjectList />);

    expect(container.textContent).toContain('Project information is currently being updated');
    expect(container.textContent).toContain('No published projects match these filters yet.');
  });

  it('filters projects by impact area and shows an empty state', async () => {
    getPublishedProjectsMock.mockResolvedValue({ data: [], error: null });

    await render(<ProjectList />);

    expect(container.textContent).toContain('Search projects');
    expect(container.textContent).toContain('Natural Language Processing');
    expect(container.querySelector('input[type="search"]')).not.toBeNull();

    const fintechFilter = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('FinTech & Digital Finance')
    ) as HTMLButtonElement;

    await act(async () => {
      fintechFilter.click();
    });

    expect(fintechFilter.getAttribute('aria-pressed')).toBe('true');
    expect(container.textContent).toContain('No published projects match these filters yet.');
  });


  it('filters projects by year and sorts newest first by default', async () => {
    getPublishedProjectsMock.mockResolvedValue({
      data: [
        {
          id: 'project-old',
          title: 'Older Project',
          slug: 'older-project',
          project_status: 'completed',
          is_deployed: true,
          image_url: null,
          display_order: 1,
          summary: 'Older project summary',
          project_year: 2023,
          impact_area: 'Natural Language Processing',
        },
        {
          id: 'project-new',
          title: 'Newer Project',
          slug: 'newer-project',
          project_status: 'active',
          is_deployed: false,
          image_url: null,
          display_order: 2,
          summary: 'Newer project summary',
          project_year: 2025,
          impact_area: 'Resilience',
        },
      ],
      error: null,
    });

    await render(<ProjectList />);

    expect(container.textContent).toContain('Newest first');
    expect(container.textContent!.indexOf('Newer Project')).toBeLessThan(
      container.textContent!.indexOf('Older Project')
    );

    const yearSelect = container.querySelector('select') as HTMLSelectElement;
    await act(async () => {
      yearSelect.value = '2023';
      yearSelect.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.textContent).toContain('Older Project');
    expect(container.textContent).not.toContain('Newer Project');
  });
  it('renders published news cards with dates and authors', async () => {
    getPublishedNewsMock.mockResolvedValue({
      data: [
        {
          id: 'news-1',
          title: 'New Lab Launch',
          slug: 'new-lab-launch',
          summary: 'Launch summary',
          featured_image_url: 'https://example.com/news.png',
          author_name: 'SDG AI Lab',
          publish_date: '2026-07-15',
        },
      ],
      error: null,
    });

    await render(<NewsList />);

    expect(container.textContent).toContain('New Lab Launch');
    expect(container.textContent).toContain('Launch summary');
    expect(container.textContent).toContain('SDG AI Lab');
    expect(container.textContent).toContain('July 15, 2026');
    expect(container.querySelector('a')?.getAttribute('href')).toContain(
      '/news/detail/?slug=new-lab-launch'
    );
  });

  it('renders people, empty, and error states', async () => {
    getPublishedPeopleMock.mockResolvedValueOnce({
      data: [
        {
          id: 'person-1',
          name: 'Ada Lovelace',
          role_title: 'Research Lead',
          photo_url: null,
          team_group: 'Coordination · Research & Advisory',
          biography: 'Works on AI for development.',
          display_order: 1,
        },
      ],
      error: null,
    });

    await render(<PeopleGrid groupType="team" />);

    expect(container.textContent).toContain('Ada Lovelace');
    expect(container.textContent).toContain('Research Lead');
    expect(container.textContent).toContain('Coordination · Research & Advisory');

    remount();
    getPublishedPeopleMock.mockResolvedValueOnce({ data: [], error: null });
    await render(<PeopleGrid groupType="team" />);
    expect(container.textContent).toContain('No members listed yet.');

    remount();
    getPublishedPeopleMock.mockResolvedValueOnce({ data: [], error: 'failed' });
    await render(<PeopleGrid groupType="team" />);
    expect(container.textContent).toContain('Unable to load team information');
  });

  it('renders partner logos and falls back to names when an image fails', async () => {
    getPublishedPartnersMock.mockResolvedValue({
      data: [
        {
          id: 'partner-1',
          name: 'Partner One',
          logo_url: 'https://example.com/logo.png',
          website_url: 'https://partner.example',
          display_order: 1,
        },
        {
          id: 'partner-2',
          name: 'Partner Two',
          logo_url: null,
          website_url: 'https://partner-two.example',
          display_order: 2,
        },
      ],
      error: null,
    });

    await render(<PartnerLogos />);

    const image = container.querySelector('img') as HTMLImageElement;
    expect(image.getAttribute('alt')).toBe('Partner One');
    expect(container.textContent).toContain('Partner Two');

    act(() => {
      image.dispatchEvent(new Event('error', { bubbles: true }));
    });

    expect(image.style.display).toBe('none');
  });

  it('renders page content from markdown and handles empty/error states', async () => {
    getPageContentMock.mockResolvedValueOnce({
      data: { id: 'content-1', body: '**About** body' },
      error: null,
    });

    await render(<PageContent pageSlug="about" sectionSlug="intro" />);

    expect(renderMarkdownMock).toHaveBeenCalledWith('**About** body');
    expect(container.innerHTML).toContain('<p>**About** body</p>');

    remount();
    getPageContentMock.mockResolvedValueOnce({ data: null, error: null });
    await render(<PageContent pageSlug="about" sectionSlug="our-approach" />);
    expect(renderMarkdownMock).toHaveBeenCalledWith(
      expect.stringContaining('one-stop solution approach')
    );

    remount();
    getPageContentMock.mockResolvedValueOnce({ data: null, error: null });
    await render(<PageContent pageSlug="about" sectionSlug="missing" />);
    expect(container.textContent).toContain('No content available yet.');

    remount();
    getPageContentMock.mockResolvedValueOnce({ data: null, error: 'failed' });
    await render(<PageContent pageSlug="about" sectionSlug="intro" />);
    expect(container.textContent).toContain('Unable to load content');
  });

  it('StatsCards has no detectable accessibility violations', async () => {
    getPublishedStatisticsMock.mockResolvedValue({
      data: [{ id: 'stat-1', label: 'Projects', value: '24', icon_name: null, display_order: 1 }],
      error: null,
    });

    await render(<StatsCards />);

    await expectAccessible(container);
  });

  it('FeaturedProjects has no detectable accessibility violations', async () => {
    getFeaturedProjectsMock.mockResolvedValue({
      data: [
        {
          id: 'fp-1',
          title: 'Accessible Featured Project',
          slug: 'accessible-featured',
          project_status: 'active',
          is_deployed: true,
          image_url: null,
          display_order: 1,
          summary: 'Summary',
          work_stream: 'GIS',
          project_year: 2024,
          implementation_countries: ['Kenya'],
        },
      ],
      error: null,
    });
    getPublishedProjectsMock.mockResolvedValue({ data: [], error: null });

    await render(<FeaturedProjects />);
    await expectAccessible(container);
  });

  it('PublicationsList filters live news-backed publications by search', async () => {
    getPublishedNewsMock.mockResolvedValue({
      data: [
        {
          id: 'n1',
          title: 'Climate Brief',
          slug: 'climate-brief',
          publish_date: '2024-01-01',
          author_name: 'Ada',
          summary: 'Climate summary',
          featured_image_url: null,
        },
        {
          id: 'n2',
          title: 'Skills Dataset',
          slug: 'skills-dataset',
          publish_date: '2025-06-01',
          author_name: 'Grace',
          summary: 'Dataset summary',
          featured_image_url: null,
        },
      ],
      error: null,
    });

    await render(<PublicationsList />);
    expect(container.textContent).toContain('Climate Brief');
    expect(container.textContent).toContain('Skills Dataset');

    const search = container.querySelector('input[type="search"], input[placeholder*="Search" i]') as HTMLInputElement;
    expect(search).not.toBeNull();

    await act(async () => {
      const proto = HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, 'value')?.set?.call(search, 'dataset');
      search.dispatchEvent(new Event('input', { bubbles: true }));
      search.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.textContent).toContain('Skills Dataset');
    expect(container.textContent).not.toContain('Climate Brief');
  });
});

