---
schema: sdgqalab/testmap@3
layer: "frontend"
project: "SDG AI Lab Website"
audited_at: "2026-07-15T16:12:00Z"
config_version: 3

coverage:
  total_source_files: 67
  unit:
    test_files: 21
    file_coverage_pct: 31.3
    file_coverage_rating: "Low"
  integration:
    test_files: 23
    file_coverage_pct: 44.8
    file_coverage_rating: "Low"
  e2e:
    journeys_identified: 9
    journeys_covered: 3
    gaps: 6
  security:
    areas_identified: 8
    areas_covered: 8
    gaps: 0
  accessibility:
    components_identified: 12
    components_covered: 2
    gaps: 10
  line_coverage_pct: 87.37
  line_coverage_rating: "Solid"
  test_count: 155

by_scope:
  "components":
    source_files: 8
    unit_test_files: 0
    unit_file_coverage_pct: 0.0
    integration_test_files: 2
    integration_file_coverage_pct: 25.0
  "islands":
    source_files: 39
    unit_test_files: 13
    unit_file_coverage_pct: 33.3
    integration_test_files: 18
    integration_file_coverage_pct: 66.7
  "lib":
    source_files: 8
    unit_test_files: 8
    unit_file_coverage_pct: 100.0
    integration_test_files: 0
    integration_file_coverage_pct: 0.0
  "pages":
    source_files: 12
    unit_test_files: 0
    unit_file_coverage_pct: 0.0
    integration_test_files: 2
    integration_file_coverage_pct: 16.7

delta:
  previous_audit: "2026-07-15T15:22"
  unit_file_coverage_change: 5.9
  integration_file_coverage_change: 7.5
  line_coverage_change: 5.6
  e2e_gaps_change: -3
  security_gaps_change: -1
  accessibility_gaps_change: -2
---

# Frontend Test Audit

> **Unit File Coverage**: 31.3% (21/67 files) · Low
> **Integration File Coverage**: 44.8% (30/67 files) · Low
> **Line Coverage**: 87.37% · Solid
> **Tests**: 155
> **Audited**: 2026-07-15

---

## Audit Status

This audit includes a working coverage-tool run via `vitest run --coverage`.

- **44** Vitest files and **155** tests pass, including new coverage for `AdminApp`, `AuthCallback`, `Sidebar`, `StatusBadge`, and Supabase client bootstrap modules.
- Line coverage reached **87.37%** (Solid), up from 81.77% in the prior snapshot.
- Playwright E2E is configured (`npm run test:e2e`) with **3** passing public/admin-shell journeys.
- `jest-axe` smoke tests cover `LoginPage` and `ConfirmDialog`; eight interactive surfaces remain without axe checks.
- Astro layout/page source tests live in `tests/pages/` to avoid Astro route collisions.

## Unit Tests

Tests that verify modules in isolation — no I/O, no external services.
Targets: utilities, hooks, guards, validation logic, shared components, state/context helpers.

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|-------|-------------:|----------------:|-------------------:|
| components | 8 | 0 | 0.0% |
| islands | 39 | 13 | 33.3% |
| lib | 8 | 8 | 100.0% |
| pages | 12 | 0 | 0.0% |
| **Total** | **67** | **21** | **31.3%** |

### Existing Unit Tests

