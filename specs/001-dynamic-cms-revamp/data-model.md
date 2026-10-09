# Data Model: Dynamic CMS Revamp

**Branch**: `001-dynamic-cms-revamp` | **Date**: 2026-02-28  
**Source**: [spec.md](./spec.md) Key Entities + [plan.md](./plan.md) architecture decisions

## Overview

All content is stored in Supabase (PostgreSQL). The public website reads from these tables at runtime using the Supabase anonymous key. Row Level Security ensures only `published` rows are visible to the public.

Every table follows a common pattern:
- `id` — UUID primary key
- `status` — publish lifecycle (`draft` → `published` → `archived`)
- `published_at` — timestamp when the item was first published
- `created_at`, `updated_at` — audit timestamps

## Entity Relationship Diagram (text)

```
statistics          (standalone — no FK relationships)
projects            (standalone — no FK relationships)
news_articles       (standalone — no FK relationships)
people              (standalone — no FK relationships)
partners            (standalone — no FK relationships)
page_content        (standalone — unique on page_slug + section_slug)
```

All entities are independent — no foreign key relationships between content tables. This keeps the schema flat and simple for non-technical editors using Supabase Studio.

## Tables

### `statistics`

Represents a single impact metric card on the homepage (FR-005, FR-006, FR-007).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Unique identifier |
| `label` | `text` | NOT NULL | Display label (e.g., "Active Projects") |
| `value` | `text` | NOT NULL | Display value (e.g., "23" or "1,200+") |
| `icon_name` | `text` | nullable | Optional icon identifier |
| `display_order` | `integer` | NOT NULL, default 0 | Editor-controlled sort order (ascending) |
| `status` | `text` | NOT NULL, default 'draft', CHECK in ('draft','published','archived') | Publish lifecycle |
| `published_at` | `timestamptz` | nullable | When first published |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | Last modification |

**Indexes**: `idx_statistics_status_order` on (`status`, `display_order`)

---

### `projects`

Represents a lab project with status tracking (FR-014, FR-015, FR-016).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Unique identifier |
| `title` | `text` | NOT NULL | Project title |
| `slug` | `text` | NOT NULL, UNIQUE | URL-safe identifier for detail pages |
| `description` | `text` | NOT NULL | Full project description (supports Markdown) |
| `project_status` | `text` | NOT NULL, default 'active', CHECK in ('active','completed','under_development','on_hold') | Project lifecycle status |
| `is_deployed` | `boolean` | NOT NULL, default false | Whether the project is deployed (separate from project_status per FR-015) |
| `is_featured` | `boolean` | NOT NULL, default false | Whether to show on homepage featured section (FR-008) |
| `image_url` | `text` | nullable | Project image (Supabase Storage URL) |
| `display_order` | `integer` | NOT NULL, default 0 | Editor-controlled sort order |
| `status` | `text` | NOT NULL, default 'draft', CHECK in ('draft','published','archived') | Publish lifecycle |
| `published_at` | `timestamptz` | nullable | When first published |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | Last modification |

**Indexes**: `idx_projects_status_order` on (`status`, `display_order`), `idx_projects_slug` on (`slug`)

---

### `news_articles`

Represents a news or blog post (FR-019, FR-020, FR-021).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Unique identifier |
| `title` | `text` | NOT NULL | Article headline |
| `slug` | `text` | NOT NULL, UNIQUE | URL-safe identifier for detail pages |
| `body` | `text` | NOT NULL | Article body content (supports Markdown) |
| `summary` | `text` | nullable | Short summary for listing cards |
| `featured_image_url` | `text` | nullable | Hero image (Supabase Storage URL) |
| `author_name` | `text` | nullable | Author display name |
| `publish_date` | `date` | NOT NULL, default `CURRENT_DATE` | Editorial publish date (used for ordering per FR-019) |
| `status` | `text` | NOT NULL, default 'draft', CHECK in ('draft','published','archived') | Publish lifecycle |
| `published_at` | `timestamptz` | nullable | When first published |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | Last modification |

**Indexes**: `idx_news_status_date` on (`status`, `publish_date` DESC), `idx_news_slug` on (`slug`)

