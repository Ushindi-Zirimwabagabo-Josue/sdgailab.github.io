-- Contact form submissions
-- Stores public website contact requests submitted through the Supabase Edge Function.

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  organization text NOT NULL,
  request_type text,
  message text NOT NULL,
  source_path text,
  user_agent text,
  notification_sent boolean NOT NULL DEFAULT false,
  notification_error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at
  ON public.contact_submissions (created_at DESC);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_manage_contact_submissions" ON public.contact_submissions;
CREATE POLICY "service_role_manage_contact_submissions"
  ON public.contact_submissions FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE public.contact_submissions IS 'Public website contact/support requests submitted through the contact form.';
COMMENT ON COLUMN public.contact_submissions.notification_sent IS 'Whether the email notification was successfully sent by the contact-submit Edge Function.';