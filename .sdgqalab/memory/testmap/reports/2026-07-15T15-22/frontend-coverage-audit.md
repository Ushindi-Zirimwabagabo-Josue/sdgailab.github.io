---
schema: sdgqalab/testmap@3
layer: "frontend"
project: "SDG AI Lab Website"
audited_at: "2026-07-15T15:22:00Z"
config_version: 3

coverage:
  total_source_files: 67
  unit:
    test_files: 17
    file_coverage_pct: 25.4
    file_coverage_rating: "Critical"
  integration:
    test_files: 18
    file_coverage_pct: 37.3
    file_coverage_rating: "Low"
  e2e:
    journeys_identified: 6
    journeys_covered: 0
    gaps: 6
  security:
    areas_identified: 8
    areas_covered: 7
    gaps: 1
  accessibility:
    components_identified: 12
    components_covered: 0
    gaps: 12
  line_coverage_pct: 81.77
  line_coverage_rating: "Solid"
  test_count: 121

by_scope:
  "components":
    source_files: 8
    unit_test_files: 0
    unit_file_coverage_pct: 0.0
    integration_test_files: 0
    integration_file_coverage_pct: 0.0
  "islands":
    source_files: 39
    unit_test_files: 11
    unit_file_coverage_pct: 28.2
    integration_test_files: 16
    integration_file_coverage_pct: 61.5
  "lib":
    source_files: 8
    unit_test_files: 6
    unit_file_coverage_pct: 75.0
    integration_test_files: 0
    integration_file_coverage_pct: 0.0
  "pages":
    source_files: 12
    unit_test_files: 0
    unit_file_coverage_pct: 0.0
    integration_test_files: 1
    integration_file_coverage_pct: 8.3

delta:
  previous_audit: "2026-07-15T04:49"
  unit_file_coverage_change: -21.7
  integration_file_coverage_change: 37.3
  line_coverage_change: 10.25
  e2e_gaps_change: 0
  security_gaps_change: 1
  accessibility_gaps_change: 0
---

# Frontend Test Audit

> **Unit File Coverage**: 25.4% (17/67 files) · Critical
> **Integration File Coverage**: 37.3% (25/67 files) · Low
> **Line Coverage**: 81.77% · Solid
> **Tests**: 121
> **Audited**: 2026-07-15

---

## Audit Status

This audit includes a working coverage-tool run via `vitest run --coverage`.

- Vitest and `@vitest/coverage-v8` are configured and passing (`35` test files, `121` tests).
- Public-content islands (`FeaturedProjects`, `NewsList`, `PageContent`, `PartnerLogos`, `PeopleGrid`, `ProjectList`, `StatsCards`) and detail islands (`NewsDetail`, `ProjectDetail`, `PageContent`) are now exercised through `public-islands.test.tsx` and `detail-islands.test.tsx`, driving line coverage from `71.52%` to `81.77%`.
- Admin CRUD surfaces remain well covered through page-level integration tests; shared admin widgets have dedicated unit tests.
- Unit vs integration classification now follows `gap-classification.md` path signals (`*Page*` → integration, `lib/**` and `shared/**` → unit), which lowers the unit file metric versus the prior audit that counted all tests as unit.
- E2E and accessibility tooling remain absent.

## Unit Tests

Tests that verify modules in isolation — no I/O, no external services.
Targets: utilities, hooks, guards, validation logic, shared components, state/context helpers.

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|-------|-------------:|----------------:|-------------------:|
| components | 8 | 0 | 0.0% |
| islands | 39 | 11 | 28.2% |
| lib | 8 | 6 | 75.0% |
| pages | 12 | 0 | 0.0% |
| **Total** | **67** | **17** | **25.4%** |

### Existing Unit Tests

