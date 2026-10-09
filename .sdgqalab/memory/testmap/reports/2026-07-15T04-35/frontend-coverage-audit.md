---
schema: sdgqalab/testmap@3
layer: "frontend"
project: "SDG AI Lab Website"
audited_at: "2026-07-15T04:35:00+02:00"
config_version: 3

coverage:
  total_source_files: 68
  unit:
    test_files: 29
    file_coverage_pct: 42.6
    file_coverage_rating: "Low"
  integration:
    test_files: 0
    file_coverage_pct: 0.0
    file_coverage_rating: "Critical"
  e2e:
    journeys_identified: 6
    journeys_covered: 0
    gaps: 6
  security:
    areas_identified: 8
    areas_covered: 8
    gaps: 0
  accessibility:
    components_identified: 12
    components_covered: 0
    gaps: 12
  line_coverage_pct: 66.47
  line_coverage_rating: "Adequate"
  test_count: 98

by_scope:
  "components":
    source_files: 8
    unit_test_files: 0
    unit_file_coverage_pct: 0.0
    integration_test_files: 0
    integration_file_coverage_pct: 0.0
  "islands":
    source_files: 39
    unit_test_files: 22
    unit_file_coverage_pct: 56.4
    integration_test_files: 0
    integration_file_coverage_pct: 0.0
  "lib":
    source_files: 8
    unit_test_files: 6
    unit_file_coverage_pct: 75.0
    integration_test_files: 0
    integration_file_coverage_pct: 0.0
  "pages":
    source_files: 12
    unit_test_files: 1
    unit_file_coverage_pct: 8.3
    integration_test_files: 0
    integration_file_coverage_pct: 0.0

delta:
  previous_audit: "2026-07-15T04:23"
  unit_file_coverage_change: 10.2
  integration_file_coverage_change: 0.0
  line_coverage_change: 15.81
  e2e_gaps_change: 0
  security_gaps_change: 0
  accessibility_gaps_change: 0
---

# Frontend Test Audit

> **Unit File Coverage**: 42.6% (29/68 files) - Low
> **Integration File Coverage**: 0.0% (0/68 files) - Critical
> **Line Coverage**: 66.47% - Adequate
> **Tests**: 98
> **Audited**: 2026-07-15

---

## Audit Status

This audit includes a working coverage-tool run via `vitest run --coverage`.

- A working Vitest setup is present in the repo.
- Twenty-nine automated test files now cover library logic, admin auth, admin login behavior, admin media upload behavior, admin project/news/statistics/page-content/partner/people form behavior, admin list surfaces, shared dialog/table/slug/status/content-form helpers, toast behavior, and project-card rendering.
- Security-targeted structural coverage remains strong for the current frontend hardening scope.
- The reported line coverage reflects both `src/lib/**/*.ts` and `src/islands/**/*.tsx`.
- Coverage is now materially stronger across `src/islands/admin/**`, with most CRUD forms and list pages sitting above 90% file-level line coverage.

## Unit Tests

