---
schema: sdgqalab/audit@3
layer: "frontend"
quality_attribute: "data-quality"
quality_attribute_name: "Data Quality"
project: "SDG AI Lab Website"
audited_at: "2026-07-22T20:59:00Z"
score: { pass: 5, partial: 4, fail: 1, na: 9, applicable: 10, score_pct: 70.0, rating: "Solid" }
project_context: { source: ".sdgqalab/memory/audit/project-context.md", checkpoint_status: "skipped_unattended" }
---

# Data Quality Audit — Frontend

> **Score**: 70.0% · Solid · 5 pass · 4 partial · 1 fail · 9 n/a

## Summary

Strong schema constraints and application-layer validation before Supabase writes. No FK relationships or documented retention policy.

## Key Findings

| Result | Checks | Evidence |
|--------|--------|----------|
| PASS | DQ-001, DQ-002, DQ-004, DQ-006, DQ-007 | CHECK constraints, validators in `admin-queries.ts`, defaults |
| PARTIAL | DQ-003, DQ-005, DQ-013, DQ-014 | No FKs; README omits migrations 003–004; RLS allowlist pattern |
| FAIL | DQ-015 | No data retention documentation |

## Recommendations

1. **[P2]** Document Supabase data retention and backup policy.
2. **[P3]** Align README migration list with `supabase/migrations/`.
