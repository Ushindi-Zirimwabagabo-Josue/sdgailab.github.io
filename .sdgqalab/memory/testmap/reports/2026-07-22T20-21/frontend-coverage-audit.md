---
schema: sdgqalab/testmap@3
layer: "frontend"
project: "SDG AI Lab Website"
audited_at: "2026-07-22T20:21:00Z"
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
    components_covered: 14
    gaps: 0
  line_coverage_pct: 87.66
  line_coverage_rating: "Solid"
  test_count: 283

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
  previous_audit: "2026-07-22T14:48"
  unit_file_coverage_change: 0.0
  integration_file_coverage_change: 0.0
  line_coverage_change: 0.16
  e2e_gaps_change: 0
  security_gaps_change: 0
  accessibility_gaps_change: -6
---

# Frontend Test Audit

> **Unit File Coverage**: 93.2% (68/73 files) · Exemplary
> **Integration File Coverage**: 95.9% (70/73 files) · Exemplary
> **Line Coverage**: 87.66% · Solid
> **Tests**: 283 Vitest + 14 Playwright E2E
> **Audited**: 2026-07-22T20:21 UTC

---

## Audit Status

P2 accessibility gaps are **closed**. All 14 identified interactive components now have jest-axe smoke coverage, including the six admin/public surfaces added in this sprint.

- **66** Vitest files and **283** tests pass (`npm run test`).
- **14** Playwright E2E tests pass across 4 spec files (`npm run test:e2e`).
- Line coverage **87.66%** (Solid).
- Remaining optional work is **P3**: Astro UI unit contracts and `lib-integration` extensions.

## Unit Tests

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|-------|-------------:|----------------:|-------------------:|
| components | 8 | 1 | 37.5% |
| islands | 39 | 19 | 100.0% |
| lib | 10 | 11 | 100.0% |
| pages | 16 | 3 | 100.0% |
| **Total** | **73** | **33** | **93.2%** |

### Unit Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/components/layout/Footer.astro` | components | Dedicated source contract (integration-only today) |
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

### Integration Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/lib/auth-callback.ts` | lib | Cross-module flow in `lib-integration.test.ts` |
| `src/lib/magic-link-errors.ts` | lib | Error mapping through composed `LoginPage` flows |
| `src/lib/storage.ts` | lib | Upload path integration with admin form workflows |

---

## End-to-End (E2E) Tests

> **14** of **14** critical journeys covered · **0** gaps

No E2E gaps remain.

---

## Security Tests

> **9** of **9** security-sensitive areas covered · **0** gaps

No security test gaps remain.

---

## Accessibility Tests

> **14** of **14** interactive components covered · **0** gaps

### Existing Accessibility Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| islands | `src/islands/admin/auth/LoginPage.test.tsx` | jest-axe on login form |
| islands | `src/islands/admin/shared/ConfirmDialog.test.tsx` | jest-axe when open |
| islands | `src/islands/admin/layout/Sidebar.test.tsx` | `expectAccessible` navigation |
| islands | `src/islands/admin/layout/Toast.test.tsx` | `expectAccessible` notifications |
| islands | `src/islands/admin/shared/ContentForm.test.tsx` | `expectAccessible` form shell |
| islands | `src/islands/admin/shared/ImageUpload.test.tsx` | `expectAccessible` upload control |
| islands | `src/islands/admin/people/PeopleListPage.test.tsx` | `expectAccessible` list page |
| islands | `src/islands/detail-islands.test.tsx` | `expectAccessible` on detail views |
| islands | `src/islands/admin/shared/ContentTable.test.tsx` | jest-axe on populated table |
| islands | `src/islands/admin/shared/StatusSelect.test.tsx` | jest-axe on labeled select |
| islands | `src/islands/admin/shared/MarkdownField.test.tsx` | jest-axe on editor + preview |
| islands | `src/islands/admin/shared/SlugField.test.tsx` | jest-axe on slug input |
| islands | `src/islands/admin/shared/FormFeedback.test.tsx` | jest-axe on alert feedback |
| islands | `src/islands/public-islands.test.tsx` | jest-axe on `StatsCards` |
| e2e | `e2e/accessibility.spec.ts` | Playwright axe on homepage + admin login |

### Accessibility Tests Needed

None.

---

## Test Health Observations

| Test File | Observation | Impact |
|-----------|-------------|--------|
| `tests/unit/page-endpoints.unit.test.ts` | Imports and executes `GET` handlers directly | Closes page endpoint gaps without Astro dev server |
| `src/lib/admin-security.ts` | 50.5% line coverage | `getAuthorizedAdmin` paths lightly exercised |
| `AdminApp.integration.test.tsx` | React `act(...)` warnings on lazy suspend | Tests pass; consider wrapping suspense resolution |

---

## Recommendations

1. **[P3]** Add dedicated unit source contracts for five Astro UI components currently covered only via integration tests.
2. **[P3]** Extend `lib-integration.test.ts` for `auth-callback` and `magic-link-errors` composed flows.
3. **[P3]** Raise line coverage on `admin-security.ts` and `admin-queries.ts` with focused negative-path tests.

## Acceptance Criteria

- [x] Every page source file has a dedicated test module (16/16)
- [x] All public data loaders and admin CRUD flows have positive and negative automated tests
- [x] Critical security logic has automated tests (9/9 areas)
- [x] Key editor journeys have E2E coverage (14/14)
- [x] Core interactive components have accessibility checks (14/14 covered)
- [x] Coverage tooling runs from `.sdgqalab/config.yml`
- [x] All tests pass: `npm run test` and `npm run test:coverage`
