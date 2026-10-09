# Tasks: Admin Content Management Interface

**Input**: Design documents from `/specs/002-admin-ui/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/admin-api.md, quickstart.md

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks in this phase)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Install new dependency and create the Astro page shell

- [x] T001 Install `@uiw/react-md-editor` production dependency via `npm install @uiw/react-md-editor`
- [x] T002 Create `src/pages/admin.astro` — Astro page with `<AdminApp client:only="react" />`, minimal `<head>` (title: "Admin — SDG AI Lab"), no Header/Footer from public site

---

## Phase 2: Foundational — Auth + App Shell (US1: P1)

**Purpose**: Authentication infrastructure, data access layer, and admin SPA shell. This phase delivers **User Story 1** (Editor Authenticates via Magic Link) and establishes the scaffolding for all subsequent stories.

**Goal**: An editor can navigate to `/admin`, log in via magic link, see an authenticated app shell with sidebar navigation, and sign out.

**Independent Test**: Navigate to `/admin` → see login form → submit email → receive magic link → click link → land on authenticated dashboard shell → click "Sign Out" → return to login.

**⚠️ CRITICAL**: No content management work (US2–US8) can begin until this phase is complete.

### Data Layer

- [x] T003 [P] [US1] Create `src/lib/supabase-auth.ts` — authenticated Supabase client with `autoRefreshToken: true` and `persistSession: true` per plan.md §4
- [x] T004 [P] [US1] Create `src/lib/storage.ts` — `uploadImage(folder, file)`, `deleteImage(publicUrl)`, `replaceImage(folder, oldUrl, newFile)` per contracts/admin-api.md Storage Functions. Validate file type (JPEG, PNG, GIF, WebP, SVG) and size (5MB max) client-side before upload. Path format: `{folder}/{timestamp}-{sanitized-filename}` (FR-021–FR-025)
- [x] T005 [P] [US1] Create `src/lib/admin-queries.ts` — generic CRUD helpers (`listAll`, `getById`, `create`, `update`, `archive`, `permanentlyDelete`), per-table typed wrappers for all 6 content types, `getDashboardCounts()`, and `published_at` auto-set logic (FR-016) per contracts/admin-api.md. Include `AdminResult<T>`, `AdminListResult<T>`, `ContentCounts` types and all `*Input` interfaces

### Authentication Components

- [x] T006 [US1] Create `src/islands/admin/auth/AuthProvider.tsx` — React context providing `{ session, user, loading }` state. Use `supabase.auth.getSession()` on mount and `supabase.auth.onAuthStateChange()` listener. Detect auth tokens in URL hash (`access_token`) on initial mount before router processes hash (per research.md RQ-3). Handle session expiry: on `onAuthStateChange` event `SIGNED_OUT` or `TOKEN_REFRESHED` failure → show toast "Session expired — please log in again" → redirect to LoginPage (US1 Scenario 6). The NavigationGuard dirty-form check (FR-018a) should fire before the redirect if a form is active
- [x] T007 [P] [US1] Create `src/islands/admin/auth/LoginPage.tsx` — centered card with SDG AI Lab branding, email input (required, type="email"), "Send Magic Link" button, loading state during API call, always show "Check your email for the magic link" success message after submit regardless of email validity (FR-001, spec.md US1 Scenario 2)
- [x] T008 [P] [US1] Create `src/islands/admin/auth/AuthCallback.tsx` — extract auth tokens from URL hash, call `supabase.auth.setSession()`, redirect to `#/` (dashboard) on success, show error message on failure

### App Shell

