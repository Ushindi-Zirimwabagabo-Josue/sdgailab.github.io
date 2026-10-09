---
schema: sdgqalab/audit@3
layer: "frontend"
quality_attribute: "compatibility"
quality_attribute_name: "Compatibility"
project: "SDG AI Lab Website"
audited_at: "2026-07-22T20:59:00Z"
score: { pass: 2, partial: 4, fail: 1, na: 9, applicable: 7, score_pct: 57.1, rating: "Adequate" }
project_context: { source: ".sdgqalab/memory/audit/project-context.md", checkpoint_status: "skipped_unattended" }
---

# Compatibility Audit — Frontend

> **Score**: 57.1% · Adequate · 2 pass · 4 partial · 1 fail · 9 n/a

## Summary

PostgreSQL UTF-8 and additive migrations support compatibility. Missing explicit browserslist policy.

## Key Findings

| Result | Checks | Evidence |
|--------|--------|----------|
| PASS | CMP-007, CMP-015 | UTF-8/timestamptz in migrations; `IF NOT EXISTS` patterns |
| PARTIAL | CMP-006, CMP-008, CMP-013, CMP-014, CMP-016 | `toLocaleDateString` without explicit UTC; uptime workflow probes |
| FAIL | CMP-012 | No `.browserslistrc` |

## Recommendations

1. **[P2]** Add browserslist targeting last 2 versions + >0.5%.
2. **[P3]** Add `<noscript>` notice for admin shell.
