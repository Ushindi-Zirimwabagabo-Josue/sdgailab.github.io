---
schema: sdgqalab/audit@3
layer: "frontend"
layer_type: "astro-react-typescript"
quality_attribute: "maintainability"
quality_attribute_name: "Maintainability"
iso_characteristic: "Maintainability"
project: "SDG AI Lab Website"
audited_at: "2026-07-14T10:07:05Z"
config_version: 2

score:
  pass: 8
  partial: 1
  fail: 4
  na: 1
  applicable: 13
  score_pct: 65.4
  rating: "Adequate"

priority_summary:
  p0_blockers: 0
  p1_critical: 1
  p2_important: 3
  p3_improvement: 1

project_context:
  source: ".sdgqalab/memory/audit/project-context.md"
  checkpoint_status: "skipped_unattended"
---

# Maintainability Audit - Frontend

> **Score**: 65.4% · Adequate
> **Results**: 8 pass · 1 partial · 4 fail · 1 n/a

## Summary

The repository is well-structured, strongly typed, and well documented, with a working deployment pipeline and a useful script surface. Maintainability drops because there is no linter, no automated tests in CI, no dead-code detection, and no pre-commit guardrails.

## Results

### PASS (8 items)

| Check ID | Item | Evidence |
|----------|------|----------|
| MNT-002 | Code Formatter | `package.json` defines `format` and ships Prettier plugins |
| MNT-003 | Type Safety | `tsconfig.json:2` extends `astro/tsconfigs/strict` |
| MNT-004 | Dependency Management | `package-lock.json` is committed and package ownership is centralized in `package.json` |
| MNT-005 | Project Structure Convention | `src/components`, `src/islands`, `src/lib`, and `src/pages` clearly separate concerns |
| MNT-009 | CI Pipeline Exists | `.github/workflows/deploy.yml` and `.github/workflows/uptime-healthcheck.yml` are active repo workflows |
| MNT-015 | TypeScript Strict Configuration | Strict Astro TypeScript config is enabled via `tsconfig.json:2` |
| MNT-016 | Package.json Scripts | `package.json` exposes `dev`, `build`, `preview`, `format`, and `check` |
| MNT-017 | Separation of Concerns | Public queries, admin queries, storage helpers, and route components are separated cleanly |

### PARTIAL (1 item)

| Check ID | Item | What Passes | What's Missing | Severity |
|----------|------|-------------|----------------|----------|
| MNT-012 | Consistent Development Environment | `README.md:17` requires Node.js 20+ and deploy CI uses Node 20 | No `.nvmrc`, Volta, or equivalent machine-readable toolchain pin exists in repo | medium |

### FAIL (4 items)

| Check ID | Item | Evidence | Severity | Priority |
|----------|------|----------|----------|----------|
| MNT-001 | Linter Configuration | No ESLint or comparable linter configuration exists in the current codebase | medium | P2 |
| MNT-006 | Dead Code Detection | No dead-code scanner or lint rule set was found, despite rapid feature churn in `src/islands/admin/` | low | P3 |
| MNT-010 | Automated Testing in CI | No test files were found under `src/`, and no test job exists in `.github/workflows/` | high | P1 |
| MNT-011 | Pre-commit Hooks | No Husky, Lefthook, or pre-commit configuration is present | medium | P2 |

### N/A (1 item)

| Check ID | Item | Reason |
|----------|------|--------|
| MNT-019 | API Versioning Strategy | This repo does not own a versioned first-party HTTP API surface |
