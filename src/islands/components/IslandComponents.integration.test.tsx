// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import ProjectCard from './ProjectCard';
import StatusBadge from './StatusBadge';

describe('Island components integration', () => {
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

  it('renders project cards with status badges in a listing layout', async () => {
    await act(async () => {
      root.render(
        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <StatusBadge status="active" />
            <ProjectCard
              project={{
                id: 'project-1',
                title: 'Integrated Coverage Project',
                slug: 'integrated-coverage-project',
                project_status: 'active',
                is_deployed: true,
                image_url: null,
                display_order: 1,
                summary: 'Used to verify composed island rendering.',
              }}
            />
          </div>
        </div>
      );
    });

    expect(container.textContent).toContain('Integrated Coverage Project');
    expect(container.textContent).toContain('Active');
    expect(container.querySelector('a')?.getAttribute('href')).toContain(
      '/projects/detail/?slug=integrated-coverage-project'
    );
  });
});
