// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import ProjectShowcase, { ProjectOverlayCard } from './ProjectShowcase';
import { expectAccessibleSmoke } from '../../test/axe';

const sampleProject = {
  id: 'p1',
  title: 'Showcase Project',
  slug: 'showcase-project',
  project_status: 'active' as const,
  is_deployed: true,
  is_featured: true,
  image_url: null,
  display_order: 1,
  summary: 'Featured summary',
  impact_area: 'Resilience',
  project_year: 2025,
  implementation_countries: ['Kenya'],
  video_url: null as string | null,
};

describe('ProjectShowcase', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('renders project overlay cards in the showcase grid', async () => {
    await act(async () => {
      root.render(<ProjectShowcase projects={[sampleProject]} />);
    });

    expect(container.querySelector('[aria-label="Projects"]')).not.toBeNull();
    expect(container.textContent).toContain('Showcase Project');
    expect(container.querySelector('a[href*="showcase-project"]')).not.toBeNull();
  });

  it('renders loopable video when allowVideo is enabled', async () => {
    await act(async () => {
      root.render(
        <ProjectOverlayCard
          project={{ ...sampleProject, video_url: 'https://cdn.example.com/clip.mp4' }}
          allowVideo
          showSummary
        />
      );
    });

    expect(container.querySelector('video')).not.toBeNull();
    expect(container.textContent).toContain('Featured summary');
  });

  it('has no detectable accessibility violations', async () => {
    await act(async () => {
      root.render(<ProjectShowcase projects={[sampleProject]} />);
    });
    await expectAccessibleSmoke(container);
  });
});
