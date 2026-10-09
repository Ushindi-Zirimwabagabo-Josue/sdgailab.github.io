-- SDG AI Lab CMS - Initial Schema
-- All 6 content tables, RLS policies, triggers, indexes

-- =============================================================================
-- Trigger function for updated_at
-- =============================================================================
CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('admin','editor')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_users_email_active ON admin_users (lower(email), active);

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

CREATE POLICY "editor_read_own_admin_user"
  ON admin_users FOR SELECT TO authenticated
  USING (
    active = true
    AND lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- Table: statistics
-- =============================================================================
CREATE TABLE statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL,
  icon_name text,
  display_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_statistics_status_order ON statistics (status, display_order);

ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_published"
  ON statistics FOR SELECT TO anon
  USING (status = 'published');

CREATE POLICY "editor_full_access"
  ON statistics FOR ALL TO authenticated
  USING (is_admin_user()) WITH CHECK (is_admin_user());

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON statistics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- Table: projects
-- =============================================================================
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  project_status text NOT NULL DEFAULT 'active' CHECK (project_status IN ('active','completed','under_development','on_hold')),
  is_deployed boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  image_url text,
  display_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_status_order ON projects (status, display_order);
CREATE INDEX idx_projects_slug ON projects (slug);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_published"
  ON projects FOR SELECT TO anon
  USING (status = 'published');

CREATE POLICY "editor_full_access"
  ON projects FOR ALL TO authenticated
  USING (is_admin_user()) WITH CHECK (is_admin_user());

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- Table: news_articles
-- =============================================================================
CREATE TABLE news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  body text NOT NULL,
  summary text,
  featured_image_url text,
  author_name text,
  publish_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_news_status_date ON news_articles (status, publish_date DESC);
CREATE INDEX idx_news_slug ON news_articles (slug);

ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_published"
  ON news_articles FOR SELECT TO anon
  USING (status = 'published');

CREATE POLICY "editor_full_access"
  ON news_articles FOR ALL TO authenticated
  USING (is_admin_user()) WITH CHECK (is_admin_user());

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON news_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- Table: people
-- =============================================================================
CREATE TABLE people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role_title text NOT NULL,
  photo_url text,
  group_type text NOT NULL CHECK (group_type IN ('team','advisory_board')),
  biography text,
  display_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_people_group_status_order ON people (group_type, status, display_order);

ALTER TABLE people ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_published"
  ON people FOR SELECT TO anon
  USING (status = 'published');

CREATE POLICY "editor_full_access"
  ON people FOR ALL TO authenticated
  USING (is_admin_user()) WITH CHECK (is_admin_user());

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON people
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- Table: partners
-- =============================================================================
CREATE TABLE partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  website_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_partners_status_order ON partners (status, display_order);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_published"
  ON partners FOR SELECT TO anon
  USING (status = 'published');

CREATE POLICY "editor_full_access"
  ON partners FOR ALL TO authenticated
  USING (is_admin_user()) WITH CHECK (is_admin_user());

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- Table: page_content
-- =============================================================================
CREATE TABLE page_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text NOT NULL,
  section_slug text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page_slug, section_slug)
);

CREATE INDEX idx_page_content_page_status ON page_content (page_slug, status);

ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_published"
  ON page_content FOR SELECT TO anon
  USING (status = 'published');

CREATE POLICY "editor_full_access"
  ON page_content FOR ALL TO authenticated
  USING (is_admin_user()) WITH CHECK (is_admin_user());

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON page_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
