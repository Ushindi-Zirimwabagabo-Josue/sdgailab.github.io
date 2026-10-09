import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getSupabaseMock } = vi.hoisted(() => ({
  getSupabaseMock: vi.fn(),
}));

type QueryRow = Record<string, unknown> | null;

function createAwaitableBuilder(data: QueryRow[] | QueryRow | null, error: { message: string } | null = null) {
  const result = { data, error };
  const builder: Record<string, unknown> = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue(result),
    then: (resolve: (value: unknown) => unknown, reject?: (reason: unknown) => unknown) =>
      Promise.resolve(result).then(resolve, reject),
  };
  builder.select = vi.fn().mockReturnValue(builder);
  builder.eq = vi.fn().mockReturnValue(builder);
  builder.order = vi.fn().mockReturnValue(builder);
  builder.limit = vi.fn().mockReturnValue(builder);
  builder.range = vi.fn().mockReturnValue(builder);
  return builder as {
    select: ReturnType<typeof vi.fn>;
    eq: ReturnType<typeof vi.fn>;
    order: ReturnType<typeof vi.fn>;
    limit: ReturnType<typeof vi.fn>;
    range: ReturnType<typeof vi.fn>;
    maybeSingle: ReturnType<typeof vi.fn>;
  };
}

async function loadQueriesModule(configured: boolean) {
  vi.resetModules();
  vi.doMock('./supabase', () => ({
    getSupabase: getSupabaseMock,
    isSupabaseConfigured: configured,
  }));
  return await import('./queries');
}

