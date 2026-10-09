import { beforeEach, describe, expect, it, vi } from 'vitest';

const { runProtectedAdminActionMock, fromMock, getSupabaseAuthMock } = vi.hoisted(() => ({
  runProtectedAdminActionMock: vi.fn(
    async <T>(_config: unknown, action: () => Promise<T> | T) => await action()
  ),
  fromMock: vi.fn(),
  getSupabaseAuthMock: vi.fn(),
}));

getSupabaseAuthMock.mockImplementation(() => ({
  from: fromMock,
}));

vi.mock('./admin-security', async () => {
  const actual = await vi.importActual<typeof import('./admin-security')>('./admin-security');
  return {
    ...actual,
    runProtectedAdminAction: runProtectedAdminActionMock,
  };
});

vi.mock('./supabase-auth', () => ({
  getSupabaseAuth: getSupabaseAuthMock,
}));

import {
  archivePageContent,
  archivePartner,
  archiveProject,
  archivePublication,
  createEvolutionTimelineItem,
  createNewsArticle,
  createPageContent,
  createPartner,
  createPerson,
  createProject,
  createPublication,
  deletePageContent,
  deletePartner,
  deletePublication,
  getDashboardCounts,
  getPageContentById,
  getPartner,
  getPublication,
  listPageContent,
  listPartners,
  listPublications,
  updateEvolutionTimelineItem,
  updatePageContent,
  updatePartner,
  updatePublication,
  updateStatistic,
} from './admin-queries';

function createInsertBuilder(returnData: unknown, returnError: { message: string } | null = null) {
  return {
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: returnData, error: returnError }),
    eq: vi.fn().mockReturnThis(),
  };
}

function createOrderedListBuilder(returnData: unknown, returnError: { message: string } | null = null) {
  const result = { data: returnData, error: returnError };
  const builder: Record<string, unknown> = {};
  builder.select = vi.fn().mockReturnValue(builder);
  builder.order = vi.fn().mockReturnValue(builder);
  builder.eq = vi.fn().mockReturnValue(builder);
  builder.range = vi.fn().mockReturnValue(builder);
  builder.maybeSingle = vi.fn().mockResolvedValue(result);
  builder.then = (resolve: (value: unknown) => unknown, reject?: (reason: unknown) => unknown) =>
    Promise.resolve(result).then(resolve, reject);
  return builder as {
    select: ReturnType<typeof vi.fn>;
    order: ReturnType<typeof vi.fn>;
    eq: ReturnType<typeof vi.fn>;
    range: ReturnType<typeof vi.fn>;
    maybeSingle: ReturnType<typeof vi.fn>;
  };
}

