import { describe, expect, it } from 'vitest';

import {
  getSampleNewsArticle,
  getSamplePageContent,
  getSampleProject,
  sampleFeaturedProjects,
  sampleNews,
  samplePartners,
  sampleProjects,
  sampleStats,
} from './sampleContent';

describe('sampleContent', () => {
  it('exposes non-empty sample statistics and partners', () => {
    expect(sampleStats.length).toBeGreaterThanOrEqual(4);
    expect(samplePartners.every((partner) => partner.name.length > 0)).toBe(true);
  });

  it('marks demonstration projects as sample content', () => {
    expect(sampleProjects.every((project) => project.is_sample)).toBe(true);
    expect(sampleFeaturedProjects.length).toBeGreaterThan(0);
    expect(sampleFeaturedProjects.every((project) => project.is_sample && project.is_featured)).toBe(true);
  });

  it('resolves sample projects and news articles by slug', () => {
    const project = getSampleProject('ai-for-tourism-platform');
    expect(project?.title).toContain('AI for Tourism Platform');
    expect(project?.summary.length).toBeGreaterThan(0);

    const article = getSampleNewsArticle('responsible-development-practice');
    expect(article?.title).toContain('responsible development');
    expect(article?.body).toContain('Publication');
    expect(article?.status).toBe('published');
  });

  it('returns null for unknown sample slugs', () => {
    expect(getSampleProject('missing-project')).toBeNull();
    expect(getSampleNewsArticle('missing-article')).toBeNull();
    expect(getSamplePageContent('missing', 'section')).toBeNull();
  });

  it('exposes sample page content for about and volunteer sections', () => {
    expect(getSamplePageContent('about', 'our-approach')).toContain('one-stop solution');
    expect(getSamplePageContent('volunteer', 'main')).toContain('Volunteer Data Scientist');
  });

  it('keeps sample news list items publish-ready', () => {
    expect(sampleNews.length).toBeGreaterThan(0);
    expect(sampleNews[0]).toMatchObject({
      slug: expect.any(String),
      title: expect.any(String),
      publish_date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
    });
  });
});
