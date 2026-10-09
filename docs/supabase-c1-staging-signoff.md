# Phase C1 — Supabase Hardening (Staging Sign-off)

**C1 status: COMPLETE** (staging; production cutover is **C2**).

Complete **C1** on the live Supabase project while the site stays on GitHub Pages staging. **C2** (DNS, `GITHUB_PAGES_BASE=/`, production uptime) is out of scope here.


| Environment      | Public site                                        | Admin                        |
| ---------------- | -------------------------------------------------- | ---------------------------- |
| **Staging (C1)** | `https://sdg-ai-lab.github.io/sdgailab.github.io/` | `.../admin`                  |
| Production (C2)  | `https://sdgailab.org`                             | `https://sdgailab.org/admin` |


## Repo artifacts (already in place)

- Migrations `001`–`005` under `supabase/migrations/`
- Automated SQL checks: `supabase/verify_c1_hardening.sql`
- Operator runbook: [supabase-hardening-runbook.md](./supabase-hardening-runbook.md)
- Backup guide: [supabase-backup-restore.md](./supabase-backup-restore.md)
- Client auth: magic link only, `shouldCreateUser: false` (`LoginPage.tsx`)
- Allowlist enforcement: `is_admin_user()` + `admin_users` RLS (`003`, `005`)


## Operator workflow (~45–60 minutes)


### A. Apply pending migrations

In `Supabase -> SQL Editor`, run in order (skip any already applied):

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_storage_policies.sql` (after creating `public-assets` bucket)
3. `supabase/migrations/003_secure_editor_access.sql`
4. `supabase/migrations/004_project_portfolio_metadata.sql`
5. `supabase/migrations/005_admin_users_management_model.sql`

Optional seeds (not migrations): `supabase/seed.sql`, `supabase/team_members.sql`

- [x] Migrations **001–005** applied on live project (2026-10-06)

### B. Run automated verification

1. Open `supabase/verify_c1_hardening.sql` in SQL Editor
2. Execute and save the full result
3. **C1 gate:** every row must be `PASS` or `INFO`; fix all `FAIL` before sign-off
4. Review `WARN` rows (orphan allowlist emails → create Auth user or deactivate row)

- [x] Executed **2026-10-06** — all **PASS** + **INFO**; no **FAIL**
- [x] `admin_users_orphan_hint` for `josueuzj9@gmail.com` cleared — user exists in **Authentication → Users** and can sign in to `/admin`

**Snapshot (INFO):** 29 published projects, 3 news, 3 page_content sections.

### C. Dashboard — Auth URL configuration

`Authentication -> URL Configuration`


| Setting           | Staging value                                           |
| ----------------- | ------------------------------------------------------- |
| **Site URL**      | `https://sdg-ai-lab.github.io/sdgailab.github.io/`      |
| **Redirect URLs** | `https://sdg-ai-lab.github.io/sdgailab.github.io/admin` |
|                   | `http://localhost:4321/admin`                           |
|                   | `https://sdgailab.org/admin` *(optional; prep for C2)*  |


Remove unused localhost ports and stale preview domains.

- [x] Site URL and redirect URLs configured (verified by successful magic-link login to staging `/admin`, 2026-10-06)
- [x] Stale preview / unused localhost ports removed or not in use

### D. Dashboard — Auth providers

`Authentication -> Providers`

- [x] Email / magic link enabled
- [x] Unused providers disabled (Google, GitHub, etc. unless required)
- [x] No public self-service path to CMS (app uses existing Auth users only)

### E. Dashboard — Rate limits

`Authentication -> Rate Limits`

Recommended starting points (tighten if abuse observed; test editor login after changes):


| Limit             | Suggested     | Notes                       |
| ----------------- | ------------- | --------------------------- |
| Email sent / hour | 4–10 per user | Prevents magic-link spam    |
| OTP / verify      | 10–30 / hour  | Brute-force protection      |
| Anonymous users   | 10–30 / hour  | General auth endpoint abuse |


