// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { ToastProvider, useToast } from './Toast';
import { expectAccessible } from '../../../test/axe';

function Harness() {
  const { showToast } = useToast();
  return (
    <div>
      <button type="button" onClick={() => showToast('Saved successfully', 'success')}>
        Show success
      </button>
      <button type="button" onClick={() => showToast('Something went wrong', 'error')}>
        Show error
      </button>
    </div>
  );
}

describe('ToastProvider', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.useFakeTimers();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    vi.useRealTimers();
  });

  it('renders and dismisses a success toast automatically', async () => {
    await act(async () => {
      root.render(
        <ToastProvider>
          <Harness />
        </ToastProvider>
      );
    });

    const successButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Show success')
    ) as HTMLButtonElement;

    await act(async () => {
      successButton.click();
    });

    expect(container.textContent).toContain('Saved successfully');

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(container.textContent).not.toContain('Saved successfully');
  });

  it('renders an error toast with alert semantics and manual dismissal', async () => {
    await act(async () => {
      root.render(
        <ToastProvider>
          <Harness />
        </ToastProvider>
      );
    });

    const errorButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Show error')
    ) as HTMLButtonElement;

    await act(async () => {
      errorButton.click();
    });

    const alert = container.querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('Something went wrong');

    const dismissButton = container.querySelector('button[aria-label="Dismiss notification"]') as HTMLButtonElement;

    await act(async () => {
      dismissButton.click();
    });

    expect(container.textContent).not.toContain('Something went wrong');
  });

  it('has no detectable accessibility violations', async () => {
    vi.useRealTimers();
    await act(async () => {
      root.render(
        <ToastProvider>
          <Harness />
        </ToastProvider>
      );
    });

    const successButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Show success')
    ) as HTMLButtonElement;

    await act(async () => {
      successButton.click();
    });

    await expectAccessible(container);
  });
});
