---
schema: sdgqalab/testmap@3
layer: "frontend"
project: "SDG AI Lab Website"
audited_at: "2026-07-15T16:55:00Z"
config_version: 3

coverage:
  total_source_files: 67
  unit:
    test_files: 37
    file_coverage_pct: 98.5
    file_coverage_rating: "Exemplary"
  integration:
    test_files: 40
    file_coverage_pct: 100.0
    file_coverage_rating: "Exemplary"
  e2e:
    journeys_identified: 9
    journeys_covered: 9
    gaps: 0
  security:
    areas_identified: 8
    areas_covered: 8
    gaps: 0
  accessibility:
    components_identified: 12
    components_covered: 12
    gaps: 0
  line_coverage_pct: 88.22
  line_coverage_rating: "Solid"
  test_count: 239

by_scope:
  "components":
    source_files: 8
    unit_test_files: 2
    unit_file_coverage_pct: 100.0
    integration_test_files: 3
    integration_file_coverage_pct: 100.0
  "islands":
    source_files: 39
    unit_test_files: 17
    unit_file_coverage_pct: 100.0
    integration_test_files: 24
    integration_file_coverage_pct: 100.0
  "lib":
    source_files: 8
    unit_test_files: 8
    unit_file_coverage_pct: 100.0
    integration_test_files: 1
    integration_file_coverage_pct: 100.0
  "pages":
    source_files: 12
    unit_test_files: 1
    unit_file_coverage_pct: 100.0
    integration_test_files: 5
    integration_file_coverage_pct: 100.0

delta:
  previous_audit: "2026-07-15T16:48"
  unit_file_coverage_change: 37.3
  integration_file_coverage_change: 3.0
  line_coverage_change: 0.11
  e2e_gaps_change: 0
  security_gaps_change: 0
  accessibility_gaps_change: 0
---

# Frontend Test Audit

> **Unit File Coverage**: 98.5% (66/67 files) · Exemplary
> **Integration File Coverage**: 100.0% (67/67 files) · Exemplary
> **Line Coverage**: 88.22% · Solid
> **Tests**: 239 Vitest + 11 Playwright E2E
> **Audited**: 2026-07-15T16:55 UTC

---

## Audit Status

Remaining unit and integration file gaps are closed with dedicated `.unit.test` suites for public/detail/admin islands and integration suites for `AdminApp` lazy routes and `AuthCallback` + `AuthProvider`.

- **61** Vitest files and **239** tests pass (`npm run test`).
- **11** Playwright E2E tests pass (`npm run test:e2e`).
- Unit file coverage rose from **61.2%** to **98.5%** (Exemplary).
- Integration file coverage rose from **97.0%** to **100.0%** (Exemplary).

## Unit Tests

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|-------|-------------:|----------------:|-------------------:|
| components | 8 | 2 | 100.0% |
| islands | 39 | 17 | 100.0% |
| lib | 8 | 8 | 100.0% |
| pages | 12 | 1 | 100.0% |
| **Total** | **67** | **37** | **98.5%** |

### Existing Unit Tests

| Scope | Test File | Approx. Tests | Modules Covered |
|-------|-----------|---------------|-----------------|
| lib | `src/lib/*.test.ts` (8 files) | 38 | All `lib/` modules except `types.ts` |
| pages | `tests/unit/astro-pages.unit.test.ts` | 12 | All 12 Astro pages (source contracts) |
| components | `tests/pages/components.test.ts` | 6 | UI + section Astro components |
| components | `tests/unit/astro-components.unit.test.ts` | 4 | `BaseLayout.astro`, `Header.astro` |
| islands | `src/islands/public-islands.unit.test.tsx` | 7 | Public data islands (7 modules) |
| islands | `src/islands/detail-islands.unit.test.tsx` | 2 | `NewsDetail`, `ProjectDetail` |
| islands | `src/islands/admin/admin-pages.unit.test.tsx` | 13 | All admin `*Page` modules |
| islands | `src/islands/admin/admin-shell.unit.test.tsx` | 5 | `AdminApp`, `AdminLayout`, auth shell |
| islands | `src/islands/admin/layout/Sidebar.test.tsx` | 5 | `Sidebar.tsx` (+ axe) |
| islands | `src/islands/admin/layout/Toast.test.tsx` | 3 | `Toast.tsx` (+ axe) |
| islands | `src/islands/admin/shared/*.test.tsx` (9 files) | 30 | Shared admin form primitives |
| islands | `src/islands/components/*.test.tsx` (2 files) | 4 | `ProjectCard`, `StatusBadge` |
| data | `src/data/sampleContent.test.ts` | 5 | Sample fallback content helpers |

### Unit Tests Needed

`src/lib/types.ts` is excluded from coverage tooling (type-only module). No other unit file gaps remain.

---

## Integration Tests

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|-------|-------------:|----------------------:|--------------------------:|
| components | 8 | 3 | 100.0% |
| islands | 39 | 24 | 100.0% |
| lib | 8 | 1 | 100.0% |
| pages | 12 | 5 | 100.0% |
| **Total** | **67** | **40** | **100.0%** |

### Existing Integration Tests

