import { runProtectedAdminAction } from './admin-security';
import {
  ADMIN_LIST_MAX_PAGE_SIZE,
  ADMIN_LIST_PAGE_SIZE,
  normalizePageOptions,
  type ListPageOptions,
} from './pagination';
import { getSupabaseAuth } from './supabase-auth';
import { isTeamGroupTitle } from './teamGroups';
import type {
  PublishStatus,
  ProjectStatus,
  PeopleGroup,
  Statistic,
  Project,
  NewsArticle,
  Publication,
  PublicationType,
  Person,
  Partner,
  PageContent,
  EvolutionTimelineItem,
} from './types';

export interface AdminResult<T> {
  data: T | null;
  error: string | null;
}

export interface AdminListResult<T> {
  data: T[];
  error: string | null;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ContentCounts {
  total: number;
  draft: number;
  published: number;
  archived: number;
}

export interface StatisticInput {
  label: string;
  value: string;
  icon_name?: string | null;
  display_order: number;
  status: PublishStatus;
  published_at?: string | null;
}

export interface ProjectInput {
  title: string;
  slug: string;
  summary?: string | null;
  description: string;
  project_status: ProjectStatus;
  deployment_status?: 'live' | 'prototype' | 'internal' | null;
  is_deployed: boolean;
  is_featured: boolean;
  image_url?: string | null;
  impact_area?: string | null;
  timeline?: string | null;
  project_year?: number | null;
  work_stream?: string | null;
  capabilities_involved?: string[];
  reusable_components?: string | null;
  current_client_segments?: string[];
  future_client_segments?: string[];
  business_model?: string | null;
  project_category?: string | null;
  best_fit?: string[];
  core_capabilities?: string[];
  problem?: string | null;
  solution?: string | null;
  how_it_works?: string[];
  features?: string[];
  tech_stack?: string[];
  collaboration_network?: string | null;
  implementation_countries?: string[];
  resource_links?: string[];
  video_url?: string | null;
  media_caption?: string | null;
  sdgs?: number[];
  display_order: number;
  status: PublishStatus;
  published_at?: string | null;
}

export interface NewsArticleInput {
  title: string;
  slug: string;
  body: string;
  summary?: string | null;
  featured_image_url?: string | null;
  author_name?: string | null;
  publish_date: string;
  status: PublishStatus;
  published_at?: string | null;
}

export interface PublicationInput {
  title: string;
  slug: string;
  publication_type: PublicationType;
  authors?: string | null;
  publication_date?: string | null;
  date_label?: string | null;
  publisher?: string | null;
  summary: string;
  source_url: string;
  cover_image_url?: string | null;
  display_order: number;
  status: PublishStatus;
  published_at?: string | null;
}

export interface PersonInput {
  name: string;
  role_title: string;
  photo_url?: string | null;
  group_type: PeopleGroup;
  team_group?: string | null;
  biography?: string | null;
  display_order: number;
  status: PublishStatus;
  published_at?: string | null;
}

export interface PartnerInput {
  name: string;
  logo_url?: string | null;
  website_url: string;
  display_order: number;
  status: PublishStatus;
  published_at?: string | null;
}

export interface EvolutionTimelineInput {
  period: string;
  title: string;
  body?: string | null;
  display_order: number;
  status: PublishStatus;
  published_at?: string | null;
}

export interface PageContentInput {
  page_slug: string;
  section_slug: string;
  body: string;
  status: PublishStatus;
  published_at?: string | null;
}

type PublishableInput = { status?: PublishStatus; published_at?: string | null };
type Validator<I> = (input: I) => I;

const VALID_STATUSES: PublishStatus[] = ['draft', 'published', 'archived'];
const VALID_PROJECT_STATUSES: ProjectStatus[] = ['active', 'completed', 'under_development', 'on_hold'];
const VALID_DEPLOYMENT_STATUSES = ['live', 'prototype', 'internal'] as const;
const VALID_PEOPLE_GROUPS: PeopleGroup[] = ['team', 'advisory_board'];
const VALID_PUBLICATION_TYPES: PublicationType[] = ['report', 'brief_white_paper', 'academic_paper', 'dataset'];
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SECTION_PATTERN = /^[a-z0-9]+(?:-[a-z0-9_]+)*$/;
const MUTATION_WINDOW_MS = 5 * 60 * 1000;

function protectedMutation<T>(key: string, action: () => Promise<T>): Promise<T> {
  return runProtectedAdminAction(
    {
      key,
      limit: 20,
      windowMs: MUTATION_WINDOW_MS,
      cooldownMs: 1_500,
      message: 'Too many admin changes were submitted too quickly.',
    },
    action
  );
}

function protectedDestructiveMutation<T>(key: string, action: () => Promise<T>): Promise<T> {
  return runProtectedAdminAction(
    {
      key,
      limit: 10,
      windowMs: 10 * 60 * 1000,
      cooldownMs: 2_000,
      message: 'Too many destructive admin actions were submitted too quickly.',
    },
    action
  );
}

function assertNonEmptyString(value: unknown, field: string): string {
  if (typeof value !== 'string') {
    throw new Error(`${field} must be a string.`);
  }
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${field} is required.`);
  }
  return normalized;
}

function normalizeOptionalString(value: unknown, field: string): string | null {
  if (value == null) return null;
  if (typeof value !== 'string') {
    throw new Error(`${field} must be a string.`);
  }
  const normalized = value.trim();
  return normalized ? normalized : null;
}

function assertBoolean(value: unknown, field: string): boolean {
  if (typeof value !== 'boolean') {
    throw new Error(`${field} must be true or false.`);
  }
  return value;
}

function assertNonNegativeInteger(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new Error(`${field} must be a non-negative integer.`);
  }
  return value;
}

function normalizeOptionalPositiveInteger(value: unknown, field: string): number | null {
  if (value == null || value === '') return null;
  const numberValue = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(numberValue) || numberValue < 0) {
    throw new Error(`${field} must be a non-negative integer.`);
  }
  return numberValue;
}

function assertStatus(value: unknown): PublishStatus {
  if (typeof value !== 'string' || !VALID_STATUSES.includes(value as PublishStatus)) {
    throw new Error('Status must be draft, published, or archived.');
  }
  return value as PublishStatus;
}

function assertProjectStatus(value: unknown): ProjectStatus {
  if (typeof value !== 'string' || !VALID_PROJECT_STATUSES.includes(value as ProjectStatus)) {
    throw new Error('Project status is invalid.');
  }
  return value as ProjectStatus;
}

function assertDeploymentStatus(value: unknown): 'live' | 'prototype' | 'internal' | null {
  if (value == null || value === '') return null;
  if (
    typeof value !== 'string' ||
    !VALID_DEPLOYMENT_STATUSES.includes(value as (typeof VALID_DEPLOYMENT_STATUSES)[number])
  ) {
    throw new Error('Deployment status is invalid.');
  }
  return value as 'live' | 'prototype' | 'internal';
}

function normalizeStringArray(value: unknown, field: string): string[] {
  if (value == null) return [];
  if (!Array.isArray(value)) {
    throw new Error(`${field} must be a list.`);
  }
  return value
    .map((item) => {
      if (typeof item !== 'string') throw new Error(`${field} must contain only text values.`);
      return item.trim();
    })
    .filter(Boolean);
}

function normalizeSdgArray(value: unknown): number[] {
  if (value == null) return [];
  if (!Array.isArray(value)) {
    throw new Error('SDGs must be a list.');
  }
  return value.map((item) => {
    const numberValue = typeof item === 'number' ? item : Number(item);
    if (!Number.isInteger(numberValue) || numberValue < 1 || numberValue > 17) {
      throw new Error('SDGs must be whole numbers between 1 and 17.');
    }
    return numberValue;
  });
}

function assertPeopleGroup(value: unknown): PeopleGroup {
  if (typeof value !== 'string' || !VALID_PEOPLE_GROUPS.includes(value as PeopleGroup)) {
    throw new Error('Group type is invalid.');
  }
  return value as PeopleGroup;
}

function assertOptionalTeamGroup(value: unknown, groupType: PeopleGroup): string | null {
  if (value == null || value === '') {
    if (groupType === 'team') {
      throw new Error('Team group is required for team members.');
    }
    return null;
  }
  if (typeof value !== 'string' || !isTeamGroupTitle(value)) {
    throw new Error('Team group is invalid.');
  }
  return groupType === 'team' ? value : null;
}

function assertPublicationType(value: unknown): PublicationType {
  if (typeof value !== 'string' || !VALID_PUBLICATION_TYPES.includes(value as PublicationType)) {
    throw new Error('Publication type is invalid.');
  }
  return value as PublicationType;
}

function assertSlug(value: unknown, field: string): string {
  const slug = assertNonEmptyString(value, field).toLowerCase();
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(`${field} must use lowercase letters, numbers, and hyphens only.`);
  }
  return slug;
}

function assertSectionSlug(value: unknown, field: string): string {
  const slug = assertNonEmptyString(value, field).toLowerCase();
  if (!SECTION_PATTERN.test(slug)) {
    throw new Error(`${field} must use lowercase letters, numbers, hyphens, or underscores.`);
  }
  return slug;
}

function assertIsoDate(value: unknown, field: string): string {
  const date = assertNonEmptyString(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
    throw new Error(`${field} must be a valid date in YYYY-MM-DD format.`);
  }
  return date;
}

function assertOptionalIsoDateTime(value: unknown, field: string): string | null {
  const normalized = normalizeOptionalString(value, field);
  if (!normalized) return null;
  if (Number.isNaN(Date.parse(normalized))) {
    throw new Error(`${field} must be a valid ISO datetime.`);
  }
  return normalized;
}

function assertOptionalHttpUrl(value: unknown, field: string): string | null {
  const normalized = normalizeOptionalString(value, field);
  if (!normalized) return null;
  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    throw new Error(`${field} must be a valid URL.`);
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`${field} must use http or https.`);
  }
  return parsed.toString();
}

function applyPublishedAt<T extends PublishableInput>(data: T): T {
  if (data.status === 'published' && (data.published_at == null || data.published_at === '')) {
    return { ...data, published_at: new Date().toISOString() };
  }
  return data;
}

function validateStatisticInput(input: StatisticInput): StatisticInput {
  return {
    label: assertNonEmptyString(input.label, 'Label'),
    value: assertNonEmptyString(input.value, 'Value'),
    icon_name: normalizeOptionalString(input.icon_name, 'Icon name'),
    display_order: assertNonNegativeInteger(input.display_order, 'Display order'),
    status: assertStatus(input.status),
    published_at: assertOptionalIsoDateTime(input.published_at, 'Published at'),
  };
}

function validateProjectInput(input: ProjectInput): ProjectInput {
  return {
    title: assertNonEmptyString(input.title, 'Title'),
    slug: assertSlug(input.slug, 'Slug'),
    summary: normalizeOptionalString(input.summary, 'Summary'),
    description: assertNonEmptyString(input.description, 'Description'),
    project_status: assertProjectStatus(input.project_status),
    deployment_status: assertDeploymentStatus(input.deployment_status),
    is_deployed: assertBoolean(input.is_deployed, 'Is deployed'),
    is_featured: assertBoolean(input.is_featured, 'Is featured'),
    image_url: assertOptionalHttpUrl(input.image_url, 'Image URL'),
    impact_area: normalizeOptionalString(input.impact_area, 'Impact area'),
    timeline: normalizeOptionalString(input.timeline, 'Timeline'),
    project_year: normalizeOptionalPositiveInteger(input.project_year, 'Project year'),
    work_stream: normalizeOptionalString(input.work_stream, 'Work stream'),
    capabilities_involved: normalizeStringArray(input.capabilities_involved, 'Capabilities involved'),
    reusable_components: normalizeOptionalString(input.reusable_components, 'Reusable components'),
    current_client_segments: normalizeStringArray(input.current_client_segments, 'Current client segments'),
    future_client_segments: normalizeStringArray(input.future_client_segments, 'Future client segments'),
    business_model: normalizeOptionalString(input.business_model, 'Business model'),
    project_category: normalizeOptionalString(input.project_category, 'Project category'),
    best_fit: normalizeStringArray(input.best_fit, 'Best fit'),
    core_capabilities: normalizeStringArray(input.core_capabilities, 'Core capabilities'),
    problem: normalizeOptionalString(input.problem, 'Problem'),
    solution: normalizeOptionalString(input.solution, 'Solution'),
    how_it_works: normalizeStringArray(input.how_it_works, 'How it works'),
    features: normalizeStringArray(input.features, 'Features'),
    tech_stack: normalizeStringArray(input.tech_stack, 'Tech stack'),
    collaboration_network: normalizeOptionalString(input.collaboration_network, 'Collaboration / network'),
    implementation_countries: normalizeStringArray(input.implementation_countries, 'Implementation countries'),
    resource_links: normalizeStringArray(input.resource_links, 'Resource links').map((url) =>
      assertOptionalHttpUrl(url, 'Resource link')!
    ),
    video_url: assertOptionalHttpUrl(input.video_url, 'Video URL'),
    media_caption: normalizeOptionalString(input.media_caption, 'Media caption'),
    sdgs: normalizeSdgArray(input.sdgs),
    display_order: assertNonNegativeInteger(input.display_order, 'Display order'),
    status: assertStatus(input.status),
    published_at: assertOptionalIsoDateTime(input.published_at, 'Published at'),
  };
}

function validateNewsArticleInput(input: NewsArticleInput): NewsArticleInput {
  return {
    title: assertNonEmptyString(input.title, 'Title'),
    slug: assertSlug(input.slug, 'Slug'),
    body: assertNonEmptyString(input.body, 'Body'),
    summary: normalizeOptionalString(input.summary, 'Summary'),
    featured_image_url: assertOptionalHttpUrl(input.featured_image_url, 'Featured image URL'),
    author_name: normalizeOptionalString(input.author_name, 'Author name'),
    publish_date: assertIsoDate(input.publish_date, 'Publish date'),
    status: assertStatus(input.status),
    published_at: assertOptionalIsoDateTime(input.published_at, 'Published at'),
  };
}

function validatePublicationInput(input: PublicationInput): PublicationInput {
  const publicationDate = normalizeOptionalString(input.publication_date, 'Publication date');
  return {
    title: assertNonEmptyString(input.title, 'Title'),
    slug: assertSlug(input.slug, 'Slug'),
    publication_type: assertPublicationType(input.publication_type),
    authors: normalizeOptionalString(input.authors, 'Authors'),
    publication_date: publicationDate ? assertIsoDate(publicationDate, 'Publication date') : null,
    date_label: normalizeOptionalString(input.date_label, 'Date label'),
    publisher: normalizeOptionalString(input.publisher, 'Publisher'),
    summary: assertNonEmptyString(input.summary, 'Summary'),
    source_url: assertNonEmptyString(assertOptionalHttpUrl(input.source_url, 'Source URL'), 'Source URL'),
    cover_image_url: assertOptionalHttpUrl(input.cover_image_url, 'Cover image URL'),
    display_order: assertNonNegativeInteger(input.display_order, 'Display order'),
    status: assertStatus(input.status),
    published_at: assertOptionalIsoDateTime(input.published_at, 'Published at'),
  };
}

function validatePersonInput(input: PersonInput): PersonInput {
  const group_type = assertPeopleGroup(input.group_type);
  return {
    name: assertNonEmptyString(input.name, 'Name'),
    role_title: assertNonEmptyString(input.role_title, 'Role title'),
    photo_url: assertOptionalHttpUrl(input.photo_url, 'Photo URL'),
    group_type,
    team_group: assertOptionalTeamGroup(input.team_group, group_type),
    biography: normalizeOptionalString(input.biography, 'Biography'),
    display_order: assertNonNegativeInteger(input.display_order, 'Display order'),
    status: assertStatus(input.status),
    published_at: assertOptionalIsoDateTime(input.published_at, 'Published at'),
  };
}

function validatePartnerInput(input: PartnerInput): PartnerInput {
  return {
    name: assertNonEmptyString(input.name, 'Name'),
    logo_url: assertOptionalHttpUrl(input.logo_url, 'Logo URL'),
    website_url: assertNonEmptyString(assertOptionalHttpUrl(input.website_url, 'Website URL'), 'Website URL'),
    display_order: assertNonNegativeInteger(input.display_order, 'Display order'),
    status: assertStatus(input.status),
    published_at: assertOptionalIsoDateTime(input.published_at, 'Published at'),
  };
}

function validateEvolutionTimelineInput(input: EvolutionTimelineInput): EvolutionTimelineInput {
  return {
    period: assertNonEmptyString(input.period, 'Period'),
    title: assertNonEmptyString(input.title, 'Title'),
    body: normalizeOptionalString(input.body, 'Body'),
    display_order: assertNonNegativeInteger(input.display_order, 'Display order'),
    status: assertStatus(input.status),
    published_at: assertOptionalIsoDateTime(input.published_at, 'Published at'),
  };
}

function validatePageContentInput(input: PageContentInput): PageContentInput {
  return {
    page_slug: assertSectionSlug(input.page_slug, 'Page slug'),
    section_slug: assertSectionSlug(input.section_slug, 'Section slug'),
    body: assertNonEmptyString(input.body, 'Content'),
    status: assertStatus(input.status),
    published_at: assertOptionalIsoDateTime(input.published_at, 'Published at'),
  };
}

async function listAll<T>(
  table: string,
  orderBy: string,
  ascending: boolean,
  options?: ListPageOptions
): Promise<AdminListResult<T>> {
  const { page, pageSize, from } = normalizePageOptions(options, {
    pageSize: ADMIN_LIST_PAGE_SIZE,
    maxPageSize: ADMIN_LIST_MAX_PAGE_SIZE,
  });
  const { data, error } = await getSupabaseAuth()
    .from(table)
    .select('*')
    .order(orderBy, { ascending })
    .range(from, from + pageSize); // pageSize + 1 rows to detect hasMore

  if (error) {
    return { data: [], error: error.message, page, pageSize, hasMore: false };
  }

  const rows = (data ?? []) as T[];
  const hasMore = rows.length > pageSize;
  return {
    data: hasMore ? rows.slice(0, pageSize) : rows,
    error: null,
    page,
    pageSize,
    hasMore,
  };
}

async function getById<T>(table: string, id: string): Promise<AdminResult<T>> {
  const { data, error } = await getSupabaseAuth().from(table).select('*').eq('id', id).maybeSingle();
  if (error) return { data: null, error: error.message };
  return { data: data as T | null, error: null };
}

async function createRecord<T, I extends PublishableInput>(
  table: string,
  data: I,
  validate: Validator<I>
): Promise<AdminResult<T>> {
  try {
    const prepared = applyPublishedAt(validate(data));
    const { data: inserted, error } = await protectedMutation(`create:${table}`, async () =>
      await getSupabaseAuth()
        .from(table)
        .insert(prepared)
        .select()
        .single()
    );
    if (error) return { data: null, error: error.message };
    return { data: inserted as T, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Invalid input.',
    };
  }
}

async function updateRecord<T, I extends PublishableInput>(
  table: string,
  id: string,
  data: I,
  validate: Validator<I>
): Promise<AdminResult<T>> {
  try {
    const prepared = applyPublishedAt(validate(data));
    const { data: updated, error } = await protectedMutation(`update:${table}`, async () =>
      await getSupabaseAuth()
        .from(table)
        .update(prepared)
        .eq('id', id)
        .select()
        .single()
    );
    if (error) return { data: null, error: error.message };
    return { data: updated as T, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Invalid input.',
    };
  }
}

async function archiveRecord(table: string, id: string): Promise<AdminResult<{ id: string }>> {
  try {
    const { error } = await protectedDestructiveMutation(`archive:${table}`, async () =>
      await getSupabaseAuth().from(table).update({ status: 'archived' }).eq('id', id)
    );
    if (error) return { data: null, error: error.message };
    return { data: { id }, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unable to archive record.',
    };
  }
}

async function permanentlyDeleteRecord(
  table: string,
  id: string
): Promise<AdminResult<{ id: string }>> {
  try {
    const { error } = await protectedDestructiveMutation(`delete:${table}`, async () =>
      await getSupabaseAuth().from(table).delete().eq('id', id)
    );
    if (error) return { data: null, error: error.message };
    return { data: { id }, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unable to delete record.',
    };
  }
}

function toContentCounts(rows: { status: PublishStatus }[]): ContentCounts {
  const total = rows.length;
  let draft = 0;
  let published = 0;
  let archived = 0;
  for (const row of rows) {
    if (row.status === 'draft') draft++;
    else if (row.status === 'published') published++;
    else if (row.status === 'archived') archived++;
  }
  return { total, draft, published, archived };
}

export async function listStatistics(options?: ListPageOptions): Promise<AdminListResult<Statistic>> {
  return listAll<Statistic>('statistics', 'display_order', true, options);
}

export async function getStatistic(id: string): Promise<AdminResult<Statistic>> {
  return getById<Statistic>('statistics', id);
}

export async function createStatistic(
  input: StatisticInput
): Promise<AdminResult<Statistic>> {
  return createRecord<Statistic, StatisticInput>('statistics', input, validateStatisticInput);
}

export async function updateStatistic(
  id: string,
  input: StatisticInput
): Promise<AdminResult<Statistic>> {
  return updateRecord<Statistic, StatisticInput>('statistics', id, input, validateStatisticInput);
}

export async function archiveStatistic(id: string): Promise<AdminResult<{ id: string }>> {
  return archiveRecord('statistics', id);
}

export async function deleteStatistic(id: string): Promise<AdminResult<{ id: string }>> {
  return permanentlyDeleteRecord('statistics', id);
}

export async function listEvolutionTimeline(
  options?: ListPageOptions
): Promise<AdminListResult<EvolutionTimelineItem>> {
  return listAll<EvolutionTimelineItem>('evolution_timeline', 'display_order', true, options);
}

export async function getEvolutionTimelineItem(id: string): Promise<AdminResult<EvolutionTimelineItem>> {
  return getById<EvolutionTimelineItem>('evolution_timeline', id);
}

export async function createEvolutionTimelineItem(
  input: EvolutionTimelineInput
): Promise<AdminResult<EvolutionTimelineItem>> {
  return createRecord<EvolutionTimelineItem, EvolutionTimelineInput>('evolution_timeline', input, validateEvolutionTimelineInput);
}

export async function updateEvolutionTimelineItem(
  id: string,
  input: EvolutionTimelineInput
): Promise<AdminResult<EvolutionTimelineItem>> {
  return updateRecord<EvolutionTimelineItem, EvolutionTimelineInput>('evolution_timeline', id, input, validateEvolutionTimelineInput);
}

export async function archiveEvolutionTimelineItem(id: string): Promise<AdminResult<{ id: string }>> {
  return archiveRecord('evolution_timeline', id);
}

export async function deleteEvolutionTimelineItem(id: string): Promise<AdminResult<{ id: string }>> {
  return permanentlyDeleteRecord('evolution_timeline', id);
}

export async function listProjects(options?: ListPageOptions): Promise<AdminListResult<Project>> {
  return listAll<Project>('projects', 'display_order', true, options);
}

export async function getProject(id: string): Promise<AdminResult<Project>> {
  return getById<Project>('projects', id);
}

export async function createProject(input: ProjectInput): Promise<AdminResult<Project>> {
  return createRecord<Project, ProjectInput>('projects', input, validateProjectInput);
}

export async function updateProject(
  id: string,
  input: ProjectInput
): Promise<AdminResult<Project>> {
  return updateRecord<Project, ProjectInput>('projects', id, input, validateProjectInput);
}

export async function archiveProject(id: string): Promise<AdminResult<{ id: string }>> {
  return archiveRecord('projects', id);
}

export async function deleteProject(id: string): Promise<AdminResult<{ id: string }>> {
  return permanentlyDeleteRecord('projects', id);
}

export async function listNewsArticles(
  options?: ListPageOptions
): Promise<AdminListResult<NewsArticle>> {
  return listAll<NewsArticle>('news_articles', 'publish_date', false, options);
}

export async function getNewsArticle(id: string): Promise<AdminResult<NewsArticle>> {
  return getById<NewsArticle>('news_articles', id);
}

export async function createNewsArticle(
  input: NewsArticleInput
): Promise<AdminResult<NewsArticle>> {
  return createRecord<NewsArticle, NewsArticleInput>('news_articles', input, validateNewsArticleInput);
}

export async function updateNewsArticle(
  id: string,
  input: NewsArticleInput
): Promise<AdminResult<NewsArticle>> {
  return updateRecord<NewsArticle, NewsArticleInput>('news_articles', id, input, validateNewsArticleInput);
}

export async function archiveNewsArticle(id: string): Promise<AdminResult<{ id: string }>> {
  return archiveRecord('news_articles', id);
}

export async function deleteNewsArticle(id: string): Promise<AdminResult<{ id: string }>> {
  return permanentlyDeleteRecord('news_articles', id);
}

export async function listPublications(
  options?: ListPageOptions
): Promise<AdminListResult<Publication>> {
  return listAll<Publication>('publications', 'publication_date', false, options);
}

export async function getPublication(id: string): Promise<AdminResult<Publication>> {
  return getById<Publication>('publications', id);
}

export async function createPublication(input: PublicationInput): Promise<AdminResult<Publication>> {
  return createRecord<Publication, PublicationInput>('publications', input, validatePublicationInput);
}

export async function updatePublication(id: string, input: PublicationInput): Promise<AdminResult<Publication>> {
  return updateRecord<Publication, PublicationInput>('publications', id, input, validatePublicationInput);
}

export async function archivePublication(id: string): Promise<AdminResult<{ id: string }>> {
  return archiveRecord('publications', id);
}

export async function deletePublication(id: string): Promise<AdminResult<{ id: string }>> {
  return permanentlyDeleteRecord('publications', id);
}

export async function listPeople(options?: ListPageOptions): Promise<AdminListResult<Person>> {
  return listAll<Person>('people', 'display_order', true, options);
}

export async function getPerson(id: string): Promise<AdminResult<Person>> {
  return getById<Person>('people', id);
}

export async function createPerson(input: PersonInput): Promise<AdminResult<Person>> {
  return createRecord<Person, PersonInput>('people', input, validatePersonInput);
}

export async function updatePerson(
  id: string,
  input: PersonInput
): Promise<AdminResult<Person>> {
  return updateRecord<Person, PersonInput>('people', id, input, validatePersonInput);
}

export async function archivePerson(id: string): Promise<AdminResult<{ id: string }>> {
  return archiveRecord('people', id);
}

export async function deletePerson(id: string): Promise<AdminResult<{ id: string }>> {
  return permanentlyDeleteRecord('people', id);
}

export async function listPartners(options?: ListPageOptions): Promise<AdminListResult<Partner>> {
  return listAll<Partner>('partners', 'display_order', true, options);
}

export async function getPartner(id: string): Promise<AdminResult<Partner>> {
  return getById<Partner>('partners', id);
}

export async function createPartner(input: PartnerInput): Promise<AdminResult<Partner>> {
  return createRecord<Partner, PartnerInput>('partners', input, validatePartnerInput);
}

export async function updatePartner(
  id: string,
  input: PartnerInput
): Promise<AdminResult<Partner>> {
  return updateRecord<Partner, PartnerInput>('partners', id, input, validatePartnerInput);
}

export async function archivePartner(id: string): Promise<AdminResult<{ id: string }>> {
  return archiveRecord('partners', id);
}

export async function deletePartner(id: string): Promise<AdminResult<{ id: string }>> {
  return permanentlyDeleteRecord('partners', id);
}

export async function listPageContent(
  options?: ListPageOptions
): Promise<AdminListResult<PageContent>> {
  return listAll<PageContent>('page_content', 'page_slug', true, options);
}

export async function getPageContentById(id: string): Promise<AdminResult<PageContent>> {
  return getById<PageContent>('page_content', id);
}

export async function createPageContent(
  input: PageContentInput
): Promise<AdminResult<PageContent>> {
  return createRecord<PageContent, PageContentInput>('page_content', input, validatePageContentInput);
}

export async function ensureCatalogPageSections(
  sections: Array<{ pageSlug: string; sectionSlug: string; fallback: string }>
): Promise<AdminResult<{ created: number }>> {
  return protectedMutation('page-content:ensure', async () => {
    const { data, error } = await getSupabaseAuth()
      .from('page_content')
      .select('page_slug, section_slug')
      .limit(1000);
    if (error) return { data: null, error: error.message };

    const existing = new Set(
      (data ?? []).map((row) => `${row.page_slug}:${row.section_slug}`)
    );
    const missing = sections.filter(
      (section) => !existing.has(`${section.pageSlug}:${section.sectionSlug}`)
    );
    if (missing.length === 0) return { data: { created: 0 }, error: null };

    const publishedAt = new Date().toISOString();
    const { error: insertError } = await getSupabaseAuth().from('page_content').insert(
      missing.map((section) => ({
        page_slug: section.pageSlug,
        section_slug: section.sectionSlug,
        body: section.fallback,
        status: 'published',
        published_at: publishedAt,
      }))
    );
    if (insertError) return { data: null, error: insertError.message };
    return { data: { created: missing.length }, error: null };
  });
}

export async function updatePageContent(
  id: string,
  input: PageContentInput
): Promise<AdminResult<PageContent>> {
  return updateRecord<PageContent, PageContentInput>('page_content', id, input, validatePageContentInput);
}

export async function archivePageContent(id: string): Promise<AdminResult<{ id: string }>> {
  return archiveRecord('page_content', id);
}

export async function deletePageContent(id: string): Promise<AdminResult<{ id: string }>> {
  return permanentlyDeleteRecord('page_content', id);
}

type DashboardTable =
  | 'statistics'
  | 'projects'
  | 'news_articles'
  | 'publications'
  | 'people'
  | 'partners'
  | 'evolution_timeline'
  | 'page_content';

export async function getDashboardCounts(): Promise<{
  data: Record<DashboardTable, ContentCounts>;
  error: string | null;
}> {
  const tables = [
    'statistics',
    'projects',
    'news_articles',
    'publications',
    'people',
    'partners',
    'evolution_timeline',
    'page_content',
  ] as const satisfies readonly DashboardTable[];
  const result: Record<string, ContentCounts> = {};
  for (const table of tables) {
    const { data, error } = await getSupabaseAuth().from(table).select('status');
    if (error) {
      return {
        data: {} as Record<DashboardTable, ContentCounts>,
        error: error.message,
      };
    }
    result[table] = toContentCounts((data ?? []) as { status: PublishStatus }[]);
  }
  return {
    data: result as Record<DashboardTable, ContentCounts>,
    error: null,
  };
}