| Scope | Test File | Approx. Tests | Modules Covered |
|-------|-----------|---------------|-----------------|
| lib | `src/lib/url.test.ts` | 2 | `src/lib/url.ts` |
| lib | `src/lib/markdown.test.ts` | 4 | `src/lib/markdown.ts` |
| lib | `src/lib/admin-security.test.ts` | 4 | `src/lib/admin-security.ts` |
| lib | `src/lib/admin-queries.test.ts` | 9 | `src/lib/admin-queries.ts` |
| lib | `src/lib/storage.test.ts` | 7 | `src/lib/storage.ts` |
| lib | `src/lib/queries.test.ts` | 6 | `src/lib/queries.ts` |
| lib | `src/lib/supabase.test.ts` | 3 | `src/lib/supabase.ts` |
| lib | `src/lib/supabase-auth.test.ts` | 3 | `src/lib/supabase-auth.ts` |
| islands | `src/islands/admin/auth/AuthProvider.test.tsx` | 4 | `src/islands/admin/auth/AuthProvider.tsx` |
| islands | `src/islands/admin/layout/Sidebar.test.tsx` | 4 | `src/islands/admin/layout/Sidebar.tsx` |
| islands | `src/islands/admin/layout/Toast.test.tsx` | 2 | `src/islands/admin/layout/Toast.tsx` |
| islands | `src/islands/admin/shared/ImageUpload.test.tsx` | 4 | `src/islands/admin/shared/ImageUpload.tsx` |
| islands | `src/islands/admin/shared/SlugField.test.tsx` | 3 | `src/islands/admin/shared/SlugField.tsx` |
| islands | `src/islands/admin/shared/StatusSelect.test.tsx` | 3 | `src/islands/admin/shared/StatusSelect.tsx` |
| islands | `src/islands/admin/shared/ContentForm.test.tsx` | 2 | `src/islands/admin/shared/ContentForm.tsx` |
| islands | `src/islands/admin/shared/FormFeedback.test.tsx` | 2 | `src/islands/admin/shared/FormFeedback.tsx` |
| islands | `src/islands/admin/shared/ConfirmDialog.test.tsx` | 4 | `src/islands/admin/shared/ConfirmDialog.tsx` |
| islands | `src/islands/admin/shared/ContentTable.test.tsx` | 3 | `src/islands/admin/shared/ContentTable.tsx` |
| islands | `src/islands/admin/shared/MarkdownField.test.tsx` | 3 | `src/islands/admin/shared/MarkdownField.tsx` |
| islands | `src/islands/components/ProjectCard.test.tsx` | 2 | `src/islands/components/ProjectCard.tsx` |
| islands | `src/islands/components/StatusBadge.test.tsx` | 2 | `src/islands/components/StatusBadge.tsx` |

### Unit Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/components/ui/EmptyState.astro` | components | Fallback messaging and aria semantics |
| `src/components/ui/LoadingSpinner.astro` | components | Loading status role/label |
| `src/components/ui/SDGWheel.astro` | components | Decorative image alt text and sizing |
| `src/components/ui/StatusBadge.astro` | components | Astro status badge variant rendering |
| `src/components/layout/Footer.astro` | components | Footer landmark and link structure |
| `src/components/sections/ParticlesHero.astro` | components | Hero landmark and CTA focus styles |

---

## Integration Tests

Tests that verify components working together across boundaries — page rendering, Supabase reads/writes, auth, storage, and admin workflows.

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|-------|-------------:|----------------------:|--------------------------:|
| components | 8 | 2 | 25.0% |
| islands | 39 | 18 | 66.7% |
| lib | 8 | 0 | 0.0% |
| pages | 12 | 2 | 16.7% |
| **Total** | **67** | **23** | **44.8%** |

### Existing Integration Tests

