-- SDG AI Lab — C1 Supabase hardening verification
-- Run in Supabase Dashboard -> SQL Editor (service role / project owner).
-- Save the full result set for your ops record.
--
-- PASS  = expected state
-- FAIL  = fix before signing off C1
-- WARN  = review manually (data or dashboard-only checks)
-- INFO  = context only

-- =============================================================================
-- 1. CMS tables exist and RLS is enabled
-- =============================================================================
WITH expected_tables AS (
  SELECT unnest(ARRAY[
    'admin_users', 'statistics', 'projects', 'news_articles',
    'people', 'partners', 'page_content'
  ]) AS tablename
),
rls_check AS (
  SELECT
    e.tablename,
    COALESCE(t.rowsecurity, false) AS rls_enabled
  FROM expected_tables e
  LEFT JOIN pg_tables t
    ON t.schemaname = 'public' AND t.tablename = e.tablename
)
SELECT
  CASE
    WHEN tablename IS NULL THEN 'FAIL'
    WHEN NOT rls_enabled THEN 'FAIL'
    ELSE 'PASS'
  END AS status,
  'cms_rls_enabled' AS check_id,
  tablename AS detail,
  CASE
    WHEN tablename IS NULL THEN 'Table missing — run migrations 001–003'
    WHEN NOT rls_enabled THEN 'Enable RLS on this table'
    ELSE 'RLS enabled'
  END AS guidance
FROM rls_check

UNION ALL

-- =============================================================================
-- 2. Required CMS policies per table
-- =============================================================================
SELECT
  CASE WHEN COUNT(*) = 2 THEN 'PASS' ELSE 'FAIL' END,
  'cms_policy_pair',
  t.tablename,
  CASE
    WHEN COUNT(*) = 2 THEN 'anon_read_published + editor_full_access present'
    ELSE 'Expected 2 policies; found ' || COUNT(*)::text
  END
FROM (
  SELECT unnest(ARRAY[
    'statistics', 'projects', 'news_articles', 'people', 'partners', 'page_content'
  ]) AS tablename
) t
LEFT JOIN pg_policies p
  ON p.schemaname = 'public'
 AND p.tablename = t.tablename
 AND p.policyname IN ('anon_read_published', 'editor_full_access')
GROUP BY t.tablename

UNION ALL

-- =============================================================================
-- 3. editor_full_access must reference is_admin_user() in USING and WITH CHECK
-- =============================================================================
SELECT
  CASE
    WHEN COUNT(*) FILTER (
      WHERE COALESCE(qual, '') NOT ILIKE '%is_admin_user()%'
        AND COALESCE(with_check, '') NOT ILIKE '%is_admin_user()%'
    ) > 0 THEN 'FAIL'
    WHEN COUNT(*) = 0 THEN 'FAIL'
    ELSE 'PASS'
  END,
  'editor_policy_uses_is_admin_user',
  tablename::text,
  'Policies checked: ' || COUNT(*)::text
FROM pg_policies
WHERE schemaname = 'public'
  AND policyname = 'editor_full_access'
  AND tablename IN (
    'statistics', 'projects', 'news_articles', 'people', 'partners', 'page_content'
  )
GROUP BY tablename

UNION ALL

-- =============================================================================
-- 4. No broad authenticated CMS policies (legacy drift)
-- =============================================================================
SELECT
  CASE WHEN COUNT(*) > 0 THEN 'FAIL' ELSE 'PASS' END,
  'no_legacy_broad_authenticated_policies',
  COALESCE(string_agg(policyname || ' on ' || tablename, ', '), '(none)'),
  'Authenticated policies on CMS tables must use is_admin_user()'
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'statistics', 'projects', 'news_articles', 'people', 'partners', 'page_content'
  )
  AND 'authenticated' = ANY(roles)
  AND policyname <> 'editor_full_access'

UNION ALL