describe('admin-queries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects invalid project slugs before hitting Supabase', async () => {
    const result = await createProject({
      title: 'Demo Project',
      slug: 'Bad Slug',
      description: 'Description',
      project_status: 'active',
      is_deployed: false,
      is_featured: false,
      image_url: 'https://example.com/image.png',
      display_order: 1,
      status: 'draft',
      published_at: null,
    });

    expect(result.data).toBeNull();
    expect(result.error).toContain('Slug must use lowercase letters, numbers, and hyphens only.');
    expect(fromMock).not.toHaveBeenCalled();
  });

  it('rejects invalid publish dates for news articles', async () => {
    const result = await createNewsArticle({
      title: 'News',
      slug: 'news-item',
      body: 'Body',
      summary: 'Summary',
      featured_image_url: 'https://example.com/news.png',
      author_name: 'Author',
      publish_date: '2026-13-99',
      status: 'draft',
      published_at: null,
    });

    expect(result.data).toBeNull();
    expect(result.error).toContain('Publish date must be a valid date in YYYY-MM-DD format.');
    expect(fromMock).not.toHaveBeenCalled();
  });

  it('rejects invalid partner website URLs', async () => {
    const result = await createPartner({
      name: 'Partner',
      logo_url: 'https://example.com/logo.png',
      website_url: 'javascript:alert(1)',
      display_order: 2,
      status: 'draft',
      published_at: null,
    });

    expect(result.data).toBeNull();
    expect(result.error).toContain('Website URL must use http or https.');
    expect(fromMock).not.toHaveBeenCalled();
  });

  it('adds published_at when creating published page content', async () => {
    const builder = createInsertBuilder({ id: 'page-1' });
    fromMock.mockReturnValue(builder);

    const result = await createPageContent({
      page_slug: 'about',
      section_slug: 'mission-statement',
      body: 'Hello world',
      status: 'published',
      published_at: null,
    });

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: 'page-1' });
    expect(fromMock).toHaveBeenCalledWith('page_content');
    expect(builder.insert).toHaveBeenCalledTimes(1);

    const insertedPayload = builder.insert.mock.calls[0][0] as { published_at: string; page_slug: string };
    expect(insertedPayload.page_slug).toBe('about');
    expect(insertedPayload.published_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('updates statistics after validation and uses protected mutation wrapper', async () => {
    const builder = createInsertBuilder({ id: 'stat-1', label: 'Projects' });
    fromMock.mockReturnValue(builder);

    const result = await updateStatistic('stat-1', {
      label: ' Projects ',
      value: ' 42 ',
      icon_name: ' rocket ',
      display_order: 0,
      status: 'draft',
      published_at: null,
    });

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: 'stat-1', label: 'Projects' });
    expect(runProtectedAdminActionMock).toHaveBeenCalled();
    expect(builder.update).toHaveBeenCalledWith({
      label: 'Projects',
      value: '42',
      icon_name: 'rocket',
      display_order: 0,
      status: 'draft',
      published_at: null,
    });
    expect(builder.eq).toHaveBeenCalledWith('id', 'stat-1');
    expect(runProtectedAdminActionMock).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'update:statistics', message: expect.stringContaining('Too many admin changes') }),
      expect.any(Function)
    );
  });

  it('archives and deletes through protected destructive actions', async () => {
    const archiveBuilder = createInsertBuilder(null, null);
    const deleteBuilder = createInsertBuilder(null, null);
    fromMock
      .mockReturnValueOnce(archiveBuilder)
      .mockReturnValueOnce(deleteBuilder);

    const archiveResult = await archiveProject('project-1');
    const deleteResult = await deletePartner('partner-1');

    expect(archiveResult).toEqual({ data: { id: 'project-1' }, error: null });
    expect(deleteResult).toEqual({ data: { id: 'partner-1' }, error: null });
    expect(archiveBuilder.update).toHaveBeenCalledWith({ status: 'archived' });
    expect(deleteBuilder.delete).toHaveBeenCalled();
    expect(runProtectedAdminActionMock).toHaveBeenCalledTimes(2);
    expect(runProtectedAdminActionMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ key: 'archive:projects', message: expect.stringContaining('destructive') }),
      expect.any(Function)
    );
    expect(runProtectedAdminActionMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ key: 'delete:partners', message: expect.stringContaining('destructive') }),
      expect.any(Function)
    );
  });

  it('computes dashboard counts from table statuses', async () => {
    fromMock
      .mockReturnValueOnce(createOrderedListBuilder([{ status: 'draft' }, { status: 'published' }]))
      .mockReturnValueOnce(createOrderedListBuilder([{ status: 'published' }]))
      .mockReturnValueOnce(createOrderedListBuilder([{ status: 'archived' }, { status: 'archived' }]))
      .mockReturnValueOnce(createOrderedListBuilder([{ status: 'published' }, { status: 'draft' }]))
      .mockReturnValueOnce(createOrderedListBuilder([]))
      .mockReturnValueOnce(createOrderedListBuilder([{ status: 'draft' }, { status: 'draft' }]))
      .mockReturnValueOnce(createOrderedListBuilder([{ status: 'published' }, { status: 'published' }]))
      .mockReturnValueOnce(createOrderedListBuilder([{ status: 'published' }, { status: 'archived' }]));

    const result = await getDashboardCounts();

    expect(result.error).toBeNull();
    expect(result.data.statistics).toEqual({ total: 2, draft: 1, published: 1, archived: 0 });
    expect(result.data.projects).toEqual({ total: 1, draft: 0, published: 1, archived: 0 });
    expect(result.data.news_articles).toEqual({ total: 2, draft: 0, published: 0, archived: 2 });
    expect(result.data.publications).toEqual({ total: 2, draft: 1, published: 1, archived: 0 });
    expect(result.data.people).toEqual({ total: 0, draft: 0, published: 0, archived: 0 });
    expect(result.data.partners).toEqual({ total: 2, draft: 2, published: 0, archived: 0 });
    expect(result.data.evolution_timeline).toEqual({ total: 2, draft: 0, published: 2, archived: 0 });
    expect(result.data.page_content).toEqual({ total: 2, draft: 0, published: 1, archived: 1 });
  });

  it('returns Supabase mutation errors without hiding them', async () => {
    const builder = createInsertBuilder(null, { message: 'duplicate key value violates unique constraint' });
    fromMock.mockReturnValue(builder);

    const result = await createProject({
      title: 'Demo Project',
      slug: 'demo-project',
      description: 'Description',
      project_status: 'active',
      is_deployed: false,
      is_featured: false,
      image_url: 'https://example.com/image.png',
      display_order: 1,
      status: 'draft',
      published_at: null,
    });

    expect(result.data).toBeNull();
    expect(result.error).toContain('duplicate key value violates unique constraint');
  });

  it('returns dashboard query errors immediately', async () => {
    fromMock.mockReturnValueOnce(createOrderedListBuilder(null, { message: 'permission denied for table statistics' }));

    const result = await getDashboardCounts();

    expect(result.error).toBe('permission denied for table statistics');
    expect(result.data).toEqual({});
  });

  it('rejects invalid project statuses before hitting Supabase', async () => {
    const result = await createProject({
      title: 'Demo Project',
      slug: 'demo-project',
      description: 'Description',
      project_status: 'invalid' as 'active',
      is_deployed: false,
      is_featured: false,
      image_url: 'https://example.com/image.png',
      display_order: 1,
      status: 'draft',
      published_at: null,
    });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Project status is invalid.');
    expect(fromMock).not.toHaveBeenCalled();
  });

  it('rejects invalid SDG values before hitting Supabase', async () => {
    const result = await createProject({
      title: 'Demo Project',
      slug: 'demo-project',
      description: 'Description',
      project_status: 'active',
      is_deployed: false,
      is_featured: false,
      image_url: 'https://example.com/image.png',
      sdgs: [99],
      display_order: 1,
      status: 'draft',
      published_at: null,
    });

    expect(result.data).toBeNull();
    expect(result.error).toBe('SDGs must be whole numbers between 1 and 17.');
    expect(fromMock).not.toHaveBeenCalled();
  });

  it('rejects invalid section slugs for page content', async () => {
    const result = await createPageContent({
      page_slug: 'about',
      section_slug: 'Bad Section',
      body: 'Hello world',
      status: 'draft',
      published_at: null,
    });

    expect(result.data).toBeNull();
    expect(result.error).toContain('Section slug must use lowercase letters, numbers, hyphens, or underscores.');
    expect(fromMock).not.toHaveBeenCalled();
  });

  it('rejects invalid people group types before hitting Supabase', async () => {
    const result = await createPerson({
      name: 'Ada Lovelace',
      role_title: 'Advisor',
      group_type: 'invalid' as 'team',
      photo_url: 'https://example.com/ada.png',
      display_order: 1,
      status: 'draft',
      published_at: null,
    });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Group type is invalid.');
    expect(fromMock).not.toHaveBeenCalled();
  });

  it('validates and creates publications', async () => {
    const invalid = await createPublication({
      title: 'Brief',
      slug: 'Bad Slug',
      publication_type: 'report',
      authors: null,
      publication_date: null,
      date_label: null,
      publisher: null,
      summary: 'Summary',
      source_url: 'https://example.com/brief',
      cover_image_url: null,
      display_order: 0,
      status: 'draft',
      published_at: null,
    });
    expect(invalid.error).toContain('Slug must use lowercase letters');

    const badType = await createPublication({
      title: 'Brief',
      slug: 'brief',
      publication_type: 'invalid' as 'report',
      authors: null,
      publication_date: '2024-01-01',
      date_label: null,
      publisher: null,
      summary: 'Summary',
      source_url: 'https://example.com/brief',
      cover_image_url: null,
      display_order: 0,
      status: 'draft',
      published_at: null,
    });
    expect(badType.error).toContain('Publication type is invalid.');

    const builder = createInsertBuilder({ id: 'pub-1' });
    fromMock.mockReturnValue(builder);
    const created = await createPublication({
      title: ' Climate Brief ',
      slug: 'climate-brief',
      publication_type: 'brief_white_paper',
      authors: ' Ada ',
      publication_date: '2024-06-01',
      date_label: ' June 2024 ',
      publisher: ' UNDP ',
      summary: ' Summary ',
      source_url: 'https://example.com/brief',
      cover_image_url: 'https://example.com/cover.png',
      display_order: 2,
      status: 'published',
      published_at: null,
    });

    expect(created.error).toBeNull();
    expect(created.data).toEqual({ id: 'pub-1' });
    expect(builder.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Climate Brief',
        slug: 'climate-brief',
        publication_type: 'brief_white_paper',
        authors: 'Ada',
        publication_date: '2024-06-01',
        date_label: 'June 2024',
        publisher: 'UNDP',
        summary: 'Summary',
        status: 'published',
        published_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
      })
    );
  });

  it('lists and updates publications', async () => {
    const listBuilder = createOrderedListBuilder([{ id: 'pub-1', title: 'Brief' }]);
    fromMock.mockReturnValue(listBuilder);
    const listed = await listPublications();
    expect(listed.data).toEqual([{ id: 'pub-1', title: 'Brief' }]);
    expect(listBuilder.order).toHaveBeenCalledWith('publication_date', { ascending: false });

    const getBuilder = createOrderedListBuilder({ id: 'pub-1', title: 'Brief' });
    fromMock.mockReturnValue(getBuilder);
    expect(await getPublication('pub-1')).toEqual({
      data: { id: 'pub-1', title: 'Brief' },
      error: null,
    });

    const updateBuilder = createInsertBuilder({ id: 'pub-1', title: 'Updated' });
    fromMock.mockReturnValue(updateBuilder);
    const updated = await updatePublication('pub-1', {
      title: 'Updated',
      slug: 'updated',
      publication_type: 'report',
      authors: null,
      publication_date: null,
      date_label: null,
      publisher: null,
      summary: 'Updated summary',
      source_url: 'https://example.com/updated',
      cover_image_url: null,
      display_order: 1,
      status: 'draft',
      published_at: null,
    });
    expect(updated.error).toBeNull();
    expect(updateBuilder.update).toHaveBeenCalled();
  });

  it('validates and creates evolution timeline items', async () => {
    const timelineBuilder = createInsertBuilder({ id: 'tl-1' });
    fromMock.mockReturnValue(timelineBuilder);
    const timeline = await createEvolutionTimelineItem({
      period: ' 2026 ',
      title: ' Mainstreaming ',
      body: ' Body ',
      display_order: 1,
      status: 'draft',
      published_at: null,
    });
    expect(timeline.error).toBeNull();
    expect(timelineBuilder.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        period: '2026',
        title: 'Mainstreaming',
        body: 'Body',
      })
    );
  });

  it('covers partner, page-content, and publication list/get/update/archive/delete paths', async () => {
    const partnersList = createOrderedListBuilder([{ id: 'partner-1' }]);
    fromMock.mockReturnValue(partnersList);
    expect((await listPartners()).data).toEqual([{ id: 'partner-1' }]);

    const partnerGet = createOrderedListBuilder({ id: 'partner-1', name: 'UNDP' });
    fromMock.mockReturnValue(partnerGet);
    expect(await getPartner('partner-1')).toEqual({
      data: { id: 'partner-1', name: 'UNDP' },
      error: null,
    });

    const partnerUpdate = createInsertBuilder({ id: 'partner-1' });
    fromMock.mockReturnValue(partnerUpdate);
    expect(
      (
        await updatePartner('partner-1', {
          name: 'UNDP',
          logo_url: null,
          website_url: 'https://www.undp.org/',
          display_order: 1,
          status: 'draft',
          published_at: null,
        })
      ).error
    ).toBeNull();

    const archivePartnerBuilder = createInsertBuilder(null);
    fromMock.mockReturnValue(archivePartnerBuilder);
    expect(await archivePartner('partner-1')).toEqual({ data: { id: 'partner-1' }, error: null });

    const pageList = createOrderedListBuilder([{ id: 'page-1' }]);
    fromMock.mockReturnValue(pageList);
    expect((await listPageContent()).data).toEqual([{ id: 'page-1' }]);

    const pageGet = createOrderedListBuilder({ id: 'page-1' });
    fromMock.mockReturnValue(pageGet);
    expect(await getPageContentById('page-1')).toEqual({ data: { id: 'page-1' }, error: null });

    const pageUpdate = createInsertBuilder({ id: 'page-1' });
    fromMock.mockReturnValue(pageUpdate);
    expect(
      (
        await updatePageContent('page-1', {
          page_slug: 'about',
          section_slug: 'mission',
          body: 'Updated body',
          status: 'draft',
          published_at: null,
        })
      ).error
    ).toBeNull();

    const archivePageBuilder = createInsertBuilder(null);
    const deletePageBuilder = createInsertBuilder(null);
    fromMock.mockReturnValueOnce(archivePageBuilder).mockReturnValueOnce(deletePageBuilder);
    expect(await archivePageContent('page-1')).toEqual({ data: { id: 'page-1' }, error: null });
    expect(await deletePageContent('page-1')).toEqual({ data: { id: 'page-1' }, error: null });

    const archivePubBuilder = createInsertBuilder(null);
    const deletePubBuilder = createInsertBuilder(null);
    fromMock.mockReturnValueOnce(archivePubBuilder).mockReturnValueOnce(deletePubBuilder);
    expect(await archivePublication('pub-1')).toEqual({ data: { id: 'pub-1' }, error: null });
    expect(await deletePublication('pub-1')).toEqual({ data: { id: 'pub-1' }, error: null });

    const timelineUpdate = createInsertBuilder({ id: 'tl-1' });
    fromMock.mockReturnValue(timelineUpdate);
    expect(
      (
        await updateEvolutionTimelineItem('tl-1', {
          period: '2025',
          title: 'Consolidation',
          body: null,
          display_order: 2,
          status: 'draft',
          published_at: null,
        })
      ).error
    ).toBeNull();
  });

  it('returns list and get-by-id query errors', async () => {
    const listError = createOrderedListBuilder([], { message: 'list failed' });
    fromMock.mockReturnValue(listError);
    expect(await listPublications()).toEqual({
      data: [],
      error: 'list failed',
      page: 1,
      pageSize: 50,
      hasMore: false,
    });

    const getError = createOrderedListBuilder(null, { message: 'get failed' });
    fromMock.mockReturnValue(getError);
    expect(await getPublication('missing')).toEqual({ data: null, error: 'get failed' });
  });
});