- [x] T009 [US1] Create `src/islands/admin/AdminApp.tsx` — root SPA component with: custom hash router (`useHashRoute` hook using `window.location.hash` + `hashchange` event per research.md RQ-2), auth guard (if no session → LoginPage, if auth tokens in hash → AuthCallback, else → authenticated routes), route table per plan.md §2. Initially only Dashboard route is active; each subsequent phase adds routes. Router MUST check a shared `isDirty` flag (via NavigationGuard context) before processing hash changes — if dirty, show a confirm("You have unsaved changes. Leave anyway?") prompt and abort navigation if cancelled (FR-018a)
- [x] T010 [P] [US1] Create `src/islands/admin/layout/Sidebar.tsx` — vertical nav with links: Dashboard (`#/`), Statistics (`#/statistics`), Projects (`#/projects`), News (`#/news`), People (`#/people`), Partners (`#/partners`), Page Content (`#/page-content`). Active link highlight based on current hash. Collapsible on mobile (hamburger toggle). Accessible: `<nav aria-label="Admin navigation">`, `aria-current="page"` on active link
- [x] T011 [P] [US1] Create `src/islands/admin/layout/Toast.tsx` — toast notification component with success/error variants, auto-dismiss after 5s, manual dismiss button. Provide `ToastProvider` context + `useToast()` hook for triggering from any component (FR-018)
- [x] T012 [US1] Create `src/islands/admin/layout/AdminLayout.tsx` — flex layout with Sidebar, header bar (showing user email + "Sign Out" button calling `supabase.auth.signOut()`), and `<main>` content area. Wrap with `ToastProvider`. Mobile: sidebar collapses behind hamburger (FR-003, FR-026)

**Checkpoint**: **US1 complete**. Editor can authenticate via magic link, see the admin shell with sidebar, and sign out. All acceptance scenarios for US1 are met.

---

## Phase 3: User Story 2 — Dashboard Overview (Priority: P1)

**Goal**: After login, editor sees a dashboard with content type cards showing counts and status breakdowns.

**Independent Test**: Login → land on dashboard → see 6 cards (Statistics, Projects, News, People, Partners, Page Content) each showing total count and draft/published/archived breakdown → click a card → navigate to that content type's listing.

- [x] T013 [US2] Create `src/islands/admin/dashboard/DashboardPage.tsx` — fetch `getDashboardCounts()` from `admin-queries.ts`, render 6 cards in responsive grid (2 cols mobile, 3 cols desktop). Each card shows: content type name, total count, status breakdown badges (draft/published/archived counts with color coding), and links to listing page (`#/{content-type}`). Loading skeleton while fetching. Error state with retry button (FR-005, FR-006, FR-007)

**Checkpoint**: **US2 complete**. Editor sees at-a-glance overview and can navigate to any content type.

---

## Phase 4: User Story 3 — Statistics Management (Priority: P1) 🎯 MVP

**Goal**: Editor can list, create, edit, archive, and permanently delete statistics through forms. This is the simplest content type and validates the full CRUD pattern that all other content types will reuse.

**Independent Test**: Navigate to Statistics listing → see all statistics with status badges → click "Add New" → fill form (label, value, display_order, status=Published) → save → see new item in listing → edit item → change value → save → archive item → item shows "Archived" badge → permanently delete archived item → confirm → item removed.

### Shared Components (created here, reused by US4–US8)

- [x] T014 [P] [US3] Create `src/islands/admin/shared/StatusSelect.tsx` — `<select>` dropdown with Draft/Published/Archived options. Also export `StatusBadge` variant for table display (color-coded: gray=draft, green=published, red=archived). Accessible labels (FR-009, FR-015)
- [x] T015 [P] [US3] Create `src/islands/admin/shared/FormFeedback.tsx` — inline message component with success (green) and error (red) variants. Auto-clears after 5s or on form change (FR-018)
- [x] T016 [P] [US3] Create `src/islands/admin/shared/ConfirmDialog.tsx` — modal overlay with title, message, "Cancel" and "Delete Permanently" buttons. Focus trap and Escape key to close. `aria-modal="true"`, `role="alertdialog"` (FR-012)
- [x] T017 [US3] Create `src/islands/admin/shared/ContentTable.tsx` — reusable table component. Props: `columns` config (label + accessor + optional render), `data` array, `onEdit` (navigates to `#/{type}/edit/{id}`), `onArchive` (calls archive function), `onDelete` (opens ConfirmDialog then calls permanentlyDelete — only shown for archived items). Header row with "Add New" button. Status column uses `StatusBadge`. Loading/empty/error states. Responsive: horizontal scroll on mobile (FR-008, FR-009, FR-010, FR-011)
- [x] T018 [US3] Create `src/islands/admin/shared/ContentForm.tsx` — reusable form wrapper. Props: `children` (form fields), `initialValues`, `onSave(values)`, `isEdit` flag, `loading` state. Handles: required field validation with inline errors (FR-013), `beforeunload` event for unsaved changes detection (FR-018a), submit button with loading spinner, cancel button navigating back. Tracks dirty state by comparing current values to initial values. Registers dirty state with a shared NavigationGuard context (consumed by the router in AdminApp.tsx) so internal hash navigation also triggers unsaved-changes warning. Uses `beforeunload` for tab close / external navigation (FR-018a)

