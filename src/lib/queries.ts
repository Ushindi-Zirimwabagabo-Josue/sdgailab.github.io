import { getSupabase, isSupabaseConfigured } from './supabase';
import {
  PUBLIC_LIST_MAX,
  PUBLIC_LIST_PAGE_SIZE,
  normalizePageOptions,
  type ListPageOptions,
  type PagedResult,
} from './pagination';
import type {
  StatisticCard,
  FeaturedProjectCard,
  ProjectListItem,
  Project,
  NewsListItem,
  NewsArticle,
  PublicationListItem,
  PersonCard,
  PartnerLogo,
  EvolutionTimelineCard,
  PageContent,
  PeopleGroup,
} from './types';

/** Short TTL for public CMS list/detail reads in a browser session. */
const PUBLIC_QUERY_CACHE_TTL_MS = 60_000;

type CacheEntry<T> = { expiresAt: number; value: T };

const publicQueryCache = new Map<string, CacheEntry<unknown>>();

type QueryResult<T> = { data: T; error: string | null };

export type PublicListResult<T> = PagedResult<T[]>;

export function clearPublicQueryCache(): void {
  publicQueryCache.clear();
}

async function withPublicCache<T>(key: string, loader: () => Promise<T>): Promise<T> {
  const hit = publicQueryCache.get(key) as CacheEntry<T> | undefined;
  if (hit && hit.expiresAt > Date.now()) {
    return hit.value;
  }

  const value = await loader();
  const error =
    typeof value === 'object' && value && 'error' in value
      ? (value as { error: string | null }).error
      : null;
  if (!error) {
    publicQueryCache.set(key, {
      expiresAt: Date.now() + PUBLIC_QUERY_CACHE_TTL_MS,
      value,
    });
  }
  return value;
}

export async function getPublishedStatistics(): Promise<QueryResult<StatisticCard[]>> {
  return withPublicCache('statistics:published', async () => {
    if (!isSupabaseConfigured) return { data: [], error: null };
    const { data, error } = await getSupabase()
      .from('statistics')
      .select('id, label, value, icon_name, display_order')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .limit(PUBLIC_LIST_MAX);

    if (error) return { data: [], error: error.message };
    return { data: data as StatisticCard[], error: null };
  });
}

export async function getFeaturedProjects(): Promise<QueryResult<FeaturedProjectCard[]>> {
  return withPublicCache('projects:featured', async () => {
    if (!isSupabaseConfigured) return { data: [], error: null };

    const projectCardSelect =
      'id, title, slug, project_status, is_deployed, is_featured, image_url, display_order, summary, deployment_status, impact_area, timeline, project_year, best_fit, core_capabilities, tech_stack, implementation_countries, capabilities_involved, sdgs, video_url, work_stream, project_category';

    const { data, error } = await getSupabase()
      .from('projects')
      .select(projectCardSelect)
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('display_order', { ascending: true })
      .limit(PUBLIC_LIST_MAX);

    if (error) return { data: [], error: error.message };
    if (data && data.length > 0) return { data: data as FeaturedProjectCard[], error: null };

    const { data: publishedData, error: publishedError } = await getSupabase()
      .from('projects')
      .select(projectCardSelect)
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .limit(3);

    if (publishedError) return { data: [], error: publishedError.message };
    return { data: (publishedData ?? []).slice(0, 3) as FeaturedProjectCard[], error: null };
  });
}

export async function getPublishedProjects(
  options?: ListPageOptions
): Promise<PublicListResult<ProjectListItem>> {
  const { page, pageSize, from } = normalizePageOptions(options, {
    pageSize: PUBLIC_LIST_MAX,
    maxPageSize: PUBLIC_LIST_MAX,
  });
  const cacheKey = `projects:published:${page}:${pageSize}`;

  return withPublicCache(cacheKey, async () => {
    if (!isSupabaseConfigured) {
      return { data: [], error: null, page, pageSize, hasMore: false };
    }
    const { data, error } = await getSupabase()
      .from('projects')
      .select(
        'id, title, slug, project_status, is_deployed, is_featured, image_url, display_order, summary, deployment_status, impact_area, timeline, project_year, best_fit, core_capabilities, tech_stack, implementation_countries, capabilities_involved, sdgs, work_stream, project_category'
      )
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .range(from, from + pageSize);

    if (error) return { data: [], error: error.message, page, pageSize, hasMore: false };
    const rows = (data ?? []) as ProjectListItem[];
    const hasMore = rows.length > pageSize;
    return {
      data: hasMore ? rows.slice(0, pageSize) : rows,
      error: null,
      page,
      pageSize,
      hasMore,
    };
  });
}

export async function getProjectBySlug(slug: string): Promise<QueryResult<Project | null>> {
  return withPublicCache(`projects:slug:${slug}`, async () => {
    if (!isSupabaseConfigured) return { data: null, error: null };
    const { data, error } = await getSupabase()
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) return { data: null, error: error.message };
    return { data: data as Project | null, error: null };
  });
}

