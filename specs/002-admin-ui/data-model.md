# Data Model: Admin Content Management Interface

**Feature**: 002-admin-ui | **Date**: 2026-03-02

## No New Entities

This feature introduces **no new database tables, columns, or schema changes** (FR-029).

The admin interface operates on the existing 6 entities defined in [001-dynamic-cms-revamp/data-model.md](../001-dynamic-cms-revamp/data-model.md):

- `statistics`
- `projects`
- `news_articles`
- `people`
- `partners`
- `page_content`

## Access Pattern Difference

The public site reads from these tables using the **anon** role (via RLS: only `status = 'published'` rows visible).

The admin interface reads and writes using the **authenticated** role (via RLS: full CRUD on all rows regardless of status). This is the key difference — the admin sees drafts, published, and archived items.

## Supabase Storage

No new buckets or folders. The admin uploads to the existing `public-assets` bucket with these sub-folders:

| Folder | Used by Admin Form |
|--------|--------------------|
| `projects/` | Project image upload |
| `news/` | News featured image upload |
| `people/` | Person photo upload |
| `partners/` | Partner logo upload |

Storage access: authenticated users can upload/delete; public users can read.
