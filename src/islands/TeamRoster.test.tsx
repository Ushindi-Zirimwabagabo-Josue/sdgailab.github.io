// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import TeamRoster from './TeamRoster';
import { expectAccessibleSmoke } from '../test/axe';

const { getPublishedPeopleMock, logAppErrorMock } = vi.hoisted(() => ({
  getPublishedPeopleMock: vi.fn(),
  logAppErrorMock: vi.fn(),
}));

vi.mock('../lib/queries', () => ({
  getPublishedPeople: getPublishedPeopleMock,
}));

vi.mock('../lib/observability', () => ({
  ensureObservabilityInitialized: vi.fn(),
  logAppError: logAppErrorMock,
}));

const sampleMember = {
  id: 'person-1',
  name: 'Ada Lovelace',
  role_title: 'Research Lead',
  photo_url: null,
  team_group: 'Coordination · Research & Advisory',
  biography: null,
  display_order: 1,
};

describe('TeamRoster', () => {
  let container: HTMLDivElement;
  let root: Root;

  async function render(ui: React.ReactNode) {
    await act(async () => {
      root.render(ui);
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  function remount() {
    act(() => {
      root.unmount();
    });
    root = createRoot(container);
  }

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    vi.clearAllMocks();
    getPublishedPeopleMock.mockResolvedValue({ data: [], error: null });
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('loads team members and renders grouped sections', async () => {
    getPublishedPeopleMock.mockResolvedValueOnce({
      data: [sampleMember],
      error: null,
    });

    await render(<TeamRoster layout="grouped" />);

    expect(getPublishedPeopleMock).toHaveBeenCalledWith('team');
    expect(container.textContent).toContain('Coordination · Research & Advisory');
    expect(container.textContent).toContain('Ada Lovelace');
    expect(container.textContent).toContain('Research Lead');
    expect(container.querySelector('.person-card')).toBeTruthy();
  });

  it('renders compact layout sorted by display order', async () => {
    getPublishedPeopleMock.mockResolvedValueOnce({
      data: [
        { ...sampleMember, id: 'b', name: 'Second', display_order: 2 },
        { ...sampleMember, id: 'a', name: 'First', display_order: 1 },
      ],
      error: null,
    });

    await render(<TeamRoster layout="compact" />);

    expect(container.querySelector('.roster')).toBeTruthy();
    const names = Array.from(container.querySelectorAll('.roster strong')).map(
      (el) => el.textContent
    );
    expect(names).toEqual(['First', 'Second']);
  });

  it('renders empty and error states', async () => {
    getPublishedPeopleMock.mockResolvedValueOnce({ data: [], error: null });
    await render(<TeamRoster />);
    expect(container.textContent).toContain('No members listed yet.');

    remount();
    getPublishedPeopleMock.mockResolvedValueOnce({ data: [], error: 'RLS denied' });
    await render(<TeamRoster />);
    expect(container.textContent).toContain('Unable to load team information');
    expect(logAppErrorMock).toHaveBeenCalled();
  });

  it('shows avatar fallback in compact layout when photo is missing', async () => {
    getPublishedPeopleMock.mockResolvedValueOnce({
      data: [sampleMember],
      error: null,
    });

    await render(<TeamRoster layout="compact" />);

    expect(container.querySelector('.roster-avatar-fallback')).toBeTruthy();
  });

  it('has no serious accessibility violations after grouped load', async () => {
    getPublishedPeopleMock.mockResolvedValueOnce({
      data: [sampleMember],
      error: null,
    });

    await render(<TeamRoster layout="grouped" />);

    await expectAccessibleSmoke(container);
  });
});
