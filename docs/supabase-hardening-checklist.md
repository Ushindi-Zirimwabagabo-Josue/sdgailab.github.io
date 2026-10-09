# Supabase Hardening Checklist

This checklist covers the remaining backend and platform controls for the SDG AI Lab website after the frontend remediation pass.

**Phase C1 (staging, no prod cutover):** use [supabase-c1-staging-signoff.md](./supabase-c1-staging-signoff.md) as the operator workflow. Run `supabase/verify_c1_hardening.sql` in the SQL Editor and fix any `FAIL` rows before sign-off. Backup procedures: [supabase-backup-restore.md](./supabase-backup-restore.md).

It is grounded in the current repo setup:

- Supabase Auth, Postgres, and Storage back the CMS
- `admin_users` is the editor allowlist
- public content is served from app tables with RLS
- uploaded images live in the `public-assets` storage bucket

Relevant repo files:

- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_storage_policies.sql`
- `supabase/migrations/003_secure_editor_access.sql`
- `supabase/migrations/004_project_portfolio_metadata.sql`
- `supabase/migrations/005_admin_users_management_model.sql`
- `supabase/verify_c1_hardening.sql`
- `src/islands/admin/auth/AuthProvider.tsx`
- `src/islands/admin/auth/LoginPage.tsx`
- `src/lib/admin-queries.ts`
- `src/lib/storage.ts`

## 1. Access Model

- [ ] Confirm every real editor has a Supabase Auth user and a matching `admin_users.email`
- [ ] Confirm revoked editors are set to `active = false` in `admin_users`
- [ ] Confirm only trusted operators can modify `admin_users`
- [ ] Confirm `admin` vs `editor` roles are intentionally assigned and documented
- [ ] Confirm no shared editor accounts exist

## 2. Row Level Security

- [ ] Verify RLS is enabled on `admin_users`, `statistics`, `projects`, `news_articles`, `people`, `partners`, and `page_content`
- [ ] Verify public `SELECT` is limited to published records only
- [ ] Verify authenticated write access is gated by `is_admin_user()` on every CMS table
- [ ] Verify there are no leftover broad `authenticated` policies from earlier iterations
- [ ] Verify direct table access in the Supabase dashboard respects the same policies

## 3. `is_admin_user()` Safety

- [ ] Verify `is_admin_user()` uses `SECURITY DEFINER` with `SET search_path = public`
- [ ] Verify it checks both email match and `active = true`
- [ ] Verify all policy references call the same function consistently
- [ ] Consider adding a companion `admin_user_role()` function if role-specific policies are needed later

## 4. `admin_users` Table Controls

- [ ] Restrict `SELECT` so editors can read only their own active record
- [ ] Ensure non-admin editors cannot `INSERT`, `UPDATE`, or `DELETE` rows in `admin_users`
- [ ] Decide whether only service-role operations or only `admin` users may manage the allowlist
- [x] Add an explicit migration for allowlist-management policy if this is not already enforced operationally (`005_admin_users_management_model.sql` — no client write policies; operators use service role)
- [ ] Keep an audit trail for allowlist changes outside the app if database-level auditing is unavailable

## 5. Storage Bucket Hardening

- [ ] Confirm `public-assets` is the only bucket used by the CMS
- [ ] Confirm `INSERT`, `UPDATE`, `DELETE`, and authenticated `SELECT` on `storage.objects` are gated by `is_admin_user()`
- [ ] Confirm anonymous `SELECT` is limited to `bucket_id = 'public-assets'`
- [ ] Verify editors cannot access other buckets through inherited/default policies
- [ ] Review whether the bucket truly needs global public read for every object
- [ ] If possible, enforce folder prefixes per content type (`projects/`, `news/`, `people/`, `partners/`) in storage policies

## 6. Auth Configuration

- [ ] In Supabase Auth, disable any provider not intentionally used by the CMS
- [ ] Confirm magic-link sign-in is the intended editor login method
- [ ] Confirm signups are not open to the public for editor access
- [ ] Confirm allowed redirect URLs include only approved environments
- [ ] Remove stale localhost, preview, or test redirect URLs that are no longer needed
- [ ] Confirm email templates and sender settings are production-ready

## 7. Rate Limiting and Abuse Controls

- [ ] Enable Supabase-side auth rate limits for OTP and magic-link delivery
- [ ] Confirm provider-side anti-abuse settings are enabled for email auth flows
- [ ] Add edge or backend rate limiting for CMS write-heavy endpoints if usage grows
- [ ] Treat the current repo throttles as guardrails, not the primary enforcement layer
- [x] Document expected editor behavior when rate limits are triggered (`docs/editor-guide.md` — login rate limits)

## 8. Secrets and Key Management

- [ ] Confirm `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` are the only browser-exposed values
- [ ] Confirm the Supabase service-role key is never used in frontend code or GitHub Pages runtime
- [ ] Rotate any leaked or historically over-shared keys
- [ ] Limit service-role key access to the smallest possible operator set
- [ ] Store sensitive operational secrets only in GitHub Actions secrets or an equivalent secret manager

## 9. Database Hygiene

- [ ] Verify unique constraints still match editor expectations (`slug`, `(page_slug, section_slug)`, email uniqueness)
- [ ] Review whether additional database constraints should backstop frontend validation
- [ ] Consider adding URL/enum/check constraints where practical for high-value fields
- [ ] Confirm timestamps and update triggers are present on all mutable CMS tables
- [ ] Review indexes for admin lookup and public-read query paths

## 10. Logging, Audit, and Incident Response

- [ ] Enable and retain Supabase auth logs long enough for abuse investigations
- [ ] Enable database and storage audit visibility appropriate to your plan/tier
- [ ] Define who reviews auth failures, repeated OTP requests, and suspicious storage activity
- [ ] Document how to revoke an editor quickly
- [ ] Document how to rotate keys and revalidate CMS access after an incident

## 11. Verification Steps

- [ ] Test anonymous reads for published content only
- [ ] Test anonymous reads for draft or archived content and confirm denial
- [ ] Test editor CRUD on every content type
- [ ] Test revoked editor access (`active = false`) and confirm denial
- [ ] Test a non-allowlisted authenticated user and confirm denial
- [ ] Test upload, replace, and delete flows in `public-assets`
- [ ] Test that access to any non-CMS bucket is denied to editors

## 12. Recommended Follow-up Migrations

- [ ] Add a migration that explicitly defines who can manage `admin_users`
- [ ] Add a migration that removes any obsolete or duplicate policies discovered during review
- [ ] Add a migration for tighter storage path rules if folder-level ownership is required
- [ ] Add a migration for any missing constraints identified during verification

## Suggested Completion Order

1. Lock down `admin_users` management
2. Verify all RLS and storage policies in Supabase
3. Tighten auth redirect URLs and provider settings
4. Enable Supabase/provider rate limits
5. Run the verification checklist with one approved editor, one revoked editor, and one non-allowlisted account

## Done Criteria

Consider this checklist complete when:

- allowlist management is explicitly controlled
- CMS tables and storage policies are verified in the live Supabase project
- auth provider settings and redirect URLs are production-safe
- backend/platform rate limits are enabled
- access tests pass for allowed and denied cases
