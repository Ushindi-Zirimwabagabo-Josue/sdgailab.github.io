// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const { signOutMock } = vi.hoisted(() => ({
  signOutMock: vi.fn(),
}));

let latestSidebarProps: any[] = [];

vi.mock('./Sidebar', () => ({
  default: (props: any) => {
    latestSidebarProps.push(props);
    return <div data-sidebar={props.isOpen ? 'open' : 'closed'}>{props.currentPath}</div>;
  },
}));

vi.mock('./Toast', () => ({
  ToastProvider: ({ children }: { children: React.ReactNode }) => <div data-toast-provider="true">{children}</div>,
}));

vi.mock('../auth/AuthProvider', () => ({
  useAuth: () => ({
    user: { email: 'editor@example.org' },
    signOut: signOutMock,
  }),
}));

import AdminLayout from './AdminLayout';

describe('AdminLayout', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    latestSidebarProps = [];
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

  it('renders the authenticated header and layout shell', async () => {
    await act(async () => {
      root.render(
        <AdminLayout currentPath="/projects">
          <div>Dashboard body</div>
        </AdminLayout>
      );
    });

    expect(container.querySelector('[data-toast-provider="true"]')).not.toBeNull();
    expect(container.textContent).toContain('editor@example.org');
    expect(container.textContent).toContain('Dashboard body');
    expect(latestSidebarProps).toHaveLength(2);
    expect(latestSidebarProps[0]).toEqual({ currentPath: '/projects' });
    expect(latestSidebarProps[1]).toEqual({ currentPath: '/projects', isOpen: false });
  });

  it('toggles the mobile sidebar overlay and closes it on backdrop click', async () => {
    await act(async () => {
      root.render(
        <AdminLayout currentPath="/news">
          <div>Body</div>
        </AdminLayout>
      );
    });

    const toggleButton = container.querySelector('button[aria-label="Toggle navigation"]') as HTMLButtonElement;

    await act(async () => {
      toggleButton.click();
    });

    const overlay = container.querySelector('div.fixed.inset-0.z-30.bg-black\\/30.md\\:hidden') as HTMLDivElement;
    expect(overlay).not.toBeNull();
    expect(latestSidebarProps.at(-1)).toEqual({ currentPath: '/news', isOpen: true });

    await act(async () => {
      overlay.click();
    });

    expect(container.querySelector('div.fixed.inset-0.z-30.bg-black\\/30.md\\:hidden')).toBeNull();
    expect(latestSidebarProps.at(-1)).toEqual({ currentPath: '/news', isOpen: false });
  });

  it('signs out from the header action', async () => {
    await act(async () => {
      root.render(
        <AdminLayout currentPath="/">
          <div>Body</div>
        </AdminLayout>
      );
    });

    const signOutButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Sign Out')
    ) as HTMLButtonElement;

    await act(async () => {
      signOutButton.click();
    });

    expect(signOutMock).toHaveBeenCalled();
  });
});