### Statistics Pages

- [x] T019 [US3] Create `src/islands/admin/statistics/StatisticsListPage.tsx` — uses `ContentTable` with `listStatistics()` from admin-queries.ts. Columns: label, value, status, display_order. Actions: edit, archive, permanent delete. "Add New" links to `#/statistics/new`. Register route `#/statistics` in `AdminApp.tsx`
- [x] T020 [US3] Create `src/islands/admin/statistics/StatisticFormPage.tsx` — uses `ContentForm`. Fields: label (text, required), value (text, required), icon_name (text, optional), display_order (number, default 0), status (StatusSelect). On save: call `createStatistic()` or `updateStatistic()`. In edit mode (`#/statistics/edit/:id`): fetch via `getStatistic(id)` and pre-fill form. Register routes `#/statistics/new` and `#/statistics/edit/:id` in `AdminApp.tsx` (US3 Scenarios 2–6)

**Checkpoint**: **US3 complete — MVP validated**. The full CRUD pattern works end-to-end. Shared components (ContentTable, ContentForm, StatusSelect, FormFeedback, ConfirmDialog) are proven and ready for reuse.

---

## Phase 5: User Story 4 — Projects Management (Priority: P2)

**Goal**: Editor can manage projects with Markdown descriptions, image uploads, slug auto-generation, project status selection, and feature/deploy toggles.

**Independent Test**: Navigate to Projects → click "Add New" → type title → slug auto-generates → write Markdown description with live preview → upload image → set project_status, is_featured, is_deployed → publish → verify on public site.

### Rich-Field Shared Components (created here, reused by US5–US8)

- [x] T021 [P] [US4] Create `src/islands/admin/shared/SlugField.tsx` — text input that auto-generates URL-safe slug from a source value (title). Slugify logic: lowercase, replace spaces with hyphens, remove non-alphanumeric chars except hyphens. Manual override: once user edits slug directly, auto-generation stops until title changes again. Show generated URL preview (FR-014)
- [x] T022 [P] [US4] Create `src/islands/admin/shared/MarkdownField.tsx` — wrapper around `@uiw/react-md-editor`. Props: `value`, `onChange`, `label`. Configure custom preview rendering using `marked` library for consistency with public site (FR-020). Simplify toolbar for non-technical users (bold, italic, headings, links, lists, images). Mobile: switch from split-pane to tabbed write/preview (FR-019)
- [x] T023 [P] [US4] Create `src/islands/admin/shared/ImageUpload.tsx` — file input (accept: image/jpeg, image/png, image/gif, image/webp, image/svg+xml), 5MB client-side validation, upload progress indicator, thumbnail preview after upload, "Replace" and "Remove" buttons. Uses `uploadImage()`, `deleteImage()`, `replaceImage()` from `storage.ts`. Accessible: label, error messages, alt text on preview (FR-021–FR-025)

### Projects Pages

