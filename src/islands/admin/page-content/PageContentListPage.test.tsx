// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const {
  listPageContentMock,
  archivePageContentMock,
  deletePageContentMock,
  ensureCatalogPageSectionsMock,
  showToastMock,
} = vi.hoisted(() => ({
  listPageContentMock: vi.fn(),
  archivePageContentMock: vi.fn(),
  deletePageContentMock: vi.fn(),
  ensureCatalogPageSectionsMock: vi.fn(),
  showToastMock: vi.fn(),
}));

let latestTableProps: any = null;

vi.mock('../../../lib/admin-queries', () => ({
  listPageContent: listPageContentMock,
  archivePageContent: archivePageContentMock,
  deletePageContent: deletePageContentMock,
  ensureCatalogPageSections: ensureCatalogPageSectionsMock,
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

import PageContentListPage from './PageContentListPage';

async function flushEffects() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe('PageContentListPage', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    latestTableProps = null;
    listPageContentMock.mockResolvedValue({
      data: [{ id: 'content-1', page_slug: 'about', section_slug: 'hero', status: 'draft' }],
      error: null,
      page: 1,
      pageSize: 50,
      hasMore: false,
    });
    archivePageContentMock.mockResolvedValue({ error: null });
    deletePageContentMock.mockResolvedValue({ error: null });
    ensureCatalogPageSectionsMock.mockResolvedValue({ data: { created: 0 }, error: null });

    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('loads page content into the table', async () => {
    await act(async () => {
      root.render(<PageContentListPage />);
    });
    await flushEffects();

    expect(listPageContentMock).toHaveBeenCalled();
    expect(latestTableProps.data).toHaveLength(1);
  });

  it('archives a content block', async () => {
    await act(async () => {
      root.render(<PageContentListPage />);
    });
    await flushEffects();

    await act(async () => {
      await latestTableProps.onArchive('content-1');
    });
    await flushEffects();

    expect(archivePageContentMock).toHaveBeenCalledWith('content-1');
    expect(showToastMock).toHaveBeenCalledWith('Content archived', 'success');
  });

  it('deletes a content block after confirmation', async () => {
    await act(async () => {
      root.render(<PageContentListPage />);
    });
    await flushEffects();

    act(() => latestTableProps.onDelete('content-1'));

    const confirmButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Confirm Delete')
    ) as HTMLButtonElement;

    await act(async () => {
      confirmButton.click();
    });
    await flushEffects();

    expect(deletePageContentMock).toHaveBeenCalledWith('content-1');
    expect(showToastMock).toHaveBeenCalledWith('Content deleted permanently', 'success');
  });
});