| Scope | Test File | Approx. Tests | Modules Covered |
|-------|-----------|---------------|-----------------|
| lib | `src/lib/url.test.ts` | 2 | `src/lib/url.ts` |
| lib | `src/lib/markdown.test.ts` | 4 | `src/lib/markdown.ts` |
| lib | `src/lib/admin-security.test.ts` | 4 | `src/lib/admin-security.ts` |
| lib | `src/lib/admin-queries.test.ts` | 9 | `src/lib/admin-queries.ts` |
| lib | `src/lib/storage.test.ts` | 7 | `src/lib/storage.ts` |
| lib | `src/lib/queries.test.ts` | 6 | `src/lib/queries.ts` |
| islands | `src/islands/admin/auth/AuthProvider.test.tsx` | 4 | `src/islands/admin/auth/AuthProvider.tsx` |
| islands | `src/islands/admin/shared/ImageUpload.test.tsx` | 4 | `src/islands/admin/shared/ImageUpload.tsx` |
| islands | `src/islands/admin/shared/SlugField.test.tsx` | 3 | `src/islands/admin/shared/SlugField.tsx` |
| islands | `src/islands/admin/shared/StatusSelect.test.tsx` | 3 | `src/islands/admin/shared/StatusSelect.tsx` |
| islands | `src/islands/admin/shared/ContentForm.test.tsx` | 2 | `src/islands/admin/shared/ContentForm.tsx` |
| islands | `src/islands/admin/shared/FormFeedback.test.tsx` | 2 | `src/islands/admin/shared/FormFeedback.tsx` |
| islands | `src/islands/admin/layout/Toast.test.tsx` | 2 | `src/islands/admin/layout/Toast.tsx` |
| islands | `src/islands/admin/shared/ConfirmDialog.test.tsx` | 3 | `src/islands/admin/shared/ConfirmDialog.tsx` |
| islands | `src/islands/admin/shared/ContentTable.test.tsx` | 3 | `src/islands/admin/shared/ContentTable.tsx` |
| islands | `src/islands/admin/shared/MarkdownField.test.tsx` | 3 | `src/islands/admin/shared/MarkdownField.tsx` |
| islands | `src/islands/components/ProjectCard.test.tsx` | 2 | `src/islands/components/ProjectCard.tsx` |

### Unit Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/lib/supabase.ts` | lib | Client initialization, env validation, and singleton behavior |
| `src/lib/supabase-auth.ts` | lib | Auth client wiring and exported helper contracts |
| `src/islands/components/StatusBadge.tsx` | islands | Status label mapping and variant rendering |
| `src/islands/admin/layout/Sidebar.tsx` | islands | Active-nav rendering, sign-out affordance, and keyboard/label semantics |
| `src/islands/admin/auth/AuthCallback.tsx` | islands | Session restoration, success routing, and failure fallback |
| `src/islands/admin/AdminApp.tsx` | islands | Route switching, auth gating, and top-level shell behavior |
| `src/components/layout/Header.astro` | components | Nav link rendering and mobile-menu toggle markup |
| `src/components/layout/BaseLayout.astro` | components | Meta tags, analytics script inclusion, and layout slots |

---

## Integration Tests

Tests that verify components working together across boundaries — page rendering, Supabase reads/writes, auth, storage, and admin workflows.

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|-------|-------------:|----------------------:|--------------------------:|
| components | 8 | 0 | 0.0% |
| islands | 39 | 16 | 61.5% |
| lib | 8 | 0 | 0.0% |
| pages | 12 | 1 | 8.3% |
| **Total** | **67** | **18** | **37.3%** |

### Existing Integration Tests

| Scope | Test File | Approx. Tests | Boundaries Covered |
|-------|-----------|---------------|--------------------|
| islands | `src/islands/public-islands.test.tsx` | 8 | Public list/content islands with mocked `queries` and `markdown` |
| islands | `src/islands/detail-islands.test.tsx` | 4 | `NewsDetail`, `ProjectDetail`, `PageContent` fetch/render lifecycles |
| islands | `src/islands/admin/auth/LoginPage.test.tsx` | 3 | Magic-link submission, throttle path, non-allowlisted rejection |
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
| pages | `src/pages/admin-page.test.ts` | 2 | `src/pages/admin.astro` CSP, noindex, and referrer-policy source |

### Integration Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/islands/admin/AdminApp.tsx` | islands | Full client router, protected-route gating, and nested page mounting |
| `src/islands/admin/auth/AuthCallback.tsx` | islands | Magic-link return handling, session exchange, and redirect on failure |
| `src/islands/admin/layout/Sidebar.tsx` | islands | Navigation within `AdminLayout` and sign-out integration |
| `src/pages/index.astro` | pages | Hero, featured sections, and island hydration wiring |
| `src/pages/news/index.astro` | pages | News list page composition with `NewsList` island |
| `src/pages/projects/index.astro` | pages | Project list page composition with `ProjectList` island |
| `src/components/layout/BaseLayout.astro` | components | Full page shell with header/footer and analytics script |

---

## End-to-End (E2E) Tests

Tests that verify complete user journeys through the real application.

> **0** of **6** critical journeys covered · **6** gaps

### Existing E2E Tests

No E2E framework or E2E test files were found (`playwright/`, `cypress/`, `e2e/` absent).

### E2E Tests Needed