Tests that verify modules in isolation - no I/O, no external services.
Targets: utilities, hooks, guards, validation logic, shared components, state/context helpers.

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|-------|-------------:|----------------:|-------------------:|
| components | 8 | 0 | 0.0% |
| islands | 39 | 22 | 56.4% |
| lib | 8 | 6 | 75.0% |
| pages | 12 | 1 | 8.3% |
| **Total** | **68** | **29** | **42.6%** |

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
| islands | `src/islands/admin/auth/LoginPage.test.tsx` | 3 | `src/islands/admin/auth/LoginPage.tsx` |
| islands | `src/islands/admin/shared/ImageUpload.test.tsx` | 4 | `src/islands/admin/shared/ImageUpload.tsx` |
| islands | `src/islands/admin/shared/SlugField.test.tsx` | 3 | `src/islands/admin/shared/SlugField.tsx` |
| islands | `src/islands/admin/shared/StatusSelect.test.tsx` | 3 | `src/islands/admin/shared/StatusSelect.tsx` |
| islands | `src/islands/admin/shared/ContentForm.test.tsx` | 2 | `src/islands/admin/shared/ContentForm.tsx` |
| islands | `src/islands/admin/layout/Toast.test.tsx` | 2 | `src/islands/admin/layout/Toast.tsx` |
| islands | `src/islands/admin/projects/ProjectFormPage.test.tsx` | 3 | `src/islands/admin/projects/ProjectFormPage.tsx` |
| islands | `src/islands/admin/news/NewsFormPage.test.tsx` | 3 | `src/islands/admin/news/NewsFormPage.tsx` |
| islands | `src/islands/admin/statistics/StatisticFormPage.test.tsx` | 2 | `src/islands/admin/statistics/StatisticFormPage.tsx` |
| islands | `src/islands/admin/statistics/StatisticsListPage.test.tsx` | 3 | `src/islands/admin/statistics/StatisticsListPage.tsx` |
| islands | `src/islands/admin/page-content/PageContentFormPage.test.tsx` | 3 | `src/islands/admin/page-content/PageContentFormPage.tsx` |
| islands | `src/islands/admin/page-content/PageContentListPage.test.tsx` | 3 | `src/islands/admin/page-content/PageContentListPage.tsx` |
| islands | `src/islands/admin/partners/PartnerFormPage.test.tsx` | 3 | `src/islands/admin/partners/PartnerFormPage.tsx` |
| islands | `src/islands/admin/partners/PartnersListPage.test.tsx` | 3 | `src/islands/admin/partners/PartnersListPage.tsx` |
| islands | `src/islands/admin/people/PersonFormPage.test.tsx` | 3 | `src/islands/admin/people/PersonFormPage.tsx` |
| islands | `src/islands/admin/people/PeopleListPage.test.tsx` | 3 | `src/islands/admin/people/PeopleListPage.tsx` |
| islands | `src/islands/admin/news/NewsListPage.test.tsx` | 3 | `src/islands/admin/news/NewsListPage.tsx` |
| islands | `src/islands/admin/projects/ProjectsListPage.test.tsx` | 3 | `src/islands/admin/projects/ProjectsListPage.tsx` |
| islands | `src/islands/admin/shared/ConfirmDialog.test.tsx` | 3 | `src/islands/admin/shared/ConfirmDialog.tsx` |
| islands | `src/islands/admin/shared/ContentTable.test.tsx` | 3 | `src/islands/admin/shared/ContentTable.tsx` |
| islands | `src/islands/components/ProjectCard.test.tsx` | 2 | `src/islands/components/ProjectCard.tsx` |
| pages | `src/pages/admin-page.test.ts` | 2 | `src/pages/admin.astro` |

### Unit Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/islands/admin/layout/AdminLayout.tsx` | islands | Layout rendering, current-path highlighting, and slot behavior |
| `src/islands/admin/layout/Sidebar.tsx` | islands | Active-nav rendering, sign-out affordance, and keyboard/label semantics |
| `src/islands/admin/dashboard/DashboardPage.tsx` | islands | Loading, retry, and dashboard-card rendering behavior |
| `src/islands/admin/auth/AuthCallback.tsx` | islands | Session restoration, success routing, and failure fallback |
| `src/islands/admin/shared/MarkdownField.tsx` | islands | Editor value changes, toolbar wiring, and preview/sanitization handoff |
| `src/islands/admin/shared/FormFeedback.tsx` | islands | Success/error visual state and aria semantics |
| `src/islands/AdminApp.tsx` | islands | Route switching, auth gating, and top-level shell behavior |
| `src/islands/FeaturedProjects.tsx` | islands | Loading/error/empty states and project-card list rendering |
| `src/islands/NewsList.tsx` | islands | Fetch lifecycle, sorting, and result rendering |

---

## Integration Tests

Tests that verify components working together across boundaries - page rendering, Supabase reads/writes, auth, storage, and admin workflows.

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|-------|-------------:|----------------------:|--------------------------:|
| components | 8 | 0 | 0.0% |
| islands | 39 | 0 | 0.0% |
| lib | 8 | 0 | 0.0% |
| pages | 12 | 0 | 0.0% |
| **Total** | **68** | **0** | **0.0%** |

### Existing Integration Tests

No integration test files were found.

