# Feature Specification: Admin Content Management Interface

**Feature ID**: 002-admin-ui  
**Date**: 2026-03-02  
**Status**: Draft  
**Depends on**: [001-dynamic-cms-revamp](../001-dynamic-cms-revamp/spec.md) (existing database schema, RLS policies, Supabase Auth)

## Problem Statement

The SDG AI Lab website uses Supabase as its CMS backend. Currently, the only way to manage content is through Supabase Studio — a raw database interface that exposes tables, columns, and SQL concepts. Non-technical staff (communications officers, project managers, interns) find this intimidating and error-prone. They risk editing wrong columns, forgetting to set `status = 'published'`, or breaking content by entering malformed data.

The team needs a purpose-built, user-friendly admin interface where editors can manage all website content (statistics, projects, news, people, partners, page content) through intuitive forms — without understanding database concepts.

## User Stories

### User Story 1 — Editor Authenticates via Magic Link (Priority: P1)

An editor navigates to the admin page and enters their email address. They receive a magic link in their inbox, click it, and are authenticated into the admin interface. No password is needed.

**Why this priority**: Authentication gates all other functionality. Without it, nothing else in the admin works.

**Acceptance Scenarios**:

1. **Given** an editor navigates to `/admin`, **When** they are not authenticated, **Then** they see a login form requesting their email address.
2. **Given** an editor submits their email, **Then** the UI always displays "Check your email for the magic link" — regardless of whether the email is associated with an account (to prevent revealing account existence). If the email is valid, a magic link arrives within 60 seconds.
3. **Given** an editor clicks the magic link, **Then** they are redirected to the admin dashboard in an authenticated state.
4. **Given** an authenticated editor, **When** they click "Sign Out", **Then** their session is terminated and they are returned to the login screen.
5. **Given** an unauthenticated user attempts to access any admin page directly, **Then** they are redirected to the login screen.
6. **Given** an authenticated editor's session expires or token refresh fails, **Then** the admin displays a "Session expired — please log in again" message and redirects to the login screen. If a form has unsaved changes, the unsaved-changes warning (FR-018a) fires first.

---

### User Story 2 — Editor Views Dashboard Overview (Priority: P1)

After logging in, an editor sees a dashboard with an at-a-glance overview of all content types — total counts, status breakdowns, and quick links to manage each type.

**Why this priority**: The dashboard is the entry point for all editor workflows. It provides orientation and reduces time to find the right content section.

**Acceptance Scenarios**:

1. **Given** an authenticated editor, **When** they land on the dashboard, **Then** they see cards for each content type (Statistics, Projects, News, People, Partners, Page Content) showing the total count of items per type.
2. **Given** the dashboard, **When** an editor clicks a content type card, **Then** they are navigated to the listing page for that content type.
3. **Given** the dashboard, **Then** it displays a count breakdown by status (draft/published/archived) for each content type.

---

### User Story 3 — Editor Manages Statistics (Priority: P1)

An editor can view, create, edit, reorder, and change the publish status of homepage statistics through a simple form interface.

**Why this priority**: Statistics are the most frequently updated content on the homepage and serve as the simplest content type to validate the admin CRUD pattern.

**Acceptance Scenarios**:

1. **Given** the Statistics listing page, **Then** the editor sees all statistics (including drafts and archived) in a table with columns: label, value, status, display order.
2. **Given** the listing page, **When** an editor clicks "New Statistic", **Then** a form appears with fields: label (text), value (text), icon name (optional text), display order (number), and status (dropdown: draft/published/archived).
3. **Given** a valid form, **When** the editor clicks "Save", **Then** the statistic is created in Supabase and appears in the listing.
4. **Given** an existing statistic, **When** the editor clicks "Edit", **Then** the form is pre-filled with the current values and can be updated.
5. **Given** an existing statistic, **When** the editor changes its status to "Published" and saves, **Then** the `published_at` timestamp is set (if not already set) and the statistic appears on the public site.
6. **Given** an existing statistic, **When** the editor changes its status to "Archived", **Then** it disappears from the public site but remains visible in the admin listing.

---

### User Story 4 — Editor Manages Projects (Priority: P2)

An editor can manage projects through forms that include a Markdown editor for the description, image upload, status selection, and feature/deploy toggles.

**Why this priority**: Projects are a core content type with richer fields (Markdown, images, project status, boolean flags) that validate the full form pattern.

**Acceptance Scenarios**:

