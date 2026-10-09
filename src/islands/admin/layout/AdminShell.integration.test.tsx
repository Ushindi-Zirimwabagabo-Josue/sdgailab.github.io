// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const { signOutMock } = vi.hoisted(() => ({
  signOutMock: vi.fn(),
}));

vi.mock('../auth/AuthProvider', () => ({
  useAuth: () => ({
    user: { email: 'editor@example.org' },
    signOut: signOutMock,
  }),
}));

import AdminLayout from './AdminLayout';

describe('Admin shell integration', () => {
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

  it('renders the real sidebar, toast provider, and page body together', async () => {
    await act(async () => {
      root.render(
        <AdminLayout currentPath="/projects">
          <div>Projects workspace</div>
        </AdminLayout>
      );
    });

    expect(container.querySelector('nav[aria-label="Admin navigation"]')).not.toBeNull();
    expect(container.textContent).toContain('Projects');
    expect(container.textContent).toContain('Projects workspace');
    expect(container.textContent).toContain('editor@example.org');

    const projectsLink = Array.from(container.querySelectorAll('a')).find((link) =>
      link.textContent?.includes('Projects')
    );
    expect(projectsLink?.getAttribute('aria-current')).toBe('page');
  });

  it('opens the mobile sidebar with the real navigation tree', async () => {
    await act(async () => {
      root.render(
        <AdminLayout currentPath="/news">
          <div>News workspace</div>
        </AdminLayout>
      );
    });

    const toggleButton = container.querySelector('button[aria-label="Toggle navigation"]') as HTMLButtonElement;

    await act(async () => {
      toggleButton.click();
    });

    const newsLinks = Array.from(container.querySelectorAll('a')).filter((link) =>
      link.textContent?.includes('News')
    );
    expect(newsLinks.length).toBeGreaterThan(0);
    expect(newsLinks.some((link) => link.getAttribute('aria-current') === 'page')).toBe(true);
  });
});
