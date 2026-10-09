-- =============================================================================
-- CMS publications
-- Separate research outputs from news so editorial teams can manage their
-- metadata, source links and public visibility independently.
-- =============================================================================

CREATE TABLE publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  publication_type text NOT NULL CHECK (
    publication_type IN ('report', 'brief_white_paper', 'academic_paper', 'dataset')
  ),
  authors text,
  publication_date date,
  date_label text,
  publisher text,
  summary text NOT NULL,
  source_url text NOT NULL,
  cover_image_url text,
  display_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_publications_status_date
  ON publications (status, publication_date DESC, display_order);
CREATE INDEX idx_publications_type_status
  ON publications (publication_type, status);
CREATE INDEX idx_publications_slug ON publications (slug);

ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_published"
  ON publications FOR SELECT TO anon
  USING (status = 'published');

CREATE POLICY "editor_full_access"
  ON publications FOR ALL TO authenticated
  USING (is_admin_user()) WITH CHECK (is_admin_user());

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON publications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
