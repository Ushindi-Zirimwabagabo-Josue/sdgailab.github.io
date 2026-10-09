// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const { getDashboardCountsMock } = vi.hoisted(() => ({
  getDashboardCountsMock: vi.fn(),
}));

vi.mock('../../../lib/admin-queries', () => ({
  getDashboardCounts: getDashboardCountsMock,
}));

import DashboardPage from './DashboardPage';

async function flushEffects() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe('DashboardPage', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
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

  it('renders dashboard cards after loading counts', async () => {
    getDashboardCountsMock.mockResolvedValue({
      data: {
        statistics: { total: 1, draft: 0, published: 1, archived: 0 },
        projects: { total: 2, draft: 1, published: 1, archived: 0 },
        news_articles: { total: 3, draft: 1, published: 1, archived: 1 },
        publications: { total: 9, draft: 1, published: 7, archived: 1 },
        people: { total: 4, draft: 1, published: 2, archived: 1 },
        partners: { total: 5, draft: 0, published: 4, archived: 1 },
        evolution_timeline: { total: 7, draft: 0, published: 7, archived: 0 },
        page_content: { total: 8, draft: 2, published: 5, archived: 1 },
      },
      error: null,
    });

    await act(async () => {
      root.render(<DashboardPage />);
    });
    await flushEffects();

    expect(getDashboardCountsMock).toHaveBeenCalled();
    expect(container.textContent).toContain('Dashboard');
    expect(container.textContent).toContain('Statistics');
    expect(container.textContent).toContain('7');
    expect(container.querySelector('a[href="#/projects"]')?.textContent).toContain('Projects');
    expect(container.querySelector('a[href="#/page-content"]')?.textContent).toContain('Page Content');
  });

  it('renders an error state and retries loading', async () => {
    getDashboardCountsMock
      .mockResolvedValueOnce({ data: null, error: 'Could not load counts' })
      .mockResolvedValueOnce({
        data: {
          statistics: { total: 1, draft: 0, published: 1, archived: 0 },
          projects: { total: 1, draft: 1, published: 0, archived: 0 },
          news_articles: { total: 1, draft: 0, published: 1, archived: 0 },
          publications: { total: 1, draft: 0, published: 1, archived: 0 },
          people: { total: 1, draft: 0, published: 1, archived: 0 },
          partners: { total: 1, draft: 0, published: 1, archived: 0 },
          evolution_timeline: { total: 1, draft: 0, published: 1, archived: 0 },
          page_content: { total: 1, draft: 0, published: 1, archived: 0 },
        },
        error: null,
      });

    await act(async () => {
      root.render(<DashboardPage />);
    });
    await flushEffects();

    expect(container.textContent).toContain('Could not load counts');

    const retryButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Retry')
    ) as HTMLButtonElement;

    await act(async () => {
      retryButton.click();
    });
    await flushEffects();

    expect(getDashboardCountsMock).toHaveBeenCalledTimes(2);
    expect(container.textContent).not.toContain('Could not load counts');
    expect(container.querySelector('a[href="#/statistics"]')).not.toBeNull();
  });

  it('shows loading skeletons before the query resolves', async () => {
    let resolveCounts!: (value: any) => void;
    getDashboardCountsMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveCounts = resolve;
        })
    );

    await act(async () => {
      root.render(<DashboardPage />);
    });

    expect(container.textContent).toContain('Dashboard');
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(8);

    await act(async () => {
      resolveCounts({
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
        error: null,
      });
      await Promise.resolve();
    });
    await flushEffects();

    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(0);
  });
});
