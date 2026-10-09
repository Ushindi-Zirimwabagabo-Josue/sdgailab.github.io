# Implementation Plan: Dynamic CMS Revamp

**Branch**: `001-dynamic-cms-revamp` | **Date**: 2026-02-28 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-dynamic-cms-revamp/spec.md`

## Summary

Replace the current static HTML/Bootstrap/jQuery website with an Astro-powered static shell that uses client-side "island" components to fetch content from Supabase at runtime. This gives non-technical editors the ability to publish changes instantly (via Supabase Studio) while the site itself remains a fast, static deployment on GitHub Pages. The homepage is restructured from long text blocks to impact statistics cards + featured projects + partner logos. Every content type (statistics, projects, news, people, partners, page content) follows a draft → published → archived lifecycle enforced by Row Level Security.

## Technical Context

**Language/Version**: TypeScript 5.x (Astro + island components)  
**Framework**: Astro 5.x (static output mode, `@astrojs/react` for islands)  
**Island Runtime**: React 19 via `@astrojs/react` (considered Preact for smaller bundle — switchable later via one config line)  
**Styling**: Tailwind CSS 4.x via `@astrojs/tailwind`  
**CMS / Database**: Supabase (PostgreSQL) — `@supabase/supabase-js` client, runtime reads only  
**Storage**: Supabase Storage (public bucket for images: logos, photos, article images)  
**Hosting**: GitHub Pages (static output, custom domain `sdgailab.org` via CNAME)  
**CI/CD**: GitHub Actions — build Astro → deploy to GitHub Pages  
**Analytics**: Google Analytics 4 (gtag.js snippet)  
**Retained Library**: particles.js (homepage hero effect)  
**Testing**: Manual acceptance testing against spec scenarios (no automated test framework required by spec)  
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge — last 2 versions), mobile-first  
**Performance Goals**: All pages usable on 360px mobile viewport; no unnecessary large client bundles  
**Constraints**: Free-tier only (Supabase free tier, GitHub Pages free, all OSS dependencies)  
**Scale/Scope**: ~12 pages, 6 Supabase tables, 6 content types, single-developer build

## Constitution Check

*GATE: Must pass before implementation. Re-check after design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| SDD-first | ✅ Pass | Plan derives from spec.md; all tasks map to FRs |
| Dynamic-first content | ✅ Pass | Runtime client-side reads from Supabase; no redeploy for content changes |
| Security by design (RLS) | ✅ Pass | RLS enabled on all tables; anon key only sees `status='published'` rows |
| Accessibility + Mobile-first | ✅ Pass | Tailwind mobile-first utilities; WCAG 2.1 AA target; semantic HTML |
| Design continuity | ✅ Pass | Tailwind config mirrors current color palette/typography; particles.js retained |
| Cost discipline | ✅ Pass | All tools free/OSS: Astro, Tailwind, Supabase free tier, GitHub Pages, GA4 |

No violations. No complexity justifications needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-dynamic-cms-revamp/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Technical research notes
├── data-model.md        # Supabase schema + RLS policies
├── quickstart.md        # Local development setup guide
├── contracts/
│   └── types.ts         # TypeScript entity interfaces
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Task breakdown (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/              # Astro components (server-rendered, zero JS)
│   ├── layout/
│   │   ├── BaseLayout.astro     # HTML shell: <head>, <body>, analytics, skip-link
│   │   ├── Header.astro         # Site header + navigation
│   │   └── Footer.astro         # Site footer + secondary nav
│   ├── ui/
│   │   ├── StatusBadge.astro    # Project status pill (color-coded)
│   │   ├── EmptyState.astro     # "No items yet" fallback
│   │   └── LoadingSpinner.astro # Loading indicator
│   └── sections/
│       └── ParticlesHero.astro  # Particles.js hero wrapper
│
├── islands/                 # Client-side React components (hydrated, fetch from Supabase)
│   ├── components/
│   │   └── StatusBadge.tsx      # React status badge (mirrors StatusBadge.astro for use inside islands)
│   ├── StatsCards.tsx           # Homepage: statistics cards
│   ├── FeaturedProjects.tsx     # Homepage: 3–4 featured projects preview
│   ├── PartnerLogos.tsx         # Homepage + Partners page: logo grid
│   ├── ProjectList.tsx          # /projects: full project listing with status filters
│   ├── ProjectDetail.tsx        # /projects/detail: single project view
│   ├── NewsList.tsx             # /news: article listing (reverse-chronological)
│   ├── NewsDetail.tsx           # /news/detail: single article view
│   ├── PeopleGrid.tsx           # /team: people cards
│   └── PageContent.tsx          # About, Volunteer: dynamic rich-text blocks
│
├── lib/
│   ├── supabase.ts              # Supabase client singleton (anon key, public URL)
│   └── queries.ts               # Typed query functions per entity
│
├── pages/
│   ├── index.astro              # Homepage
│   ├── about.astro              # About page (Our Approach)
│   ├── projects/
│   │   ├── index.astro          # Projects listing
│   │   └── detail.astro         # Project detail (?slug=xxx)
│   ├── news/
│   │   ├── index.astro          # News listing
│   │   └── detail.astro         # Article detail (?slug=xxx)
│   ├── team.astro               # Team members
│   ├── partners.astro           # Partners page
│   ├── volunteer.astro          # Volunteer page
│   ├── contact.astro            # Contact page
│   └── 404.astro                # Custom 404
│
└── styles/
    └── global.css               # Tailwind directives + custom design tokens

public/
├── CNAME                        # sdgailab.org
├── particles-config.json        # particles.js configuration
├── favicon.ico                  # Migrated from current icons/
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
├── android-chrome-192x192.png
├── android-chrome-256x256.png
└── site.webmanifest

supabase/
├── migrations/
│   └── 001_initial_schema.sql   # All tables + RLS policies
└── seed.sql                     # Seed data migrated from current site

.github/
└── workflows/
    └── deploy.yml               # Build Astro → deploy to GitHub Pages

# Root config files
astro.config.mjs                 # Astro: static output, React integration, Tailwind, site URL
tailwind.config.mjs              # Design tokens: colors, fonts, breakpoints from current site
tsconfig.json                    # TypeScript strict mode
package.json                     # Dependencies + scripts
.env.example                     # PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY
.gitignore                       # node_modules, dist, .env, .astro
.nojekyll                        # Prevent GitHub Pages Jekyll processing
```

