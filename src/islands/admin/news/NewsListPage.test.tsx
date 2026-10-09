// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const {
  listNewsArticlesMock,
  archiveNewsArticleMock,
  deleteNewsArticleMock,
  showToastMock,
} = vi.hoisted(() => ({
  listNewsArticlesMock: vi.fn(),
  archiveNewsArticleMock: vi.fn(),
  deleteNewsArticleMock: vi.fn(),
  showToastMock: vi.fn(),
}));

let latestTableProps: any = null;

vi.mock('../../../lib/admin-queries', () => ({
  listNewsArticles: listNewsArticlesMock,
  archiveNewsArticle: archiveNewsArticleMock,
  deleteNewsArticle: deleteNewsArticleMock,
}));

vi.mock('../layout/Toast', () => ({
  useToast: () => ({ showToast: showToastMock }),
}));

vi.mock('../shared/ContentTable', () => ({
  ContentTable: (props: any) => {
    latestTableProps = props;
    return <div>{props.error ?? `rows:${props.data.length}`}</div>;
  },
}));

vi.mock('../shared/ConfirmDialog', () => ({
  ConfirmDialog: (props: any) =>
    props.isOpen ? <button type="button" onClick={props.onConfirm}>Confirm Delete</button> : null,
}));

import NewsListPage from './NewsListPage';

async function flushEffects() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

function setInputValue(input: HTMLInputElement, value: string) {
  const proto = Object.getPrototypeOf(input);
  const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
  descriptor?.set?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

describe('NewsListPage', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    latestTableProps = null;
    listNewsArticlesMock.mockResolvedValue({
      data: [
        { id: 'news-1', title: 'Climate Article', slug: 'climate', author_name: 'Ada', publish_date: '2026-07-15', status: 'draft' },
        { id: 'news-2', title: 'Resilience Update', slug: 'resilience', author_name: 'Grace', publish_date: '2026-08-01', status: 'published' },
      ],
      error: null,
      page: 1,
      pageSize: 50,
      hasMore: false,
    });
    archiveNewsArticleMock.mockResolvedValue({ error: null });
    deleteNewsArticleMock.mockResolvedValue({ error: null });

    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('loads articles into the table', async () => {
    await act(async () => {
      root.render(<NewsListPage />);
    });
    await flushEffects();

    expect(listNewsArticlesMock).toHaveBeenCalled();
    expect(latestTableProps.data).toHaveLength(2);
  });

  it('filters articles by search query', async () => {
    await act(async () => {
      root.render(<NewsListPage />);
    });
    await flushEffects();

    const searchInput = container.querySelector('#news-search') as HTMLInputElement;
    await act(async () => {
      setInputValue(searchInput, 'grace');
    });
    await flushEffects();

    expect(latestTableProps.data).toHaveLength(1);
    expect(latestTableProps.data[0].title).toBe('Resilience Update');
  });

  it('archives an article', async () => {
    await act(async () => {
      root.render(<NewsListPage />);
    });
    await flushEffects();

    await act(async () => {
      await latestTableProps.onArchive('news-1');
    });
    await flushEffects();

    expect(archiveNewsArticleMock).toHaveBeenCalledWith('news-1');
    expect(showToastMock).toHaveBeenCalledWith('Article archived', 'success');
  });

  it('deletes an article after confirmation', async () => {
    await act(async () => {
      root.render(<NewsListPage />);
    });
    await flushEffects();

    act(() => latestTableProps.onDelete('news-1'));

    const confirmButton = container.querySelector('button') as HTMLButtonElement;

    await act(async () => {
      confirmButton.click();
    });
    await flushEffects();

    expect(deleteNewsArticleMock).toHaveBeenCalledWith('news-1');
    expect(showToastMock).toHaveBeenCalledWith('Article deleted permanently', 'success');
  });
});
