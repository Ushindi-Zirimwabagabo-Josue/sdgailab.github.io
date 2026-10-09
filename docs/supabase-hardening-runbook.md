# Supabase Hardening Runbook

This runbook is for the SDG AI Lab website's live Supabase project.

It turns `docs/supabase-hardening-checklist.md` into an operator procedure with:

- exact Supabase dashboard areas to open
- copy-paste SQL for verification and remediation
- post-change checks

## Scope

This runbook covers:

- editor allowlist enforcement via `admin_users`
- RLS verification on CMS tables
- storage policy verification for `public-assets`
- Auth redirect URL hardening
- Auth rate-limit hardening

This runbook does **not** change application code. It is for the Supabase project itself.

## Repo Context

Relevant repo files:

- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_storage_policies.sql`
- `supabase/migrations/003_secure_editor_access.sql`
- `src/islands/admin/auth/LoginPage.tsx`
- `src/islands/admin/auth/AuthProvider.tsx`
- `src/lib/admin-queries.ts`
- `src/lib/storage.ts`

## Before You Start

- [ ] You have project owner or equivalent admin access in Supabase
- [ ] You know the correct current staging site URL and admin URL
- [ ] You know the planned future production site URL and admin URL
- [ ] You have at least one approved editor account and one non-editor account for testing
- [ ] You have a rollback contact or owner available in case editor access breaks

## Known Environment Values

Update these to match your project before executing.

### Current staging values

- Staging site URL: `https://sdg-ai-lab.github.io/sdgailab.github.io/`
- Staging admin URL: `https://sdg-ai-lab.github.io/sdgailab.github.io/admin`
- Local admin URL: `http://localhost:4321/admin`
- Storage bucket: `public-assets`

### Future production values

- Production site URL: `https://sdgailab.org`
- Production admin URL: `https://sdgailab.org/admin`

---

## Quick start (C1)

For staging sign-off without production cutover, follow [supabase-c1-staging-signoff.md](./supabase-c1-staging-signoff.md) and run `supabase/verify_c1_hardening.sql` after migrations `001`–`005`.

---

## Step 1: Snapshot Current State

### Dashboard

Open:

- `Supabase Dashboard -> Project -> SQL Editor`

### SQL

Run this first and save the output somewhere secure:

```sql
select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname in ('public', 'storage')
  and (
    tablename in (
      'admin_users',
      'statistics',
      'projects',
      'news_articles',
      'people',
      'partners',
      'page_content'
    )
    or tablename = 'objects'
  )
order by schemaname, tablename, policyname;
```

Then confirm RLS state:

```sql
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'admin_users',
    'statistics',
    'projects',
    'news_articles',
    'people',
    'partners',
    'page_content'
  )
order by tablename;
```

### Expected

- `rowsecurity = true` for all CMS tables
- policies exist for public read and editor access

---

## Step 2: Verify `admin_users` Allowlist Data

### Dashboard

Open:

- `Supabase Dashboard -> Project -> Table Editor -> admin_users`

### Operator Actions

- Confirm every approved editor has one row
- Confirm email addresses exactly match the Supabase Auth user emails
- Confirm revoked users are set to `active = false`
- Confirm `role` is either `admin` or `editor`

### SQL

Use this to inspect the table:

```sql
select id, email, role, active, created_at, updated_at
from admin_users
order by lower(email);
```

To add an editor:

```sql
insert into admin_users (email, role, active)
values ('editor@example.com', 'editor', true)
on conflict (email)
do update set
  role = excluded.role,
  active = excluded.active,
  updated_at = now();
```

To revoke without deleting:

```sql
update admin_users
set active = false,
    updated_at = now()
where lower(email) = lower('editor@example.com');
```

### Notes

- The app expects the signed-in email to match `admin_users.email`
- Revoke by disabling, not deleting, unless you intentionally want to remove history

---

## Step 3: Verify `admin_users` Access Policy

### Why

Editors should only be able to read their own active allowlist row. They should not be able to manage the allowlist from the browser.

### Dashboard

Open:

- `Supabase Dashboard -> Project -> Authentication -> Users`
- `Supabase Dashboard -> Project -> SQL Editor`

