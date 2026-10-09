// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import ObservabilityBoundary from './ObservabilityBoundary';

vi.mock('../../lib/observability', () => ({
  ensureObservabilityInitialized: vi.fn(),
  logAppError: vi.fn(),
}));

function BrokenChild(): never {
  throw new Error('render failed');
}

describe('ObservabilityBoundary', () => {
  let container: HTMLDivElement;
  let root: Root;

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    container?.remove();
  });

  it('renders children when no error occurs', () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => {
      root.render(
        <ObservabilityBoundary surface="public" name="TestIsland">
          <p>Healthy island</p>
        </ObservabilityBoundary>
      );
    });

    expect(container.textContent).toContain('Healthy island');
  });

  it('shows a fallback and reports the error when a child throws', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { logAppError } = await import('../../lib/observability');

    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => {
      root.render(
        <ObservabilityBoundary surface="admin" name="TestIsland">
          <BrokenChild />
        </ObservabilityBoundary>
      );
    });

    expect(container.textContent).toContain('Something went wrong');
    expect(logAppError).toHaveBeenCalledWith(
      'react.error_boundary.TestIsland',
      expect.any(Error),
      expect.objectContaining({ component: 'TestIsland', surface: 'admin' })
    );

    consoleError.mockRestore();
  });
});