1. **Given** the Projects listing page, **Then** the editor sees all projects with columns: title, project status, publish status, featured flag, deployed flag, display order.
2. **Given** a project form, **Then** it includes: title (text), slug (auto-generated from title, editable), description (Markdown editor with live preview), project status (dropdown: active/completed/under_development/on_hold), is_deployed (checkbox), is_featured (checkbox), image upload, display order (number), status (dropdown: draft/published/archived).
3. **Given** the slug field, **When** the editor types a title, **Then** a URL-safe slug is auto-generated. The editor can override it manually.
4. **Given** the image upload field, **When** the editor selects a file, **Then** it is uploaded to the Supabase Storage `public-assets/projects/` folder and the resulting URL is saved to the record.
5. **Given** the Markdown editor, **Then** it shows a side-by-side or toggle view with raw Markdown on the left and rendered preview on the right.

---

### User Story 5 — Editor Manages News Articles (Priority: P2)

An editor can create and manage news articles with Markdown body content, optional featured image, and editorial metadata.

**Why this priority**: News articles are the content type most frequently created (vs. edited), validating the create-heavy workflow.

**Acceptance Scenarios**:

1. **Given** the News listing page, **Then** articles are shown in reverse-chronological order by publish date with columns: title, author, publish date, status.
2. **Given** a news form, **Then** it includes: title, slug (auto-generated), body (Markdown editor with preview), summary (optional textarea), featured image upload, author name (text), publish date (date picker), status (dropdown).
3. **Given** the image upload field, **When** the editor uploads an image, **Then** it goes to `public-assets/news/` and the URL is saved.

---

### User Story 6 — Editor Manages People (Priority: P2)

An editor can add and manage team members (and advisory board members) with photo uploads and biographical information.

**Acceptance Scenarios**:

1. **Given** the People listing page, **Then** entries are grouped or filterable by group type (team / advisory_board).
2. **Given** a person form, **Then** it includes: name, role/title, group type (dropdown: team/advisory_board), photo upload, biography (optional textarea), display order, status.
3. **Given** the photo upload field, **When** the editor uploads a photo, **Then** it goes to `public-assets/people/` and the URL is saved.

---

### User Story 7 — Editor Manages Partners (Priority: P2)

An editor can manage partner entries with logo uploads and website links.

**Acceptance Scenarios**:

1. **Given** the Partners listing page, **Then** entries are shown with: name, logo preview, website URL, status, display order.
2. **Given** a partner form, **Then** it includes: name, website URL, logo upload, display order, status.
3. **Given** the logo upload field, **When** the editor uploads a logo, **Then** it goes to `public-assets/partners/` and the URL is saved.

---

### User Story 8 — Editor Manages Page Content (Priority: P2)

An editor can manage the dynamic content blocks used on the About and Volunteer pages through a Markdown editor.

**Acceptance Scenarios**:

1. **Given** the Page Content listing page, **Then** entries are shown with: page slug, section slug, status.
2. **Given** a page content form, **Then** it includes: page slug (dropdown or text), section slug (text), body (Markdown editor with preview), status.
3. **Given** the page slug field, **Then** it suggests known values (about, volunteer, contact) but allows custom values.

---

## Functional Requirements

**Authentication**

- **FR-001**: The admin interface MUST authenticate editors using Supabase Auth magic link (passwordless email).
- **FR-002**: Unauthenticated users MUST be redirected to the login page when attempting to access any admin route.
- **FR-003**: The admin MUST provide a sign-out function that terminates the Supabase session.
- **FR-004**: Only users with Supabase Auth accounts can access the admin. No public registration — accounts are created by a Supabase admin.

**Dashboard**

- **FR-005**: The dashboard MUST show a card for each content type with the total item count.
- **FR-006**: Each card MUST show a status breakdown (draft / published / archived counts).
- **FR-007**: Each card MUST link to the listing page for that content type.

**Content Listings**

- **FR-008**: Each content type MUST have a listing page showing all items (including drafts and archived).
- **FR-009**: Listings MUST display the publish status with a visual indicator (color-coded badge).
- **FR-010**: Listings MUST include an "Add New" button to create a new item.
- **FR-011**: Each row MUST include "Edit" and "Archive" actions. Archiving sets the item's status to "Archived" (soft delete). For items already archived, a "Permanently Delete" action MUST be available.
- **FR-012**: Permanent deletion MUST require a confirmation dialog before executing. Archiving does not require confirmation.

**Content Forms**

- **FR-013**: All forms MUST validate required fields before submission and show inline error messages.
- **FR-014**: Slug fields MUST auto-generate a URL-safe slug from the title field but allow manual override.
- **FR-015**: Status fields MUST present as a dropdown with three options: Draft, Published, Archived.
- **FR-016**: When status is changed to "Published" and `published_at` is null, the system MUST set `published_at` to the current timestamp.
- **FR-017**: Display order fields MUST accept numeric input.
- **FR-018**: All form submissions (create and update) MUST provide clear success/error feedback (toast notification or inline message).
- **FR-018a**: If a form has unsaved changes, navigating away MUST warn the editor before discarding changes. For tab close or external navigation, use the browser's native "Leave page?" dialog (`beforeunload`). For internal SPA navigation (hash route changes), use a custom confirmation prompt before allowing the route change.

