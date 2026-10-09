import { describe, expect, it } from 'vitest';
import type {
  FeaturedProjectCard,
  NewsListItem,
  PartnerLogo,
  PersonCard,
  PublishStatus,
  StatisticCard,
} from './types';

describe('types', () => {
  it('accepts publish status values used across CMS entities', () => {
    const statuses: PublishStatus[] = ['draft', 'published', 'archived'];
    expect(statuses).toEqual(['draft', 'published', 'archived']);
  });

  it('allows statistic card shapes returned by public queries', () => {
    const card: StatisticCard = {
      id: 'stat-1',
      label: 'Project areas',
      value: '6',
      icon_name: 'folder',
      display_order: 1,
    };

    expect(card.label).toBe('Project areas');
  });

  it('allows featured project card shapes used by listing islands', () => {
    const project: FeaturedProjectCard = {
      id: 'project-1',
      title: 'Open SDG Classification',
      slug: 'open-sdg-classification',
      project_status: 'active',
      is_deployed: true,
      image_url: null,
      display_order: 1,
      summary: 'Sample summary',
      deployment_status: 'live',
      sdgs: [9],
      is_sample: true,
    };

    expect(project.slug).toBe('open-sdg-classification');
  });

  it('allows news, people, and partner list item shapes', () => {
    const article: NewsListItem = {
      id: 'news-1',
      title: 'Responsible AI practice',
      slug: 'responsible-ai',
      summary: 'Summary',
      featured_image_url: null,
      author_name: 'SDG AI Lab',
      publish_date: '2026-01-15',
    };
    const person: PersonCard = {
      id: 'person-1',
      name: 'Alex Example',
      role_title: 'Researcher',
      photo_url: null,
      team_group: 'Coordination · Research & Advisory',
      biography: null,
      display_order: 1,
    };
    const partner: PartnerLogo = {
      id: 'partner-1',
      name: 'UNDP',
      logo_url: null,
      website_url: 'https://www.undp.org',
      display_order: 1,
    };

    expect(article.author_name).toBe('SDG AI Lab');
    expect(person.name).toBe('Alex Example');
    expect(partner.website_url).toContain('undp.org');
  });
});
