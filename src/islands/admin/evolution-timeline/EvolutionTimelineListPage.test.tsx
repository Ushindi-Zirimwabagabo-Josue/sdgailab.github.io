// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const {
  listEvolutionTimelineMock,
  archiveEvolutionTimelineItemMock,
  deleteEvolutionTimelineItemMock,
  showToastMock,
} = vi.hoisted(() => ({
  listEvolutionTimelineMock: vi.fn(),
  archiveEvolutionTimelineItemMock: vi.fn(),
  deleteEvolutionTimelineItemMock: vi.fn(),
  showToastMock: vi.fn(),
}));

let latestTableProps: any = null;

vi.mock('../../../lib/admin-queries', () => ({
  listEvolutionTimeline: listEvolutionTimelineMock,
  archiveEvolutionTimelineItem: archiveEvolutionTimelineItemMock,
  deleteEvolutionTimelineItem: deleteEvolutionTimelineItemMock,
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
    props.isOpen ? (
      <button type="button" onClick={props.onConfirm}>
        Confirm Delete
      </button>
    ) : null,
}));

import EvolutionTimelineListPage from './EvolutionTimelineListPage';

async function flushEffects() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe('EvolutionTimelineListPage', () => {
  let container: HTMLDivElement;
  let root: Root;
  let originalHash: string;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    latestTableProps = null;
    originalHash = window.location.hash;
    listEvolutionTimelineMock.mockResolvedValue({
      data: [
        {
          id: 'tl-1',
          period: '2019-2020',
          title: 'Foundations',
          body: 'Early work',
          display_order: 1,
          status: 'published',
        },
        {
          id: 'tl-2',
          period: '2026',
          title: 'Mainstreaming',
          body: 'Scale-up',
          display_order: 2,
          status: 'draft',
        },
      ],
      error: null,
      page: 1,
      pageSize: 50,
      hasMore: false,
    });
    archiveEvolutionTimelineItemMock.mockResolvedValue({ error: null });
    deleteEvolutionTimelineItemMock.mockResolvedValue({ error: null });

    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    window.location.hash = originalHash;
  });

  it('loads timeline entries into the table', async () => {
    await act(async () => {
      root.render(<EvolutionTimelineListPage />);
    });
    await flushEffects();

    expect(listEvolutionTimelineMock).toHaveBeenCalled();
    expect(container.textContent).toContain('Evolution Timeline');
    expect(latestTableProps.data).toHaveLength(2);
  });

  it('navigates to the edit route', async () => {
    await act(async () => {
      root.render(<EvolutionTimelineListPage />);
    });
    await flushEffects();

    act(() => latestTableProps.onEdit('tl-2'));
    expect(window.location.hash).toBe('#/evolution-timeline/edit/tl-2');
  });

  it('archives a timeline entry', async () => {
    await act(async () => {
      root.render(<EvolutionTimelineListPage />);
    });
    await flushEffects();

    await act(async () => {
      await latestTableProps.onArchive('tl-1');
    });
    await flushEffects();

    expect(archiveEvolutionTimelineItemMock).toHaveBeenCalledWith('tl-1');
    expect(showToastMock).toHaveBeenCalledWith('Timeline entry archived', 'success');
  });

  it('deletes a timeline entry after confirmation', async () => {
    await act(async () => {
      root.render(<EvolutionTimelineListPage />);
    });
    await flushEffects();

    act(() => latestTableProps.onDelete('tl-1'));

    const confirmButton = container.querySelector('button') as HTMLButtonElement;
    await act(async () => {
      confirmButton.click();
    });
    await flushEffects();

    expect(deleteEvolutionTimelineItemMock).toHaveBeenCalledWith('tl-1');
    expect(showToastMock).toHaveBeenCalledWith('Timeline entry deleted permanently', 'success');
  });
});
