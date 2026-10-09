---
schema: sdgqalab/audit@3
layer: "frontend"
quality_attribute: "maintainability"
quality_attribute_name: "Maintainability"
project: "SDG AI Lab Website"
audited_at: "2026-07-22T20:59:00Z"
score: { pass: 6, partial: 9, fail: 2, na: 5, applicable: 17, score_pct: 61.8, rating: "Adequate" }
project_context: { source: ".sdgqalab/memory/audit/project-context.md", checkpoint_status: "skipped_unattended" }
---

# Maintainability Audit — Frontend

> **Score**: 61.8% · Adequate · 6 pass · 9 partial · 2 fail · 5 n/a

## Summary

Strong test posture (304 tests, 89.72% line coverage) and clear project structure. Missing ESLint, pre-commit hooks, and `npm run check` in CI.

## Key Findings

| Result | Checks | Evidence |
|--------|--------|----------|
| PASS | MNT-005, MNT-006, MNT-008, MNT-010, MNT-015, MNT-017 | `src/` layout, zero TODOs, CI runs Vitest+E2E, strict TS |
| PARTIAL | MNT-002, MNT-003, MNT-004, MNT-007, MNT-009, MNT-012, MNT-016, MNT-018, MNT-020 | Format script exists; check not in CI; manual SQL migrations |
| FAIL | MNT-001, MNT-011 | No ESLint; no Husky/pre-commit |

## Recommendations

1. **[P1]** Add ESLint + `npm run lint` + CI lint/check jobs.
2. **[P1]** Enable Dependabot.
3. **[P2]** Add Husky + lint-staged.
