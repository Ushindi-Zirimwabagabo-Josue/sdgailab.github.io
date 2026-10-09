// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import HomeGallery from './HomeGallery';
import { HOME_GALLERY_SLUGS } from '../lib/queries';

const { getHomeGalleryProjectsMock } = vi.hoisted(() => ({
  getHomeGalleryProjectsMock: vi.fn(),
}));

vi.mock('../lib/queries', () => ({
  HOME_GALLERY_SLUGS: [
    'tech-volunteers-for-resilience-tech4r',
    'digital-social-vulnerability-index-dsvi',
    'frontier-future-tech-leaders-programmes',
    'innovation-campus',
  ],
  getHomeGalleryProjects: getHomeGalleryProjectsMock,
}));

describe('HomeGallery', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    getHomeGalleryProjectsMock.mockReset();
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('shows the homepage projects from the CMS in carousel order', async () => {
    getHomeGalleryProjectsMock.mockResolvedValue({
      data: [
        {
          id: 'p1',
          title: 'Tech Volunteers for Resilience (Tech4R)',
          slug: HOME_GALLERY_SLUGS[0],
          image_url: 'https://example.com/tech4r.jpg',
        },
        {
          id: 'p2',
          title: 'Digital Social Vulnerability Index (DSVI)',
          slug: HOME_GALLERY_SLUGS[1],
          image_url: 'https://example.com/dsvi.jpg',
        },
        {
          id: 'p4',
          title: 'Innovation Campus',
          slug: HOME_GALLERY_SLUGS[3],
          image_url: null,
        },
      ],
      error: null,
    });

    await act(async () => {
      root.render(<HomeGallery />);
    });
    await act(async () => {
      await Promise.resolve();
    });

    const links = [...container.querySelectorAll('a')].filter(
      (link) => link.getAttribute('tabindex') !== '-1',
    );
    expect(links.map((link) => link.textContent?.trim())).toEqual([
      'Tech Volunteers for Resilience (Tech4R)',
      'Digital Social Vulnerability Index (DSVI)',
      'Frontier Tech Leaders',
      'Innovation Campus',
    ]);
    expect(links[0]?.querySelector('img')?.getAttribute('src')).toBe(
      'https://example.com/tech4r.jpg',
    );
    expect(links[3]?.querySelector('img')?.getAttribute('src')).toContain(
      'hero-innovation-campus.jpg',
    );
  });

  it('keeps the built-in cards when the CMS returns nothing', async () => {
    getHomeGalleryProjectsMock.mockResolvedValue({ data: [], error: null });

    await act(async () => {
      root.render(<HomeGallery />);
    });
    await act(async () => {
      await Promise.resolve();
    });

    const links = [...container.querySelectorAll('a')].filter(
      (link) => link.getAttribute('tabindex') !== '-1',
    );
    expect(links).toHaveLength(4);
    expect(container.textContent).toContain('Tech4R');
    expect(container.textContent).toContain('Innovation Campus');
  });
});