- [x] T024 [US4] Create `src/islands/admin/projects/ProjectsListPage.tsx` — uses `ContentTable` with `listProjects()`. Columns: title, project_status (with project-specific status badge: active/completed/under_development/on_hold), publish status, is_featured (checkmark icon), is_deployed (checkmark icon), display_order. Register route `#/projects` in `AdminApp.tsx`
- [x] T025 [US4] Create `src/islands/admin/projects/ProjectFormPage.tsx` — uses `ContentForm`. Fields: title (text, required), slug (SlugField, sourced from title), description (MarkdownField, required), project_status (dropdown: active/completed/under_development/on_hold), is_deployed (checkbox), is_featured (checkbox), image (ImageUpload, folder: 'projects'), display_order (number), status (StatusSelect). Register routes `#/projects/new` and `#/projects/edit/:id` in `AdminApp.tsx` (US4 Scenarios 1–5)

**Checkpoint**: **US4 complete**. Rich-field components (Markdown, image upload, slug) are proven.

---

## Phase 6: User Story 5 — News Articles Management (Priority: P2)

**Goal**: Editor can create and manage news articles with Markdown body, featured image, and editorial metadata.

**Independent Test**: Navigate to News → "Add New" → fill title (slug auto-generates) → write Markdown body → upload featured image → set author name + publish date → publish → verify on public News page.

- [x] T026 [US5] Create `src/islands/admin/news/NewsListPage.tsx` — uses `ContentTable` with `listNewsArticles()`. Columns: title, author_name, publish_date, status. Default sort: publish_date descending. Register route `#/news` in `AdminApp.tsx`
- [x] T027 [US5] Create `src/islands/admin/news/NewsFormPage.tsx` — uses `ContentForm`. Fields: title (text, required), slug (SlugField, sourced from title), body (MarkdownField, required), summary (textarea, optional), featured_image (ImageUpload, folder: 'news'), author_name (text, optional), publish_date (date input, default: today), status (StatusSelect). Register routes `#/news/new` and `#/news/edit/:id` in `AdminApp.tsx` (US5 Scenarios 1–3)

**Checkpoint**: **US5 complete**. Create-heavy workflow validated.

---

## Phase 7: User Story 6 — People Management (Priority: P2)

**Goal**: Editor can manage team members and advisory board members with photo uploads and biographical information.

**Independent Test**: Navigate to People → filter by "Team" → "Add New" → fill name, role, set group_type=team → upload photo → publish → verify on public Team page. Repeat for advisory_board group.

- [x] T028 [US6] Create `src/islands/admin/people/PeopleListPage.tsx` — uses `ContentTable` with `listPeople()`. Columns: name, role_title, group_type, status, display_order. Add filter/toggle for group_type (team / advisory_board / all). Register route `#/people` in `AdminApp.tsx`
- [x] T029 [US6] Create `src/islands/admin/people/PersonFormPage.tsx` — uses `ContentForm`. Fields: name (text, required), role_title (text, required), group_type (dropdown: team/advisory_board, required), photo (ImageUpload, folder: 'people'), biography (textarea, optional), display_order (number), status (StatusSelect). Register routes `#/people/new` and `#/people/edit/:id` in `AdminApp.tsx` (US6 Scenarios 1–3)

**Checkpoint**: **US6 complete**. People management with group filtering works.

---

## Phase 8: User Story 7 — Partners Management (Priority: P2)

**Goal**: Editor can manage partner entries with logo uploads and website links.

**Independent Test**: Navigate to Partners → "Add New" → fill name, website URL → upload logo → publish → verify on public Partners page and homepage partner logos section.

- [x] T030 [US7] Create `src/islands/admin/partners/PartnersListPage.tsx` — uses `ContentTable` with `listPartners()`. Columns: name, logo preview (small thumbnail), website_url, status, display_order. Register route `#/partners` in `AdminApp.tsx`
- [x] T031 [US7] Create `src/islands/admin/partners/PartnerFormPage.tsx` — uses `ContentForm`. Fields: name (text, required), website_url (URL input, required), logo (ImageUpload, folder: 'partners'), display_order (number), status (StatusSelect). Register routes `#/partners/new` and `#/partners/edit/:id` in `AdminApp.tsx` (US7 Scenarios 1–3)

