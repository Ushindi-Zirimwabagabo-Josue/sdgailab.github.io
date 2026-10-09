// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const {
  listStatisticsMock,
  archiveStatisticMock,
  deleteStatisticMock,
  showToastMock,
} = vi.hoisted(() => ({
  listStatisticsMock: vi.fn(),
  archiveStatisticMock: vi.fn(),
  deleteStatisticMock: vi.fn(),
  showToastMock: vi.fn(),
}));

let latestTableProps: any = null;
let latestDialogProps: any = null;

vi.mock('../../../lib/admin-queries', () => ({
  listStatistics: listStatisticsMock,
  archiveStatistic: archiveStatisticMock,
  deleteStatistic: deleteStatisticMock,
}));

vi.mock('../layout/Toast', () => ({
  useToast: () => ({
    showToast: showToastMock,
  }),
}));

vi.mock('../shared/ContentTable', () => ({
  ContentTable: (props: any) => {
    latestTableProps = props;
    return <div data-testid="content-table">{props.error ?? `rows:${props.data.length}`}</div>;
  },
}));

vi.mock('../shared/ConfirmDialog', () => ({
  ConfirmDialog: (props: any) => {
    latestDialogProps = props;
    return props.isOpen ? <button type="button" onClick={props.onConfirm}>Confirm Delete</button> : null;
  },
}));

import StatisticsListPage from './StatisticsListPage';

async function flushEffects() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe('StatisticsListPage', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    latestTableProps = null;
    latestDialogProps = null;
    listStatisticsMock.mockResolvedValue({
      data: [{ id: 'stat-1', label: 'Projects', value: '12', status: 'draft', display_order: 1 }],
      error: null,
      page: 1,
      pageSize: 50,
      hasMore: false,
    });
    archiveStatisticMock.mockResolvedValue({ error: null });
    deleteStatisticMock.mockResolvedValue({ error: null });

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

  it('loads statistics into the content table', async () => {
    await act(async () => {
      root.render(<StatisticsListPage />);
    });
    await flushEffects();

    expect(listStatisticsMock).toHaveBeenCalled();
    expect(latestTableProps.data).toHaveLength(1);
    expect(container.textContent).toContain('rows:1');
  });

  it('archives a statistic and refreshes the list', async () => {
    await act(async () => {
      root.render(<StatisticsListPage />);
    });
    await flushEffects();

    await act(async () => {
      await latestTableProps.onArchive('stat-1');
    });
    await flushEffects();

    expect(archiveStatisticMock).toHaveBeenCalledWith('stat-1');
    expect(showToastMock).toHaveBeenCalledWith('Statistic archived', 'success');
    expect(listStatisticsMock).toHaveBeenCalledTimes(2);
  });

  it('deletes a statistic after confirmation and refreshes the list', async () => {
    await act(async () => {
      root.render(<StatisticsListPage />);
    });
    await flushEffects();

    act(() => {
      latestTableProps.onDelete('stat-1');
    });

    const confirmButton = container.querySelector('button');
    expect(confirmButton?.textContent).toContain('Confirm Delete');

    await act(async () => {
      confirmButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await flushEffects();

    expect(deleteStatisticMock).toHaveBeenCalledWith('stat-1');
    expect(showToastMock).toHaveBeenCalledWith('Statistic deleted permanently', 'success');
    expect(listStatisticsMock).toHaveBeenCalledTimes(2);
  });
});
