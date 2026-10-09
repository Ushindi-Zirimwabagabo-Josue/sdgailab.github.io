---
schema: sdgqalab/audit@3
layer: "frontend"
layer_type: "astro-react-typescript"
quality_attribute: "reliability"
quality_attribute_name: "Reliability"
iso_characteristic: "Reliability"
project: "SDG AI Lab Website"
audited_at: "2026-09-28T21:36:00Z"
config_version: 3

score:
  pass: 3
  partial: 7
  fail: 1
  na: 11
  applicable: 11
  score_pct: 59.1
  rating: "Adequate"

priority_summary:
  p0_blockers: 0
  p1_critical: 1
  p2_important: 1
  p3_improvement: 0

delta:
  previous_audit: '2026-07-22T20:59'
  score_change: 5.5
  new_passes: []
  new_fails: []

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: "skipped_unattended"
---
# Reliability Audit — Frontend

> **Score**: 59.1% · Adequate
> **Results**: 3 pass · 7 partial · 1 fail · 11 n/a
> **Blockers**: 0 | **Critical (P1)**: 1 | **Important (P2)**: 1
> **Audited**: 2026-09-28
> **Layer**: frontend (astro-react-typescript)
> **ISO Grounding**: Reliability

---

## Summary

Reliability is **Adequate (59.1%)**: GitHub Pages atomic deploys, rollback via redeploy, and input validators are in place. Gaps center on unverified Supabase backup/PITR (REL-013, critical→P1), incomplete retry/timeout wrappers, and non-idempotent `replaceImage` (REL-022).

---

## Project Context Used

| Context Item | Evidence |
|--------------|----------|
| Layer purpose | Static shell + client data fetch; no long-running app process |
| Interfaces | Supabase JS reads/writes; `contact-submit` edge; Pages deploy |
| Data contracts | Validators in `admin-queries.ts`; SQL migrations |
| AI/ML behavior | N/A |
| Checkpoint status | skipped_unattended |

---

## Results

### PASS (3 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| REL-015 | Zero-Downtime Deployment | `.github/workflows/deploy.yml` → `actions/deploy-pages`; static artifact swap |
| REL-017 | Rollback Capability | Git revert + redeploy; noted in `docs/production-cutover-checklist.md` |
| REL-021 | Input Data Validation | `validate*Input` in `src/lib/admin-queries.ts`; contact validation in edge function |

### PARTIAL (7 items)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| REL-001 | Error Handling Strategy | `{ data, error }` in queries; island empty/error UI; `ObservabilityBoundary` | Not every island wraps consistently; limited retry UX | medium |
| REL-004 | Retry Logic with Backoff | Uptime workflow `curl --retry` | No bounded backoff on Supabase client fetches | medium |
| REL-006 | Timeout Configuration | Uptime curl timeouts | No explicit fetch timeout on Supabase/browser calls | medium |
| REL-009 | Transaction Management | Single-row CRUD via Supabase | Multi-step media+row updates not transactional | medium |
| REL-013 | Data Backup Configuration | Schema in `supabase/migrations/`; `docs/supabase-backup-restore.md` | PITR/backup enablement not verified in project evidence | critical |
| REL-014 | Disaster Recovery Plan | Cutover checklist + backup doc | No explicit RTO/RPO targets | high |
| REL-016 | Database Migration Safety | Forward SQL migrations `001`–`012` | No automated down migrations / CI apply gate | medium |

### FAIL (1 item)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| REL-022 | Idempotent Operations | `replaceImage` in `src/lib/storage.ts` delete-then-upload without compensating rollback | medium | P2 |

### N/A (11 items)

| Check ID | Item | Reason |
|----------|------|--------|
| REL-002 | Graceful Shutdown | No long-lived server process |
| REL-003 | Health Check Endpoints | Static hosting; health via external uptime workflow |
| REL-005 | Circuit Breaker Pattern | No server-side outbound fan-out requiring CB |
| REL-007 | Database Connection Pooling | Managed by Supabase; not app-owned |
| REL-008 | Session Persistence | Supabase Auth client storage; not custom sessions |
| REL-010 | Dead Letter Queue | No app job queue |
| REL-011 | Container Restart Policy | No containers |
| REL-012 | Resource Limits | No container/k8s limits |
| REL-018 | LLM Fallback Handling | No AI/ML |
| REL-019 | Model Version Pinning | No AI/ML |
| REL-020 | Embedding Store Resilience | No AI/ML |

---

## Remediation Roadmap

### P0 — Blockers

None.

### P1 — Critical

#### REL-013: Data Backup Configuration

**Current state:** Docs exist; live PITR/backup not evidenced.
**Fix:** Confirm Supabase PITR/backups on prod project; record schedule/RPO in `docs/supabase-backup-restore.md`.
**Effort:** Short

### P2 — Important

| Check ID | Item | Fix Summary | Effort |
|----------|------|------------|--------|
| REL-022 | Idempotent Operations | Make `replaceImage` upload-first or compensate on failure | Short |
| REL-004 / REL-006 | Retry / Timeout | Wrapper with timeout + exponential backoff for queries | Medium |
| REL-014 | Disaster Recovery | Add RTO/RPO table to runbook | Short |
| REL-016 | Migration Safety | Document apply order; optional Supabase CLI CI dry-run | Medium |

### P3 — Improvements

- REL-001: Standardize ObservabilityBoundary on all islands
- REL-009: Document multi-step media update failure modes

---

## Delta from Previous Audit

| Metric | Previous | Current | Change |
|--------|----------|---------|--------|
| Score | 53.6% | 59.1% | +5.5 |
| Pass | 3 | 3 | 0 |
| Fail | 2 | 1 | −1 |
| Blockers | 0 | 0 | 0 |

**New passes since last audit:** none
**New fails since last audit:** none (REL-022 remains FAIL; prior second FAIL cleared via checklist/docs maturation)

---

## Acceptance Criteria

- [x] All P0 blockers resolved
- [ ] All P1 critical items resolved or risk-accepted (REL-013 open)
- [x] Quality attribute score >= 50%
- [x] No critical-severity items in FAIL state
