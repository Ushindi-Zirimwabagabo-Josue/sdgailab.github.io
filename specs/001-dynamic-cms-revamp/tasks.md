# Tasks: Dynamic CMS Revamp

**Input**: Design documents from `/specs/001-dynamic-cms-revamp/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not required per spec (manual acceptance testing only). No test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. US1 and US6 are combined into one phase because both are P1 and the homepage cannot be tested without both.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Initialize the Astro project with all dependencies, configuration, and static assets.

- [x] T001 Initialize Astro project with `npm create astro@latest` in the repository root, selecting the empty/minimal template with TypeScript (strict)
- [x] T002 Install production dependencies: `astro`, `@astrojs/react`, `@astrojs/tailwind`, `react`, `react-dom`, `@supabase/supabase-js`, `tailwindcss`, `particles.js`, `marked` (Markdown renderer)
- [x] T003 Install dev dependencies: `typescript`, `@types/react`, `@types/react-dom`, `prettier`, `prettier-plugin-astro`, `prettier-plugin-tailwindcss`
- [x] T004 [P] Configure Astro in `astro.config.mjs`: static output mode, `site: 'https://sdgailab.org'`, React integration, Tailwind integration
- [x] T005 [P] Configure TypeScript in `tsconfig.json`: strict mode, JSX react-jsx, path aliases (`@components/*`, `@islands/*`, `@lib/*`)
- [x] T006 [P] Create `tailwind.config.mjs` with design tokens extracted from the current site: primary color (#1a237e family), Open Sans font family, Bootstrap-equivalent breakpoints (sm:576, md:768, lg:992, xl:1200)
- [x] T007 [P] Create root config files: `.env.example` (with `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` placeholders), `.gitignore` (node_modules, dist, .env, .astro), `.nojekyll`
- [x] T008 [P] Migrate static assets to `public/`: copy favicons + `site.webmanifest` from current `icons/` directory, create `public/CNAME` with `sdgailab.org`, extract particles.js config from current `assets/js/app.js` into `public/particles-config.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T009 Write the Supabase migration file at `supabase/migrations/001_initial_schema.sql` with all 6 tables (`statistics`, `projects`, `news_articles`, `people`, `partners`, `page_content`), CHECK constraints, indexes, RLS policies (anon read published, authenticated full access), `update_updated_at()` trigger function, and per-table triggers — per `data-model.md`
- [x] T010 [P] Write `supabase/seed.sql` with initial content migrated from the current HTML pages: extract ~10 projects from `active-projects.html`, ~15 team members from `about-us.html`, ~8 advisory board members from `advisory-board.html`, ~15 partners from logo references in `index.html`, page content for About ("Our Approach") and Volunteer sections, and a few initial statistics. All rows with `status = 'published'`
- [ ] T010a After running T009 migration and T010 seed against Supabase, verify RLS correctness: using the anon key, query each table with `status != 'published'` and confirm zero rows returned. Also confirm that `INSERT`/`UPDATE`/`DELETE` operations are rejected for the anon role. This validates constitution principle 3 (Security by Design — RLS non-negotiable)
- [x] T011 [P] Create TypeScript types at `src/lib/types.ts` — copy entity interfaces and query return types from `specs/001-dynamic-cms-revamp/contracts/types.ts`
- [x] T012 Create Supabase client singleton at `src/lib/supabase.ts` — initialize `createClient()` with `import.meta.env.PUBLIC_SUPABASE_URL` and `import.meta.env.PUBLIC_SUPABASE_ANON_KEY`
- [x] T013 Create typed query functions at `src/lib/queries.ts` — one function per entity read pattern: `getPublishedStatistics()`, `getFeaturedProjects()`, `getPublishedProjects()`, `getProjectBySlug(slug)`, `getPublishedNews()`, `getNewsArticleBySlug(slug)`, `getPublishedPeople(groupType)`, `getPublishedPartners()`, `getPageContent(pageSlug, sectionSlug)`. Each returns typed results using the types from `src/lib/types.ts` and orders by appropriate column (display_order or publish_date DESC)
- [x] T014 [P] Create global styles at `src/styles/global.css` — Tailwind `@tailwind base/components/utilities` directives, self-hosted Open Sans `@font-face` declarations (download font files to `public/fonts/`), custom utility classes for the SDG AI Lab color palette
- [x] T015 Create `src/components/layout/BaseLayout.astro` — full HTML shell with `<head>` (charset, viewport, title prop, favicon links, GA4 gtag.js script, global.css import), `<body>` with skip-to-content link, Header slot, `<main id="main-content">` with `<slot />`, Footer. Accept `title` and optional `description` props
- [x] T016 [P] Create `src/components/layout/Header.astro` — site logo/name linking to `/`, responsive navigation menu with links: Home, About, Projects, News, Team, Partners, Volunteer, Contact. Mobile hamburger menu with accessible toggle (aria-expanded, aria-controls). `aria-current="page"` on active link
- [x] T017 [P] Create `src/components/layout/Footer.astro` — secondary navigation links, copyright notice, SDG AI Lab branding. Semantic `<footer>` element
- [x] T018 [P] Create `src/components/ui/EmptyState.astro` — accepts `message` prop (e.g., "No projects yet"), renders a centered placeholder with an icon and message text. Used as fallback when Supabase returns zero published items
- [x] T019 [P] Create `src/components/ui/LoadingSpinner.astro` — lightweight CSS-only loading indicator with `aria-label="Loading"` and `role="status"`. Used by islands while fetching from Supabase
- [x] T020 [P] Create status badge components: (a) `src/components/ui/StatusBadge.astro` for use in Astro pages, and (b) `src/islands/components/StatusBadge.tsx` as a React component for use inside island components (Astro components cannot be imported into React .tsx files). Both implement the same visual pattern: accepts `status` prop (active/completed/under_development/on_hold), renders a color-coded pill/badge with accessible text. Color mapping: active=green, completed=blue, under_development=amber, on_hold=gray. Uses semantic `<span>` with visible text (not color-only per FR-030)
- [x] T021 [P] Create custom 404 page at `src/pages/404.astro` using BaseLayout — friendly "Page not found" message with link back to homepage
- [x] T022 [P] Create GitHub Actions workflow at `.github/workflows/deploy.yml` — trigger on push to main branch, checkout → setup Node 20 → npm ci → astro build (with PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY from secrets) → upload-pages-artifact → deploy-pages. Per `research.md` Section 6
- [x] T023 [P] Download Open Sans font files (regular 400, semibold 600, bold 700 weights in woff2 format) to `public/fonts/` for self-hosting per `research.md` Section 3

**Checkpoint**: Foundation ready — Supabase schema defined, Supabase client wired, layout shell renders, shared components available. User story implementation can now begin.

---

## Phase 3: User Story 1 + User Story 6 — Homepage + Content Restructuring (Priority: P1) 🎯 MVP

**Goal**: Deliver the fully restructured homepage with particles hero, dynamic statistics cards, featured projects preview, and partner logos section. Also deliver the About page (with "Our Approach") and Volunteer page (with "Volunteer Data Scientist Initiative").

**Independent Test**: Load the homepage → see particles hero, statistics cards fetched from Supabase, featured projects section, partner logos section. Navigate to About → see "Our Approach" content. Navigate to Volunteer → see initiative content. Confirm no "Our Approach" or "Volunteer Initiative" content on the homepage.

### Implementation

- [x] T024 [P] [US6] Create `src/components/sections/ParticlesHero.astro` — renders `<section>` with `<div id="particles-js">` container, a `<slot />` overlay for hero text (site name/tagline), and a `<script>` tag that imports particles.js and calls `particlesJS.load('particles-js', '/particles-config.json')`. Include `prefers-reduced-motion` check to skip particle animation. Per `research.md` Section 5
- [x] T025 [P] [US1] Create `src/islands/StatsCards.tsx` — React island component that fetches statistics via `getPublishedStatistics()` on mount, renders a responsive grid of cards (each showing label + value + optional icon). Shows LoadingSpinner while fetching, EmptyState if no results, error fallback if Supabase unreachable. Ordered by `display_order`. Accessible: cards use semantic markup, values announced clearly by screen readers
- [x] T026 [P] [US6] Create `src/islands/FeaturedProjects.tsx` — React island component that fetches featured projects via `getFeaturedProjects()` (limit 4), renders a grid of project cards with title, status badge (StatusBadge pattern), and optional image. Each card links to `/projects/detail/?slug=<slug>`. Shows EmptyState if no featured projects
- [x] T027 [P] [US6] Create `src/islands/PartnerLogos.tsx` — React island component that fetches partners via `getPublishedPartners()`, renders a responsive logo grid. Each logo is an `<a>` linking to `website_url` with `target="_blank" rel="noopener noreferrer"`. Uses `<img>` with `alt={partner.name}` and an `onError` fallback that replaces the image with the partner name as text (FR-026). Reused on both homepage and `/partners` page
- [x] T028 [P] [US6] Create `src/islands/PageContent.tsx` — React island component that accepts `pageSlug` and `sectionSlug` props, fetches content via `getPageContent()`, parses Markdown body to HTML using `marked`, and renders it. Shows LoadingSpinner while fetching, EmptyState if no content found
- [x] T029 [US6] Create homepage at `src/pages/index.astro` — uses BaseLayout. Assembles sections in order per FR-013: (1) ParticlesHero with site name overlay, (2) StatsCards island with `client:load`, (3) FeaturedProjects island with `client:load`, (4) PartnerLogos island with `client:load`. No "Our Approach" block (FR-010). No "Volunteer Initiative" block (FR-011). All sections mobile-responsive with Tailwind
- [x] T030 [P] [US6] Create About page at `src/pages/about.astro` — uses BaseLayout with title "About". Renders PageContent island with `pageSlug="about"` and `sectionSlug="our-approach"` via `client:load` (FR-017). May include additional static content about the lab's mission
- [x] T031 [P] [US6] Create Volunteer page at `src/pages/volunteer.astro` — uses BaseLayout with title "Volunteer". Renders PageContent island with `pageSlug="volunteer"` and `sectionSlug="main"` via `client:load` (FR-018). Navigation label is "Volunteer" or "Volunteering with Us"
- [x] T032 [US6] Update `src/components/layout/Header.astro` to ensure navigation includes all final page links in correct order, and that "Volunteer" link is clearly labeled per US6 acceptance scenario 7

**Checkpoint**: Homepage fully functional with dynamic content from Supabase. About and Volunteer pages show relocated content. This is the MVP — statistics, featured projects, and partner logos all update immediately when editors change data in Supabase Studio.

---

## Phase 4: User Story 2 — Projects with Status Indicators (Priority: P2)

**Goal**: Deliver the Projects listing page with status badges and the Project detail page.

**Independent Test**: Create a project in Supabase with status "Active" and `status='published'`. Navigate to /projects → see it listed with an "Active" badge. Click it → navigate to detail page showing full description, status, and deployed flag.

### Implementation

- [x] T033 [P] [US2] Create `src/islands/ProjectList.tsx` — React island that fetches all published projects via `getPublishedProjects()`, renders a list/grid of project cards. Each card shows: title, status badge (color-coded per StatusBadge pattern), deployed indicator (if `is_deployed` is true), optional image thumbnail. Each card links to `/projects/detail/?slug=<slug>`. Shows EmptyState with "No projects yet" message if empty. Ordered by `display_order`
- [x] T034 [P] [US2] Create `src/islands/ProjectDetail.tsx` — React island that reads `slug` from `window.location.search`, fetches the project via `getProjectBySlug(slug)`. Renders full project: title, description (Markdown → HTML via `marked`), status badge, deployed flag, image. Shows "Project not found" if slug is invalid or project is not published. Includes a "Back to Projects" link
- [x] T035 [US2] Create Projects listing page at `src/pages/projects/index.astro` — uses BaseLayout with title "Projects". Renders ProjectList island with `client:load`
- [x] T036 [US2] Create Project detail page at `src/pages/projects/detail.astro` — uses BaseLayout with title "Project Details". Renders ProjectDetail island with `client:load`

**Checkpoint**: Projects listing and detail pages fully functional. Each project shows its status at a glance. Editors can add/update/archive projects in Supabase and see changes immediately.

---

## Phase 5: User Story 3 — News Articles (Priority: P3)

**Goal**: Deliver the News listing page (reverse-chronological) and News article detail page.

**Independent Test**: Create a news article in Supabase with `status='published'`. Navigate to /news → see it listed. Click it → navigate to detail page showing full article.

### Implementation

- [x] T037 [P] [US3] Create `src/islands/NewsList.tsx` — React island that fetches published articles via `getPublishedNews()`, renders a list of article cards in reverse-chronological order (by `publish_date`). Each card shows: title, summary (or truncated body), author name, publish date, optional featured image thumbnail. Each card links to `/news/detail/?slug=<slug>`. Shows EmptyState with "No news articles yet" if empty
- [x] T038 [P] [US3] Create `src/islands/NewsDetail.tsx` — React island that reads `slug` from `window.location.search`, fetches the article via `getNewsArticleBySlug(slug)`. Renders: title, author, publish date, featured image, full body (Markdown → HTML via `marked`). Shows "Article not found" if invalid slug. Includes "Back to News" link
- [x] T039 [US3] Create News listing page at `src/pages/news/index.astro` — uses BaseLayout with title "News". Renders NewsList island with `client:load`
- [x] T040 [US3] Create News detail page at `src/pages/news/detail.astro` — uses BaseLayout with title "News Article". Renders NewsDetail island with `client:load`

**Checkpoint**: News listing and detail pages fully functional. Articles appear in reverse-chronological order. Editors can publish/archive news and see changes immediately.

---

## Phase 6: User Story 4 — People Listings (Priority: P4)

**Goal**: Deliver the Team page displaying people filtered by group type.

**Independent Test**: Create a person in Supabase with `group_type='team'` and `status='published'`. Navigate to /team → see them listed.

### Implementation

- [x] T041 [US4] Create `src/islands/PeopleGrid.tsx` — React island that accepts a `groupType` prop ('team' | 'advisory_board'), fetches people via `getPublishedPeople(groupType)`, renders a responsive card grid. Each card shows: photo (with `alt={name}`), name, role/title, optional biography. Ordered by `display_order`. Shows EmptyState if no people in the group. Photo uses `object-fit: cover` with fixed aspect ratio; if photo_url is null, shows a placeholder avatar
- [x] T042 [P] [US4] Create Team page at `src/pages/team.astro` — uses BaseLayout with title "Team". Renders PeopleGrid island with `groupType="team"` and `client:load`
- ~~T043 [P] [US4] Create Advisory Board page~~ *(Removed — Advisory Board page removed from scope. Data model retains `advisory_board` group type for future use.)*

**Checkpoint**: Team page fully functional. People appear with proper ordering. Editors can update team listings in Supabase and see changes immediately.

---

## Phase 7: User Story 5 — Partners Page (Priority: P5)

**Goal**: Deliver the dedicated Partners page. (The homepage partner logos section was already built in Phase 3 using the same PartnerLogos island.)

**Independent Test**: Add a partner in Supabase with `status='published'`. Navigate to /partners → see partner with logo and link. Also verify it appears in the homepage partner logos section.

### Implementation

- [x] T044 [US5] Create Partners page at `src/pages/partners.astro` — uses BaseLayout with title "Partners". Renders PartnerLogos island with `client:load`. May include additional context text about the lab's partnerships above the logo grid

**Checkpoint**: Partners page fully functional. The PartnerLogos island (built in Phase 3) is reused here. Editors can manage partners in Supabase and changes appear on both the homepage and the Partners page.

---

## Phase 8: User Story 7 — Contact Page (Priority: P6)

**Goal**: Deliver the Contact page with a working email-based contact method.

**Independent Test**: Navigate to /contact → see the lab's email address as a clickable mailto link. Tap on mobile → email app opens.

### Implementation

- [x] T045 [US7] Create Contact page at `src/pages/contact.astro` — uses BaseLayout with title "Contact". Displays the SDG AI Lab email address as a `<a href="mailto:...">` link. Additional context (address, social media links) can be included as static content or via PageContent island. Mobile-friendly tap target size for the email link (min 44×44px per WCAG)

**Checkpoint**: Contact page complete. Visitors can reach the lab via email on any device.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility hardening, performance optimization, responsive fine-tuning, and final deployment configuration.

- [x] T046 [P] Run Lighthouse accessibility audit on all pages (homepage, about, projects, projects/detail, news, news/detail, team, partners, volunteer, contact). Fix any WCAG 2.1 AA violations: missing alt text, insufficient color contrast, missing focus indicators, heading hierarchy issues
- [ ] T047 [P] Verify mobile responsiveness on all pages at 360px, 768px, and 1200px viewports. Fix any horizontal overflow, overlapping content, or unreadable text. Ensure particles hero, stats cards, project grids, people grids, and partner logos all adapt gracefully
- [x] T048 [P] Add `prefers-reduced-motion` media query support: disable particles.js animation, disable any CSS transitions/animations for users who prefer reduced motion
- [x] T049 [P] Review all island components for error handling and content overflow: (a) ensure every island shows LoadingSpinner while fetching, a user-friendly error message if Supabase is unreachable, and EmptyState if the query returns zero results; (b) verify long Markdown content (news articles, project descriptions) renders within container bounds using `overflow-wrap: break-word` and `max-width` constraints; (c) verify listing cards truncate long text with line-clamp and a "read more" link; (d) verify oversized images are constrained by `object-fit: cover` and fixed aspect ratios
- [x] T050 [P] Verify keyboard navigation across all pages: Tab order is logical, all interactive elements are reachable, focus indicators are visible, skip-to-content link works, mobile menu is keyboard-accessible
- [x] T051 Run `astro build` and verify the production build: confirm `dist/` output includes CNAME, all pages are generated, no build errors. Test with `astro preview` that all pages load and islands hydrate correctly
- [ ] T052 Configure GitHub Pages deployment: enable Pages in repo settings (Source: GitHub Actions), add `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` as repository secrets, trigger a deploy and verify the live site at `sdgailab.org`
- [ ] T053 [P] Verify i18n future-proofing (FR-033): audit all Astro pages and island components for hardcoded English UI strings (button labels, empty-state messages, section headings, error messages). Confirm all user-facing text either comes from Supabase `page_content` or is isolated in a single location (e.g., a constants file) that can be swapped for a translation layer later without restructuring components

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **US1+US6 Homepage (Phase 3)**: Depends on Phase 2 — delivers the MVP
- **US2 Projects (Phase 4)**: Depends on Phase 2 — can run in parallel with Phase 3
- **US3 News (Phase 5)**: Depends on Phase 2 — can run in parallel with Phases 3–4
- **US4 People (Phase 6)**: Depends on Phase 2 — can run in parallel with Phases 3–5
- **US5 Partners (Phase 7)**: Depends on Phase 3 (reuses PartnerLogos island built there)
- **US7 Contact (Phase 8)**: Depends on Phase 2 — can run in parallel with Phases 3–7
- **Polish (Phase 9)**: Depends on all user story phases being complete

### User Story Dependencies

- **US1+US6 (P1)**: Depends on Foundational. Creates shared islands (FeaturedProjects, PartnerLogos, PageContent) reused by later stories
- **US2 (P2)**: Depends on Foundational. Independent of other stories. ProjectList/ProjectDetail are new components
- **US3 (P3)**: Depends on Foundational. Independent of other stories. NewsList/NewsDetail are new components
- **US4 (P4)**: Depends on Foundational. Independent of other stories. PeopleGrid is a new component
- **US5 (P5)**: Depends on Phase 3 (PartnerLogos island). Only adds a new page using existing island
- **US7 (P6)**: Depends on Foundational. Independent. Static page only

### Within Each User Story

- Islands before pages (islands are imported by pages)
- Shared components/queries available from Phase 2
- Page assembly is the final step per story

### Parallel Opportunities

- All Phase 1 tasks marked [P] can run in parallel (after T001 initializes the project)
- All Phase 2 tasks marked [P] can run in parallel
- Phases 3, 4, 5, 6, and 8 can run in parallel after Phase 2 (if team capacity allows)
- Within each story phase, island components marked [P] can be built in parallel
- All Phase 9 tasks marked [P] can run in parallel

---

## Parallel Example: Phase 3 (US1+US6)

```
# After Phase 2 is complete, launch these in parallel:
Task T024: "ParticlesHero.astro"
Task T025: "StatsCards.tsx"
Task T026: "FeaturedProjects.tsx"
Task T027: "PartnerLogos.tsx"
Task T028: "PageContent.tsx"

# Then assemble pages (depends on above):
Task T029: "Homepage index.astro" (imports T024, T025, T026, T027)
Task T030: "About page" (imports T028) — parallel with T029
Task T031: "Volunteer page" (imports T028) — parallel with T029, T030

# Then final nav update:
Task T032: "Update Header.astro"
```

---

## Implementation Strategy

### MVP First (Phase 1 + 2 + 3 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (create Supabase project, run migration + seed)
3. Complete Phase 3: US1+US6 — Homepage + About + Volunteer
4. **STOP and VALIDATE**: Test homepage with dynamic statistics from Supabase
5. Deploy to GitHub Pages and verify live at sdgailab.org

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1+US6 → Homepage MVP → Deploy/Demo
3. US2 → Projects pages → Deploy/Demo
4. US3 → News pages → Deploy/Demo
5. US4 → People pages → Deploy/Demo
6. US5 → Partners page → Deploy/Demo
7. US7 → Contact page → Deploy/Demo
8. Polish → Accessibility + performance hardening → Final Deploy

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks in the same phase
- [Story] label maps each task to its user story for traceability
- US1 and US6 are combined because the homepage can't be meaningfully tested without both
- Every island follows the same pattern: fetch on mount → loading state → render data or empty state → error fallback
- The PartnerLogos island is built once (Phase 3) and reused in Phase 7
- The PageContent island is built once (Phase 3) and reused for About + Volunteer pages
- StatusBadge is built in Phase 2 (foundational) as both an Astro component and a React component, because React islands cannot import .astro files — the React version lives in `src/islands/components/StatusBadge.tsx`
- All queries are defined in Phase 2 (T013) so every island has its data access ready
- Seed data (T010) should be run after T009 migration — both target the same Supabase instance
- T010a (RLS verification) should be run immediately after T010 seed data — validates a constitution non-negotiable
- T053 (i18n audit) is best done near the end when all UI strings exist, before final deploy
- Commit after each completed phase
