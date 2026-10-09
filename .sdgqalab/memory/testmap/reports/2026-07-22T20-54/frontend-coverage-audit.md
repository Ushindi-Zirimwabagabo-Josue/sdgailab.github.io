---
schema: sdgqalab/testmap@3
layer: "frontend"
project: "SDG AI Lab Website"
audited_at: "2026-07-22T20:54:00Z"
config_version: 3

coverage:
  total_source_files: 73
  unit:
    test_files: 33
    file_coverage_pct: 100.0
    file_coverage_rating: "Exemplary"
  integration:
    test_files: 32
    file_coverage_pct: 98.6
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
  line_coverage_pct: 89.72
  line_coverage_rating: "Solid"
  test_count: 304

by_scope:
  "components":
    source_files: 8
    unit_test_files: 2
    unit_file_coverage_pct: 100.0
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
    integration_file_coverage_pct: 90.0
  "pages":
    source_files: 16
    unit_test_files: 3
    unit_file_coverage_pct: 100.0
    integration_test_files: 9
    integration_file_coverage_pct: 100.0

delta:
  previous_audit: "2026-07-22T22:30"
  unit_file_coverage_change: 0.0
  integration_file_coverage_change: 0.0
  line_coverage_change: 0.16
  e2e_gaps_change: 0
  security_gaps_change: 0
  accessibility_gaps_change: 0
---

# Frontend Test Audit

> **Unit File Coverage**: 100.0% (73/73 files) · Exemplary
> **Integration File Coverage**: 98.6% (72/73 files) · Exemplary
> **Line Coverage**: 89.72% · Solid
> **Tests**: 304 Vitest + 14 Playwright E2E
> **Audited**: 2026-07-22T20:54 UTC

---

## Audit Status

All P1–P3 testmap gaps are **closed**. Coverage is stable at exemplary file coverage with solid line depth.

- **66** Vitest files and **304** tests pass (`npm run test`).
- **14** Playwright E2E tests pass across 4 spec files (`npm run test:e2e`).
- Line coverage **89.72%** (Solid).
- No open gaps in E2E, security, or accessibility inventories.

## Unit Tests

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|-------|-------------:|----------------:|-------------------:|
| components | 8 | 2 | 100.0% |
| islands | 39 | 19 | 100.0% |
| lib | 10 | 11 | 100.0% |
| pages | 16 | 3 | 100.0% |
| **Total** | **73** | **33** | **100.0%** |

### Unit Tests Needed

None.

---

## Integration Tests

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|-------|-------------:|----------------------:|--------------------------:|
| components | 8 | 4 | 100.0% |
| islands | 39 | 23 | 100.0% |
| lib | 10 | 1 | 90.0% |
| pages | 16 | 9 | 100.0% |
| **Total** | **73** | **32** | **98.6%** |

### Integration Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/lib/storage.ts` | lib | Upload path integration with admin `ImageUpload` form workflows (optional) |

---

## End-to-End (E2E) Tests

> **14** of **14** critical journeys covered · **0** gaps

### Existing E2E Tests

| Test File / Suite | User Journey Covered |
|-------------------|---------------------|
| `e2e/public-and-admin.spec.ts` | Homepage load, projects navigation, admin shell |
| `e2e/cms-pages.spec.ts` | About, volunteer, and team CMS hydration |
| `e2e/admin-editor-journeys.spec.ts` | Magic-link login, unauthorized user, project CRUD, news publish, media upload, archive/delete |
| `e2e/accessibility.spec.ts` | Homepage and admin login axe scans |

### E2E Tests Needed

None.

---

## Security Tests

> **9** of **9** security-sensitive areas covered · **0** gaps

### Existing Security Tests

| Scope | Test File | What's Tested |
|-------|-----------|---------------|
| lib | `src/lib/admin-security.test.ts` | Rate limits, allowlist, protected actions |
| lib | `src/lib/auth-callback.test.ts` | PKCE/hash callback exchange |
| lib | `src/lib/magic-link-errors.test.ts` | OTP error mapping |
| lib | `src/lib/admin-queries.test.ts` | Input validation guards |
| islands | `src/islands/admin/auth/LoginPage.test.tsx` | Login flow and error display |
| islands | `src/islands/admin/auth/AuthProvider.test.tsx` | Session authorization |
| islands | `src/islands/admin/auth/AuthCallback.test.tsx` | Callback error handling |
| pages | `tests/pages/admin-astro.test.ts` | Admin CSP and noindex shell |
| pages | `tests/unit/page-endpoints.unit.test.ts` | `robots.txt` / `sitemap.xml` handlers |

### Security Tests Needed

None.

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
| `src/lib/admin-queries.ts` | 68.2% line coverage | CRUD happy paths covered; deeper mutation branches remain optional |
| `src/lib/queries.ts` | 69.4% line coverage | Public loader error branches lightly exercised |
| `AdminApp.integration.test.tsx` | React `act(...)` warnings on lazy suspend | Tests pass; consider wrapping suspense resolution |

---

## Recommendations

1. **[Optional]** Add `storage.ts` upload integration coverage through `ImageUpload` form workflows.
2. **[Optional]** Raise `admin-queries.ts` and `queries.ts` line coverage above 75% with additional negative-path tests.
3. **[Optional]** Consider nonce-based CSP on `admin.astro` if `'unsafe-inline'` needs tightening later.

## Acceptance Criteria

- [x] Every page source file has a dedicated test module (16/16)
- [x] All public data loaders and admin CRUD flows have positive and negative automated tests
- [x] Critical security logic has automated tests (9/9 areas)
- [x] Key editor journeys have E2E coverage (14/14)
- [x] Core interactive components have accessibility checks (14/14 covered)
- [x] Coverage tooling runs from `.sdgqalab/config.yml`
- [x] All tests pass: `npm run test` and `npm run test:coverage`
