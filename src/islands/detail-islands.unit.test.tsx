// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import NewsDetail from './NewsDetail';
import ProjectDetail from './ProjectDetail';

const { getNewsArticleBySlugMock, getProjectBySlugMock } = vi.hoisted(() => ({
  getNewsArticleBySlugMock: vi.fn(),
  getProjectBySlugMock: vi.fn(),
}));

vi.mock('../lib/queries', () => ({
  getNewsArticleBySlug: getNewsArticleBySlugMock,
  getProjectBySlug: getProjectBySlugMock,
}));

vi.mock('../lib/markdown', () => ({
  renderMarkdown: vi.fn().mockResolvedValue('<p>preview</p>'),
}));

describe('detail islands (unit)', () => {
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
    vi.clearAllMocks();
    getNewsArticleBySlugMock.mockResolvedValue({ data: null, error: null });
    getProjectBySlugMock.mockResolvedValue({ data: null, error: null });
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('ProjectDetail shows the missing-slug message', async () => {
    await render(<ProjectDetail />);
    expect(container.textContent).toContain('No project specified.');
  });

  it('NewsDetail shows the missing-slug message', async () => {
    await render(<NewsDetail />);
    expect(container.textContent).toContain('No article specified.');
  });
});