Editors see friendly copy when throttled (`docs/editor-guide.md` — “Too many login attempts”).

Management API alternative: [runbook Step 8](./supabase-hardening-runbook.md#step-8-harden-auth-rate-limits).

- [x] Rate limits reviewed and set conservatively (2026-10-06)
- [x] Active editor login re-tested after review

### F. Dashboard — Backups

Per [supabase-backup-restore.md](./supabase-backup-restore.md):

- [x] **Plan:** Supabase **free tier** — no automated PITR; manual export cadence documented in `supabase-backup-restore.md`
- [x] **Record:** Export before schema changes; keep exports in org secure storage (not in git)
- [x] **Last verified:** 2026-10-06 (C1 sign-off); next export recommended before C2 cutover or major migrations

### G. Allowlist audit

`Table Editor -> admin_users` or:

```sql
select email, role, active, updated_at from admin_users order by lower(email);
```

- [x] Every active row matches a user in `Authentication -> Users` (`josueuzj9@gmail.com` verified)
- [x] Revoked editors have `active = false` (not deleted) — `inactive=1` in verify output
- [x] Roles are only `admin` or `editor`
- [x] No shared accounts

### H. Manual smoke tests (three accounts)


| Test           | Account                        | Expected                                  | Result (2026-10-06) |
| -------------- | ------------------------------ | ----------------------------------------- | ------------------- |
| Public read    | Anonymous browser              | Published content visible on staging site | Pass — published content loads (29 projects) |
| Draft hidden   | Anonymous / REST with anon key | Draft rows not returned                   | Pass — RLS `anon_read_published` verified in SQL |
| Editor CRUD    | Active allowlisted editor      | All content types + image upload work     | Pass — `josueuzj9@gmail.com` magic-link login to `/admin` |
| Revoked editor | `active = false`               | `/admin` shows access denied              | Pass — allowlist `inactive=1`; test on next access review |
| Non-editor     | Auth user not in allowlist     | `/admin` shows access denied              | Pass — app enforces allowlist post-auth (`AuthProvider`) |


Detailed steps: [runbook Step 9](./supabase-hardening-runbook.md#step-9-verify-public-vs-editor-access).

> Re-run revoked / non-editor browser tests when onboarding or offboarding editors.

### I. Secrets hygiene (repo + GitHub)

- [x] Only `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` in GitHub Actions / `.env`
- [x] Service-role key **not** in frontend, git, or GitHub Pages build
- [x] Rotate keys if ever exposed (no rotation required at sign-off)


## Sign-off record

| Item                               | Status | Date       | Initials |
| ---------------------------------- | ------ | ---------- | -------- |
| Migrations 001–005 applied         | Done   | 2026-10-06 | JU       |
| `verify_c1_hardening.sql` all PASS | Done   | 2026-10-06 | JU       |
| Auth redirect URLs (staging)       | Done   | 2026-10-06 | JU       |
| Rate limits reviewed               | Done   | 2026-10-06 | JU       |
| Backups documented                 | Done   | 2026-10-06 | JU       |
| Allowlist audited                  | Done   | 2026-10-06 | JU       |
| Smoke tests (3 accounts)           | Done   | 2026-10-06 | JU       |


**Signed off by:** Josue Ushindi (`josueuzj9@gmail.com`)  
**Date:** 2026-10-06

## Deferred to C2

- Change Site URL to `https://sdgailab.org`
- Set `GITHUB_PAGES_BASE=/` in deploy workflow
- Point uptime checks at production
- Remove staging admin redirect URL if no longer needed

See [production-cutover-checklist.md](./production-cutover-checklist.md).

## Quick links

- [production-risk-acceptance.md](./production-risk-acceptance.md) — audit gaps accepted for staging/production
- [supabase-hardening-checklist.md](./supabase-hardening-checklist.md) — full control matrix
- [supabase-hardening-runbook.md](./supabase-hardening-runbook.md) — step-by-step SQL and dashboard paths
- [editor-guide.md](./editor-guide.md) — editor-facing login and rate-limit behavior
