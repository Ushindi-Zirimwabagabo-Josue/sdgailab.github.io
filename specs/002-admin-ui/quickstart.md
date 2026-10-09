# Quickstart: Admin Content Management Interface

**Feature**: 002-admin-ui | **Date**: 2026-03-02

## Prerequisites

- Node.js 20+ and npm installed
- Supabase project set up (from 001-dynamic-cms-revamp)
- `.env` file with `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`
- At least one editor user created in Supabase Auth
- **Storage RLS policies** applied (run `supabase/migrations/002_storage_policies.sql` in SQL Editor) — required for image uploads

## Development Setup

### 1. Install the new dependency

```bash
npm install @uiw/react-md-editor
```

### 2. Create an editor account in Supabase

In the Supabase Dashboard:
1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter the editor's email address
4. The user will receive a confirmation email

### 3. Configure Supabase Auth redirect URL

In the Supabase Dashboard:
1. Go to **Authentication** → **URL Configuration**
2. Add to **Redirect URLs**: `http://localhost:4321/admin` (for local dev)
3. Also add: `https://sdgailab.org/admin` (for production)

### 4. Run the development server

```bash
npm run dev
```

### 5. Access the admin

1. Navigate to `http://localhost:4321/admin`
2. Enter your editor email address
3. Check your email for the magic link
4. Click the link — you'll be redirected to the admin dashboard

## Build & Deploy

No changes to the build/deploy pipeline. The admin page is built alongside all other Astro pages:

```bash
npm run build
```

The output includes `dist/admin/index.html` which serves the admin SPA.

## File Overview

| File | Purpose |
|------|---------|
| `src/pages/admin.astro` | Astro page shell that mounts the React SPA |
| `src/islands/admin/AdminApp.tsx` | Root SPA component (routing + auth gate) |
| `src/islands/admin/auth/` | Authentication components (login, callback, provider) |
| `src/islands/admin/layout/` | Admin layout (sidebar, header, toast) |
| `src/islands/admin/dashboard/` | Dashboard overview page |
| `src/islands/admin/shared/` | Reusable form/table components |
| `src/islands/admin/statistics/` | Statistics CRUD pages |
| `src/islands/admin/projects/` | Projects CRUD pages |
| `src/islands/admin/news/` | News articles CRUD pages |
| `src/islands/admin/people/` | People CRUD pages |
| `src/islands/admin/partners/` | Partners CRUD pages |
| `src/islands/admin/page-content/` | Page content CRUD pages |
| `src/lib/supabase-auth.ts` | Authenticated Supabase client |
| `src/lib/admin-queries.ts` | All CRUD query functions |
| `src/lib/storage.ts` | Supabase Storage upload/delete helpers |

## Navigation

The admin uses hash-based routing (e.g., `/admin#/statistics`, `/admin#/projects/edit/abc123`). All navigation happens within the single `/admin` page — the browser never leaves it. The sidebar provides links to all content types.

If you have unsaved changes in a form, the admin will warn you before navigating away.

## Common Editor Workflows

### Create and publish a new statistic
1. Login → Dashboard → Click "Statistics" card
2. Click "Add New"
3. Fill in label, value, set display order
4. Set status to "Published"
5. Click "Save"
6. The statistic appears on the public homepage immediately

### Edit an existing project
1. Login → Dashboard → Click "Projects" card
2. Find the project in the list → Click "Edit"
3. Modify fields as needed (e.g., update description in Markdown editor)
4. Click "Save"
5. Changes appear on the public site immediately

### Archive (soft delete) a news article
1. Navigate to News listing
2. Find the article → Click "Archive"
3. The article disappears from the public site but remains in the admin listing (status: Archived)

### Permanently delete an archived item
1. Navigate to any content listing
2. Filter or find the archived item
3. Click "Permanently Delete" (only shown for archived items)
4. Confirm in the dialog
5. The item is permanently removed from the database