export async function getPublishedNews(
  options?: ListPageOptions
): Promise<PublicListResult<NewsListItem>> {
  const { page, pageSize, from } = normalizePageOptions(options, {
    pageSize: PUBLIC_LIST_PAGE_SIZE,
    maxPageSize: PUBLIC_LIST_MAX,
  });
  const cacheKey = `news:published:${page}:${pageSize}`;

  return withPublicCache(cacheKey, async () => {
    if (!isSupabaseConfigured) {
      return { data: [], error: null, page, pageSize, hasMore: false };
    }
    const { data, error } = await getSupabase()
      .from('news_articles')
      .select('id, title, slug, summary, featured_image_url, author_name, publish_date')
      .eq('status', 'published')
      .order('publish_date', { ascending: false })
      .range(from, from + pageSize);

    if (error) return { data: [], error: error.message, page, pageSize, hasMore: false };
    const rows = (data ?? []) as NewsListItem[];
    const hasMore = rows.length > pageSize;
    return {
      data: hasMore ? rows.slice(0, pageSize) : rows,
      error: null,
      page,
      pageSize,
      hasMore,
    };
  });
}

export async function getPublishedPublications(
  options?: ListPageOptions
): Promise<PublicListResult<PublicationListItem>> {
  const { page, pageSize, from } = normalizePageOptions(options, {
    pageSize: PUBLIC_LIST_PAGE_SIZE,
    maxPageSize: PUBLIC_LIST_MAX,
  });
  const cacheKey = `publications:published:${page}:${pageSize}`;

  return withPublicCache(cacheKey, async () => {
    if (!isSupabaseConfigured) {
      return { data: [], error: null, page, pageSize, hasMore: false };
    }
    const { data, error } = await getSupabase()
      .from('publications')
      .select(
        'id, title, slug, publication_type, authors, publication_date, date_label, publisher, summary, source_url, cover_image_url, display_order'
      )
      .eq('status', 'published')
      .order('publication_date', { ascending: false, nullsFirst: false })
      .order('display_order', { ascending: true })
      .range(from, from + pageSize);

    if (error) return { data: [], error: error.message, page, pageSize, hasMore: false };
    const rows = (data ?? []) as PublicationListItem[];
    const hasMore = rows.length > pageSize;
    return {
      data: hasMore ? rows.slice(0, pageSize) : rows,
      error: null,
      page,
      pageSize,
      hasMore,
    };
  });
}

export async function getNewsArticleBySlug(slug: string): Promise<QueryResult<NewsArticle | null>> {
  return withPublicCache(`news:slug:${slug}`, async () => {
    if (!isSupabaseConfigured) return { data: null, error: null };
    const { data, error } = await getSupabase()
      .from('news_articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) return { data: null, error: error.message };
    return { data: data as NewsArticle | null, error: null };
  });
}

export async function getPublishedPeople(
  groupType: PeopleGroup
): Promise<QueryResult<PersonCard[]>> {
  return withPublicCache(`people:published:${groupType}`, async () => {
    if (!isSupabaseConfigured) return { data: [], error: null };
    const { data, error } = await getSupabase()
      .from('people')
      .select('id, name, role_title, photo_url, team_group, biography, display_order')
      .eq('status', 'published')
      .eq('group_type', groupType)
      .order('display_order', { ascending: true })
      .limit(PUBLIC_LIST_MAX);

    if (error) return { data: [], error: error.message };
    return { data: data as PersonCard[], error: null };
  });
}

export async function getPublishedPartners(): Promise<QueryResult<PartnerLogo[]>> {
  return withPublicCache('partners:published', async () => {
    if (!isSupabaseConfigured) return { data: [], error: null };
    const { data, error } = await getSupabase()
      .from('partners')
      .select('id, name, logo_url, website_url, display_order')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .limit(PUBLIC_LIST_MAX);

    if (error) return { data: [], error: error.message };
    return { data: data as PartnerLogo[], error: null };
  });
}

export async function getPublishedEvolutionTimeline(): Promise<
  QueryResult<EvolutionTimelineCard[]>
> {
  return withPublicCache('evolution-timeline:published', async () => {
    if (!isSupabaseConfigured) return { data: [], error: null };
    const { data, error } = await getSupabase()
      .from('evolution_timeline')
      .select('id, period, title, body, display_order')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .order('period', { ascending: true })
      .limit(PUBLIC_LIST_MAX);

    if (error) return { data: [], error: error.message };
    return { data: data as EvolutionTimelineCard[], error: null };
  });
}

export async function getPublishedPageCopy(
  pageSlug: string
): Promise<QueryResult<Record<string, string>>> {
  return withPublicCache(`page-copy:${pageSlug}`, async () => {
    if (!isSupabaseConfigured) return { data: {}, error: null };
    const { data, error } = await getSupabase()
      .from('page_content')
      .select('section_slug, body')
      .eq('page_slug', pageSlug)
      .eq('status', 'published')
      .limit(PUBLIC_LIST_MAX);

    if (error) return { data: {}, error: error.message };
    const copy: Record<string, string> = {};
    for (const row of data ?? []) {
      if (row.section_slug && row.body) copy[row.section_slug] = row.body;
    }
    return { data: copy, error: null };
  });
}

export async function getPageContent(
  pageSlug: string,
  sectionSlug: string
): Promise<QueryResult<PageContent | null>> {
  return withPublicCache(`page-content:${pageSlug}:${sectionSlug}`, async () => {
    if (!isSupabaseConfigured) return { data: null, error: null };
    const { data, error } = await getSupabase()
      .from('page_content')
      .select('*')
      .eq('page_slug', pageSlug)
      .eq('section_slug', sectionSlug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) return { data: null, error: error.message };
    return { data: data as PageContent | null, error: null };
  });
}
