-- Storage RLS policies for public-assets bucket
-- Enables authenticated editors to upload, replace, and delete images.
-- Required for the admin UI (002-admin-ui) image upload feature.
-- Run this AFTER creating the public-assets bucket in Supabase Dashboard (Storage).

-- Allow approved editors to upload (INSERT) to public-assets
CREATE POLICY "editor_insert_public_assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'public-assets' AND is_admin_user());

-- Allow approved editors to update (replace) files in public-assets
CREATE POLICY "editor_update_public_assets"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'public-assets' AND is_admin_user())
  WITH CHECK (bucket_id = 'public-assets' AND is_admin_user());

-- Allow approved editors to delete files in public-assets
CREATE POLICY "editor_delete_public_assets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'public-assets' AND is_admin_user());

-- Allow approved editors to select (read) - needed for replace/upsert flows
CREATE POLICY "editor_select_public_assets"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'public-assets' AND is_admin_user());

-- Ensure public read for anon (images displayed on public site)
CREATE POLICY "anon_select_public_assets"
  ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'public-assets');
