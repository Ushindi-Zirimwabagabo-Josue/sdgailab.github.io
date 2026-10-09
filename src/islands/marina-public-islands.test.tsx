// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import EvolutionTimeline from './EvolutionTimeline';
import HeroProjectSpotlight from './HeroProjectSpotlight';
import LatestActivity from './LatestActivity';
import PortfolioGrid from './PortfolioGrid';
import ResearchOutputs from './ResearchOutputs';
import { expectAccessible, expectAccessibleSmoke } from '../test/axe';

const {
  getFeaturedProjectsMock,
  getPublishedEvolutionTimelineMock,
  getPublishedNewsMock,
  getPublishedProjectsMock,
  getPublishedPublicationsMock,
} = vi.hoisted(() => ({
  getFeaturedProjectsMock: vi.fn(),
  getPublishedEvolutionTimelineMock: vi.fn(),
  getPublishedNewsMock: vi.fn(),
  getPublishedProjectsMock: vi.fn(),
  getPublishedPublicationsMock: vi.fn(),
}));

vi.mock('../lib/queries', () => ({
  getFeaturedProjects: getFeaturedProjectsMock,
  getPublishedEvolutionTimeline: getPublishedEvolutionTimelineMock,
  getPublishedNews: getPublishedNewsMock,
  getPublishedProjects: getPublishedProjectsMock,
  getPublishedPublications: getPublishedPublicationsMock,
}));