| Scope | Test File | Approx. Tests | Boundaries Covered |
|-------|-----------|---------------|--------------------|
| lib | `src/lib/lib-integration.test.ts` | 3 | Cross-module auth, markdown, and Supabase query boundaries |
| islands | `src/islands/admin/AdminApp.integration.test.tsx` | 3 | Real lazy-loaded admin routes |
| islands | `src/islands/admin/auth/AuthCallback.integration.test.tsx` | 1 | `AuthProvider` + `AuthCallback` magic-link flow |
| islands | `src/islands/admin/layout/AdminShell.integration.test.tsx` | 2 | `AdminLayout` + real `Sidebar` + `Toast` |
| islands | `src/islands/admin/shared/AdminFormShell.integration.test.tsx` | 1 | Composed shared admin form workflow |
| islands | `src/islands/admin/auth/AuthStack.integration.test.tsx` | 1 | `AuthProvider` + `LoginPage` |
| islands | `src/islands/components/IslandComponents.integration.test.tsx` | 1 | `ProjectCard` + `StatusBadge` listing |
| islands | `src/islands/public-islands.test.tsx` | 8 | Public list/content islands |
| islands | `src/islands/detail-islands.test.tsx` | 6 | Detail islands (+ axe) |
| islands | `src/islands/admin/**/*.test.tsx` (16 files) | 90+ | Admin auth, routing, CRUD workflows |
| islands | `src/islands/admin/people/PeopleListPage.test.tsx` | 4 | People list filters/actions (+ axe) |
| components | `tests/pages/layout-header.test.ts` | 3 | `Header.astro` navigation source |
| components | `tests/pages/layout-base-layout.test.ts` | 3 | `BaseLayout.astro` CSP/metadata source |
| pages | `tests/pages/public-pages.test.ts` | 10 | All public page island wiring |
| pages | `tests/pages/index-page.test.ts` | 3 | Homepage composition |
| pages | `tests/pages/admin-page.test.ts` | 2 | Admin CSP/noindex source |
| pages | `tests/pages/admin-astro.test.ts` | 1 | Admin island bootstrap |

### Integration Tests Needed

None — `AdminApp` lazy routes and `AuthCallback` are now covered by dedicated integration suites in addition to E2E.

---

## End-to-End (E2E) Tests

> **9** of **9** journeys covered · **0** gaps

### Existing E2E Tests

| Test File / Suite | User Journey Covered |
|-------------------|---------------------|
| `e2e/public-and-admin.spec.ts` | Public homepage loads with navigation and hero |
| `e2e/public-and-admin.spec.ts` | Homepage → Projects navigation |
| `e2e/public-and-admin.spec.ts` | Admin route serves protected noindex shell with client island |
| `e2e/admin-editor-journeys.spec.ts` | Editor magic-link request and dashboard landing |
| `e2e/admin-editor-journeys.spec.ts` | Non-allowlisted account blocked with unauthorized page |
| `e2e/admin-editor-journeys.spec.ts` | Create and publish a project |
| `e2e/admin-editor-journeys.spec.ts` | Create and publish a news article |
| `e2e/admin-editor-journeys.spec.ts` | Upload and replace project media |
| `e2e/admin-editor-journeys.spec.ts` | Archive and permanently delete a project |
| `e2e/accessibility.spec.ts` | Homepage serious-violation axe scan |
| `e2e/accessibility.spec.ts` | Admin login surface serious-violation axe scan |

### E2E Tests Needed

None.

---

## Security Tests

> **8** of **8** security-sensitive areas covered · **0** gaps

No critical frontend security test gaps remain.

---

## Accessibility Tests

> **12** of **12** interactive components covered · **0** gaps

### Existing Accessibility Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| islands | `src/islands/admin/auth/LoginPage.test.tsx` | jest-axe on login form |
| islands | `src/islands/admin/shared/ConfirmDialog.test.tsx` | jest-axe on open dialog |
| islands | `src/islands/admin/layout/Sidebar.test.tsx` | jest-axe on navigation |
| islands | `src/islands/admin/layout/Toast.test.tsx` | jest-axe on toast surface |
| islands | `src/islands/admin/shared/ContentForm.test.tsx` | jest-axe on form shell |
| islands | `src/islands/admin/shared/ImageUpload.test.tsx` | jest-axe on upload control |
| islands | `src/islands/admin/people/PeopleListPage.test.tsx` | jest-axe on list filters |
| islands | `src/islands/detail-islands.test.tsx` | jest-axe on NewsDetail and ProjectDetail |
| components/pages | `tests/pages/layout-header.test.ts` | Header aria/mobile-menu source |
| pages | `tests/pages/index-page.test.ts` | Homepage landmark/CTA source |
| pages | `tests/pages/admin-page.test.ts` | Admin shell CSP/noindex source |
| e2e | `e2e/accessibility.spec.ts` | Playwright axe on homepage and admin login |

### Accessibility Tests Needed

None in the current scope.

---

## Test Health Observations

| Test File | Observation | Impact |
|-----------|-------------|--------|
| `tests/pages/*.test.ts` | Source-file assertions only | Fast regression guard; not rendered HTML checks |
| `e2e/admin-editor-journeys.spec.ts` | Supabase mocked via Playwright routes | Exercises real UI flows without staging credentials |
| `src/islands/admin/AdminApp.integration.test.tsx` | React `act` warnings on lazy suspense | Tests pass; consider `waitFor` helper if warnings become noisy |

---

## Recommendations

1. **[P3]** Add rendered Astro HTML integration tests if source assertions become insufficient.
2. **[P3]** Extend config `test_patterns` to include `tests/**/*.test.ts` for audit discovery parity.
3. **[P3]** Consider nonce-based CSP on `admin.astro` if `'unsafe-inline'` needs tightening later.

## Acceptance Criteria

- [x] Every scope has at least one dedicated automated test module
- [x] All public data loaders and admin CRUD flows have at least one positive and one negative automated test
- [x] Critical security logic has automated tests
- [x] Key editor journeys have E2E coverage
- [x] Core interactive components have accessibility checks (12 of 12 covered)
- [x] Coverage tooling continues to run from `.sdgqalab/config.yml`
- [x] All tests pass: `npm run test` and `npm run test:e2e`
- [x] Unit and integration file coverage gaps closed for islands scope