**Markdown Editing**

- **FR-019**: Fields that store Markdown content (project description, news body, page content body) MUST provide a Markdown editor with live preview.
- **FR-020**: The preview MUST render Markdown to HTML using the same rendering approach as the public site (`marked` library).

**Image Upload**

- **FR-021**: Image fields MUST provide a file picker that uploads to the Supabase Storage `public-assets` bucket.
- **FR-022**: After upload, the public URL MUST be automatically saved to the record's image field.
- **FR-023**: The form MUST show a thumbnail preview of the currently uploaded image.
- **FR-024**: The editor MUST be able to remove or replace an existing image.
- **FR-025**: Uploads MUST be restricted to image file types (JPEG, PNG, GIF, WebP, SVG) and a reasonable maximum size (5MB).

**Cross-Cutting**

- **FR-026**: The admin interface MUST be mobile-responsive (usable at 360px viewport width).
- **FR-027**: The admin MUST meet WCAG 2.1 AA accessibility requirements.
- **FR-028**: The admin MUST use free/open-source tools only.
- **FR-029**: The admin MUST NOT require any changes to the existing Supabase database schema.
- **FR-030**: All data reads and writes MUST use the authenticated Supabase client (using the user's session token, not the anon key or service role key).

## Key Entities

No new entities are introduced. The admin interface operates on the 6 existing entities defined in [001-dynamic-cms-revamp/data-model.md](../001-dynamic-cms-revamp/data-model.md):

- **Statistic** — label, value, icon_name, display_order, status
- **Project** — title, slug, description (Markdown), project_status, is_deployed, is_featured, image_url, display_order, status
- **NewsArticle** — title, slug, body (Markdown), summary, featured_image_url, author_name, publish_date, status
- **Person** — name, role_title, photo_url, group_type, biography, display_order, status
- **Partner** — name, logo_url, website_url, display_order, status
- **PageContent** — page_slug, section_slug, body (Markdown), status

## Assumptions

- Editor accounts are created manually by a Supabase admin (via Supabase dashboard > Authentication). There is no self-registration.
- All editors have equal access to all content types. Role-based permissions (e.g., "news editor" vs "project editor") are not required for this version.
- The admin interface is a client-side SPA within the existing Astro site (React island at `/admin`), not a separate application.
- Supabase Auth magic link emails are sent via Supabase's built-in email service (free tier allows 4 emails/hour; sufficient for a small editing team).
- The admin does not need undo/version history. Editors can manually revert by editing a record.
- Bulk operations (e.g., publish 10 items at once) are not required. Editors manage items one at a time.
- The admin does not need a "preview" mode showing how content will appear on the public site. The live preview of Markdown in the form is sufficient.
- Image uploads are limited to 5MB per file. Supabase Storage free tier provides 1GB total.

## Out of Scope

- Self-registration or public sign-up for editor accounts.
- Role-based access control (per-content-type permissions).
- Content versioning or audit logs.
- Bulk operations (multi-select, batch publish).
- Scheduled publishing (publish at a future date/time).
- Content preview in the context of the public site layout.
- Drag-and-drop reordering (number-based reordering via display_order field is sufficient for this version).
- Media library or centralized asset management beyond per-field upload.

## Clarifications

### Session 2026-03-02

- Q: Should "Delete" be a hard delete (permanent) or soft delete (archive), or both? → A: Both — "Archive" as the default action (soft delete), with a separate "Permanently Delete" option available only for already-archived items (two-step destruction).
- Q: Should the admin warn editors about unsaved changes when navigating away from a form? → A: Yes — use the browser's native "Leave page?" confirmation dialog when a form has been modified but not saved.
- Q: What should the login screen show when an editor enters an email not associated with any account? → A: Always show the same "Check your email" success message regardless — do not reveal whether the email exists (security best practice).

## Success Criteria

### Measurable Outcomes

- **SC-001**: A non-technical editor can log in via magic link and reach the admin dashboard within 2 minutes of receiving the email.
- **SC-002**: An editor can create a new statistic with label, value, and "Published" status, and see it appear on the public homepage within 60 seconds.
- **SC-003**: An editor can create a news article with Markdown body and featured image, publish it, and see it on the public News page within 60 seconds.
- **SC-004**: An editor can upload an image for a project, person, or partner, and the image appears correctly on the public site.
- **SC-005**: An editor can change any item's status from Published to Archived, and it disappears from the public site within 60 seconds.
- **SC-006**: The admin interface is usable on a 360px mobile viewport without horizontal scrolling.
- **SC-007**: The admin interface passes automated WCAG 2.1 AA accessibility checks with zero critical violations.
