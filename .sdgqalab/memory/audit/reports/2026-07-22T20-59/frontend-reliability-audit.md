---
schema: sdgqalab/audit@3
layer: "frontend"
layer_type: "astro-react-typescript"
quality_attribute: "reliability"
quality_attribute_name: "Reliability"
iso_characteristic: "Reliability"
project: "SDG AI Lab Website"
audited_at: "2026-07-22T20:59:00Z"
config_version: 3

score:
  pass: 3
  partial: 9
  fail: 2
  na: 10
  applicable: 14
  score_pct: 53.6
  rating: "Adequate"

priority_summary:
  p0_blockers: 0
  p1_critical: 1
  p2_important: 4
  p3_improvement: 2

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: "skipped_unattended"
---

# Reliability Audit — Frontend

> **Score**: 53.6% · Adequate
> **Results**: 3 pass · 9 partial · 2 fail · 10 n/a

## Summary

Static deployment model provides inherent availability (GitHub Pages atomic deploy). Error handling patterns exist in queries and auth flows, but retry/timeout wrappers, backup verification, and idempotent storage operations remain gaps.

## Results

### PASS (3)

| Check ID | Item | Evidence |
|----------|------|----------|
| REL-015 | Zero-Downtime Deployment | `actions/deploy-pages@v4` in `deploy.yml` |
| REL-017 | Rollback Capability | Git revert + redeploy; rollback triggers in `production-cutover-checklist.md` |
| REL-021 | Input Data Validation | `admin-queries.ts` validators; empty/error states in public islands |

### PARTIAL (9)

| Check ID | Item | Gap |
|----------|------|-----|
| REL-001 | Error Handling Strategy | `{ data, error }` pattern; no global ErrorBoundary |
| REL-003 | Health Check Endpoints | External uptime workflow only; no in-app `/health` |
| REL-004 | Retry Logic | `curl --retry` in uptime; no Supabase client retries |
| REL-006 | Timeout Configuration | Uptime curl timeouts; no Supabase fetch timeout |
| REL-013 | Data Backup Configuration | Migrations in repo; Supabase PITR unverified |
| REL-014 | Disaster Recovery Plan | Cutover checklist exists; no RTO/RPO targets |
| REL-016 | Database Migration Safety | Idempotent SQL; no down migrations |

### FAIL (2)

| Check ID | Item | Evidence | Remediation |
|----------|------|----------|-------------|
| REL-022 | Idempotent Operations | `replaceImage` delete-then-upload without rollback (`storage.ts`) | Compensating delete on upload failure |

### N/A (10)

Graceful shutdown, circuit breakers, connection pooling, DLQ, container restart — not applicable to static SPA.

## Recommendations

1. **[P1]** Verify Supabase backup/PITR and document in runbook.
2. **[P2]** Add bounded retry with backoff for transient Supabase errors.
3. **[P2]** Fix `replaceImage` atomicity in `storage.ts`.
4. **[P3]** Add RTO/RPO to DR documentation.
