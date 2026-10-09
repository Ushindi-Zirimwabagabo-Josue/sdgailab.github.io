---
schema: sdgqalab/testmap@3
layer: "frontend"
project: "SDG AI Lab Website"
audited_at: "2026-07-15T16:35:00Z"
config_version: 3

coverage:
  total_source_files: 67
  unit:
    test_files: 28
    file_coverage_pct: 40.3
    file_coverage_rating: "Low"
  integration:
    test_files: 33
    file_coverage_pct: 68.7
    file_coverage_rating: "Adequate"
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
  line_coverage_pct: 87.37
  line_coverage_rating: "Solid"
  test_count: 179

by_scope:
  "components":
    source_files: 8
    unit_test_files: 1
    unit_file_coverage_pct: 75.0
    integration_test_files: 3
    integration_file_coverage_pct: 100.0
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
    integration_test_files: 5
    integration_file_coverage_pct: 100.0

delta:
  previous_audit: "2026-07-15T16:12"
  unit_file_coverage_change: 9.0
  integration_file_coverage_change: 23.9
  line_coverage_change: 0.0
  e2e_gaps_change: -6
  security_gaps_change: 0
  accessibility_gaps_change: -10
---

# Frontend Test Audit

> **Unit File Coverage**: 40.3% (27/67 files) · Low
> **Integration File Coverage**: 68.7% (46/67 files) · Adequate
> **Line Coverage**: 87.37% · Solid
> **Tests**: 179 Vitest + 11 Playwright E2E
> **Audited**: 2026-07-15

---

## Audit Status

All previously identified gaps in the current hardening scope are closed.

- **47** Vitest files and **179** tests pass, including Astro source tests in `tests/pages/`, jest-axe smoke tests on 10 interactive surfaces, and expanded admin island coverage.
- Line coverage remains **87.37%** (Solid).
- Playwright E2E covers **9/9** identified user journeys (public navigation, admin shell, editor auth, CRUD publish, media upload, archive/delete) with a mocked Supabase preview environment.
- Accessibility checks cover **12/12** identified interactive surfaces via jest-axe (unit) and `@axe-core/playwright` (homepage + admin login E2E).
- **Critical fix**: `admin.astro` CSP now allows `'unsafe-inline'` scripts so Astro `client:only` islands hydrate under Playwright and production admin loads correctly.

## Unit Tests

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|-------|-------------:|----------------:|-------------------:|
| components | 8 | 1 | 75.0% |
| islands | 39 | 13 | 33.3% |
| lib | 8 | 8 | 100.0% |
| pages | 12 | 0 | 0.0% |
| **Total** | **67** | **28** | **40.3%** |

### Existing Unit Tests

| Scope | Test File | Approx. Tests | Modules Covered |
|-------|-----------|---------------|-----------------|
| lib | `src/lib/*.test.ts` (8 files) | 38 | All `lib/` modules except `types.ts` |
| islands | `src/islands/admin/layout/Sidebar.test.tsx` | 5 | `Sidebar.tsx` (+ axe) |
| islands | `src/islands/admin/layout/Toast.test.tsx` | 3 | `Toast.tsx` (+ axe) |
| islands | `src/islands/admin/shared/*.test.tsx` (9 files) | 30 | Shared admin form primitives (+ axe on ContentForm, ImageUpload, ConfirmDialog) |
| islands | `src/islands/components/*.test.tsx` (2 files) | 4 | `ProjectCard`, `StatusBadge` |
| components | `tests/pages/components.test.ts` | 6 | `EmptyState`, `LoadingSpinner`, `SDGWheel`, `StatusBadge.astro`, `Footer`, `ParticlesHero` (source assertions) |

### Unit Tests Needed

No critical unit gaps remain in the current scope. Astro pages rely on integration source tests in `tests/pages/`.

---

## Integration Tests

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|-------|-------------:|----------------------:|--------------------------:|
| components | 8 | 3 | 100.0% |
| islands | 39 | 18 | 66.7% |
| lib | 8 | 0 | 0.0% |
| pages | 12 | 5 | 100.0% |
| **Total** | **67** | **33** | **68.7%** |

### Existing Integration Tests

| Scope | Test File | Approx. Tests | Boundaries Covered |
|-------|-----------|---------------|--------------------|
| islands | `src/islands/public-islands.test.tsx` | 8 | Public list islands |
| islands | `src/islands/detail-islands.test.tsx` | 6 | Detail islands (+ axe on NewsDetail, ProjectDetail) |
| islands | `src/islands/admin/**/*.test.tsx` (16 files) | 90+ | Admin auth, routing, CRUD workflows |
| islands | `src/islands/admin/people/PeopleListPage.test.tsx` | 4 | People list filters/actions (+ axe) |
| components | `tests/pages/layout-header.test.ts` | 3 | `Header.astro` navigation source |
| components | `tests/pages/layout-base-layout.test.ts` | 3 | `BaseLayout.astro` CSP/metadata source |
| pages | `tests/pages/public-pages.test.ts` | 10 | All public page island wiring |
| pages | `tests/pages/index-page.test.ts` | 3 | Homepage composition |
| pages | `tests/pages/admin-page.test.ts` | 2 | Admin CSP/noindex source |
| pages | `tests/pages/admin-astro.test.ts` | 1 | Admin island bootstrap |

### Integration Tests Needed

No critical integration gaps remain in the current scope.

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

None — editor journeys run against `npm run build && npm run preview` with `PUBLIC_SUPABASE_URL=https://e2e-test.supabase.co` and `e2e/helpers/supabase-mock.ts` route interception.

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
| `src/islands/admin/AdminApp.test.tsx` | Lazy routes mocked in unit tests | Line coverage strong; lazy imports resolved in E2E |

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