| Scope | Test File | Approx. Tests | Boundaries Covered |
|-------|-----------|---------------|--------------------|
| islands | `src/islands/public-islands.test.tsx` | 8 | Public list/content islands with mocked `queries` and `markdown` |
| islands | `src/islands/detail-islands.test.tsx` | 4 | `NewsDetail`, `ProjectDetail`, `PageContent` fetch/render lifecycles |
| islands | `src/islands/admin/AdminApp.test.tsx` | 7 | Auth gating, hash routing, unauthorized surface, dashboard route |
| islands | `src/islands/admin/auth/AuthCallback.test.tsx` | 4 | Magic-link callback tokens, redirect, and invalid-link error |
| islands | `src/islands/admin/auth/LoginPage.test.tsx` | 4 | Magic-link submission, throttle path, non-allowlisted rejection |
| islands | `src/islands/admin/dashboard/DashboardPage.test.tsx` | 3 | Dashboard counts with mocked admin queries |
| islands | `src/islands/admin/layout/AdminLayout.test.tsx` | 3 | Admin shell layout and auth boundary |
| islands | `src/islands/admin/projects/ProjectFormPage.test.tsx` | 3 | Create/update workflow, validation, navigation |
| islands | `src/islands/admin/projects/ProjectsListPage.test.tsx` | 3 | List fetch, archive/delete actions |
| islands | `src/islands/admin/news/NewsFormPage.test.tsx` | 3 | Create/update workflow and validation |
| islands | `src/islands/admin/news/NewsListPage.test.tsx` | 3 | List fetch and row actions |
| islands | `src/islands/admin/statistics/StatisticFormPage.test.tsx` | 2 | Statistic create flow |
| islands | `src/islands/admin/statistics/StatisticsListPage.test.tsx` | 3 | Statistics list actions |
| islands | `src/islands/admin/page-content/PageContentFormPage.test.tsx` | 3 | Page content create/update |
| islands | `src/islands/admin/page-content/PageContentListPage.test.tsx` | 3 | Page content list actions |
| islands | `src/islands/admin/partners/PartnerFormPage.test.tsx` | 3 | Partner create/update |
| islands | `src/islands/admin/partners/PartnersListPage.test.tsx` | 3 | Partner list actions |
| islands | `src/islands/admin/people/PersonFormPage.test.tsx` | 3 | Person create/update |
| islands | `src/islands/admin/people/PeopleListPage.test.tsx` | 3 | People list actions |
| components | `tests/pages/layout-header.test.ts` | 3 | `Header.astro` navigation and mobile-menu source |
| components | `tests/pages/layout-base-layout.test.ts` | 3 | `BaseLayout.astro` CSP, metadata, analytics source |
| pages | `tests/pages/admin-page.test.ts` | 2 | `admin.astro` CSP, noindex, referrer-policy source |
| pages | `tests/pages/index-page.test.ts` | 3 | `index.astro` hero, islands, and CTA source |

### Integration Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/components/layout/Footer.astro` | components | Footer links and landmark structure in rendered HTML |
| `src/components/sections/ParticlesHero.astro` | components | Hero section composition on the homepage |
| `src/pages/news/index.astro` | pages | News list page island wiring |
| `src/pages/projects/index.astro` | pages | Project list page island wiring |
| `src/pages/team.astro` | pages | People grid page composition |
| `src/pages/contact.astro` | pages | Contact page structure and mailto link |

---

## End-to-End (E2E) Tests

Tests that verify complete user journeys through the real application.

> **3** of **9** journeys covered · **6** gaps

### Existing E2E Tests

| Test File / Suite | User Journey Covered |
|-------------------|---------------------|
| `e2e/public-and-admin.spec.ts` | Public homepage loads with navigation and hero |
| `e2e/public-and-admin.spec.ts` | Homepage → Projects navigation |
| `e2e/public-and-admin.spec.ts` | Admin route serves protected noindex shell with client island |

### E2E Tests Needed

| User Journey | Priority | What to Cover |
|-------------|----------|---------------|
| Editor magic-link login | P1 | Request link, return to `/admin`, establish session, land on dashboard |
| Unauthorized editor denial | P1 | Sign in with a non-allowlisted account and confirm access is blocked |
| Create and publish a project | P1 | Full admin create flow, publish, and verify public visibility |
| Create and publish a news article | P1 | Full admin create flow with Markdown and public detail-page verification |
| Upload and replace media | P1 | Add image, replace image, and verify resulting public URL behavior |
| Archive and delete content | P2 | Archive an item, confirm removal from public views, then permanently delete |

> Playwright is configured with `playwright.config.ts` and `npm run test:e2e`. Editor journeys require a Supabase-enabled preview environment.

---

## Security Tests

Tests that verify authentication, authorization, input validation, and protection against common vulnerabilities.

> **8** of **8** security-sensitive areas covered · **0** gaps

