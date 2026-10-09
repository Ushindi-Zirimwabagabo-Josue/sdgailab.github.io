-- Purge contact_submissions older than 90 days.
-- Run in Supabase SQL Editor with an operator account that can use the service role.
-- See docs/contact-form/pii-retention.md

-- Preview first:
-- select count(*) from contact_submissions where created_at < now() - interval '90 days';

delete from contact_submissions
where created_at < now() - interval '90 days';
