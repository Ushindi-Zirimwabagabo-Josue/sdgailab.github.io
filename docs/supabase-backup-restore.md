# Supabase Backup and Restore

Operational guide for the SDG AI Lab CMS database and storage. Complete this during **Phase C1** (staging) and re-verify before **Phase C2** production cutover.

## What to protect

| Asset | Location | Recovery impact |
|-------|----------|-----------------|
| CMS content | Postgres (`statistics`, `projects`, `news_articles`, `publications`, `people`, `partners`, `page_content`, `evolution_timeline`) | Site content missing or stale |
| Contact enquiries (PII) | Postgres (`contact_submissions`) | Lost enquiry history; see `docs/contact-form/pii-retention.md` |
| Editor allowlist | Postgres (`admin_users`) | Editors locked out or unauthorized access |
| Uploaded images / video | Storage bucket `public-assets` | Broken media URLs on public site |
| Auth users | Supabase Auth | Editors cannot sign in |

The static site on GitHub Pages is rebuilt from git; **Supabase is the source of truth for live CMS data**.

## Recovery objectives (operators)

Document and confirm with the hosting owner before production cutover:

| Objective | Target | Notes |
|-----------|--------|-------|
| **RPO** (max data loss) | ≤ 24h on Free; ≤ PITR window on Pro | Free tier relies on last manual export |
| **RTO** (time to restore CMS) | ≤ 4h for content restore from export/PITR | Includes re-apply migrations `001`–`012` if new project |

## Backup verification checklist (sign-off)

Complete once per environment (staging, then production). Keep evidence outside git (ticket / ops wiki).

| # | Check | Staging | Production | Evidence |
|---|-------|---------|------------|----------|
| 1 | Plan confirmed (Free / Pro) and backup UI location recorded | ☐ | ☐ | |
| 2 | Automated daily backups **or** documented manual export cadence | ☐ | ☐ | |
| 3 | PITR enabled (Pro+) **or** N/A with accepted risk on Free | ☐ | ☐ | |
| 4 | Latest successful backup / export timestamp recorded | ☐ | ☐ | |
| 5 | Storage `public-assets` archive or accepted risk noted | ☐ | ☐ | |
| 6 | Staging restore drill completed (date + owner) | ☐ | ☐ | |
| 7 | Migrations applied through `012_drop_geographic_reach.sql` | ☐ | ☐ | |

**Last verified:** _YYYY-MM-DD_ · **Owner:** _name_ · **Environment:** _staging|production_

## Backup options (by Supabase plan)

### All plans

1. **Dashboard export (manual)**
   - `Project Settings -> Database -> Backups` (wording varies by plan)
   - Use **Download backup** or follow plan-specific export when available
   - Store exports in your organization’s secure storage (not in this git repo)

2. **Schema + policy snapshot (repo-aligned)**
   - Run `supabase/verify_c1_hardening.sql` and save output
   - Export policy snapshot from `docs/supabase-hardening-runbook.md` Step 1
   - Migrations in `supabase/migrations/` are the canonical schema definition

3. **Storage**
   - Periodically list objects in `public-assets` and archive critical folders if your plan has no automated storage backup
   - Supabase Storage does not replace off-site backup for irreplaceable uploads

### Pro plan and above

- **Daily automated backups** — confirm enabled under `Database -> Backups`
- **Point-in-time recovery (PITR)** — note retention window and recovery procedure in your internal ops wiki

### Free tier

- Rely on manual exports before major migrations or cutover
- Document who runs exports and how often (recommended: before each production-affecting change)

## Pre-change backup checklist

Run before:

- Applying new migrations (`005_*`, future schema changes)
- Bulk content imports (`team_members.sql`, `seed.sql`)
- Production cutover (C2)
- Revoking or rotating service-role keys

Steps:

1. Note current migration level applied in Supabase (`001`–`012`)
2. Export or confirm a recent automated backup exists
3. Save output of `supabase/verify_c1_hardening.sql`
4. Record active `admin_users` emails (no secrets):

   ```sql
   select email, role, active from admin_users order by lower(email);
   ```

## Restore scenarios

### Accidental content delete (single table / rows)

1. If PITR is available: restore to a new branch/project at a timestamp before the delete, export affected rows, merge into production
2. Without PITR: restore from latest logical backup export if you have one
3. Re-run verification: `supabase/verify_c1_hardening.sql`

### Broken RLS / editor cannot access CMS

1. Do **not** disable RLS globally
2. Re-apply `supabase/migrations/003_secure_editor_access.sql`
3. Confirm affected editor row: `select * from admin_users where lower(email) = lower('editor@example.com');`
4. See rollback section in `docs/supabase-hardening-runbook.md`

### Allowlist mistake (editor locked out)

```sql
insert into admin_users (email, role, active)
values ('editor@example.com', 'editor', true)
on conflict (email)
do update set role = excluded.role, active = true, updated_at = now();
```

User must also exist in `Authentication -> Users`.

### Storage bucket issues

1. Confirm bucket name is exactly `public-assets`
2. Re-apply storage section of migration `003_secure_editor_access.sql`
3. Re-upload missing objects from local archive if backups exist

### Full project disaster

1. Create new Supabase project (or restore from platform backup per Supabase support docs)
2. Apply migrations in order: `001` → `012` (see `supabase/README.md`)
3. Create `public-assets` bucket (public read)
4. Restore data from logical backup or PITR export
5. Reconfigure Auth redirect URLs per `docs/supabase-c1-staging-signoff.md`
6. Re-add GitHub Actions secrets (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, optional `PUBLIC_SENTRY_*`)
7. Run full C1 verification and smoke tests

## Retention and access

- Limit service-role key holders to the smallest operator set
- Never commit backups containing user emails + secrets to git
- Contact PII retention: **90 days** — see `docs/contact-form/pii-retention.md` and `supabase/contact_submissions_purge.sql`
- Assign an owner for quarterly restore drills on staging

## Related docs

- [supabase-c1-staging-signoff.md](./supabase-c1-staging-signoff.md) — C1 verification workflow
- [supabase-hardening-runbook.md](./supabase-hardening-runbook.md) — policy and auth steps
- [production-cutover-checklist.md](./production-cutover-checklist.md) — C2 backup gate
- [contact-form/pii-retention.md](./contact-form/pii-retention.md) — enquiry PII retention
- [deployment-runtime.md](./deployment-runtime.md) — Pages vs optional Docker preview
