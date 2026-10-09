// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import Sidebar from './Sidebar';
import { expectAccessible } from '../../../test/axe';

describe('Sidebar', () => {
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

  it('renders admin navigation links with accessible labels', async () => {
    await act(async () => {
      root.render(<Sidebar currentPath="/" />);
    });

    const nav = container.querySelector('nav[aria-label="Admin navigation"]');
    expect(nav).not.toBeNull();
    expect(container.textContent).toContain('Dashboard');
    expect(container.textContent).toContain('Page Content');

    const links = container.querySelectorAll('a');
    expect(links.length).toBeGreaterThanOrEqual(7);
  });

  it('marks the dashboard link active on the root path', async () => {
    await act(async () => {
      root.render(<Sidebar currentPath="/" />);
    });

    const dashboardLink = Array.from(container.querySelectorAll('a')).find((link) =>
      link.textContent?.includes('Dashboard')
    );
    expect(dashboardLink?.getAttribute('aria-current')).toBe('page');
    expect(dashboardLink?.className).toContain('bg-lab-section');
  });

  it('marks the matching section link active', async () => {
    await act(async () => {
      root.render(<Sidebar currentPath="/projects" />);
    });

    const projectsLink = Array.from(container.querySelectorAll('a')).find((link) =>
      link.textContent?.includes('Projects')
    );
    const dashboardLink = Array.from(container.querySelectorAll('a')).find((link) =>
      link.textContent?.includes('Dashboard')
    );

    expect(projectsLink?.getAttribute('aria-current')).toBe('page');
    expect(dashboardLink?.getAttribute('aria-current')).toBeNull();
  });

  it('slides open when isOpen is true on mobile', async () => {
    await act(async () => {
      root.render(<Sidebar currentPath="/news" isOpen />);
    });

    const nav = container.querySelector('nav');
    expect(nav?.className).toContain('translate-x-0');
  });

  it('has no detectable accessibility violations', async () => {
    await act(async () => {
      root.render(<Sidebar currentPath="/projects" />);
    });

    await expectAccessible(container);
  });
});
