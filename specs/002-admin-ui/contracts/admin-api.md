# Admin API Contracts

**Feature**: 002-admin-ui | **Date**: 2026-03-02

These contracts define the TypeScript function signatures for all admin data operations. Implementation lives in `src/lib/admin-queries.ts` and `src/lib/storage.ts`. All functions use the authenticated Supabase client.

## Common Types

```typescript
type PublishStatus = 'draft' | 'published' | 'archived';

interface AdminResult<T> {
  data: T | null;
  error: string | null;
}

interface AdminListResult<T> {
  data: T[];
  error: string | null;
}

interface ContentCounts {
  total: number;
  draft: number;
  published: number;
  archived: number;
}
```

## Dashboard Queries

```typescript
function getDashboardCounts(): Promise<{
  data: Record<'statistics' | 'projects' | 'news_articles' | 'people' | 'partners' | 'page_content', ContentCounts>;
  error: string | null;
}>;
```

## Generic CRUD Pattern

All 6 content types follow this pattern. The table name and entity type vary.

```typescript
// List all items (no status filter — admin sees everything)
function listAll<T>(table: string, orderBy: string, ascending: boolean): Promise<AdminListResult<T>>;

// Get single item by ID
function getById<T>(table: string, id: string): Promise<AdminResult<T>>;

// Create new item
function create<T>(table: string, data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<AdminResult<T>>;

// Update existing item
function update<T>(table: string, id: string, data: Partial<T>): Promise<AdminResult<T>>;

// Archive item (soft delete: set status = 'archived')
function archive(table: string, id: string): Promise<AdminResult<{ id: string }>>;

// Permanently delete item (hard delete — only for archived items)
function permanentlyDelete(table: string, id: string): Promise<AdminResult<{ id: string }>>;
```

## Content-Type-Specific Functions

### Statistics

```typescript
function listStatistics(): Promise<AdminListResult<Statistic>>;
function getStatistic(id: string): Promise<AdminResult<Statistic>>;
function createStatistic(data: StatisticInput): Promise<AdminResult<Statistic>>;
function updateStatistic(id: string, data: Partial<StatisticInput>): Promise<AdminResult<Statistic>>;
function archiveStatistic(id: string): Promise<AdminResult<{ id: string }>>;
function deleteStatistic(id: string): Promise<AdminResult<{ id: string }>>;

interface StatisticInput {
  label: string;
  value: string;
  icon_name?: string | null;
  display_order: number;
  status: PublishStatus;
  published_at?: string | null;
}
```

### Projects

```typescript
function listProjects(): Promise<AdminListResult<Project>>;
function getProject(id: string): Promise<AdminResult<Project>>;
function createProject(data: ProjectInput): Promise<AdminResult<Project>>;
function updateProject(id: string, data: Partial<ProjectInput>): Promise<AdminResult<Project>>;
function archiveProject(id: string): Promise<AdminResult<{ id: string }>>;
function deleteProject(id: string): Promise<AdminResult<{ id: string }>>;

interface ProjectInput {
  title: string;
  slug: string;
  description: string;
  project_status: 'active' | 'completed' | 'under_development' | 'on_hold';
  is_deployed: boolean;
  is_featured: boolean;
  image_url?: string | null;
  display_order: number;
  status: PublishStatus;
  published_at?: string | null;
}
```

### News Articles

```typescript
function listNewsArticles(): Promise<AdminListResult<NewsArticle>>;
function getNewsArticle(id: string): Promise<AdminResult<NewsArticle>>;
function createNewsArticle(data: NewsArticleInput): Promise<AdminResult<NewsArticle>>;
function updateNewsArticle(id: string, data: Partial<NewsArticleInput>): Promise<AdminResult<NewsArticle>>;
function archiveNewsArticle(id: string): Promise<AdminResult<{ id: string }>>;
function deleteNewsArticle(id: string): Promise<AdminResult<{ id: string }>>;

interface NewsArticleInput {
  title: string;
  slug: string;
  body: string;
  summary?: string | null;
  featured_image_url?: string | null;
  author_name?: string | null;
  publish_date: string; // ISO date (YYYY-MM-DD)
  status: PublishStatus;
  published_at?: string | null;
}
```

### People

```typescript
function listPeople(): Promise<AdminListResult<Person>>;
function getPerson(id: string): Promise<AdminResult<Person>>;
function createPerson(data: PersonInput): Promise<AdminResult<Person>>;
function updatePerson(id: string, data: Partial<PersonInput>): Promise<AdminResult<Person>>;
function archivePerson(id: string): Promise<AdminResult<{ id: string }>>;
function deletePerson(id: string): Promise<AdminResult<{ id: string }>>;

interface PersonInput {
  name: string;
  role_title: string;
  photo_url?: string | null;
  group_type: 'team' | 'advisory_board';
  biography?: string | null;
  display_order: number;
  status: PublishStatus;
  published_at?: string | null;
}
```

### Partners

```typescript
function listPartners(): Promise<AdminListResult<Partner>>;
function getPartner(id: string): Promise<AdminResult<Partner>>;
function createPartner(data: PartnerInput): Promise<AdminResult<Partner>>;
function updatePartner(id: string, data: Partial<PartnerInput>): Promise<AdminResult<Partner>>;
function archivePartner(id: string): Promise<AdminResult<{ id: string }>>;
function deletePartner(id: string): Promise<AdminResult<{ id: string }>>;

interface PartnerInput {
  name: string;
  logo_url?: string | null;
  website_url: string;
  display_order: number;
  status: PublishStatus;
  published_at?: string | null;
}
```

### Page Content

```typescript
function listPageContent(): Promise<AdminListResult<PageContent>>;
function getPageContent(id: string): Promise<AdminResult<PageContent>>;
function createPageContent(data: PageContentInput): Promise<AdminResult<PageContent>>;
function updatePageContent(id: string, data: Partial<PageContentInput>): Promise<AdminResult<PageContent>>;
function archivePageContent(id: string): Promise<AdminResult<{ id: string }>>;
function deletePageContent(id: string): Promise<AdminResult<{ id: string }>>;

interface PageContentInput {
  page_slug: string;
  section_slug: string;
  body: string;
  status: PublishStatus;
  published_at?: string | null;
}
```

## Storage Functions

```typescript
// src/lib/storage.ts

function uploadImage(
  folder: 'projects' | 'news' | 'people' | 'partners',
  file: File
): Promise<{ url: string | null; error: string | null }>;

function deleteImage(
  publicUrl: string
): Promise<{ error: string | null }>;

function replaceImage(
  folder: 'projects' | 'news' | 'people' | 'partners',
  oldUrl: string | null,
  newFile: File
): Promise<{ url: string | null; error: string | null }>;
```

## published_at Auto-Set Logic

When `status` is changed to `'published'` and `published_at` is currently `null`:
- The `create` or `update` function sets `published_at` to `new Date().toISOString()`.
- This is done client-side in `admin-queries.ts` before sending the data to Supabase.
- If `published_at` already has a value, it is preserved (re-publishing after archive keeps the original publish date).
