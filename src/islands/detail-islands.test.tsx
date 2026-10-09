// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import NewsDetail from './NewsDetail';
import ProjectDetail from './ProjectDetail';
import { expectAccessible } from '../test/axe';

const { getNewsArticleBySlugMock, getProjectBySlugMock, renderMarkdownMock } = vi.hoisted(() => ({
  getNewsArticleBySlugMock: vi.fn(),
  getProjectBySlugMock: vi.fn(),
  renderMarkdownMock: vi.fn(),
}));

vi.mock('../lib/queries', () => ({
  getNewsArticleBySlug: getNewsArticleBySlugMock,
  getProjectBySlug: getProjectBySlugMock,
}));

vi.mock('../lib/markdown', () => ({
  renderMarkdown: renderMarkdownMock,
}));

describe('detail islands', () => {
  let container: HTMLDivElement;
  let root: Root;

  async function render(ui: React.ReactNode, search = '') {
    window.history.pushState({}, '', `/${search}`);
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

  it('renders a published project detail page', async () => {
    getProjectBySlugMock.mockResolvedValue({
      data: {
        id: 'project-1',
        title: 'Portfolio Project',
        slug: 'portfolio-project',
        description: 'Project **body**',
        project_status: 'active',
        is_deployed: true,
        is_featured: false,
        image_url: 'https://example.com/project.png',
        display_order: 1,
        status: 'published',
        published_at: '2026-07-15T00:00:00Z',
        created_at: '2026-07-15T00:00:00Z',
        updated_at: '2026-07-15T00:00:00Z',
        summary: 'Short project summary',
      },
      error: null,
    });

    await render(<ProjectDetail />, '?slug=portfolio-project');

    expect(getProjectBySlugMock).toHaveBeenCalledWith('portfolio-project');
    expect(renderMarkdownMock).toHaveBeenCalledWith('Project **body**');
    expect(container.textContent).toContain('Portfolio Project');
    expect(container.textContent).toContain('Short project summary');
    expect(container.innerHTML).toContain('<p>Project **body**</p>');
  });

  it('renders a direct project video player when video_url points to an MP4', async () => {
    getProjectBySlugMock.mockResolvedValue({
      data: {
        id: 'project-video',
        title: 'Video Project',
        slug: 'video-project',
        description: 'Project body',
        project_status: 'active',
        is_deployed: true,
        is_featured: false,
        image_url: null,
        video_url: 'https://example.supabase.co/storage/v1/object/public/public-assets/projects/videos/demo.mp4',
        media_caption: 'Demo walkthrough',
        display_order: 1,
        status: 'published',
        published_at: '2026-07-15T00:00:00Z',
        created_at: '2026-07-15T00:00:00Z',
        updated_at: '2026-07-15T00:00:00Z',
        summary: 'Video summary',
      },
      error: null,
    });

    await render(<ProjectDetail />, '?slug=video-project');

    const video = container.querySelector('video');
    expect(video).toBeTruthy();
    expect(video?.querySelector('source')?.getAttribute('src')).toBe(
      'https://example.supabase.co/storage/v1/object/public/public-assets/projects/videos/demo.mp4'
    );
    expect(container.textContent).toContain('Demo walkthrough');
  });
  it('renders project missing-slug and not-found states', async () => {
    await render(<ProjectDetail />);

    expect(container.textContent).toContain('Project Not Found');
    expect(container.textContent).toContain('No project specified.');

    remount();
    getProjectBySlugMock.mockResolvedValue({ data: null, error: null });
    await render(<ProjectDetail />, '?slug=missing-project');

    expect(container.textContent).toContain('Project not found.');
  });

  it('renders a published news detail page', async () => {
    getNewsArticleBySlugMock.mockResolvedValue({
      data: {
        id: 'news-1',
        title: 'Important Update',
        slug: 'important-update',
        body: 'News **body**',
        summary: 'News summary',
        featured_image_url: 'https://example.com/news.png',
        author_name: 'Comms Team',
        publish_date: '2026-07-15',
        status: 'published',
        published_at: '2026-07-15T00:00:00Z',
        created_at: '2026-07-15T00:00:00Z',
        updated_at: '2026-07-15T00:00:00Z',
      },
      error: null,
    });

    await render(<NewsDetail />, '?slug=important-update');

    expect(getNewsArticleBySlugMock).toHaveBeenCalledWith('important-update');
    expect(renderMarkdownMock).toHaveBeenCalledWith('News **body**');
    expect(container.textContent).toContain('Important Update');
    expect(container.textContent).toContain('By Comms Team');
    expect(container.textContent).toContain('July 15, 2026');
  });

  it('renders news error states', async () => {
    await render(<NewsDetail />);

    expect(container.textContent).toContain('Article Not Found');
    expect(container.textContent).toContain('No article specified.');

    remount();
    getNewsArticleBySlugMock.mockResolvedValue({ data: null, error: 'RLS denied' });
    await render(<NewsDetail />, '?slug=private-news');

    expect(container.textContent).toContain('RLS denied');
  });

  it('has no detectable accessibility violations on project detail', async () => {
    getProjectBySlugMock.mockResolvedValue({
      data: {
        id: 'project-1',
        title: 'Accessible Project',
        slug: 'accessible-project',
        description: 'Body',
        project_status: 'active',
        is_deployed: false,
        is_featured: false,
        image_url: null,
        display_order: 1,
        status: 'published',
        published_at: '2026-07-15T00:00:00Z',
        created_at: '2026-07-15T00:00:00Z',
        updated_at: '2026-07-15T00:00:00Z',
        summary: 'Summary',
      },
      error: null,
    });

    await render(<ProjectDetail />, '?slug=accessible-project');
    await expectAccessible(container);
  });

  it('has no detectable accessibility violations on news detail', async () => {
    getNewsArticleBySlugMock.mockResolvedValue({
      data: {
        id: 'news-1',
        title: 'Accessible Article',
        slug: 'accessible-article',
        body: 'Body',
        summary: 'Summary',
        featured_image_url: null,
        author_name: 'Editor',
        publish_date: '2026-07-15',
        status: 'published',
        published_at: '2026-07-15T00:00:00Z',
        created_at: '2026-07-15T00:00:00Z',
        updated_at: '2026-07-15T00:00:00Z',
      },
      error: null,
    });

    await render(<NewsDetail />, '?slug=accessible-article');
    await expectAccessible(container);
  });
});

