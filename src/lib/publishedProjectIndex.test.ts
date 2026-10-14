import { describe, expect, it } from 'vitest';
import {
  projectDescription,
  projectDetailPath,
  publishedProjectsFromRows,
} from './publishedProjectIndex';

describe('published project index', () => {
  it('keeps published rows with a safe slug', () => {
    const projects = publishedProjectsFromRows([
      { title: 'Open SDG', slug: 'Open-SDG', summary: 'A classifier.', image_url: '/media/open.png' },
      { title: 'Skip', slug: '../secret', summary: null, image_url: null },
      { title: 'Again', slug: 'open-sdg', summary: 'duplicate' },
      null,
    ]);

    expect(projects).toEqual([
      { title: 'Open SDG', slug: 'open-sdg', summary: 'A classifier.', image_url: '/media/open.png' },
    ]);
    expect(projectDetailPath(projects[0].slug)).toBe('/projects/detail/open-sdg/');
  });

  it('uses a short description from the summary', () => {
    expect(projectDescription(null, 'Open SDG')).toBe('Open SDG, a solution from the SDG AI Lab.');
    expect(projectDescription('  Mapped   access. ', 'Open SDG')).toBe('Mapped access.');
    expect(projectDescription('a'.repeat(180), 'Open SDG')).toHaveLength(160);
  });
});
