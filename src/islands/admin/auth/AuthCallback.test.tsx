// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const authState = vi.hoisted(() => ({
  session: null as { user: { email: string } } | null,
  loading: true,
}));

const { completeAuthCallbackMock, hasAuthCallbackParamsMock } = vi.hoisted(() => ({
  completeAuthCallbackMock: vi.fn(),
  hasAuthCallbackParamsMock: vi.fn(),
}));

vi.mock('./AuthProvider', () => ({
  useAuth: () => authState,
}));

vi.mock('../../../lib/auth-callback', () => ({
  hasAuthCallbackParams: hasAuthCallbackParamsMock,
  completeAuthCallback: completeAuthCallbackMock,
  clearAuthCallbackQueryParams: vi.fn(),
}));

import AuthCallback from './AuthCallback';

describe('AuthCallback', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    authState.session = null;
    authState.loading = true;
    hasAuthCallbackParamsMock.mockReturnValue(true);
    completeAuthCallbackMock.mockResolvedValue({ error: null });
    window.location.hash = '';
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

  async function renderCallback() {
    await act(async () => {
      root.render(<AuthCallback />);
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  it('shows an error when the callback has no auth params', async () => {
    hasAuthCallbackParamsMock.mockReturnValue(false);
    await renderCallback();

    expect(container.textContent).toContain('Invalid or expired link');
    expect(container.querySelector('a[href="#/login"]')).not.toBeNull();
  });

  it('shows a loading state while auth tokens are being processed', async () => {
    await renderCallback();

    expect(container.textContent).toContain('Signing you in...');
    expect(container.querySelector('.animate-spin')).not.toBeNull();
    expect(completeAuthCallbackMock).toHaveBeenCalled();
  });

  it('redirects to the dashboard when a session becomes available', async () => {
    await renderCallback();

    authState.session = { user: { email: 'editor@example.org' } };
    authState.loading = false;

    await act(async () => {
      root.render(<AuthCallback />);
      await Promise.resolve();
    });

    expect(window.location.hash).toBe('#/');
  });

  it('shows an error when callback exchange fails', async () => {
    completeAuthCallbackMock.mockResolvedValue({
      error: new Error('Invalid grant'),
    });

    await renderCallback();

    expect(container.textContent).toContain('Invalid or expired link');
  });
});
