# Implementation Plan: Admin Content Management Interface

**Branch**: `002-admin-ui` | **Date**: 2026-03-02 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/002-admin-ui/spec.md`  
**Depends on**: `/specs/001-dynamic-cms-revamp/` (existing schema, RLS, Supabase Auth, Astro site)

## Summary

Build a lightweight admin interface as a React SPA island inside the existing Astro site at `/admin`. Editors authenticate via Supabase Auth magic link and manage all 6 content types (statistics, projects, news, people, partners, page content) through forms with Markdown editing, image uploads, and publish lifecycle management. The admin uses the same Supabase database and Storage bucket as the public site but operates under the `authenticated` role (full CRUD via existing RLS policies). No database schema changes required.

## Technical Context

**Language/Version**: TypeScript 5.x (React components within Astro)  
**Framework**: Existing Astro 5.x site + React 19 island for the admin SPA  
**Styling**: Tailwind CSS 3.x (same config as public site)  
**Auth**: Supabase Auth — magic link (passwordless email)  
**Data Access**: `@supabase/supabase-js` — authenticated client (user session token)  
**Storage**: Supabase Storage — `public-assets` bucket (existing)  
**Markdown Editor**: `@uiw/react-md-editor` — free, open-source, supports preview, lightweight (~50KB gzipped)  
**Hosting**: GitHub Pages (same deployment as public site)  
**CI/CD**: Existing GitHub Actions workflow (no changes needed — admin pages built alongside public pages)  
**Routing**: Hash-based client-side routing within the React island (`#/dashboard`, `#/statistics`, etc.) — compatible with static hosting  
**Target Platform**: Modern browsers, mobile-first (360px minimum)

## Constitution Check

*GATE: Must pass before implementation.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| SDD-first | ✅ Pass | Plan derives from spec.md; all tasks map to FRs |
| Dynamic-first content | ✅ Pass | Authenticated Supabase client for real-time CRUD |
| Security by design (RLS) | ✅ Pass | Uses authenticated role (existing RLS grants full access); no service role key in browser |
| Accessibility + Mobile-first | ✅ Pass | Tailwind mobile-first; WCAG 2.1 AA target; semantic HTML + ARIA |
| Design continuity | ✅ Pass | Admin uses same Tailwind config/palette as public site |
| Cost discipline | ✅ Pass | All tools free/OSS; Supabase Auth free tier; `@uiw/react-md-editor` is MIT licensed |

## Project Structure

### Documentation (this feature)

```text
specs/002-admin-ui/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Markdown editor + routing + auth flow research
├── data-model.md        # References existing 001 data model (no new entities)
├── quickstart.md        # Setup and editor workflow guide
├── contracts/
│   └── admin-api.md     # TypeScript function signatures for all admin operations
├── checklists/
│   └── requirements.md  # Spec completeness checklist
└── tasks.md             # Task breakdown (created by /speckit.tasks)
```

### New Files (all within existing repository)

```text
src/
├── pages/
│   └── admin.astro                    # Astro page shell for the admin SPA
│
├── islands/
│   └── admin/                         # Admin SPA — all React components
│       ├── AdminApp.tsx               # Root SPA component (router + auth guard)
│       ├── auth/
│       │   ├── AuthProvider.tsx        # Supabase Auth context (session state)
│       │   ├── LoginPage.tsx           # Magic link login form
│       │   └── AuthCallback.tsx        # Handles magic link redirect token extraction
│       │
│       ├── layout/
│       │   ├── AdminLayout.tsx         # Sidebar nav + header + main content area
│       │   ├── Sidebar.tsx             # Navigation sidebar (content type links)
│       │   └── Toast.tsx              # Toast notification component
│       │
│       ├── dashboard/
│       │   └── DashboardPage.tsx       # Overview cards with counts per content type
│       │
│       ├── shared/
│       │   ├── ContentTable.tsx        # Reusable data table (listing, status badges, actions)
│       │   ├── ContentForm.tsx         # Reusable form shell (validation, save, unsaved warning)
│       │   ├── StatusSelect.tsx        # Draft/Published/Archived dropdown
│       │   ├── SlugField.tsx           # Auto-generating slug input
│       │   ├── ImageUpload.tsx         # File picker → Supabase Storage upload → URL + preview
│       │   ├── MarkdownField.tsx       # Markdown editor wrapper (react-md-editor + marked preview)
│       │   ├── ConfirmDialog.tsx       # Confirmation modal for permanent delete
│       │   └── FormFeedback.tsx        # Inline success/error messages
│       │
│       ├── statistics/
│       │   ├── StatisticsListPage.tsx  # Statistics table + actions
│       │   └── StatisticFormPage.tsx   # Create/edit statistic form
│       │
│       ├── projects/
│       │   ├── ProjectsListPage.tsx    # Projects table + actions
│       │   └── ProjectFormPage.tsx     # Create/edit project form (Markdown + image)
│       │
│       ├── news/
│       │   ├── NewsListPage.tsx        # News articles table + actions
│       │   └── NewsFormPage.tsx        # Create/edit article form (Markdown + image)
│       │
│       ├── people/
│       │   ├── PeopleListPage.tsx      # People table + group filter + actions
│       │   └── PersonFormPage.tsx      # Create/edit person form (photo upload)
│       │
│       ├── partners/
│       │   ├── PartnersListPage.tsx    # Partners table + actions
│       │   └── PartnerFormPage.tsx     # Create/edit partner form (logo upload)
│       │
│       └── page-content/
│           ├── PageContentListPage.tsx # Page content table + actions
│           └── PageContentFormPage.tsx # Create/edit page content form (Markdown)
│
├── lib/
│   ├── supabase.ts                    # (existing) anon client — used by public site
│   ├── supabase-auth.ts               # NEW: authenticated client factory (uses session token)
│   ├── admin-queries.ts               # NEW: CRUD functions for admin (all tables, all statuses)
│   └── storage.ts                     # NEW: Supabase Storage upload/delete helpers
```

