---
schema: sdgqalab/testmap@3
layer: "frontend"
project: "SDG AI Lab Website"
audited_at: "2026-10-06T12:58:00Z"
config_version: 3

coverage:
  total_source_files: 96
  unit:
    test_files: 21
    file_coverage_pct: 81.3
    file_coverage_rating: "Solid"
  integration:
    test_files: 56
    file_coverage_pct: 92.7
    file_coverage_rating: "Exemplary"
  e2e:
    journeys_identified: 25
    journeys_covered: 25
    gaps: 0
  security:
    areas_identified: 11
    areas_covered: 11
    gaps: 0
  accessibility:
    components_identified: 23
    components_covered: 23
    gaps: 0
  line_coverage_pct: 89.09
  line_coverage_rating: "Solid"
  test_count: 412

by_scope:
  "components":
    source_files: 8
    unit_test_files: 2
    unit_file_coverage_pct: 87.5
    integration_test_files: 4
    integration_file_coverage_pct: 100.0
  "islands":
    source_files: 54
    unit_test_files: 5
    unit_file_coverage_pct: 68.5
    integration_test_files: 42
    integration_file_coverage_pct: 98.1
  "lib":
    source_files: 12
    unit_test_files: 12
    unit_file_coverage_pct: 100.0
    integration_test_files: 1
    integration_file_coverage_pct: 66.7
  "pages":
    source_files: 22
    unit_test_files: 2
    unit_file_coverage_pct: 100.0
    integration_test_files: 9
    integration_file_coverage_pct: 90.9

delta:
  previous_audit: "2026-09-28T21:27"
  unit_file_coverage_change: -0.8
  integration_file_coverage_change: -1.0
  line_coverage_change: -2.34
  e2e_gaps_change: 0
  security_gaps_change: 0
  accessibility_gaps_change: 0
---

# Frontend Test Audit

> **Unit File Coverage**: 81.3% (78/96 files) · Solid
> **Integration File Coverage**: 92.7% (89/96 files) · Exemplary
> **Line Coverage**: 89.09% · Solid
> **Tests**: 412 Vitest + 25 Playwright E2E journeys
> **Audited**: 2026-10-06T12:58 UTC

---

## Audit Status

Refresh after `TeamRoster` island coverage (`TeamRoster.test.tsx`: grouped/compact, empty/error, axe). Critical E2E, security, and curated a11y gap counts are **0**. Line coverage may rise on next `test:coverage` run.

---

## Unit Tests

### Unit Coverage by Scope

| Scope | Source Files | Unit Test Files | Unit File Coverage |
|-------|-------------:|----------------:|-------------------:|
| components | 8 | 2 | 87.5% |
| islands | 54 | 5 | 68.5% |
| lib | 12 | 12 | 100.0% |
| pages | 22 | 2 | 100.0% |
| **Total** | **96** | **21** | **81.3%** |

### Unit Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/components/ui/StatusBadge.astro` | components | Source-contract assertion (optional) |

---

## Integration Tests

### Integration Coverage by Scope

| Scope | Source Files | Integration Test Files | Integration File Coverage |
|-------|-------------:|----------------------:|--------------------------:|
| components | 8 | 4 | 100.0% |
| islands | 54 | 42 | 98.1% |
| lib | 12 | 1 | 66.7% |
| pages | 22 | 9 | 90.9% |
| **Total** | **96** | **56** | **92.7%** |

### Integration Tests Needed

| File | Scope | What to Test |
|------|-------|--------------|
| `src/lib/storage.ts` / `supabase.ts` / `supabase-auth.ts` | lib | Optional real-import boundaries (UI still mocks) |

---

## End-to-End (E2E) Tests

> **25** of **25** critical journeys covered · **0** gaps

Team page smoke remains in `e2e/cms-pages.spec.ts` (hydration/structure); does not replace island-level tests for `TeamRoster`.

---

## Security Tests

> **11** of **11** security-sensitive areas covered · **0** gaps

---

## Accessibility Tests

> **23** of **23** interactive components covered · **0** gaps

---

## Test Health Observations

| Test File | Observation | Impact |
|-----------|-------------|--------|
| `lib-integration.test.ts` | Supabase mocks needed `.range()` after paginated queries | Fixed in this audit cycle |
| Page source contracts | Footer/team/home copy updated for Marina layout | Tests aligned to current markup |
| `TeamRoster.test.tsx` | Covers grouped/compact, empty/error, axe | Closes prior `/team` island gap |

---

## Recommendations

1. **[P3]** Optional lib real-import integration tests for storage/supabase clients.

## Acceptance Criteria

- [x] Coverage tooling runs from `.sdgqalab/config.yml`
- [x] `npm run test:coverage` completes successfully
- [x] `TeamRoster` has automated tests