### SQL

Inspect current `admin_users` policies:

```sql
select policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'admin_users'
order by policyname;
```

### Expected

- one `SELECT` policy allowing an authenticated user to read only their own active row
- no broad browser-write policy for `admin_users`

### Recommended Action

If you only want project owners/operators to manage `admin_users`, keep browser-side write policies **absent** and manage the allowlist only through the SQL Editor or trusted backend automation.

No extra SQL is required if that is already your model.

---

## Step 4: Verify CMS Table RLS

### Dashboard

Open:

- `Supabase Dashboard -> Project -> SQL Editor`

### SQL

Run:

```sql
select schemaname, tablename, policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename in (
    'statistics',
    'projects',
    'news_articles',
    'people',
    'partners',
    'page_content'
  )
order by tablename, policyname;
```

### Expected

For each CMS table:

- `anon_read_published`
- `editor_full_access`

The `editor_full_access` policy should use `is_admin_user()` in both `USING` and `WITH CHECK`.

### Remediation SQL

If any `editor_full_access` policy is missing or too broad, run the repo migration:

```sql
-- Run the contents of:
-- supabase/migrations/003_secure_editor_access.sql
```

If you need to repair just one table manually, use this pattern:

```sql
drop policy if exists "editor_full_access" on projects;

create policy "editor_full_access"
  on projects
  for all
  to authenticated
  using (is_admin_user())
  with check (is_admin_user());
```

Repeat for any affected table.

---

## Step 5: Verify Storage Policies for `public-assets`

### Dashboard

Open:

- `Supabase Dashboard -> Project -> Storage`
- `Supabase Dashboard -> Project -> SQL Editor`

Confirm the bucket exists:

- bucket name: `public-assets`

### SQL

Inspect storage policies:

```sql
select policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
order by policyname;
```

### Expected

These policies should exist:

- `editor_insert_public_assets`
- `editor_update_public_assets`
- `editor_delete_public_assets`
- `editor_select_public_assets`
- `anon_select_public_assets`

Editor policies should require:

- `bucket_id = 'public-assets'`
- `is_admin_user()`

### Remediation SQL

If needed, run the repo migration:

```sql
-- Run the contents of:
-- supabase/migrations/002_storage_policies.sql
-- and then:
-- supabase/migrations/003_secure_editor_access.sql
```

### Stronger Optional Hardening

If you want to restrict uploads by top-level folder, use `storage.foldername(name)`.

Example for the `projects` folder:

```sql
drop policy if exists "editor_insert_public_assets" on storage.objects;

create policy "editor_insert_public_assets"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'public-assets'
    and is_admin_user()
    and (storage.foldername(name))[1] in ('projects', 'news', 'people', 'partners')
  );
```

Only do this if your actual upload paths match those folder names.

---

## Step 6: Harden Auth Redirect URLs

### Source

Supabase's Redirect URLs guide says the `redirectTo` URL used by the client must match the allowed Redirect URLs list, and the default Site URL should be set to the primary currently active site URL.

### Dashboard

Open:

- `Supabase Dashboard -> Project -> Authentication -> URL Configuration`

### Operator Actions

Set for the current staging phase:

- **Site URL**: `https://sdg-ai-lab.github.io/sdgailab.github.io/`

Add allowed Redirect URLs:

- `https://sdg-ai-lab.github.io/sdgailab.github.io/admin`
- `https://sdgailab.org/admin`
- `http://localhost:4321/admin`

### Staging recommendation

- Keep the GitHub Pages staging admin URL enabled while staging is the active environment.
- Keep the future production admin URL present only if you are actively preparing cutover or validating email/auth flows ahead of launch.
- Avoid broad wildcard redirect URLs unless they are operationally necessary.

### Production cutover note

When `https://sdgailab.org` becomes the active environment:

- change **Site URL** to `https://sdgailab.org`
- keep `https://sdgailab.org/admin`
- keep `http://localhost:4321/admin` if local development still matters
- remove the GitHub Pages staging admin URL if it is no longer needed operationally

### Remove if present

- old localhost ports you no longer use
- stale preview domains
- temporary test domains

