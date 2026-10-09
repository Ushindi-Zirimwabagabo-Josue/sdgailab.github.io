---
schema: sdgqalab/testmap@3
layer: "frontend"
project: "SDG AI Lab Website"
audited_at: "2026-07-15T17:00:00Z"
config_version: 3

coverage:
  total_source_files: 67
  unit:
    test_files: 30
    file_coverage_pct: 98.5
    file_coverage_rating: "Exemplary"
  integration:
    test_files: 31
    file_coverage_pct: 89.6
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
    unit_test_files: 3
    unit_file_coverage_pct: 100.0
    integration_test_files: 0
    integration_file_coverage_pct: 12.5
  "islands":
    source_files: 39
    unit_test_files: 16
    unit_file_coverage_pct: 100.0
    integration_test_files: 26
    integration_file_coverage_pct: 100.0
  "lib":
    source_files: 7
    unit_test_files: 8
    unit_file_coverage_pct: 100.0
    integration_test_files: 1
    integration_file_coverage_pct: 100.0
  "pages":
    source_files: 12
    unit_test_files: 1
    unit_file_coverage_pct: 100.0
    integration_test_files: 4
    integration_file_coverage_pct: 100.0

delta:
  previous_audit: "2026-07-15T16:55"
  unit_file_coverage_change: 0.0
  integration_file_coverage_change: -10.4
  line_coverage_change: 0.0
  e2e_gaps_change: 0
  security_gaps_change: 0
  accessibility_gaps_change: 0
---

# Frontend Test Audit

> **Unit File Coverage**: 98.5% (66/67 files) · Exemplary
> **Integration File Coverage**: 89.6% (60/67 files) · Exemplary
> **Line Coverage**: 88.22% · Solid
> **Tests**: 239 Vitest + 11 Playwright E2E
> **Audited**: 2026-07-15T17:00 UTC

---

## Audit Status

Full testmap re-run confirms the gap-closing work from this session. All tests pass. Structural analysis now distinguishes unit source-contract tests from integration coverage — seven static Astro components have unit tests but no integration-classified tests.

- **61** Vitest files and **239** tests pass (`npm run test`).
- **11** Playwright E2E tests pass (`npm run test:e2e`).
- Line coverage **88.22%** from `npm run test:coverage`.
- E2E, security, and accessibility gap counts remain **0**.

## Unit Tests

Tests that verify modules in isolation — no I/O, no external services.

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|-------|-------------:|----------------:|-------------------:|
| components | 8 | 3 | 100.0% |
| islands | 39 | 16 | 100.0% |
| lib | 7 | 8 | 100.0% |
| pages | 12 | 1 | 100.0% |
| **Total** | **67** | **30** | **98.5%** |

### Existing Unit Tests

| Scope | Test File | Approx. Tests | Modules Covered |
|-------|-----------|---------------|-----------------|
| lib | `src/lib/*.test.ts` (8 files) | 41 | All `lib/` modules except `types.ts` |
| pages | `tests/unit/astro-pages.unit.test.ts` | 12 | All 12 Astro pages (source contracts) |
| components | `tests/pages/components.test.ts` | 6 | UI + section Astro components |
| components | `tests/unit/astro-components.unit.test.ts` | 4 | `BaseLayout.astro`, `Header.astro` |
| components | `tests/pages/layout-header.test.ts` | 3 | `Header.astro` navigation source |
| components | `tests/pages/layout-base-layout.test.ts` | 3 | `BaseLayout.astro` CSP/metadata source |
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

| File | Scope | What to Test |
|------|-------|--------------|
| `src/lib/types.ts` | lib | Type-only module — excluded from coverage tooling; no runtime tests required |

---

## Integration Tests

Tests that verify components working together across boundaries.

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|-------|-------------:|----------------------:|--------------------------:|
| components | 8 | 0 | 12.5% |
| islands | 39 | 26 | 100.0% |
| lib | 7 | 1 | 100.0% |
| pages | 12 | 4 | 100.0% |
| **Total** | **67** | **31** | **89.6%** |

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
| pages | `tests/pages/public-pages.test.ts` | 10 | All public page island wiring |
| pages | `tests/pages/index-page.test.ts` | 3 | Homepage composition |
| pages | `tests/pages/admin-page.test.ts` | 2 | Admin CSP/noindex source |
| pages | `tests/pages/admin-astro.test.ts` | 1 | Admin island bootstrap |

### Integration Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/components/ui/SDGWheel.astro` | components | Rendered HTML integration or page-level composition test |
| `src/components/ui/LoadingSpinner.astro` | components | Rendered status semantics in a page context |
| `src/components/ui/EmptyState.astro` | components | Rendered empty-state messaging |
| `src/components/sections/ParticlesHero.astro` | components | Hero slot + reduced-motion behaviour in composed page |
| `src/components/layout/Header.astro` | components | Rendered navigation integration (beyond source contracts) |
| `src/components/layout/Footer.astro` | components | Rendered footer links in page layout |
| `src/components/layout/BaseLayout.astro` | components | Rendered CSP/meta tags in full page output |

> These Astro components have **unit** source-contract tests in `tests/pages/components.test.ts` and `tests/pages/layout-*.test.ts`. Integration gaps reflect missing render-level or composed-page tests per testmap classification rules.

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

### Existing Security Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| lib | `src/lib/admin-security.test.ts` | Rate limiting, email normalization, editor allowlist |
| lib | `src/lib/supabase-auth.test.ts` | Auth client configuration |
| lib | `src/lib/storage.test.ts` | Upload path validation and bucket rules |
| lib | `src/lib/markdown.test.ts` | Markdown sanitization |
| lib | `src/lib/lib-integration.test.ts` | Cross-module auth boundary |
| islands | `src/islands/admin/auth/AuthProvider.test.tsx` | Editor authorization gate |
| islands | `src/islands/admin/auth/LoginPage.test.tsx` | Magic-link request flow |
| islands | `src/islands/admin/AdminApp.test.tsx` | Unauthorized editor page |

### Security Tests Needed

None in the current scope.

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
| `src/islands/admin/AdminApp.integration.test.tsx` | React `act` warnings on lazy suspense | Tests pass; optional `waitFor` helper if warnings become noisy |
| `.sdgqalab/config.yml` | `test_patterns` omits `tests/**` | Audit relies on manual discovery of `tests/` suite |

---

## Recommendations

1. **[P3]** Add rendered Astro HTML integration tests for the seven static components flagged above.
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
- [ ] Rendered integration tests for all Astro layout/UI components (7 remaining)