**Checkpoint**: **US7 complete**. Partner management with logo preview works.

---

## Phase 9: User Story 8 — Page Content Management (Priority: P2)

**Goal**: Editor can manage dynamic content blocks (About, Volunteer pages) through a Markdown editor.

**Independent Test**: Navigate to Page Content → "Add New" → select page_slug "about", enter section_slug "our-approach" → write Markdown body → publish → verify on public About page.

- [x] T032 [US8] Create `src/islands/admin/page-content/PageContentListPage.tsx` — uses `ContentTable` with `listPageContent()`. Columns: page_slug, section_slug, status. Register route `#/page-content` in `AdminApp.tsx`
- [x] T033 [US8] Create `src/islands/admin/page-content/PageContentFormPage.tsx` — uses `ContentForm`. Fields: page_slug (combobox/datalist suggesting "about", "volunteer", "contact" but allowing custom values), section_slug (text, required), body (MarkdownField, required), status (StatusSelect). Register routes `#/page-content/new` and `#/page-content/edit/:id` in `AdminApp.tsx` (US8 Scenarios 1–3)

**Checkpoint**: **US8 complete**. All 6 content types are now manageable through the admin.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Quality verification across all user stories

- [ ] T034 [P] Mobile responsiveness audit — verify all admin pages at 360px viewport: sidebar collapses, tables scroll horizontally, forms stack vertically, Markdown editor uses tabbed mode, image upload works on mobile (FR-026, SC-006)
- [ ] T035 [P] Accessibility audit — verify semantic HTML (`<nav>`, `<main>`, `<form>`, `<table>`), ARIA attributes (`aria-label`, `aria-current`, `aria-modal`, `role="alertdialog"`), focus management (ConfirmDialog focus trap, Toast announcements), keyboard navigation (all actions reachable via Tab/Enter/Escape), color contrast (WCAG 2.1 AA 4.5:1 ratio) (FR-027, SC-007)
- [x] T036 Build verification — run `npm run build` and confirm `dist/admin/index.html` is generated. Verify admin bundle is isolated (only loaded when visiting `/admin`, not on public pages)
- [ ] T037 End-to-end workflow validation per quickstart.md — login, create+publish a statistic (verify on public homepage), create+publish a news article with image (verify on public News page), archive an item (verify it disappears from public site), permanently delete an archived item (SC-001–SC-005)
- [x] T038 Update `specs/002-admin-ui/quickstart.md` with any adjustments discovered during implementation (corrected paths, additional setup steps, revised workflows)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational / US1)**: Depends on Phase 1 — **BLOCKS all other phases**
- **Phase 3 (US2 Dashboard)**: Depends on Phase 2
- **Phase 4 (US3 Statistics)**: Depends on Phase 2 (uses Phase 2 data layer + app shell)
- **Phase 5 (US4 Projects)**: Depends on Phase 4 (reuses ContentTable, ContentForm from US3)
- **Phase 6 (US5 News)**: Depends on Phase 5 (reuses SlugField, MarkdownField, ImageUpload from US4)
- **Phase 7 (US6 People)**: Depends on Phase 5 (reuses ImageUpload from US4)
- **Phase 8 (US7 Partners)**: Depends on Phase 5 (reuses ImageUpload from US4)
- **Phase 9 (US8 Page Content)**: Depends on Phase 5 (reuses MarkdownField from US4)
- **Phase 10 (Polish)**: Depends on all previous phases

### User Story Dependencies

```text
Phase 1 (Setup)
    │
    ▼
Phase 2 (US1: Auth + Shell) ← BLOCKS EVERYTHING
    │
    ├──▶ Phase 3 (US2: Dashboard)
    │
    └──▶ Phase 4 (US3: Statistics) ← creates shared CRUD components
              │
              ▼
         Phase 5 (US4: Projects) ← creates rich-field shared components
              │
              ├──▶ Phase 6 (US5: News)       ┐
              ├──▶ Phase 7 (US6: People)      │ These 4 can run
              ├──▶ Phase 8 (US7: Partners)    │ in parallel after
              └──▶ Phase 9 (US8: Page Content)┘ Phase 5 completes
                        │
                        ▼
                  Phase 10 (Polish)
```

