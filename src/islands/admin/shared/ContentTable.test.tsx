// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { ContentTable } from './ContentTable';
import { expectAccessible } from '../../../test/axe';

type Item = {
  id: string;
  name: string;
  status: 'draft' | 'published' | 'archived';
};

describe('ContentTable', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
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

  it('renders loading skeleton rows', async () => {
    await act(async () => {
      root.render(
        <ContentTable<Item>
          columns={[{ label: 'Name', accessor: 'name' }]}
          data={[]}
          loading={true}
          error={null}
          onEdit={() => {}}
          onArchive={() => {}}
          onDelete={() => {}}
          addNewHref="#/new"
        />
      );
    });

    expect(container.textContent).toContain('Add New');
    expect(container.querySelectorAll('tbody tr').length).toBe(5);
  });

  it('renders error state with retry action', async () => {
    const onRetry = vi.fn();

    await act(async () => {
      root.render(
        <ContentTable<Item>
          columns={[{ label: 'Name', accessor: 'name' }]}
          data={[]}
          loading={false}
          error="Fetch failed"
          onEdit={() => {}}
          onArchive={() => {}}
          onDelete={() => {}}
          onRetry={onRetry}
          addNewHref="#/new"
        />
      );
    });

    const retry = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Retry')
    ) as HTMLButtonElement;

    expect(container.textContent).toContain('Fetch failed');

    await act(async () => {
      retry.click();
    });

    expect(onRetry).toHaveBeenCalled();
  });

  it('renders rows and action buttons with status badge behavior', async () => {
    const onEdit = vi.fn();
    const onArchive = vi.fn();
    const onDelete = vi.fn();

    await act(async () => {
      root.render(
        <ContentTable<Item>
          columns={[{ label: 'Name', accessor: 'name' }]}
          data={[
            { id: '1', name: 'Draft item', status: 'draft' },
            { id: '2', name: 'Archived item', status: 'archived' },
          ]}
          loading={false}
          error={null}
          onEdit={onEdit}
          onArchive={onArchive}
          onDelete={onDelete}
          addNewHref="#/new"
        />
      );
    });

    expect(container.textContent).toContain('Draft item');
    expect(container.textContent).toContain('Archived item');

    const buttons = Array.from(container.querySelectorAll('button'));
    const archiveButton = buttons.find((button) => button.textContent === 'Archive') as HTMLButtonElement;
    const deleteButton = buttons.find((button) => button.textContent === 'Delete') as HTMLButtonElement;
    const editButton = buttons.find((button) => button.textContent === 'Edit') as HTMLButtonElement;

    await act(async () => {
      editButton.click();
      archiveButton.click();
      deleteButton.click();
    });

    expect(onEdit).toHaveBeenCalledWith('1');
    expect(onArchive).toHaveBeenCalledWith('1');
    expect(onDelete).toHaveBeenCalledWith('2');
  });

  it('has no detectable accessibility violations', async () => {
    await act(async () => {
      root.render(
        <ContentTable<Item>
          columns={[{ label: 'Name', accessor: 'name' }]}
          data={[{ id: '1', name: 'Published item', status: 'published' }]}
          loading={false}
          error={null}
          onEdit={() => {}}
          onArchive={() => {}}
          onDelete={() => {}}
          addNewHref="#/new"
        />
      );
    });

    await expectAccessible(container);
  });
});
