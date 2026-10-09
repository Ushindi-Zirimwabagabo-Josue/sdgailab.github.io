// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const {
  listPeopleMock,
  archivePersonMock,
  deletePersonMock,
  showToastMock,
} = vi.hoisted(() => ({
  listPeopleMock: vi.fn(),
  archivePersonMock: vi.fn(),
  deletePersonMock: vi.fn(),
  showToastMock: vi.fn(),
}));

let latestTableProps: any = null;

vi.mock('../../../lib/admin-queries', () => ({
  listPeople: listPeopleMock,
  archivePerson: archivePersonMock,
  deletePerson: deletePersonMock,
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

import PeopleListPage from './PeopleListPage';
import { expectAccessible } from '../../../test/axe';

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

describe('PeopleListPage', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    latestTableProps = null;
    listPeopleMock.mockResolvedValue({
      data: [
        { id: 'person-1', name: 'Ada', role_title: 'Advisor', group_type: 'advisory_board', team_group: null, status: 'draft', display_order: 1 },
        { id: 'person-2', name: 'Grace', role_title: 'Engineer', group_type: 'team', team_group: 'GIS & GeoAI · Software Development', status: 'published', display_order: 2 },
      ],
      error: null,
      page: 1,
      pageSize: 50,
      hasMore: false,
    });
    archivePersonMock.mockResolvedValue({ error: null });
    deletePersonMock.mockResolvedValue({ error: null });

    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('loads people into the table and filters to advisory board', async () => {
    await act(async () => {
      root.render(<PeopleListPage />);
    });
    await flushEffects();

    expect(listPeopleMock).toHaveBeenCalled();
    expect(latestTableProps.data).toHaveLength(2);

    const advisoryButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Advisory Board')
    ) as HTMLButtonElement;

    await act(async () => {
      advisoryButton.click();
    });

    expect(latestTableProps.data).toHaveLength(1);
    expect(latestTableProps.data[0].id).toBe('person-1');
  });

  it('filters people by search query', async () => {
    await act(async () => {
      root.render(<PeopleListPage />);
    });
    await flushEffects();

    const searchInput = container.querySelector('#people-search') as HTMLInputElement;
    await act(async () => {
      setInputValue(searchInput, 'engineer');
    });
    await flushEffects();

    expect(latestTableProps.data).toHaveLength(1);
    expect(latestTableProps.data[0].name).toBe('Grace');
  });

  it('archives a person', async () => {
    await act(async () => {
      root.render(<PeopleListPage />);
    });
    await flushEffects();

    await act(async () => {
      await latestTableProps.onArchive('person-1');
    });
    await flushEffects();

    expect(archivePersonMock).toHaveBeenCalledWith('person-1');
    expect(showToastMock).toHaveBeenCalledWith('Person archived', 'success');
  });

  it('deletes a person after confirmation', async () => {
    await act(async () => {
      root.render(<PeopleListPage />);
    });
    await flushEffects();

    act(() => latestTableProps.onDelete('person-1'));

    const confirmButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Confirm Delete')
    ) as HTMLButtonElement;

    await act(async () => {
      confirmButton.click();
    });
    await flushEffects();

    expect(deletePersonMock).toHaveBeenCalledWith('person-1');
    expect(showToastMock).toHaveBeenCalledWith('Person deleted permanently', 'success');
  });

  it('has no detectable accessibility violations', async () => {
    await act(async () => {
      root.render(<PeopleListPage />);
    });
    await flushEffects();

    await expectAccessible(container);
  });
});
