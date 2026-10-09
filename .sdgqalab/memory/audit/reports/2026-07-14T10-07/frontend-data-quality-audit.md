---
schema: sdgqalab/audit@3
layer: "frontend"
layer_type: "astro-react-typescript"
quality_attribute: "data-quality"
quality_attribute_name: "Data Quality"
iso_characteristic: "ISO 25012 Data Quality + ISO 5259 ML Data Quality"
project: "SDG AI Lab Website"
audited_at: "2026-07-14T10:07:05Z"
config_version: 2

score:
  pass: 5
  partial: 1
  fail: 2
  na: 1
  applicable: 8
  score_pct: 68.8
  rating: "Adequate"

priority_summary:
  p0_blockers: 0
  p1_critical: 0
  p2_important: 3
  p3_improvement: 1

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: "skipped_unattended"
---

# Data Quality Audit - Frontend

> **Score**: 68.8% · Adequate
> **Results**: 5 pass · 1 partial · 2 fail · 1 n/a

## Summary

The Supabase schema is intentionally simple but generally disciplined: constraints, enum checks, default values, and RLS are all present. The weaker spots are boundary validation on admin writes and the lack of any retention or automated data-quality verification process.

## Results

### PASS (5 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| DQ-001 | Database Schema Constraints | `supabase/migrations/001_initial_schema.sql` defines `NOT NULL`, `UNIQUE`, and `CHECK` constraints across tables |
| DQ-004 | Data Type Enforcement | Dates, booleans, integers, and timestamps use typed SQL columns rather than plain text everywhere |
| DQ-005 | Migration Completeness | Schema is managed through committed migration files in `supabase/migrations/` |
| DQ-006 | Default Values | Status, timestamps, booleans, and ordering fields have sane defaults in SQL |
| DQ-014 | Data Access Controls | RLS plus `is_admin_user()` controls data access for authenticated editors and anonymous readers |

### PARTIAL (1 item)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| DQ-002 | Data Validation at Input | TypeScript input shapes exist in `src/lib/admin-queries.ts` and forms constrain some field types | Runtime schema validation before writes is absent, so malformed payloads rely on UI behavior or database rejection | high |

### FAIL (2 items)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| DQ-015 | Data Retention Policy | No documented retention or archival policy exists for content records, uploads, or operational data | medium | P2 |
| DQ-017 | Data Quality Monitoring | No automated checks validate row freshness, required content completeness, or schema drift after deployment | medium | P2 |

### N/A (1 item)

| Check ID | Item | Reason |
|----------|------|--------|
| DQ-010 | Bias Detection | No AI/ML dataset or model pipeline exists |
