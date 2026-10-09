---
schema: sdgqalab/testmap@3
layer: "frontend"
project: "SDG AI Lab Website"
audited_at: "2026-07-22T14:48:00Z"
config_version: 3

coverage:
  total_source_files: 73
  unit:
    test_files: 33
    file_coverage_pct: 93.2
    file_coverage_rating: "Exemplary"
  integration:
    test_files: 32
    file_coverage_pct: 95.9
    file_coverage_rating: "Exemplary"
  e2e:
    journeys_identified: 14
    journeys_covered: 14
    gaps: 0
  security:
    areas_identified: 9
    areas_covered: 9
    gaps: 0
  accessibility:
    components_identified: 14
    components_covered: 8
    gaps: 6
  line_coverage_pct: 87.5
  line_coverage_rating: "Solid"
  test_count: 277

by_scope:
  "components":
    source_files: 8
    unit_test_files: 1
    unit_file_coverage_pct: 37.5
    integration_test_files: 4
    integration_file_coverage_pct: 100.0
  "islands":
    source_files: 39
    unit_test_files: 19
    unit_file_coverage_pct: 100.0
    integration_test_files: 23
    integration_file_coverage_pct: 100.0
  "lib":
    source_files: 10
    unit_test_files: 11
    unit_file_coverage_pct: 100.0
    integration_test_files: 1
    integration_file_coverage_pct: 70.0
  "pages":
    source_files: 16
    unit_test_files: 3
    unit_file_coverage_pct: 100.0
    integration_test_files: 9
    integration_file_coverage_pct: 100.0

delta:
  previous_audit: "2026-07-22T14:33"
  unit_file_coverage_change: 5.5
  integration_file_coverage_change: 6.9
  line_coverage_change: -0.16
  e2e_gaps_change: 0
  security_gaps_change: 0
  accessibility_gaps_change: 0
---

# Frontend Test Audit

> **Unit File Coverage**: 93.2% (68/73 files) · Exemplary
> **Integration File Coverage**: 95.9% (70/73 files) · Exemplary
> **Line Coverage**: 87.5% · Solid
> **Tests**: 277 Vitest + 14 Playwright E2E
> **Audited**: 2026-07-22T14:48 UTC

---

## Audit Status

P1 page test gaps are **closed**. All 16 `pages/` source files now have mapped unit and integration coverage, including the four files added in this sprint.

- **66** Vitest files and **277** tests pass (`npm run test`).
- **14** Playwright E2E tests pass across 4 spec files (`npm run test:e2e`).
- Line coverage **87.5%** (Solid).
- Remaining gaps are **accessibility** (6 admin form components) and **component-scope unit contracts** (5 Astro UI files integration-only).

## Unit Tests

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|-------|-------------:|----------------:|-------------------:|
| components | 8 | 1 | 37.5% |
| islands | 39 | 19 | 100.0% |
| lib | 10 | 11 | 100.0% |
| pages | 16 | 3 | 100.0% |
| **Total** | **73** | **33** | **93.2%** |

### Existing Unit Tests

| Scope | Test File | Approx. Tests | Modules Covered |
|-------|-----------|---------------|-----------------|
| pages | `tests/unit/astro-pages.unit.test.ts` | 14 | All 14 Astro pages (source contracts) |
| pages | `tests/unit/page-endpoints.unit.test.ts` | 4 | `robots.txt.ts`, `sitemap.xml.ts` |
| lib | `src/lib/*.test.ts` (11 files) | 55 | All `lib/` modules |
| components | `tests/unit/astro-components.unit.test.ts` | 4 | `BaseLayout.astro`, `Header.astro` |
| islands | `src/islands/**/*.unit.test.tsx` (3 files) | 15 | Public/detail/admin page modules |
| islands | `src/islands/admin/shared/*.test.tsx` (9 files) | 30 | Shared admin form primitives |
| islands | `src/islands/components/*.test.tsx` (2 files) | 4 | `ProjectCard`, `StatusBadge` |
| islands | `src/islands/admin/auth/*.test.tsx` (4 files) | 18 | Auth shell modules |
| data | `src/data/sampleContent.test.ts` | 6 | Sample fallback content helpers |

### Unit Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/components/layout/Footer.astro` | components | Dedicated source contract (currently integration-only) |
| `src/components/sections/ParticlesHero.astro` | components | Dedicated source contract |
| `src/components/ui/EmptyState.astro` | components | Dedicated source contract |
| `src/components/ui/LoadingSpinner.astro` | components | Dedicated source contract |
| `src/components/ui/SDGWheel.astro` | components | Dedicated source contract |

---

## Integration Tests

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|-------|-------------:|----------------------:|--------------------------:|
| components | 8 | 4 | 100.0% |
| islands | 39 | 23 | 100.0% |
| lib | 10 | 1 | 70.0% |
| pages | 16 | 9 | 100.0% |
| **Total** | **73** | **32** | **95.9%** |

### Existing Integration Tests