**Structure Decision**: Single Astro project (no separate backend — Supabase is the backend). The `src/islands/` directory separates client-hydrated components (which ship JS to the browser) from `src/components/` (pure Astro components that render to HTML at build time with zero JS). This keeps the client bundle small — only pages with dynamic content load the Supabase SDK.

## Key Architecture Decisions

### 1. Detail Pages on Static Hosting

Since GitHub Pages serves only static files and content is fully dynamic (not known at build time), detail pages for projects and news articles use a **query-parameter pattern**:

- `/projects/` — listing page
- `/projects/detail/?slug=my-project` — detail page (island reads `slug` from URL search params)
- `/news/` — listing page
- `/news/detail/?slug=article-title` — detail page

Each detail page is a single static Astro page whose island component reads the `slug` parameter and fetches the corresponding record from Supabase. This avoids the need for SSR or SPA fallback hacks.

### 2. Supabase Client Initialization

The Supabase client is initialized with two `PUBLIC_` environment variables (Astro convention for client-exposed env vars):

- `PUBLIC_SUPABASE_URL` — Supabase project URL
- `PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key (safe to expose because RLS restricts access)

These are embedded at build time into the client bundle via Astro's `import.meta.env`.

### 3. Image Handling

- Editor-uploaded images (team photos, partner logos, article images) are stored in a **public Supabase Storage bucket**.
- Entity records store the image URL (Supabase storage public URL).
- Astro's `<Image>` component is used for static assets (favicons, etc.) but NOT for dynamic Supabase images (since those are external URLs resolved at runtime).
- CSS `object-fit: cover` + fixed aspect ratios constrain oversized images in the layout.

### 4. Design Token Migration

The current site's visual identity is extracted into Tailwind configuration:

- **Colors**: Primary (#1a237e-ish deep blue), accent colors from current CSS
- **Typography**: Open Sans (currently loaded from Google Fonts — will be self-hosted for performance)
- **Spacing/Layout**: Match current section padding, card dimensions, grid layouts
- **Breakpoints**: Mobile-first; current site uses Bootstrap's breakpoints (576/768/992/1200) — map to Tailwind equivalents

### 5. Particles.js Integration

The particles.js library is loaded as a client-side script only on the homepage. The `ParticlesHero.astro` component includes:
- A `<div id="particles-js">` container
- A `<script>` tag that loads particles.js and initializes it with the existing configuration
- The configuration is stored in `public/particles-config.json` (migrated from the current site's inline config)

### 6. GA4 Integration

A `<script>` tag for Google Analytics 4 (gtag.js) is included in `BaseLayout.astro`. If cookie consent is required by policy, a lightweight consent banner component is added.

## Dependency List

### Production Dependencies

| Package | Purpose |
|---------|---------|
| `astro` | Static site generator + build framework |
| `@astrojs/react` | React island integration for Astro |
| `@astrojs/tailwind` | Tailwind CSS integration for Astro |
| `react` + `react-dom` | Island component runtime |
| `@supabase/supabase-js` | Supabase client for runtime data fetching |
| `tailwindcss` | Utility-first CSS framework |
| `particles.js` | Homepage hero particle effect |
| `marked` | Client-side Markdown → HTML rendering for dynamic rich-text content |

### Development Dependencies

| Package | Purpose |
|---------|---------|
| `typescript` | Type checking |
| `@types/react` + `@types/react-dom` | React type definitions |
| `prettier` | Code formatting |
| `prettier-plugin-astro` | Astro file formatting |
| `prettier-plugin-tailwindcss` | Tailwind class sorting |

## FR → Implementation Mapping

| FR | Implementation Location | Story |
|----|------------------------|-------|
| FR-001 | Supabase tables + Studio UI | All |
| FR-002 | Island components with runtime Supabase reads | All |
| FR-003, FR-004 | RLS policies + `status` column on all tables | All |
| FR-005–007 | `src/islands/StatsCards.tsx` + `statistics` table | US1 |
| FR-008 | `src/islands/FeaturedProjects.tsx` + `projects` table (`is_featured`) | US2, US6 |
| FR-009 | `src/islands/PartnerLogos.tsx` + `partners` table | US5, US6 |
| FR-010–011 | `src/pages/index.astro` (sections removed) | US6 |
| FR-012 | `src/components/sections/ParticlesHero.astro` | US6 |
| FR-013 | `src/pages/index.astro` (section ordering) | US6 |
| FR-014–016 | `src/islands/ProjectList.tsx`, `ProjectDetail.tsx` + `projects` table | US2 |
| FR-017 | `src/pages/about.astro` + `src/islands/PageContent.tsx` | US6 |
| FR-018 | `src/pages/volunteer.astro` + `src/islands/PageContent.tsx` | US6 |
| FR-019–021 | `src/islands/NewsList.tsx`, `NewsDetail.tsx` + `news_articles` table | US3 |
| FR-022–024 | `src/islands/PeopleGrid.tsx` + `people` table (Team page only; Advisory Board page removed) | US4 |
| FR-025–026 | `src/islands/PartnerLogos.tsx` + `partners` table | US5 |
| FR-027 | `src/pages/contact.astro` (static mailto link) | US7 |
| FR-028–030 | Tailwind mobile-first + semantic HTML + ARIA attributes | All |
| FR-031–032 | `tailwind.config.mjs` design tokens + `ParticlesHero.astro` | US6 |
| FR-033 | Content stored as plain text (no hardcoded English-only structure) | All |
| FR-034 | All deps are OSS; Supabase free tier; GitHub Pages free | All |
