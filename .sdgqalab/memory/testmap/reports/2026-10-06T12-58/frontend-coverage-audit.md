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
    components_covered: 22
    gaps: 1
  line_coverage_pct: 89.09
  line_coverage_rating: "Solid"
  test_count: 407

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
  accessibility_gaps_change: 1
---

# Frontend Test Audit

> **Unit File Coverage**: 81.3% (78/96 files) · Solid
> **Integration File Coverage**: 92.7% (89/96 files) · Exemplary
> **Line Coverage**: 89.09% · Solid
> **Tests**: 407 Vitest + 25 Playwright E2E journeys
> **Audited**: 2026-10-06T12:58 UTC

---

## Audit Status

Refresh after `TeamRoster` island and Marina page contract updates. Coverage tooling runs clean (`npm run test:coverage`). Line coverage dipped slightly below **Exemplary** (89.09%) because `TeamRoster.tsx` is untested (0% lines). Critical E2E and security gap counts remain **0**; one curated a11y gap for TeamRoster.

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
| `src/islands/TeamRoster.tsx` | islands | Grouping, loading/error states, avatar fallbacks |
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
| `src/islands/TeamRoster.tsx` | islands | Mocked `people` query; renders groups from CMS data |
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

> **22** of **23** interactive components covered · **1** gap

### Accessibility Tests Needed

| Component / Page | Scope | What to Test |
|-----------------|-------|--------------|
| `TeamRoster.tsx` | islands | jest-axe after mocked people load |

---

## Test Health Observations

| Test File | Observation | Impact |
|-----------|-------------|--------|
| `lib-integration.test.ts` | Supabase mocks needed `.range()` after paginated queries | Fixed in this audit cycle |
| Page source contracts | Footer/team/home copy updated for Marina layout | Tests aligned to current markup |
| `TeamRoster.tsx` | New island, 0% line coverage | Primary regression risk for `/team` |

---

## Recommendations

1. **[P2]** Add `TeamRoster.test.tsx` (integration + axe) and optional unit for `teamGroups` edge cases.
2. **[P3]** Optional: restore line coverage ≥90% by exercising roster loading paths.
3. **[P3]** Optional lib real-import integration tests for storage/supabase clients.

## Acceptance Criteria

- [x] Coverage tooling runs from `.sdgqalab/config.yml`
- [x] `npm run test:coverage` completes successfully
- [ ] `TeamRoster` has automated tests (new gap)
