---
schema: sdgqalab/audit@3
layer: "frontend"
layer_type: "astro-react-typescript"
quality_attribute: "data-quality"
quality_attribute_name: "Data Quality"
iso_characteristic: "Functional suitability"
project: "SDG AI Lab Website"
audited_at: "2026-09-28T21:36:00Z"
config_version: 3

score:
  pass: 7
  partial: 4
  fail: 0
  na: 7
  applicable: 11
  score_pct: 81.8
  rating: "Solid"

priority_summary:
  p0_blockers: 0
  p1_critical: 1
  p2_important: 0
  p3_improvement: 0

delta:
  previous_audit: '2026-07-22T20:59'
  score_change: 11.8
  new_passes: ['DQ-001', 'DQ-003', 'DQ-014']
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: "skipped_unattended"
---
# Data Quality Audit — Frontend

> **Score**: 81.8% · Solid
> **Results**: 7 pass · 4 partial · 0 fail · 7 n/a
> **Blockers**: 0 | **Critical (P1)**: 1 | **Important (P2)**: 0
> **Audited**: 2026-09-28
> **Layer**: frontend (astro-react-typescript)
> **ISO Grounding**: Functional suitability

---

## Summary

Data quality is the strongest domain at **81.8% Solid** with zero FAILs. Schema constraints, referential integrity, types, migrations, defaults, normalization, and RLS access controls pass. Top residual: **PII handling for contact submissions (DQ-013, critical→P1)**.

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | CMS content + contact submissions |
| Interfaces | Admin CRUD; contact edge → `contact_submissions` |
| Data contracts | `types.ts`; migrations `001`–`012`; validators |
| AI/ML behavior | N/A |
| Checkpoint status | skipped_unattended |

---

## Results

### PASS (7 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| DQ-001 | Database Schema Constraints | NOT NULL/CHECK/UNIQUE in `supabase/migrations/` |
| DQ-003 | Referential Integrity | FKs where applicable in migrations |
| DQ-004 | Data Type Enforcement | TS models align with SQL types (`src/lib/types.ts`) |
| DQ-005 | Migration Completeness | Sequential `001`–`012` including geo drop |
| DQ-006 | Default Values | Status/timestamps defaults in SQL |
| DQ-007 | Data Normalization | Entity tables per content type; no GeographicReach remnant in types |
| DQ-014 | Data Access Controls | RLS + `admin_users` allowlist (`003`, `005`) |

### PARTIAL (4 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| DQ-002 | Data Validation at Input | Hand validators in `admin-queries.ts`; contact edge validation | No shared schema lib; uneven client/server parity | medium |
| DQ-013 | PII Handling | Contact fields intentional; service role insert gated | Retention/redaction/access policy for enquiry PII incomplete | critical |
| DQ-015 | Data Retention Policy | Backup docs mention restore | No retention schedule for contact_submissions / soft-deleted CMS | medium |
| DQ-017 | Data Quality Monitoring | Tests cover validators | No production DQ metrics/alerts | low |

### FAIL (0 items)

None.

### N/A (7 items)

| Check ID | Item | Reason |
|----------|------|--------|
| DQ-008 | Training Data Documentation | No AI/ML |
| DQ-009 | Data Lineage | No ML feature pipelines |
| DQ-010 | Bias Detection | No AI/ML |
| DQ-011 | Data Versioning | No ML datasets |
| DQ-012 | Feature Store / Data Schema | No ML features |
| DQ-016 | ETL/Pipeline Error Handling | No ETL pipelines |
| DQ-018 | Embedding Quality Checks | No embeddings |

---

## Remediation Roadmap

### P0 — Blockers

None.

### P1 — Critical

#### DQ-013: PII Handling

**Current state:** Contact PII stored; admin access via RLS; retention/redaction incomplete.
**Fix:** Document access, retention, and deletion procedure; optional auto-purge job.
**Effort:** Short–Medium

### P2 — Important

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| DQ-002 | Data Validation | Shared Zod schemas client/edge | Medium |
| DQ-015 | Data Retention | Publish retention schedule for submissions/media | Short |

### P3 — Improvements

- DQ-017 periodic content completeness reports

---

## Delta from Previous Audit

| Metric | Previous | Current | Change |
|--------|----------|---------|--------|
| Score | 70.0% | 81.8% | +11.8 |
| Pass | 5 | 7 | +2 |
| Fail | 1 | 0 | −1 |
| Blockers | 0 | 0 | 0 |

**New passes since last audit:** DQ-001, DQ-003, DQ-014
**New fails since last audit:** none

---

## Acceptance Criteria

- [x] All P0 blockers resolved
- [ ] All P1 critical items resolved or risk-accepted (DQ-013 open)
- [x] Quality attribute score >= 50%
- [x] No critical-severity items in FAIL state