---

### `people`

Represents a team member or advisory board member (FR-022, FR-023, FR-024).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Unique identifier |
| `name` | `text` | NOT NULL | Full name |
| `role_title` | `text` | NOT NULL | Job title or role |
| `photo_url` | `text` | nullable | Headshot image (Supabase Storage URL) |
| `group_type` | `text` | NOT NULL, CHECK in ('team','advisory_board') | Which group this person belongs to (FR-022) |
| `biography` | `text` | nullable | Short bio |
| `display_order` | `integer` | NOT NULL, default 0 | Editor-controlled sort order within group |
| `status` | `text` | NOT NULL, default 'draft', CHECK in ('draft','published','archived') | Publish lifecycle |
| `published_at` | `timestamptz` | nullable | When first published |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | Last modification |

**Indexes**: `idx_people_group_status_order` on (`group_type`, `status`, `display_order`)

---

### `partners`

Represents an institutional partner (FR-025, FR-026).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Unique identifier |
| `name` | `text` | NOT NULL | Partner name (also used as alt text / fallback per FR-026) |
| `logo_url` | `text` | nullable | Partner logo (Supabase Storage URL) |
| `website_url` | `text` | NOT NULL | Partner website link |
| `display_order` | `integer` | NOT NULL, default 0 | Editor-controlled sort order |
| `status` | `text` | NOT NULL, default 'draft', CHECK in ('draft','published','archived') | Publish lifecycle |
| `published_at` | `timestamptz` | nullable | When first published |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | Last modification |

**Indexes**: `idx_partners_status_order` on (`status`, `display_order`)

---

### `page_content`

Represents editable content blocks for semi-static pages like About, Volunteer, Contact (FR-017, FR-018).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Unique identifier |
| `page_slug` | `text` | NOT NULL | Page identifier (e.g., "about", "volunteer", "contact") |
| `section_slug` | `text` | NOT NULL | Section within the page (e.g., "our-approach", "main") |
| `body` | `text` | NOT NULL | Rich content (supports Markdown) |
| `status` | `text` | NOT NULL, default 'draft', CHECK in ('draft','published','archived') | Publish lifecycle |
| `published_at` | `timestamptz` | nullable | When first published |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | Last modification |

**Constraints**: UNIQUE on (`page_slug`, `section_slug`)  
**Indexes**: `idx_page_content_page_status` on (`page_slug`, `status`)

## Row Level Security Policies

All tables follow the same RLS pattern:

```sql
-- Enable RLS on every table
ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;

-- Public visitors (anon role): can only SELECT published rows
CREATE POLICY "anon_read_published"
  ON <table_name>
  FOR SELECT
  TO anon
  USING (status = 'published');

-- Authenticated editors: full access (all operations, all rows)
CREATE POLICY "editor_full_access"
  ON <table_name>
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

This ensures:
- The Supabase anon key (shipped to the browser) can only read published content (FR-004).
- Editors authenticated via Supabase Auth can create, read, update, and delete any row via Supabase Studio.

## Supabase Storage

One public bucket: `public-assets`

| Folder | Contents | Access |
|--------|----------|--------|
| `projects/` | Project images | Public read |
| `news/` | Article featured images | Public read |
| `people/` | Team/board headshots | Public read |
| `partners/` | Partner logos | Public read |

Storage policy: Public read for the entire bucket. Authenticated users can upload/delete.

## Triggers

### `updated_at` auto-update

A PostgreSQL trigger on each table to automatically set `updated_at = now()` on every UPDATE:

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Applied to each table:
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON <table_name>
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

## Seed Data

The `supabase/seed.sql` file will contain initial content migrated from the current static site:
- ~10 projects (from `active-projects.html`)
- ~15 team members (from `about-us.html`)
- ~8 advisory board members (from `advisory-board.html`)
- ~15 partners (from partner logos in `index.html`)
- Page content for About ("Our Approach") and Volunteer sections
- A few initial statistics derived from current site content

All seeded rows will have `status = 'published'` so the site is populated on first deploy.
