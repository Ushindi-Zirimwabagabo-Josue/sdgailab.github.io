// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const {
  listPublicationsMock,
  archivePublicationMock,
  deletePublicationMock,
  showToastMock,
} = vi.hoisted(() => ({
  listPublicationsMock: vi.fn(),
  archivePublicationMock: vi.fn(),
  deletePublicationMock: vi.fn(),
  showToastMock: vi.fn(),
}));

let latestTableProps: any = null;

vi.mock('../../../lib/admin-queries', () => ({
  listPublications: listPublicationsMock,
  archivePublication: archivePublicationMock,
  deletePublication: deletePublicationMock,
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

import PublicationsListPage from './PublicationsListPage';

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

describe('PublicationsListPage', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    latestTableProps = null;
    listPublicationsMock.mockResolvedValue({
      data: [
        {
          id: 'pub-1',
          title: 'Climate Brief',
          slug: 'climate-brief',
          publication_type: 'brief_white_paper',
          authors: 'Ada',
          publisher: 'UNDP',
          summary: 'Brief summary',
          status: 'draft',
          publication_date: '2024-01-01',
          date_label: null,
        },
        {
          id: 'pub-2',
          title: 'Skills Dataset',
          slug: 'skills-dataset',
          publication_type: 'dataset',
          authors: 'Grace',
          publisher: 'Lab',
          summary: 'Dataset summary',
          status: 'published',
          publication_date: '2025-06-01',
          date_label: null,
        },
      ],
      error: null,
      page: 1,
      pageSize: 50,
      hasMore: false,
    });
    archivePublicationMock.mockResolvedValue({ error: null });
    deletePublicationMock.mockResolvedValue({ error: null });

    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('loads publications into the table', async () => {
    await act(async () => {
      root.render(<PublicationsListPage />);
    });
    await flushEffects();

    expect(listPublicationsMock).toHaveBeenCalled();
    expect(container.textContent).toContain('Research publications');
    expect(latestTableProps.data).toHaveLength(2);
  });

  it('filters publications by search query', async () => {
    await act(async () => {
      root.render(<PublicationsListPage />);
    });
    await flushEffects();

    const searchInput = container.querySelector('#publication-search') as HTMLInputElement;
    await act(async () => {
      setInputValue(searchInput, 'dataset');
    });
    await flushEffects();

    expect(latestTableProps.data).toHaveLength(1);
    expect(latestTableProps.data[0].title).toBe('Skills Dataset');
  });

  it('archives a publication', async () => {
    await act(async () => {
      root.render(<PublicationsListPage />);
    });
    await flushEffects();

    await act(async () => {
      await latestTableProps.onArchive('pub-1');
    });
    await flushEffects();

    expect(archivePublicationMock).toHaveBeenCalledWith('pub-1');
    expect(showToastMock).toHaveBeenCalledWith('Publication archived', 'success');
  });

  it('deletes a publication after confirmation', async () => {
    await act(async () => {
      root.render(<PublicationsListPage />);
    });
    await flushEffects();

    act(() => latestTableProps.onDelete('pub-1'));

    const confirmButton = container.querySelector('button') as HTMLButtonElement;
    await act(async () => {
      confirmButton.click();
    });
    await flushEffects();

    expect(deletePublicationMock).toHaveBeenCalledWith('pub-1');
    expect(showToastMock).toHaveBeenCalledWith('Publication deleted permanently', 'success');
  });
});