### Existing Files (no changes needed)

- `astro.config.mjs` — already has React integration
- `tailwind.config.mjs` — same design tokens
- `.github/workflows/deploy.yml` — already builds all pages
- `src/lib/types.ts` — entity types reused by admin

## Key Architecture Decisions

### 1. Single-Page App via React Island

The entire admin is a single React island mounted at `src/pages/admin.astro`. This page renders `<AdminApp client:only="react" />` — the `client:only` directive means no SSR (the admin is purely client-side). Astro generates a single `dist/admin/index.html` at build time containing just the shell; React takes over routing.

**Why `client:only`**: The admin requires browser APIs (Supabase Auth session, `window.location.hash`, `beforeunload` event). Server-rendering it would be meaningless since it gates on authentication.

### 2. Hash-Based Routing

Routes use URL hash fragments (`#/dashboard`, `#/statistics`, `#/statistics/new`, `#/statistics/edit/:id`). A lightweight custom router (no dependency needed — ~30 lines of React code using `window.location.hash` + `hashchange` event) maps hash paths to page components.

**Why hash routing**: GitHub Pages serves static files. Path-based routing (e.g., `/admin/statistics`) would require a 404 fallback hack. Hash routing (`/admin#/statistics`) works natively because the browser never requests a different HTML file — it always loads `/admin/index.html`.

**Route table**:

| Hash Route | Component | Description |
|------------|-----------|-------------|
| `#/` | DashboardPage | Default after login |
| `#/statistics` | StatisticsListPage | Statistics listing |
| `#/statistics/new` | StatisticFormPage | Create statistic |
| `#/statistics/edit/:id` | StatisticFormPage | Edit statistic |
| `#/projects` | ProjectsListPage | Projects listing |
| `#/projects/new` | ProjectFormPage | Create project |
| `#/projects/edit/:id` | ProjectFormPage | Edit project |
| `#/news` | NewsListPage | News listing |
| `#/news/new` | NewsFormPage | Create article |
| `#/news/edit/:id` | NewsFormPage | Edit article |
| `#/people` | PeopleListPage | People listing |
| `#/people/new` | PersonFormPage | Create person |
| `#/people/edit/:id` | PersonFormPage | Edit person |
| `#/partners` | PartnersListPage | Partners listing |
| `#/partners/new` | PartnerFormPage | Create partner |
| `#/partners/edit/:id` | PartnerFormPage | Edit partner |
| `#/page-content` | PageContentListPage | Page content listing |
| `#/page-content/new` | PageContentFormPage | Create page content |
| `#/page-content/edit/:id` | PageContentFormPage | Edit page content |

### 3. Authentication Flow

1. Editor navigates to `/admin` → React island mounts → `AuthProvider` checks for existing Supabase session.
2. If no session → render `LoginPage` (email input form).
3. Editor submits email → `supabase.auth.signInWithOtp({ email })` → always show "Check your email" message.
4. Editor clicks magic link in email → browser navigates to `/admin#auth-callback` with tokens in the URL hash fragment.
5. `AuthCallback` component extracts the tokens, calls `supabase.auth.setSession()`, then redirects to `#/` (dashboard).
6. All subsequent Supabase queries use the authenticated session automatically.
7. Sign out → `supabase.auth.signOut()` → clear state → show login.

**Supabase Auth redirect URL config**: In Supabase dashboard → Authentication → URL Configuration, add `https://sdgailab.org/admin` to the redirect allow-list. The magic link will redirect to `/admin` with auth tokens in the hash fragment.

### 4. Authenticated Supabase Client