-- =============================================================================
-- 5. admin_users: read-only for browsers; no client write policies
-- =============================================================================
SELECT
  CASE WHEN COUNT(*) = 1 THEN 'PASS' ELSE 'FAIL' END,
  'admin_users_select_policy',
  'editor_read_own_admin_user count=' || COUNT(*)::text,
  'Exactly one SELECT policy for authenticated editors'
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'admin_users'
  AND cmd = 'SELECT'

UNION ALL

SELECT
  CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END,
  'admin_users_no_client_writes',
  COALESCE(string_agg(cmd || ':' || policyname, ', '), '(none)'),
  'Allowlist changes must use SQL Editor / service role only'
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'admin_users'
  AND cmd IN ('INSERT', 'UPDATE', 'DELETE')

UNION ALL

-- =============================================================================
-- 6. is_admin_user() function safety
-- =============================================================================
SELECT
  CASE
    WHEN COUNT(*) = 0 THEN 'FAIL'
    WHEN bool_and(prosecdef) AND bool_and(proconfig @> ARRAY['search_path=public']) THEN 'PASS'
    ELSE 'FAIL'
  END,
  'is_admin_user_function',
  'security_definer + search_path=public',
  'Re-run migration 003 if this fails'
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' AND p.proname = 'is_admin_user'

UNION ALL

-- =============================================================================
-- 7. Storage policies for public-assets
-- =============================================================================
SELECT
  CASE WHEN COUNT(*) = 5 THEN 'PASS' ELSE 'FAIL' END,
  'storage_public_assets_policies',
  'found=' || COUNT(*)::text || ' expected=5',
  'Need editor_* x4 + anon_select_public_assets'
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname IN (
    'editor_insert_public_assets',
    'editor_update_public_assets',
    'editor_delete_public_assets',
    'editor_select_public_assets',
    'anon_select_public_assets'
  )

UNION ALL

SELECT
  CASE
    WHEN COUNT(*) FILTER (
      WHERE policyname LIKE 'editor_%'
        AND NOT (
          (COALESCE(qual, '') ILIKE '%is_admin_user()%' OR COALESCE(with_check, '') ILIKE '%is_admin_user()%')
          AND (COALESCE(qual, '') ILIKE '%public-assets%' OR COALESCE(with_check, '') ILIKE '%public-assets%')
        )
    ) > 0 THEN 'FAIL'
    WHEN COUNT(*) < 4 THEN 'FAIL'
    ELSE 'PASS'
  END,
  'storage_editor_policies_gated',
  'editor policies with is_admin_user + bucket',
  NULL
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE 'editor_%'

UNION ALL

-- =============================================================================
-- 8. Allowlist hygiene (manual review)
-- =============================================================================
SELECT
  CASE
    WHEN COUNT(*) FILTER (WHERE active) = 0 THEN 'WARN'
    WHEN COUNT(*) FILTER (WHERE active AND role NOT IN ('admin', 'editor')) > 0 THEN 'FAIL'
    ELSE 'PASS'
  END,
  'admin_users_allowlist',
  'active=' || COUNT(*) FILTER (WHERE active)::text
    || ' inactive=' || COUNT(*) FILTER (WHERE NOT active)::text,
  'Confirm each active email matches a Supabase Auth user'
FROM admin_users

UNION ALL

SELECT
  'WARN',
  'admin_users_orphan_hint',
  lower(email),
  'Verify this email exists in Authentication -> Users'
FROM admin_users
WHERE active = true

UNION ALL

-- =============================================================================
-- 9. Published content smoke (INFO)
-- =============================================================================
SELECT 'INFO', 'published_projects', COUNT(*)::text, NULL
FROM projects WHERE status = 'published'

UNION ALL
SELECT 'INFO', 'published_news', COUNT(*)::text, NULL
FROM news_articles WHERE status = 'published'

UNION ALL
SELECT 'INFO', 'published_page_content', COUNT(*)::text, NULL
FROM page_content WHERE status = 'published'

ORDER BY status DESC, check_id, detail;