### Integration Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/islands/PageContent.tsx` | islands | Supabase content fetch, fallback/error states, and sanitized HTML rendering |
| `src/islands/NewsDetail.tsx` | islands | Article loading, missing-content path, metadata rendering, and Markdown display |
| `src/islands/ProjectDetail.tsx` | islands | Project fetch, detail rendering, and content fallback behavior |
| `src/islands/admin/auth/LoginPage.tsx` | islands | Magic-link submission, throttle error path, and non-allowlisted response handling with mocked auth boundary |
| `src/islands/admin/shared/ImageUpload.tsx` | islands | Upload, replace, and remove flows with mocked storage responses in surrounding forms |
| `src/islands/admin/projects/ProjectFormPage.tsx` | islands | Create/update workflow, validation errors, and success navigation |
| `src/islands/admin/news/NewsFormPage.tsx` | islands | Create/update workflow, validation errors, and draft/published behavior |
| `src/islands/admin/statistics/StatisticsListPage.tsx` | islands | List fetch, archive/delete actions, and loading/error states |
| `src/pages/admin.astro` | pages | Admin shell bootstrapping and client-only app rendering |

---

## End-to-End (E2E) Tests

Tests that verify complete user journeys through the real application.

> **0** of **6** critical journeys covered - **6** gaps

### Existing E2E Tests

No E2E framework or E2E test files were found.

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

> **8** of **8** security-sensitive areas covered - **0** gaps

### Existing Security Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| lib | `src/lib/markdown.test.ts` | Markdown sanitization, unsafe URL neutralization, and safe data-image handling |
| lib | `src/lib/admin-security.test.ts` | Rate-limit helper behavior and retry timing |
| lib | `src/lib/url.test.ts` | Environment-derived staging/base-path behavior relevant to route construction |
| lib | `src/lib/admin-queries.test.ts` | Runtime validation, published-at normalization, mutation wrapper usage, and mutation/query error propagation |
| lib | `src/lib/storage.test.ts` | Upload validation, storage abuse controls, URL parsing, and replace-image behavior |
| islands | `src/islands/admin/auth/AuthProvider.test.tsx` | Session allowlist enforcement, mismatched-user rejection, sign-out reset, and auth-state subscriptions |
| islands | `src/islands/admin/auth/LoginPage.test.tsx` | Login throttle behavior, normalized email submission, and non-allowlisted OTP rejection guidance |
| islands | `src/islands/admin/shared/ImageUpload.test.tsx` | Upload, replace, remove, and error-state behavior around admin media management |
| pages | `src/pages/admin-page.test.ts` | Admin CSP, noindex, and strict referrer-policy source assertions |

### Security Tests Needed

No critical frontend security test gaps remain in the current hardening scope.

---

## Accessibility Tests

Tests that verify the application is usable by people with disabilities.

> **0** of **12** interactive components covered - **12** gaps

### Existing Accessibility Tests

No accessibility testing tooling or assertions were found.

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

The current unit tests are focused and deterministic. The biggest remaining gap is no longer admin CRUD basics; it is the still-uncovered public-content islands, top-level admin shell/layout surfaces, and the complete absence of integration, E2E, and accessibility coverage.

---

## Recommendations

1. **[P1]** Add focused UI tests for `AdminApp`, dashboard/layout shells, and the remaining public-content islands to keep converting zero-coverage surfaces into maintained baselines.
2. **[P1]** Add integration tests around the admin auth, CRUD, and storage workflows because these are still the highest-risk uncovered user paths.
3. **[P2]** Introduce an E2E framework for the core editor journeys once the integration layer is in place.
4. **[P2]** Add accessibility smoke tests (for example axe-based checks) for the admin UI and public interactive components.

## Acceptance Criteria

- [ ] Every scope has at least one dedicated automated test module
- [ ] All public data loaders and admin CRUD flows have at least one positive and one negative automated test
- [x] Critical security logic has automated tests
- [ ] Key editor journeys have E2E coverage
- [ ] Core interactive components have accessibility checks
- [x] Coverage tooling continues to run from `.sdgqalab/config.yml`
- [x] All tests pass: `npm run test`
