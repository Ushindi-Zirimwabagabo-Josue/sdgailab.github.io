# Supabase — SDG AI Lab CMS

## Migrations (run in order)

| File | Purpose |
|------|---------|
| `migrations/001_initial_schema.sql` | Tables, RLS, `is_admin_user()`, triggers |
| `migrations/002_storage_policies.sql` | `public-assets` storage policies (create bucket first) |
| `migrations/003_secure_editor_access.sql` | Allowlist-gated editor access (replaces broad authenticated policies) |
| `migrations/004_project_portfolio_metadata.sql` | Extra project portfolio columns |
| `migrations/005_admin_users_management_model.sql` | Documents allowlist ops model (no client writes) |
| `migrations/006_project_content_template_fields.sql` | Structured public project-detail fields |
| `migrations/007_project_portfolio_workbook_fields.sql` | Workbook-backed portfolio fields |
| `migrations/008_geographic_reach.sql` | Geographic reach content (historical create; superseded by 012) |
| `migrations/009_contact_submissions.sql` | Contact submissions and notification workflow |
| `migrations/010_evolution_timeline.sql` | Institutional evolution timeline content |
| `migrations/011_publications.sql` | Publications content |
| `migrations/012_drop_geographic_reach.sql` | Drops unused `geographic_reach` table after app unwiring |

## Verification

- **C1 hardening:** `verify_c1_hardening.sql` — run in SQL Editor; all checks should be `PASS` or `INFO`
- **Operator guide:** [docs/supabase-c1-staging-signoff.md](../docs/supabase-c1-staging-signoff.md)

## Seeds (optional, not migrations)

| File | Purpose |
|------|---------|
| `geographic_reach_seed.sql` | Obsolete seed for dropped `geographic_reach` table (do not run after migration 012) |
| `seed.sql` | Sample CMS content for development |
| `team_members.sql` | Upsert team into `people` table |
| `demo_day_projects.sql` | Demo project data |
| `project_portfolio_bulk_import.sql` | Upserts the approved 23-project portfolio workbook into public projects |

Seeds can be re-run; migrations should be applied once per environment (idempotent where noted).

## Definitive project portfolio import

Run `migrations/004_project_portfolio_metadata.sql`,
`migrations/006_project_content_template_fields.sql`, and
`migrations/007_project_portfolio_workbook_fields.sql` first. Then run
`project_portfolio_bulk_import.sql` in the Supabase SQL Editor.

The import is idempotent: it matches records by slug, normalized title, and the
established PFS legacy slug, then updates the matching project or inserts a new
one. It preserves existing CMS-managed card images and existing video URLs when
the workbook has no media link. It does not archive projects that are absent
from the workbook.

## Contact form email notifications

The public contact form uses the `contact-submit` Supabase Edge Function.

Apply the migration:

```sql
supabase/migrations/009_contact_submissions.sql
```

For the temporary Gmail notification setup, use Google Apps Script as the email webhook. See:

```text
docs/contact-form/gmail-notifications.md
```

Configure Supabase secrets after creating the Apps Script web app:

```bash
supabase secrets set CONTACT_EMAIL_WEBHOOK_URL="https://script.google.com/macros/s/.../exec"
supabase secrets set CONTACT_EMAIL_WEBHOOK_SECRET="your-long-random-secret"
supabase secrets set CONTACT_NOTIFICATION_TO="josueuzj9@gmail.com"
supabase functions deploy contact-submit
```

For production, replace `CONTACT_NOTIFICATION_TO` with the Lab inbox and use an approved institutional sender/workflow where possible.