describe('queries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty published statistics when Supabase is not configured', async () => {
    const { getPublishedStatistics } = await loadQueriesModule(false);

    const result = await getPublishedStatistics();

    expect(result).toEqual({ data: [], error: null });
    expect(getSupabaseMock).not.toHaveBeenCalled();
  });

  it('caches successful published statistics within the TTL window', async () => {
    const builder = createAwaitableBuilder([{ id: 's1', label: 'Projects' }]);
    const fromMock = vi.fn().mockReturnValue(builder);
    getSupabaseMock.mockReturnValue({ from: fromMock });
    const { getPublishedStatistics } = await loadQueriesModule(true);

    const first = await getPublishedStatistics();
    const second = await getPublishedStatistics();

    expect(first).toEqual(second);
    expect(fromMock).toHaveBeenCalledTimes(1);
  });

  it('loads featured projects with the expected published filters', async () => {
    const builder = createAwaitableBuilder([{ id: 'p1', title: 'Project One' }]);
    getSupabaseMock.mockReturnValue({
      from: vi.fn().mockReturnValue(builder),
    });
    const { getFeaturedProjects } = await loadQueriesModule(true);

    const result = await getFeaturedProjects();

    expect(result.error).toBeNull();
    expect(result.data).toEqual([{ id: 'p1', title: 'Project One' }]);
    expect(builder.eq).toHaveBeenNthCalledWith(1, 'status', 'published');
    expect(builder.eq).toHaveBeenNthCalledWith(2, 'is_featured', true);
    expect(builder.order).toHaveBeenCalledWith('display_order', { ascending: true });
  });

  it('falls back to published project cards when no projects are marked featured', async () => {
    const featuredBuilder = createAwaitableBuilder([]);
    const publishedBuilder = createAwaitableBuilder([
      { id: 'p1', title: 'Project One' },
      { id: 'p2', title: 'Project Two' },
      { id: 'p3', title: 'Project Three' },
      { id: 'p4', title: 'Project Four' },
    ]);
    const fromMock = vi.fn().mockReturnValueOnce(featuredBuilder).mockReturnValueOnce(publishedBuilder);
    getSupabaseMock.mockReturnValue({ from: fromMock });
    const { getFeaturedProjects } = await loadQueriesModule(true);

    const result = await getFeaturedProjects();

    expect(result.error).toBeNull();
    expect(result.data).toEqual([
      { id: 'p1', title: 'Project One' },
      { id: 'p2', title: 'Project Two' },
      { id: 'p3', title: 'Project Three' },
    ]);
    expect(fromMock).toHaveBeenCalledTimes(2);
  });

  it('returns featured-project query errors and published fallback errors', async () => {
    const featuredError = createAwaitableBuilder([], { message: 'featured failed' });
    getSupabaseMock.mockReturnValue({ from: vi.fn().mockReturnValue(featuredError) });
    const queries = await loadQueriesModule(true);
    expect(await queries.getFeaturedProjects()).toEqual({ data: [], error: 'featured failed' });

    const featuredEmpty = createAwaitableBuilder([]);
    const publishedError = createAwaitableBuilder([], { message: 'published failed' });
    getSupabaseMock.mockReturnValue({
      from: vi.fn().mockReturnValueOnce(featuredEmpty).mockReturnValueOnce(publishedError),
    });
    const queriesAgain = await loadQueriesModule(true);
    expect(await queriesAgain.getFeaturedProjects()).toEqual({ data: [], error: 'published failed' });
  });

  it('returns project lookup errors cleanly', async () => {
    const builder = createAwaitableBuilder(null, { message: 'row level security denied' });
    getSupabaseMock.mockReturnValue({
      from: vi.fn().mockReturnValue(builder),
    });
    const { getProjectBySlug } = await loadQueriesModule(true);

    const result = await getProjectBySlug('demo-project');

    expect(result).toEqual({ data: null, error: 'row level security denied' });
    expect(builder.eq).toHaveBeenNthCalledWith(1, 'slug', 'demo-project');
    expect(builder.eq).toHaveBeenNthCalledWith(2, 'status', 'published');
  });

  it('loads published projects, news, partners, and statistics', async () => {
    const builder = createAwaitableBuilder([{ id: 'row-1' }]);
    getSupabaseMock.mockReturnValue({ from: vi.fn().mockReturnValue(builder) });
    const {
      getPublishedProjects,
      getPublishedNews,
      getPublishedPartners,
      getPublishedStatistics,
    } = await loadQueriesModule(true);

    expect((await getPublishedProjects()).data).toEqual([{ id: 'row-1' }]);
    expect((await getPublishedNews()).data).toEqual([{ id: 'row-1' }]);
    expect((await getPublishedPartners()).data).toEqual([{ id: 'row-1' }]);
    expect((await getPublishedStatistics()).data).toEqual([{ id: 'row-1' }]);
  });

  it('loads published publications with dual order and maps errors', async () => {
    const builder = createAwaitableBuilder([{ id: 'pub-1', title: 'Brief' }]);
    getSupabaseMock.mockReturnValue({ from: vi.fn().mockReturnValue(builder) });
    const { getPublishedPublications } = await loadQueriesModule(true);

    const result = await getPublishedPublications();

    expect(result.data).toEqual([{ id: 'pub-1', title: 'Brief' }]);
    expect(builder.order).toHaveBeenCalledWith('publication_date', {
      ascending: false,
      nullsFirst: false,
    });
    expect(builder.order).toHaveBeenCalledWith('display_order', { ascending: true });

    const errorBuilder = createAwaitableBuilder([], { message: 'publications offline' });
    getSupabaseMock.mockReturnValue({ from: vi.fn().mockReturnValue(errorBuilder) });
    const queries = await loadQueriesModule(true);
    expect(await queries.getPublishedPublications()).toEqual({
      data: [],
      error: 'publications offline',
      page: 1,
      pageSize: 24,
      hasMore: false,
    });
  });

  it('loads evolution timeline with secondary sorts', async () => {
    const builder = createAwaitableBuilder([{ id: 'tl-1' }]);
    getSupabaseMock.mockReturnValue({ from: vi.fn().mockReturnValue(builder) });
    const { getPublishedEvolutionTimeline } = await loadQueriesModule(true);

    expect((await getPublishedEvolutionTimeline()).data).toEqual([{ id: 'tl-1' }]);
    expect(builder.order).toHaveBeenCalledWith('period', { ascending: true });
  });

  it('loads news articles by slug and returns null when missing', async () => {
    const builder = createAwaitableBuilder({ id: 'news-1', slug: 'launch' });
    getSupabaseMock.mockReturnValue({ from: vi.fn().mockReturnValue(builder) });
    const { getNewsArticleBySlug } = await loadQueriesModule(true);

    expect(await getNewsArticleBySlug('launch')).toEqual({
      data: { id: 'news-1', slug: 'launch' },
      error: null,
    });

    const missing = createAwaitableBuilder(null);
    getSupabaseMock.mockReturnValue({ from: vi.fn().mockReturnValue(missing) });
    const queries = await loadQueriesModule(true);
    expect(await queries.getNewsArticleBySlug('missing')).toEqual({ data: null, error: null });
  });

  it('passes through people group filters for published people', async () => {
    const builder = createAwaitableBuilder([{ id: 'person-1', name: 'Ada' }]);
    getSupabaseMock.mockReturnValue({
      from: vi.fn().mockReturnValue(builder),
    });
    const { getPublishedPeople } = await loadQueriesModule(true);

    const result = await getPublishedPeople('team');

    expect(result.error).toBeNull();
    expect(builder.eq).toHaveBeenNthCalledWith(1, 'status', 'published');
    expect(builder.eq).toHaveBeenNthCalledWith(2, 'group_type', 'team');
  });

  it('returns page content and preserves null when no row matches', async () => {
    const builder = createAwaitableBuilder(null, null);
    getSupabaseMock.mockReturnValue({
      from: vi.fn().mockReturnValue(builder),
    });
    const { getPageContent } = await loadQueriesModule(true);

    const result = await getPageContent('home', 'hero');

    expect(result).toEqual({ data: null, error: null });
    expect(builder.eq).toHaveBeenNthCalledWith(1, 'page_slug', 'home');
    expect(builder.eq).toHaveBeenNthCalledWith(2, 'section_slug', 'hero');
    expect(builder.eq).toHaveBeenNthCalledWith(3, 'status', 'published');
  });

  it('returns empty payloads for public loaders when Supabase is not configured', async () => {
    const {
      getPublishedProjects,
      getPublishedPublications,
      getPublishedEvolutionTimeline,
      getPublishedPartners,
      getNewsArticleBySlug,
      getProjectBySlug,
      getPageContent,
    } = await loadQueriesModule(false);

    expect(await getPublishedProjects()).toEqual({
      data: [],
      error: null,
      page: 1,
      pageSize: 200,
      hasMore: false,
    });
    expect(await getPublishedPublications()).toEqual({
      data: [],
      error: null,
      page: 1,
      pageSize: 24,
      hasMore: false,
    });
    expect(await getPublishedEvolutionTimeline()).toEqual({ data: [], error: null });
    expect(await getPublishedPartners()).toEqual({ data: [], error: null });
    expect(await getNewsArticleBySlug('x')).toEqual({ data: null, error: null });
    expect(await getProjectBySlug('x')).toEqual({ data: null, error: null });
    expect(await getPageContent('a', 'b')).toEqual({ data: null, error: null });
  });

  it('surfaces query errors for people, partners, news, projects, and page content', async () => {
    const builder = createAwaitableBuilder([], { message: 'timeout' });
    getSupabaseMock.mockReturnValue({ from: vi.fn().mockReturnValue(builder) });
    const queries = await loadQueriesModule(true);

    expect(await queries.getPublishedPeople('alumni')).toEqual({ data: [], error: 'timeout' });
    expect(await queries.getPublishedPartners()).toEqual({ data: [], error: 'timeout' });
    expect(await queries.getPublishedNews()).toEqual({
      data: [],
      error: 'timeout',
      page: 1,
      pageSize: 24,
      hasMore: false,
    });
    expect(await queries.getPublishedProjects()).toEqual({
      data: [],
      error: 'timeout',
      page: 1,
      pageSize: 200,
      hasMore: false,
    });
    expect(await queries.getPublishedStatistics()).toEqual({ data: [], error: 'timeout' });
    expect(await queries.getPublishedEvolutionTimeline()).toEqual({ data: [], error: 'timeout' });

    const single = createAwaitableBuilder(null, { message: 'missing' });
    getSupabaseMock.mockReturnValue({ from: vi.fn().mockReturnValue(single) });
    const again = await loadQueriesModule(true);
    expect(await again.getNewsArticleBySlug('x')).toEqual({ data: null, error: 'missing' });
    expect(await again.getPageContent('a', 'b')).toEqual({ data: null, error: 'missing' });
  });
});