### Existing Security Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| lib | `src/lib/markdown.test.ts` | Markdown sanitization, unsafe URL neutralization, safe data-image handling |
| lib | `src/lib/admin-security.test.ts` | Rate-limit helper behavior and retry timing |
| lib | `src/lib/url.test.ts` | Environment-derived staging/base-path behavior |
| lib | `src/lib/admin-queries.test.ts` | Runtime validation, published-at normalization, mutation error propagation |
| lib | `src/lib/storage.test.ts` | Upload validation, storage abuse controls, URL parsing, replace-image behavior |
| lib | `src/lib/supabase.test.ts` | Browser-only client singleton guard |
| lib | `src/lib/supabase-auth.test.ts` | Auth client persistence options and browser guard |
| islands | `src/islands/admin/auth/AuthProvider.test.tsx` | Session allowlist enforcement, mismatched-user rejection, sign-out reset |
| islands | `src/islands/admin/auth/LoginPage.test.tsx` | Login throttle behavior, normalized email submission, non-allowlisted OTP rejection |
| islands | `src/islands/admin/auth/AuthCallback.test.tsx` | Invalid callback rejection and post-auth redirect |
| islands | `src/islands/admin/shared/ImageUpload.test.tsx` | Upload, replace, remove, and error-state behavior |
| pages | `tests/pages/admin-page.test.ts` | Admin CSP, noindex, and strict referrer-policy source assertions |

### Security Tests Needed

No critical frontend security test gaps remain in the current hardening scope.

---

## Accessibility Tests

Tests that verify the application is usable by people with disabilities.

> **2** of **12** interactive components covered · **10** gaps

### Existing Accessibility Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| islands | `src/islands/admin/auth/LoginPage.test.tsx` | `jest-axe` smoke test on the login form |
| islands | `src/islands/admin/shared/ConfirmDialog.test.tsx` | `jest-axe` smoke test on the open dialog |

### Accessibility Tests Needed

| Component / Page | Scope | What to Test |
|-----------------|-------|--------------|
| `src/components/layout/Header.astro` | components | Keyboard navigation, mobile menu state, and aria attributes |
| `src/pages/index.astro` | pages | Landmark structure, heading order, and CTA accessibility |
| `src/pages/admin.astro` | pages | Admin shell semantics and noindex/structure smoke checks |
| `src/islands/admin/shared/ContentForm.tsx` | islands | Focus order, submit states, and error feedback semantics |
| `src/islands/admin/shared/ImageUpload.tsx` | islands | File input labeling and error announcement |
| `src/islands/admin/layout/Sidebar.tsx` | islands | Navigation roles and active-page indicators |
| `src/islands/admin/layout/Toast.tsx` | islands | `aria-live` behavior and dismiss controls |
| `src/islands/admin/people/PeopleListPage.tsx` | islands | Filter buttons and keyboard access |
| `src/islands/NewsDetail.tsx` | islands | Loading/error states and content semantics |
| `src/islands/ProjectDetail.tsx` | islands | Loading/error states and interactive details |

---

## Test Health Observations

| Test File | Observation | Impact |
|-----------|-------------|--------|
| `src/islands/public-islands.test.tsx` | Uses manual `createRoot` + `act()` rendering instead of Testing Library | Harder to maintain; still provides meaningful mocked-boundary coverage |
| `src/islands/admin/AdminApp.test.tsx` | Hash-route and lazy-page paths are mocked, not exercised end-to-end | Line coverage is strong but real lazy imports are not resolved in tests |
| `tests/pages/*.test.ts` | Source-file assertions only; no rendered Astro HTML checks | Fast regression guard, not a substitute for component render tests |

---

## Recommendations

1. **[P1]** Add Supabase-backed Playwright flows for editor login and one CRUD publish journey using staging credentials in CI.
2. **[P2]** Extend `jest-axe` smoke tests to `ContentForm`, `ImageUpload`, `Sidebar`, and `Toast`.
3. **[P2]** Add Astro render or integration tests for remaining public pages (`news`, `projects`, `team`, `contact`).
4. **[P3]** Cover remaining presentational Astro components (`Footer`, `ParticlesHero`, `EmptyState`) with lightweight source or render tests.

## Acceptance Criteria

- [ ] Every scope has at least one dedicated automated test module
- [x] All public data loaders and admin CRUD flows have at least one positive and one negative automated test
- [x] Critical security logic has automated tests
- [ ] Key editor journeys have E2E coverage (public journeys covered; editor flows pending Supabase staging)
- [ ] Core interactive components have accessibility checks (2 of 12 covered)
- [x] Coverage tooling continues to run from `.sdgqalab/config.yml`
- [x] All tests pass: `npm run test`