### Key Parallelism Points

1. **Within Phase 2**: T003, T004, T005 (data layer) can all run in parallel. T007, T008 (auth UI) can run in parallel. T010, T011 (layout parts) can run in parallel.
2. **Phase 3 ∥ Phase 4**: Dashboard (US2) and Statistics (US3) can run in parallel after Phase 2 since they don't share components.
3. **Within Phase 4**: T014, T015, T016 (shared components) can all run in parallel before T017, T018.
4. **Within Phase 5**: T021, T022, T023 (rich components) can all run in parallel before T024, T025.
5. **Phases 6–9**: All four can run in parallel after Phase 5, as they only consume shared components (no new shared components created).

---

## Parallel Examples

### Phase 2 — Data Layer (3 tasks, parallel)

```
Task T003: "Create src/lib/supabase-auth.ts"
Task T004: "Create src/lib/storage.ts"
Task T005: "Create src/lib/admin-queries.ts"
```

### Phase 4 — Shared Components (3 tasks, parallel)

```
Task T014: "Create StatusSelect.tsx"
Task T015: "Create FormFeedback.tsx"
Task T016: "Create ConfirmDialog.tsx"
```

### Phase 5 — Rich Shared Components (3 tasks, parallel)

```
Task T021: "Create SlugField.tsx"
Task T022: "Create MarkdownField.tsx"
Task T023: "Create ImageUpload.tsx"
```

### Phases 6–9 — Content Types (4 phases, parallel after Phase 5)

```
Task T026+T027: "News management"
Task T028+T029: "People management"
Task T030+T031: "Partners management"
Task T032+T033: "Page Content management"
```

---

## Implementation Strategy

### MVP First (US1 + US2 + US3)

1. Complete **Phase 1**: Setup (T001–T002)
2. Complete **Phase 2**: Auth + App Shell — US1 (T003–T012)
3. Complete **Phase 3**: Dashboard — US2 (T013)
4. Complete **Phase 4**: Statistics — US3 (T014–T020)
5. **STOP and VALIDATE**: Login → dashboard → create/edit/publish/archive statistics → verify on public site
6. Deploy if ready — this is a usable MVP

### Incremental Delivery (P2 Content Types)

7. Complete **Phase 5**: Projects — US4 (T021–T025) → Test → Deploy
8. Complete **Phases 6–9** in priority order or parallel (US5–US8) → Test each → Deploy
9. Complete **Phase 10**: Polish (T034–T038) → Final validation

### Single-Developer Strategy (Recommended)

Phases 1 → 2 → 3 → 4 → **pause, validate MVP** → 5 → 6 → 7 → 8 → 9 → 10

Total tasks executed sequentially: 38  
Estimated parallelizable: 14 tasks (37% of total)

---

## Notes

- **Route registration**: Each `*ListPage` and `*FormPage` task includes updating `AdminApp.tsx` to add the corresponding hash route(s) to the route table. This keeps the router in sync as pages are created.
- **Shared components layering**: Phase 4 (US3) creates basic shared components (ContentTable, ContentForm, StatusSelect, FormFeedback, ConfirmDialog). Phase 5 (US4) adds rich-field components (SlugField, MarkdownField, ImageUpload). Phases 6–9 only consume — no new shared components needed.
- **`published_at` logic**: Handled centrally in `admin-queries.ts` (T005), not in individual form components. When `status` changes to `'published'` and `published_at` is null, the query function auto-sets it.
- **No schema changes**: All tasks operate on the existing 6 tables from 001-dynamic-cms-revamp. No migration files needed (FR-029).
- **Bundle isolation**: The admin SPA is loaded only when visiting `/admin` because of `client:only="react"` on a separate Astro page. Public site visitors never download admin code.