| Scope | Test File | Approx. Tests | Boundaries Covered |
|-------|-----------|---------------|--------------------|
| pages | `tests/pages/public-pages.test.ts` | 12 | All public Astro pages incl. `launch-readiness`, `resources` |
| pages | `tests/unit/page-endpoints.unit.test.ts` | 4 | `robots.txt` and `sitemap.xml` HTTP handlers |
| components | `tests/integration/astro-components.integration.test.ts` | 11 | Astro layout/UI composition |
| components | `tests/pages/components.test.ts` | 6 | UI + section Astro components |
| lib | `src/lib/lib-integration.test.ts` | 3 | Cross-module auth and query boundaries |
| islands | `src/islands/admin/*.integration.test.tsx` (6 files) | 12 | Admin shell, lazy routes, auth callback |
| islands | `src/islands/public-islands.test.tsx` | 9 | Public list/content islands |
| islands | `src/islands/detail-islands.test.tsx` | 6 | Detail islands (+ axe) |
| islands | `src/islands/admin/**/*.test.tsx` (17 files) | 95+ | Admin CRUD workflows |
| pages | `tests/pages/index-page.test.ts` | 3 | Homepage composition |
| pages | `tests/pages/admin-page.test.ts` | 2 | Admin CSP/noindex source |
| pages | `tests/pages/admin-astro.test.ts` | 1 | Admin island bootstrap |
| pages | `tests/pages/layout-*.test.ts` | 6 | Header/base layout source |

### Integration Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/lib/auth-callback.ts` | lib | Cross-module flow with `AuthCallback` + `AuthProvider` in `lib-integration.test.ts` |
| `src/lib/magic-link-errors.ts` | lib | Error mapping surfaced through `LoginPage` for all codes |
| `src/lib/storage.ts` | lib | Upload path integration with admin form workflows |

---

## End-to-End (E2E) Tests

> **14** of **14** critical journeys covered · **0** gaps

### Existing E2E Tests

| Test File / Suite | User Journey Covered |
|-------------------|---------------------|
| `e2e/public-and-admin.spec.ts` | Public homepage loads with navigation and hero |
| `e2e/public-and-admin.spec.ts` | Homepage → Projects navigation |
| `e2e/public-and-admin.spec.ts` | Admin route serves protected noindex shell with client island |
| `e2e/cms-pages.spec.ts` | About page hydrates CMS content sections |
| `e2e/cms-pages.spec.ts` | Volunteer page hydrates CMS content |
| `e2e/cms-pages.spec.ts` | Team page finishes loading people grid |
| `e2e/admin-editor-journeys.spec.ts` | Editor magic-link request and dashboard landing |
| `e2e/admin-editor-journeys.spec.ts` | Non-allowlisted account blocked with unauthorized page |
| `e2e/admin-editor-journeys.spec.ts` | Create and publish a project |
| `e2e/admin-editor-journeys.spec.ts` | Create and publish a news article |
| `e2e/admin-editor-journeys.spec.ts` | Upload and replace project media |
| `e2e/admin-editor-journeys.spec.ts` | Archive and permanently delete a project |
| `e2e/accessibility.spec.ts` | Homepage serious-violation axe scan |
| `e2e/accessibility.spec.ts` | Admin login surface serious-violation axe scan |

### E2E Tests Needed

None for identified critical journeys.

---

## Security Tests

> **9** of **9** security-sensitive areas covered · **0** gaps

No security test gaps remain.

---

## Accessibility Tests

> **8** of **14** interactive components covered · **6** gaps

### Accessibility Tests Needed

| Component / Page | Scope | What to Test |
|-----------------|-------|--------------|
| `ContentTable.tsx` | islands | jest-axe smoke on table actions |
| `StatusSelect.tsx` | islands | Label association and keyboard use |
| `MarkdownField.tsx` | islands | Editor label/preview semantics |
| `SlugField.tsx` | islands | Input label and error states |
| `StatsCards.tsx` | islands | jest-axe after `aria-label` additions |
| `FormFeedback.tsx` | islands | Error/status announcement semantics |

---

## Test Health Observations

| Test File | Observation | Impact |
|-----------|-------------|--------|
| `tests/unit/page-endpoints.unit.test.ts` | Imports and executes `GET` handlers directly | Closes page endpoint gaps without Astro dev server |
| `tests/pages/*.test.ts` | Source-file assertions only | Fast regression guard; not rendered HTML checks |
| `src/lib/admin-security.ts` | 50.5% line coverage | `getAuthorizedAdmin` paths lightly exercised |
| `AdminApp.integration.test.tsx` | React `act(...)` warnings on lazy suspend | Tests pass; consider wrapping suspense resolution |

---

## Recommendations

1. **[P2]** Add jest-axe smoke tests for `ContentTable`, `StatusSelect`, `StatsCards`, and `MarkdownField`.
2. **[P3]** Add dedicated unit source contracts for the five Astro UI components currently covered only via integration tests.
3. **[P3]** Extend `lib-integration.test.ts` for `auth-callback` and `magic-link-errors` composed flows.

## Acceptance Criteria

- [x] Every page source file has a dedicated test module (16/16)
- [x] All public data loaders and admin CRUD flows have positive and negative automated tests
- [x] Critical security logic has automated tests (9/9 areas)
- [x] Key editor journeys have E2E coverage (14/14)
- [ ] Core interactive components have accessibility checks (8/14 covered)
- [x] Coverage tooling runs from `.sdgqalab/config.yml`
- [x] All tests pass: `npm run test` and `npm run test:coverage`
