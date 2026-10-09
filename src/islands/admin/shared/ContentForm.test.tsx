// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const { setIsDirtyMock } = vi.hoisted(() => ({
  setIsDirtyMock: vi.fn(),
}));

vi.mock('../AdminApp', () => ({
  useNavigationGuard: () => ({
    setIsDirty: setIsDirtyMock,
  }),
}));

import { ContentForm } from './ContentForm';
import { expectAccessible } from '../../../test/axe';

describe('ContentForm', () => {
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

  it('registers and clears dirty state with the navigation guard', async () => {
    await act(async () => {
      root.render(
        <ContentForm onSubmit={() => {}} isEdit={false} loading={false} backHref="#/back" isDirty={true}>
          <div>Body</div>
        </ContentForm>
      );
    });

    expect(setIsDirtyMock).toHaveBeenCalledWith(true);

    act(() => {
      root.unmount();
    });

    expect(setIsDirtyMock).toHaveBeenLastCalledWith(false);
  });

  it('renders loading submit state and cancel link', async () => {
    await act(async () => {
      root.render(
        <ContentForm onSubmit={() => {}} isEdit={true} loading={true} backHref="#/stats" isDirty={false}>
          <div>Body</div>
        </ContentForm>
      );
    });

    const cancelLink = container.querySelector('a[href="#/stats"]');
    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;

    expect(cancelLink?.textContent).toBe('Cancel');
    expect(submitButton.disabled).toBe(true);
    expect(submitButton.textContent).toContain('Update');
  });

  it('has no detectable accessibility violations', async () => {
    await act(async () => {
      root.render(
        <ContentForm onSubmit={() => {}} isEdit={false} loading={false} backHref="#/back" isDirty={false}>
          <label htmlFor="title">Title</label>
          <input id="title" name="title" />
        </ContentForm>
      );
    });

    await expectAccessible(container);
  });
});
