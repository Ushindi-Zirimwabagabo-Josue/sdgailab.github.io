---
schema: sdgqalab/audit@3
layer: "frontend"
layer_type: "astro-react-typescript"
quality_attribute: "observability"
quality_attribute_name: "Observability"
iso_characteristic: "Observability"
project: "SDG AI Lab Website"
audited_at: "2026-07-14T10:07:05Z"
config_version: 2

score:
  pass: 1
  partial: 1
  fail: 5
  na: 1
  applicable: 7
  score_pct: 21.4
  rating: "Critical"

priority_summary:
  p0_blockers: 0
  p1_critical: 2
  p2_important: 3
  p3_improvement: 1

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: "skipped_unattended"
---

# Observability Audit - Frontend

> **Score**: 21.4% · Critical
> **Results**: 1 pass · 1 partial · 5 fail · 1 n/a

## Summary

This repo has basic uptime monitoring but almost no application-level observability. There is no structured logging, no contextual error capture, no error tracking service, and no metrics or alerting strategy beyond site availability.

## Results

### PASS (1 item)

| Check ID | Item | Evidence |
|----------|------|----------|
| OBS-013 | Uptime Monitoring | `.github/workflows/uptime-healthcheck.yml` checks the public site and Supabase REST API every six hours |

### PARTIAL (1 item)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| OBS-008 | Error Alerting | The uptime workflow opens or comments on GitHub issues when health checks fail | No alerting exists for application exceptions, auth failures, or content write failures | medium |

### FAIL (5 items)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| OBS-001 | Structured Logging | No structured logging framework or log event schema is present in `src/` | medium | P2 |
| OBS-004 | Error Logging with Context | Components surface UI errors, but no contextual logging path records them for operators | high | P1 |
| OBS-007 | Error Tracking Service | No Sentry, Rollbar, Bugsnag, or equivalent service configuration was found | high | P1 |
| OBS-010 | Application Metrics | No app metrics, counters, dashboards, or analytics beyond a placeholder GA snippet exist in repo code | medium | P2 |
| OBS-019 | Alerting Rules | No production alert thresholds or notification routing are documented for anything beyond availability | medium | P2 |

### N/A (1 item)

| Check ID | Item | Reason |
|----------|------|--------|
| OBS-016 | LLM Call Logging | No LLM features are present |
