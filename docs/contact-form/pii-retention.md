# Contact form PII retention

Contact enquiries are stored in Supabase table `contact_submissions` (migration `009_contact_submissions.sql`). Fields include name, email, organization, request type, message, source path, and user agent.

## Access control

- Inserts: Supabase Edge Function `contact-submit` using the **service role** key (server-only).
- Reads/deletes: service role or Dashboard operators only. Anon and authenticated clients have no SELECT/UPDATE/DELETE policies for this table.
- Browser logs: `src/lib/observability.ts` scrubs email/token-like values before Sentry.

## Retention policy

| Item | Policy |
|------|--------|
| Default retention | **90 days** from `created_at` |
| Purpose | Respond to enquiries; short-term operational follow-up |
| Legal basis | Legitimate interest / consent via form submission (confirm with UNDP privacy counsel) |
| After retention | Rows must be deleted or anonymized |

Operators should also honour valid data-subject deletion requests promptly (see Export / delete below), regardless of the 90-day window.

## Scheduled purge (operators)

Run in the Supabase SQL Editor (service role / Dashboard) on a monthly cadence, or after confirming no open tickets for aged rows:

```sql
-- Preview
select id, created_at, email, left(message, 40) as message_preview
from contact_submissions
where created_at < now() - interval '90 days'
order by created_at asc;

-- Delete aged rows
delete from contact_submissions
where created_at < now() - interval '90 days';
```

Record the run date and row count in your ops log. A reusable script lives at `supabase/contact_submissions_purge.sql`.

## Export / delete (data-subject request)

1. Locate rows: `select * from contact_submissions where lower(email) = lower('person@example.com');`
2. Export needed fields to the requester via secure channel (not email to a shared inbox if avoidable).
3. Delete: `delete from contact_submissions where lower(email) = lower('person@example.com');`
4. Confirm related notification mailboxes do not retain unnecessary copies beyond org email retention rules.

## Related

- [gmail-notifications.md](./gmail-notifications.md)
- [../supabase-backup-restore.md](../supabase-backup-restore.md)