The admin uses a separate Supabase client instance initialized with the same `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`, but the Supabase JS client automatically upgrades to the `authenticated` role when a valid session exists. No service role key is needed or exposed.

```typescript
// src/lib/supabase-auth.ts
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
  { auth: { autoRefreshToken: true, persistSession: true } }
);
```

### 5. Image Upload Flow

1. Editor clicks "Upload" → browser file picker opens (restricted to image types, 5MB max).
2. On file selection → `supabaseAdmin.storage.from('public-assets').upload(path, file)`.
3. Path is deterministic: `{folder}/{timestamp}-{filename}` (e.g., `projects/1709323200-hero.jpg`).
4. On success → get public URL via `supabaseAdmin.storage.from('public-assets').getPublicUrl(path)`.
5. URL is saved to the form state → saved to database on form submit.
6. Replace: upload new file, delete old file, save new URL.
7. Remove: delete file from storage, set URL field to null.

### 6. Markdown Editor

Using `@uiw/react-md-editor` — a React component that provides:
- Split-pane editor (write | preview)
- Toolbar (bold, italic, links, headings, lists, images)
- Preview rendered via `marked` (same library as public site) for consistency
- Mobile-friendly (collapses to tabbed write/preview on narrow screens)

## Dependency List

### New Production Dependencies

| Package | Purpose |
|---------|---------|
| `@uiw/react-md-editor` | Markdown editor with live preview for admin forms |

### Existing Dependencies (no changes)

| Package | Used by Admin |
|---------|--------------|
| `react` + `react-dom` | Admin SPA runtime |
| `@supabase/supabase-js` | Auth + data CRUD + storage uploads |
| `tailwindcss` | Styling |
| `marked` | Markdown preview rendering (consistency with public site) |

### New Development Dependencies

None.

## FR → Implementation Mapping

| FR | Implementation Location | Story |
|----|------------------------|-------|
| FR-001 | `AuthProvider.tsx`, `LoginPage.tsx`, `supabase-auth.ts` | US1 |
| FR-002 | `AuthProvider.tsx`, `AdminApp.tsx` (auth guard) | US1 |
| FR-003 | `AdminLayout.tsx` (sign out button), `AuthProvider.tsx` | US1 |
| FR-004 | Supabase Auth config (no self-registration endpoint) | US1 |
| FR-005–007 | `DashboardPage.tsx`, `admin-queries.ts` (count queries) | US2 |
| FR-008 | `ContentTable.tsx` (reusable), per-entity `*ListPage.tsx` | US3–8 |
| FR-009 | `StatusSelect.tsx` (badge variant in table) | US3–8 |
| FR-010 | `ContentTable.tsx` ("Add New" button) | US3–8 |
| FR-011 | `ContentTable.tsx` (Archive + Permanent Delete actions) | US3–8 |
| FR-012 | `ConfirmDialog.tsx` (permanent delete confirmation) | US3–8 |
| FR-013 | `ContentForm.tsx` (validation logic) | US3–8 |
| FR-014 | `SlugField.tsx` (auto-generate + manual override) | US4, US5 |
| FR-015 | `StatusSelect.tsx` | US3–8 |
| FR-016 | `admin-queries.ts` (set `published_at` on status change) | US3–8 |
| FR-017 | `ContentForm.tsx` (number input for display_order) | US3–8 |
| FR-018 | `Toast.tsx`, `FormFeedback.tsx` | US3–8 |
| FR-018a | `ContentForm.tsx` (`beforeunload` event listener) | US3–8 |
| FR-019–020 | `MarkdownField.tsx` (react-md-editor + marked preview) | US4, US5, US8 |
| FR-021–025 | `ImageUpload.tsx`, `storage.ts` | US4–7 |
| FR-026 | Tailwind responsive classes throughout admin components | All |
| FR-027 | Semantic HTML, ARIA attributes, focus management | All |
| FR-028 | All deps are MIT/OSS; Supabase free tier | All |
| FR-029 | No migration files; admin reads/writes existing schema | All |
| FR-030 | `supabase-auth.ts` uses session token (authenticated role) | All |

## Complexity Tracking

No constitution violations. The plan stays within the project's established architecture (Astro + React islands + Supabase + Tailwind) and adds only one new dependency (`@uiw/react-md-editor`).

| Aspect | Assessment |
|--------|-----------|
| New dependency count | 1 (justified: building a Markdown editor from scratch would be disproportionate effort) |
| Schema changes | 0 (FR-029 satisfied) |
| New pages | 1 Astro page (`admin.astro`) mounting 1 React SPA |
| New React components | ~25 (auth, layout, shared, 6 content types × 2 pages each) |
| Estimated bundle addition | ~80KB gzipped (react-md-editor + admin components) — only loaded when visiting `/admin` |