### Repo Match

This aligns with `src/islands/admin/auth/LoginPage.tsx`, which sends magic links back to `/admin` on the current host-derived base URL.

---

## Step 7: Review Auth Providers and Signups

### Dashboard

Open:

- `Supabase Dashboard -> Project -> Authentication -> Providers`
- `Supabase Dashboard -> Project -> Authentication -> Users`

### Operator Actions

- Keep only the auth providers you actually use for the CMS
- Confirm email magic link / OTP is the intended method
- Confirm there is no accidental public self-service editor access path
- Confirm test users are removed or clearly labeled

### Repo Match

`src/islands/admin/auth/LoginPage.tsx` uses `signInWithOtp(... shouldCreateUser: false)`, so the frontend expects passwordless email auth for existing users only.

---

## Step 8: Harden Auth Rate Limits

### Source

Supabase documents configurable Auth rate limits under:

- `Supabase Dashboard -> Project -> Authentication -> Rate Limits`

### Dashboard

Open:

- `Supabase Dashboard -> Project -> Authentication -> Rate Limits`

### Operator Actions

Review and tighten, at minimum:

- email sending limits
- OTP verification limits
- anonymous/auth endpoint limits relevant to magic links

### Optional Management API

Supabase documents a Management API for reading and updating auth rate-limit config.

Read current config:

```bash
curl -X GET "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN"
```

Example update:

```bash
curl -X PATCH "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rate_limit_anonymous_users": 10,
    "rate_limit_email_sent": 10,
    "rate_limit_verify": 10,
    "rate_limit_otp": 10
  }'
```

### Recommendation

Start conservatively and test editor workflows after any change. The repo already has client-side throttling, but Supabase-side settings are the real enforcement layer.

---

## Step 9: Verify Public vs Editor Access

### Dashboard

Open:

- `Supabase Dashboard -> Project -> SQL Editor`

### SQL Smoke Checks

As an operator, verify that published content exists:

```sql
select count(*) from projects where status = 'published';
select count(*) from news_articles where status = 'published';
select count(*) from page_content where status = 'published';
```

### App Checks

Use three accounts:

1. approved active editor
2. revoked editor (`active = false`)
3. authenticated non-editor

Verify:

- approved editor can sign in and use `/admin`
- revoked editor cannot use `/admin`
- non-editor cannot use `/admin`
- public site still loads published data
- image upload, replace, and delete still work for approved editors only

---

## Step 10: Optional SQL for Policy Drift Detection

Use this query after future changes:

```sql
select
  schemaname,
  tablename,
  policyname,
  cmd,
  roles,
  coalesce(qual, '') as using_clause,
  coalesce(with_check, '') as with_check_clause
from pg_policies
where schemaname in ('public', 'storage')
order by schemaname, tablename, policyname;
```

Export and compare it against a previous snapshot whenever auth or storage policies change.

---

## Step 11: Rollback Notes

If editor access breaks:

1. Re-check `admin_users` rows for the affected email
2. Re-check `Authentication -> URL Configuration`
3. Re-check the `editor_full_access` policies
4. Re-check `storage.objects` policies for `public-assets`
5. Re-run `supabase/migrations/003_secure_editor_access.sql` if policy drift is suspected

If storage breaks but content editing still works:

1. Re-check `storage.objects` policies
2. Confirm the bucket name is exactly `public-assets`
3. Confirm upload paths still match any folder-level restrictions you added

---

## Completion Criteria

This runbook is complete when:

- `admin_users` entries are clean and current
- RLS is verified on all CMS tables
- storage policies are verified on `public-assets`
- redirect URLs are reduced to approved active environments
- auth rate limits are explicitly reviewed and configured
- approved and denied access cases are tested successfully

## Sources

- Supabase Redirect URLs docs: https://supabase.com/docs/guides/auth/redirect-urls
- Supabase Auth Rate Limits docs: https://supabase.com/docs/guides/auth/rate-limits
- Supabase Storage Access Control docs: https://supabase.com/docs/guides/storage/security/access-control
- Supabase Row Level Security docs: https://supabase.com/docs/guides/database/postgres/row-level-security
