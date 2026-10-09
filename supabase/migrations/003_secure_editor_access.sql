-- SDG AI Lab CMS - Secure editor access
-- Run this after 001_initial_schema.sql and 002_storage_policies.sql.
-- It replaces broad "authenticated user" CMS access with an explicit editor allowlist.

-- =============================================================================
-- Admin allowlist
-- =============================================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('admin','editor')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email_active ON admin_users (lower(email), active);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM admin_users
    WHERE lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      AND active = true
  );
$$;

DROP POLICY IF EXISTS "editor_read_own_admin_user" ON admin_users;
CREATE POLICY "editor_read_own_admin_user"
  ON admin_users FOR SELECT TO authenticated
  USING (
    active = true
    AND lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

DROP TRIGGER IF EXISTS set_updated_at ON admin_users;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- Replace content-table policies
-- =============================================================================
DROP POLICY IF EXISTS "editor_full_access" ON statistics;
CREATE POLICY "editor_full_access"
  ON statistics FOR ALL TO authenticated
  USING (is_admin_user()) WITH CHECK (is_admin_user());

DROP POLICY IF EXISTS "editor_full_access" ON projects;
CREATE POLICY "editor_full_access"
  ON projects FOR ALL TO authenticated
  USING (is_admin_user()) WITH CHECK (is_admin_user());

DROP POLICY IF EXISTS "editor_full_access" ON news_articles;
CREATE POLICY "editor_full_access"
  ON news_articles FOR ALL TO authenticated
  USING (is_admin_user()) WITH CHECK (is_admin_user());

DROP POLICY IF EXISTS "editor_full_access" ON people;
CREATE POLICY "editor_full_access"
  ON people FOR ALL TO authenticated
  USING (is_admin_user()) WITH CHECK (is_admin_user());

DROP POLICY IF EXISTS "editor_full_access" ON partners;
CREATE POLICY "editor_full_access"
  ON partners FOR ALL TO authenticated
  USING (is_admin_user()) WITH CHECK (is_admin_user());

DROP POLICY IF EXISTS "editor_full_access" ON page_content;
CREATE POLICY "editor_full_access"
  ON page_content FOR ALL TO authenticated
  USING (is_admin_user()) WITH CHECK (is_admin_user());

-- =============================================================================
-- Replace storage policies
-- =============================================================================
DROP POLICY IF EXISTS "authenticated_insert_public_assets" ON storage.objects;
DROP POLICY IF EXISTS "editor_insert_public_assets" ON storage.objects;
CREATE POLICY "editor_insert_public_assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'public-assets' AND is_admin_user());

DROP POLICY IF EXISTS "authenticated_update_public_assets" ON storage.objects;
DROP POLICY IF EXISTS "editor_update_public_assets" ON storage.objects;
CREATE POLICY "editor_update_public_assets"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'public-assets' AND is_admin_user())
  WITH CHECK (bucket_id = 'public-assets' AND is_admin_user());

DROP POLICY IF EXISTS "authenticated_delete_public_assets" ON storage.objects;
DROP POLICY IF EXISTS "editor_delete_public_assets" ON storage.objects;
CREATE POLICY "editor_delete_public_assets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'public-assets' AND is_admin_user());

DROP POLICY IF EXISTS "authenticated_select_public_assets" ON storage.objects;
DROP POLICY IF EXISTS "editor_select_public_assets" ON storage.objects;
CREATE POLICY "editor_select_public_assets"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'public-assets' AND is_admin_user());

-- Keep public read for website images. This is safe only for intentionally public assets.
DROP POLICY IF EXISTS "anon_select_public_assets" ON storage.objects;
CREATE POLICY "anon_select_public_assets"
  ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'public-assets');
