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
import { renderMarkdown } from '../lib/markdown';

const queryMocks = vi.hoisted(() => ({
  getFeaturedProjects: vi.fn(),
  getPageContent: vi.fn(),
  getPublishedNews: vi.fn(),
  getPublishedPartners: vi.fn(),
  getPublishedPeople: vi.fn(),
  getPublishedProjects: vi.fn(),
  getPublishedStatistics: vi.fn(),
}));

vi.mock('../lib/queries', () => queryMocks);
vi.mock('../lib/markdown', () => ({
  renderMarkdown: vi.fn().mockResolvedValue('<p>preview</p>'),
}));

describe('public islands (unit)', () => {
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
    vi.clearAllMocks();
    queryMocks.getPublishedStatistics.mockResolvedValue({ data: [], error: null });
    queryMocks.getFeaturedProjects.mockResolvedValue({ data: [], error: null });
    queryMocks.getPublishedProjects.mockResolvedValue({ data: [], error: null });
    queryMocks.getPublishedNews.mockResolvedValue({ data: [], error: null });
    queryMocks.getPublishedPeople.mockResolvedValue({ data: [], error: null });
    queryMocks.getPublishedPartners.mockResolvedValue({ data: [], error: null });
    queryMocks.getPageContent.mockResolvedValue({ data: null, error: null });
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('StatsCards renders sample statistics by default', async () => {
    await render(<StatsCards />);
    expect(container.textContent).toContain('Digital projects');
  });

  it('FeaturedProjects renders a visitor-facing empty state when no featured projects exist', async () => {
    await render(<FeaturedProjects />);
    expect(container.textContent).toContain('Featured projects are being updated.');
  });



  it('FeaturedProjects renders a scrollable two-row project showcase', async () => {
    queryMocks.getFeaturedProjects.mockResolvedValue({
      data: Array.from({ length: 5 }, (_, index) => ({
        id: `project-${index + 1}`,
        title: `Project ${index + 1}`,
        slug: `project-${index + 1}`,
        project_status: 'active',
        is_deployed: false,
        image_url: null,
        display_order: index + 1,
        summary: `Project ${index + 1} summary`,
      })),
      error: null,
    });
    queryMocks.getPublishedProjects.mockResolvedValue({
      data: [],
      error: null,
    });

    await render(<FeaturedProjects />);
    expect(container.querySelector('.project-scroll-stage')).not.toBeNull();
    expect(container.querySelectorAll('.project-scroll-row').length).toBe(2);
    expect(container.textContent).toContain('Project 1');
    expect(container.textContent).toContain('Project 5');
  });

  it('ProjectList renders an empty state when no projects exist', async () => {
    await render(<ProjectList />);
    expect(container.textContent).toContain('No published projects match these filters yet.');
  });

  it('ProjectList defaults to a mixed-size gallery view', async () => {
    queryMocks.getPublishedProjects.mockResolvedValue({
      data: Array.from({ length: 3 }, (_, index) => ({
        id: `project-${index + 1}`,
        title: `Project ${index + 1}`,
        slug: `project-${index + 1}`,
        project_status: 'active',
        is_deployed: false,
        image_url: null,
        display_order: index + 1,
        summary: `Project ${index + 1} summary`,
      })),
      error: null,
    });

    await render(<ProjectList />);
    expect(container.querySelector('.project-showcase-grid')).not.toBeNull();
    expect(container.querySelector('.project-showcase-card--xl')).not.toBeNull();
    expect(container.textContent).not.toContain('Cards');
  });

  it('NewsList renders a visitor-facing empty state when no news exists', async () => {
    await render(<NewsList />);
    expect(container.textContent).toContain('News and publications are being updated.');
  });

  it('NewsList filters news items by search term', async () => {
    queryMocks.getPublishedNews.mockResolvedValue({
      data: [
        {
          id: 'news-1',
          title: 'Climate AI Update',
          slug: 'climate-ai-update',
          summary: 'Lorem ipsum dolor sit amet.',
          featured_image_url: null,
          author_name: 'Research Team',
          publish_date: '2026-02-01',
        },
        {
          id: 'news-2',
          title: 'Public Finance Workshop',
          slug: 'public-finance-workshop',
          summary: 'Dolor sit amet.',
          featured_image_url: null,
          author_name: 'Finance Team',
          publish_date: '2025-12-05',
        },
      ],
      error: null,
    });

    await render(<NewsList />);

    const searchInput = container.querySelector('input[type="search"]') as HTMLInputElement;
    const inputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    await act(async () => {
      inputValueSetter?.call(searchInput, 'climate');
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    expect(container.textContent).toContain('Climate AI Update');
    expect(container.textContent).not.toContain('Public Finance Workshop');
    expect(container.textContent).toContain('Showing 1 of 2 news items');
  });
  it('PublicationsList renders publication cards when no live data exists', async () => {
    await render(<PublicationsList />);
    expect(container.textContent).toContain('Publications');
    expect(container.textContent).toContain('Read more');
    expect(container.textContent).toContain('From AI experiments to responsible development practice');
  });

  it('PublicationsList filters publications by search term', async () => {
    queryMocks.getPublishedNews.mockResolvedValue({
      data: [
        {
          id: 'publication-1',
          title: 'Climate AI Brief',
          slug: 'climate-ai-brief',
          summary: 'Lorem ipsum dolor sit amet.',
          featured_image_url: null,
          author_name: 'Research Team',
          publish_date: '2026-01-15',
        },
        {
          id: 'publication-2',
          title: 'Public Finance Note',
          slug: 'public-finance-note',
          summary: 'Dolor sit amet.',
          featured_image_url: null,
          author_name: 'Finance Team',
          publish_date: '2025-11-10',
        },
      ],
      error: null,
    });

    await render(<PublicationsList />);

    const searchInput = container.querySelector('input[type="search"]') as HTMLInputElement;
    const inputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    await act(async () => {
      inputValueSetter?.call(searchInput, 'climate');
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    expect(container.textContent).toContain('Climate AI Brief');
    expect(container.textContent).not.toContain('Public Finance Note');
    expect(container.textContent).toContain('Showing 1 of 2 publications');
  });
  it('PeopleGrid renders the team empty state', async () => {
    await render(<PeopleGrid groupType="team" />);
    expect(container.textContent).toContain('No members listed yet.');
  });

  it('PartnerLogos renders sample partner names', async () => {
    await render(<PartnerLogos />);
    expect(container.textContent).toContain('UNDP');
  });



  it('PartnerLogos can limit homepage display while showing all partners elsewhere', async () => {
    queryMocks.getPublishedPartners.mockResolvedValue({
      data: Array.from({ length: 10 }, (_, index) => ({
        id: `partner-${index + 1}`,
        name: `Partner ${index + 1}`,
        logo_url: null,
        website_url: `https://partner-${index + 1}.example`,
        display_order: index + 1,
      })),
      error: null,
    });

    await render(<PartnerLogos limit={8} />);
    expect(container.textContent).toContain('Partner 8');
    expect(container.textContent).not.toContain('Partner 9');

    act(() => root.unmount());
    root = createRoot(container);

    await render(<PartnerLogos />);
    expect(container.textContent).toContain('Partner 10');
  });



  it('PartnerLogos can render all partners in a pauseable homepage marquee', async () => {
    queryMocks.getPublishedPartners.mockResolvedValue({
      data: Array.from({ length: 10 }, (_, index) => ({
        id: `partner-${index + 1}`,
        name: `Partner ${index + 1}`,
        logo_url: null,
        website_url: `https://partner-${index + 1}.example`,
        display_order: index + 1,
      })),
      error: null,
    });

    await render(<PartnerLogos variant="marquee" />);
    expect(container.textContent).toContain('Partner 10');
    expect(container.querySelector('.partner-marquee-track')).not.toBeNull();
    expect(container.textContent).toContain('Partner 1');
  });

  it('PageContent renders the empty-state message', async () => {
    await render(<PageContent pageSlug="about" sectionSlug="missing-section" />);
    expect(container.textContent).toContain('No content available yet.');
  });

  it('PageContent renders sample content when live data is unavailable', async () => {
    queryMocks.getPageContent.mockResolvedValue({ data: null, error: null });
    await render(<PageContent pageSlug="volunteer" sectionSlug="main" />);
    expect(vi.mocked(renderMarkdown)).toHaveBeenCalledWith(
      expect.stringContaining('Volunteer Data Scientist Initiative')
    );
  });
});
