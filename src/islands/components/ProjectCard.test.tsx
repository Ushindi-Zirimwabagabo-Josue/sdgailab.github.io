// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import ProjectCard from './ProjectCard';

describe('ProjectCard', () => {
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

  it('renders a linked project card with summary and image', async () => {
    await act(async () => {
      root.render(
        <ProjectCard
          project={{
            id: 'p1',
            title: 'AI Lab Project',
            slug: 'ai-lab-project',
            project_status: 'active',
            is_deployed: true,
            image_url: 'https://example.com/project.png',
            display_order: 1,
            summary: 'A helpful project summary.',
          }}
        />
      );
    });

    const link = container.querySelector('a');
    const image = container.querySelector('img');

    expect(link?.getAttribute('href')).toContain('/projects/detail/?slug=ai-lab-project');
    expect(container.textContent).toContain('AI Lab Project');
    expect(container.textContent).toContain('A helpful project summary.');
    expect(container.textContent).toContain('Live');
    expect(image?.getAttribute('src')).toBe('https://example.com/project.png');
  });

  it('renders fallback SDG badges and prototype label when no image exists', async () => {
    await act(async () => {
      root.render(
        <ProjectCard
          project={{
            id: 'p2',
            title: 'Prototype Project',
            slug: 'prototype-project',
            project_status: 'under_development',
            is_deployed: false,
            image_url: null,
            display_order: 2,
            sdgs: [9, 17],
            is_sample: true,
          }}
        />
      );
    });

    expect(container.textContent).toContain('Prototype');
    expect(container.textContent).toContain('9');
    expect(container.textContent).toContain('17');
  });
});
