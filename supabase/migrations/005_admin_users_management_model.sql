-- SDG AI Lab CMS — Explicit allowlist management model (C1)
-- Run after 001–004. Idempotent documentation + safety comment only.
--
-- Model: authenticated browser clients may SELECT their own active admin_users row
-- (policy editor_read_own_admin_user). There are intentionally NO INSERT/UPDATE/DELETE
-- policies for the authenticated role. Operators manage the allowlist via:
--   - Supabase SQL Editor (service role), or
--   - trusted automation holding the service-role key (never in frontend / GitHub Pages).
--
-- To add or revoke editors, use the SQL patterns in docs/supabase-hardening-runbook.md Step 2.

COMMENT ON TABLE admin_users IS
  'CMS editor allowlist. Browser clients: SELECT own active row only. '
  'Operators: manage via service role / SQL Editor (see docs/supabase-c1-staging-signoff.md).';

COMMENT ON FUNCTION is_admin_user() IS
  'Returns true when JWT email matches an active admin_users row. Used by RLS on CMS tables and storage.';