describe('Marina public islands', () => {
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

    getPublishedProjectsMock.mockResolvedValue({ data: [], error: null });
    getPublishedPublicationsMock.mockResolvedValue({ data: [], error: null });
    getPublishedEvolutionTimelineMock.mockResolvedValue({ data: [], error: null });
    getPublishedNewsMock.mockResolvedValue({ data: [], error: null });
    getFeaturedProjectsMock.mockResolvedValue({ data: [], error: null });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('PortfolioGrid renders live projects and filters by workstream', async () => {
    getPublishedProjectsMock.mockResolvedValue({
      data: [
        {
          id: 'p1',
          title: 'Flood Mapping',
          slug: 'flood-mapping',
          project_status: 'active',
          is_deployed: true,
          image_url: null,
          display_order: 1,
          summary: 'GIS flood risk tool',
          work_stream: 'GIS & GeoAI',
          project_year: 2024,
          implementation_countries: ['Kazakhstan'],
        },
        {
          id: 'p2',
          title: 'Policy Chatbot',
          slug: 'policy-chatbot',
          project_status: 'completed',
          is_deployed: false,
          image_url: null,
          display_order: 2,
          summary: 'NLP assistant',
          work_stream: 'NLP',
          project_year: 2023,
          implementation_countries: ['Türkiye'],
        },
      ],
      error: null,
    });

    await render(<PortfolioGrid />);

    expect(container.textContent).toContain('2 products, seven years of delivery.');
    expect(container.textContent).toContain('Flood Mapping');
    expect(container.textContent).toContain('Policy Chatbot');

    const nlpFilter = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('NLP & Gen AI')
    ) as HTMLButtonElement;

    await act(async () => {
      nlpFilter.click();
    });

    expect(container.textContent).toContain('Policy Chatbot');
    expect(container.textContent).not.toContain('Flood Mapping');
    expect(container.textContent).toContain('1 of 2 products shown');
  });

  it('PortfolioGrid shows an unavailable message when the query fails', async () => {
    getPublishedProjectsMock.mockResolvedValue({ data: [], error: 'offline' });

    await render(<PortfolioGrid />);

    expect(container.textContent).toContain('Published products are temporarily unavailable.');
  });

  it('ResearchOutputs filters publications by type and year', async () => {
    getPublishedPublicationsMock.mockResolvedValue({
      data: [
        {
          id: 'pub-1',
          title: 'Climate Brief',
          slug: 'climate-brief',
          publication_type: 'brief_white_paper',
          summary: 'A short brief',
          source_url: 'https://example.com/brief',
          cover_image_url: null,
          publication_date: '2024-01-01',
          date_label: null,
          authors: null,
          publisher: null,
          display_order: 1,
        },
        {
          id: 'pub-2',
          title: 'Skills Dataset',
          slug: 'skills-dataset',
          publication_type: 'dataset',
          summary: 'Open data',
          source_url: 'https://example.com/dataset',
          cover_image_url: null,
          publication_date: null,
          date_label: '2025',
          authors: null,
          publisher: null,
          display_order: 2,
        },
      ],
      error: null,
    });

    await render(<ResearchOutputs />);

    expect(container.textContent).toContain('Climate Brief');
    expect(container.textContent).toContain('Skills Dataset');
    expect(container.textContent).toContain('All years');
    expect(container.textContent).toContain('2024');
    expect(container.textContent).toContain('2025');
    expect(container.textContent).not.toContain('Briefs & white papers');

    const reportsFilter = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Reports')
    ) as HTMLButtonElement;

    await act(async () => {
      reportsFilter.click();
    });

    expect(container.textContent).toContain('Climate Brief');
    expect(container.textContent).not.toContain('Skills Dataset');

    const allOutputs = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('All outputs')
    ) as HTMLButtonElement;
    const year2025 = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === '2025'
    ) as HTMLButtonElement;

    await act(async () => {
      allOutputs.click();
      year2025.click();
    });

    expect(container.textContent).toContain('Skills Dataset');
    expect(container.textContent).not.toContain('Climate Brief');
  });

  it('EvolutionTimeline keeps fallback items when live data is empty', async () => {
    await render(<EvolutionTimeline />);
    expect(container.textContent).toContain('Foundations');
    expect(container.textContent).toContain('Mainstreaming');
  });

  it('EvolutionTimeline replaces fallback items with live timeline data', async () => {
    getPublishedEvolutionTimelineMock.mockResolvedValue({
      data: [
        {
          id: 'tl-1',
          period: '2026',
          title: 'Live Milestone',
          body: 'Live timeline body',
          display_order: 1,
        },
      ],
      error: null,
    });

    await render(<EvolutionTimeline />);
    expect(container.textContent).toContain('Live Milestone');
    expect(container.textContent).toContain('Live timeline body');
    expect(container.textContent).not.toContain('Foundations');
  });

  it('LatestActivity renders discovery links and recent news items', async () => {
    getPublishedNewsMock.mockResolvedValue({
      data: [
        {
          id: 'n1',
          title: 'Lab Launch',
          slug: 'lab-launch',
          publish_date: '2026-09-01',
          author_name: 'Ada',
          summary: null,
          image_url: null,
        },
      ],
      error: null,
    });

    await render(<LatestActivity />);

    expect(container.textContent).toContain('Publications');
    expect(container.textContent).toContain('Latest activity');
    expect(container.textContent).toContain('Lab Launch');
    expect(container.querySelector('a[href*="/news/detail"]')).not.toBeNull();
  });

  it('HeroProjectSpotlight shows the lab-value panel by default and project cards on slide change', async () => {
    getFeaturedProjectsMock.mockResolvedValue({
      data: [
        {
          id: 'fp-1',
          title: 'Spotlight Project',
          slug: 'spotlight-project',
          project_status: 'active',
          is_deployed: true,
          image_url: null,
          display_order: 1,
          summary: 'Featured summary',
          impact_area: 'Resilience',
          project_year: 2025,
          implementation_countries: ['Kenya'],
        },
      ],
      error: null,
    });

    await render(<HeroProjectSpotlight />);

    expect(container.querySelector('[aria-label="Hero visual summary"]')).not.toBeNull();
    expect(container.textContent).toContain('Lorem ipsum dolor sit amet');

    await act(async () => {
      window.dispatchEvent(new CustomEvent('hero-slide-change', { detail: { index: 1 } }));
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(container.textContent).toContain('Go and check our projects');
    expect(container.textContent).toContain('Spotlight Project');
  });

  it('PortfolioGrid has no serious accessibility violations after load', async () => {
    getPublishedProjectsMock.mockResolvedValue({
      data: [
        {
          id: 'p1',
          title: 'Accessible Project',
          slug: 'accessible-project',
          project_status: 'active',
          is_deployed: true,
          image_url: null,
          display_order: 1,
          summary: 'Summary',
          work_stream: 'Training',
          project_year: 2024,
          implementation_countries: [],
        },
      ],
      error: null,
    });

    await render(<PortfolioGrid />);
    await expectAccessible(container);
  });

  it('ResearchOutputs, LatestActivity, EvolutionTimeline and HeroProjectSpotlight pass axe smoke checks', async () => {
    getPublishedPublicationsMock.mockResolvedValue({
      data: [
        {
          id: 'pub-1',
          title: 'Accessible Output',
          slug: 'accessible-output',
          publication_type: 'report',
          summary: 'Summary',
          source_url: 'https://example.com/output',
          cover_image_url: null,
          publication_date: '2024-01-01',
          date_label: null,
          authors: null,
          publisher: null,
          display_order: 1,
        },
      ],
      error: null,
    });
    getPublishedNewsMock.mockResolvedValue({
      data: [
        {
          id: 'n1',
          title: 'Accessible News',
          slug: 'accessible-news',
          publish_date: '2026-09-01',
          author_name: 'Ada',
          summary: null,
          image_url: null,
        },
      ],
      error: null,
    });
    getPublishedEvolutionTimelineMock.mockResolvedValue({
      data: [
        {
          id: 'tl-1',
          period: '2026',
          title: 'Accessible Milestone',
          body: 'Timeline body',
          display_order: 1,
        },
      ],
      error: null,
    });
    getFeaturedProjectsMock.mockResolvedValue({ data: [], error: null });

    await render(<ResearchOutputs />);
    await expectAccessibleSmoke(container);

    act(() => root.unmount());
    root = createRoot(container);
    await render(<LatestActivity />);
    await expectAccessibleSmoke(container);

    act(() => root.unmount());
    root = createRoot(container);
    await render(<EvolutionTimeline />);
    await expectAccessibleSmoke(container);

    act(() => root.unmount());
    root = createRoot(container);
    await render(<HeroProjectSpotlight />);
    await expectAccessibleSmoke(container);
  });
});