| User Journey | Priority | What to Cover |
|-------------|----------|---------------|
| Editor magic-link login | P1 | Request link, return to `/admin`, establish session, and land on dashboard |
| Unauthorized editor denial | P1 | Sign in with a non-allowlisted account and confirm access is blocked |
| Create and publish a project | P1 | Full admin create flow, publish, and verify public visibility |
| Create and publish a news article | P1 | Full admin create flow with Markdown and public detail-page verification |
| Upload and replace media | P1 | Add image, replace image, and verify resulting public URL behavior |
| Archive and delete content | P2 | Archive an item, confirm removal from public views, then permanently delete |

---

## Security Tests

Tests that verify authentication, authorization, input validation, and protection against common vulnerabilities.

> **7** of **8** security-sensitive areas covered · **1** gap

### Existing Security Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| lib | `src/lib/markdown.test.ts` | Markdown sanitization, unsafe URL neutralization, and safe data-image handling |
| lib | `src/lib/admin-security.test.ts` | Rate-limit helper behavior and retry timing |
| lib | `src/lib/url.test.ts` | Environment-derived staging/base-path behavior relevant to route construction |
| lib | `src/lib/admin-queries.test.ts` | Runtime validation, published-at normalization, and mutation error propagation |
| lib | `src/lib/storage.test.ts` | Upload validation, storage abuse controls, URL parsing, and replace-image behavior |
| islands | `src/islands/admin/auth/AuthProvider.test.tsx` | Session allowlist enforcement, mismatched-user rejection, sign-out reset |
| islands | `src/islands/admin/auth/LoginPage.test.tsx` | Login throttle behavior, normalized email submission, non-allowlisted OTP rejection |
| islands | `src/islands/admin/shared/ImageUpload.test.tsx` | Upload, replace, remove, and error-state behavior around admin media |
| pages | `src/pages/admin-page.test.ts` | Admin CSP, noindex, and strict referrer-policy source assertions |

### Security Tests Needed

| Area | Scope | What to Test |
|------|-------|--------------|
| Auth callback session handling | islands | `AuthCallback.tsx` — token exchange success, invalid/expired callback rejection, and safe redirect targets |

---

## Accessibility Tests

Tests that verify the application is usable by people with disabilities.

> **0** of **12** interactive components covered · **12** gaps

### Existing Accessibility Tests

No accessibility testing tooling (`jest-axe`, `axe-core`, `pa11y`) or assertions were found.

### Accessibility Tests Needed

| Component / Page | Scope | What to Test |
|-----------------|-------|--------------|
| `src/components/layout/Header.astro` | components | Keyboard navigation, mobile menu state, and aria attributes |
| `src/pages/index.astro` | pages | Landmark structure, heading order, and CTA accessibility |
| `src/pages/admin.astro` | pages | Admin shell semantics and noindex/structure smoke checks |
| `src/islands/admin/auth/LoginPage.tsx` | islands | Form labels, error messaging, and submit-button state |
| `src/islands/admin/shared/ContentForm.tsx` | islands | Focus order, submit states, and error feedback semantics |
| `src/islands/admin/shared/ConfirmDialog.tsx` | islands | Dialog labeling, focus trapping, and keyboard dismissal |
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
| `src/islands/admin/*/ProjectsListPage.test.tsx` (and sibling list pages) | Delete/archive branches have limited negative-path assertions | Row-action edge cases may regress silently |
| `src/islands/admin/shared/FormFeedback.test.tsx` | New focused unit coverage for a small presentational helper | Positive — closes a prior unit gap |

---

## Recommendations

1. **[P1]** Add integration tests for `AdminApp.tsx` and `AuthCallback.tsx` — these are the highest-risk uncovered auth/routing surfaces with `0%` line coverage.
2. **[P1]** Introduce Playwright (or Cypress) for the six critical editor journeys; no E2E framework exists today.
3. **[P2]** Add `jest-axe` smoke tests for admin forms, dialogs, and public interactive pages.
4. **[P2]** Add unit tests for `supabase.ts` / `supabase-auth.ts` client bootstrap and env guard behavior.
5. **[P3]** Add Astro component/render tests for layout shells (`BaseLayout`, `Header`) once integration gaps in pages are addressed.

## Acceptance Criteria

- [ ] Every scope has at least one dedicated automated test module
- [ ] All public data loaders and admin CRUD flows have at least one positive and one negative automated test
- [x] Critical security logic has automated tests (one auth-callback gap remains)
- [ ] Key editor journeys have E2E coverage
- [ ] Core interactive components have accessibility checks
- [x] Coverage tooling continues to run from `.sdgqalab/config.yml`
- [x] All tests pass: `npm run test`
