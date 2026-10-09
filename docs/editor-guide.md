# SDG AI Lab — Content Editor Guide

This guide is for non-technical staff who manage the SDG AI Lab website content. You can update statistics, projects, news, team members, partners, and page content through the Admin Panel without involving a developer.

---

## Table of Contents

- [SDG AI Lab — Content Editor Guide](#sdg-ai-lab--content-editor-guide)
  - [Table of Contents](#table-of-contents)
  - [Accessing the Admin Panel](#accessing-the-admin-panel)
  - [Logging In](#logging-in)
  - [Dashboard Overview](#dashboard-overview)
  - [Where Content Appears on the Website](#where-content-appears-on-the-website)
  - [Managing Content](#managing-content)
    - [Adding a New Item](#adding-a-new-item)
    - [Editing an Existing Item](#editing-an-existing-item)
    - [Hiding Content Without Deleting (Archive)](#hiding-content-without-deleting-archive)
    - [Permanently Deleting Content](#permanently-deleting-content)
  - [Status: Draft, Published, Archived](#status-draft-published-archived)
  - [Uploading Images](#uploading-images)
  - [Tips and Reminders](#tips-and-reminders)
    - [Unsaved Changes](#unsaved-changes)
    - [Session Expired](#session-expired)
    - [Ordering Content](#ordering-content)
    - [Slug (URL)](#slug-url)
    - [Markdown](#markdown)
    - [Contact for Help](#contact-for-help)

---

## Accessing the Admin Panel

1. Open your web browser and go to the SDG AI Lab website.
2. In the address bar, add `/admin` at the end of the URL.

   - **Current staging**: `https://sdg-ai-lab.github.io/sdgailab.github.io/admin`
   - **Future production**: `https://sdgailab.org/admin`

3. You will see a login screen. You must have an editor account — contact your site administrator if you need access.

---

## Logging In

The admin uses **passwordless login** (no passwords to remember):

1. Enter your approved editor email address.
2. Click **Send Magic Link**.
3. Check your email inbox for a message from Supabase. The subject may mention "Magic Link" or "Sign in".
4. Click the link in the email. Your browser will open the admin dashboard.
5. You stay logged in until you click **Sign Out** or close the browser (depending on your session settings).

**If you don't receive the email:**

- Check your spam or junk folder.
- Wait a minute and try again.
- Ask your administrator to confirm your email has been invited in Supabase Auth and added to the CMS editor allowlist.

**If you see "Editor access required":**

- You successfully signed in, but your account is not approved for CMS access.
- Contact your site administrator and ask them to add your email to the `admin_users` allowlist.

**If you see "Too many login attempts" or a message about rate limits:**

- The system is temporarily blocking new magic-link emails to prevent abuse.
- Wait 15–30 minutes before clicking **Send Magic Link** again.
- Do not click the button repeatedly — that can extend the wait.
- If you still cannot log in after an hour, contact your site administrator.

---

## Dashboard Overview

After logging in, you see the **Dashboard** — a grid of cards, one for each content type:

| Card | What It Manages |
|------|-----------------|
| **Statistics** | Impact numbers on the homepage (e.g., "Active Projects: 23") |
| **Projects** | Project portfolio shown on the Projects page |
| **News** | News articles on the News page |
| **People** | Team members and advisors on the Team page |
| **Partners** | Partner logos on the Partners page and homepage |
| **Page Content** | Text blocks for the About and Volunteer pages |

Each card shows:
- The total number of items
- How many are draft, published, or archived
- A link — click the card to open that section

Use the **sidebar** on the left to jump between sections anytime.

---

## Where Content Appears on the Website

| Content Type | Where Visitors See It |
|--------------|------------------------|
| **Statistics** | Homepage — "Our Impact" section |
| **Projects** | Homepage (featured projects) + Projects page |
| **News** | News page |
| **People** | Team page |
| **Partners** | Homepage (partner logos) + Partners page |
| **Page Content** | About page, Volunteer page, Contact page (section blocks) |

Only items with status **Published** appear on the public site. Draft and archived items are visible only in the admin.

---

## Managing Content

### Adding a New Item

1. Click the content type in the sidebar (or on the dashboard).
2. Click **Add New** (top right of the table).
3. Fill in the required fields (marked with *).
4. Set **Status** to **Published** if you want it to show on the website immediately.
5. Click **Save** or **Create**.

### Editing an Existing Item

1. Go to the content listing.
2. Find the item and click **Edit**.
3. Make your changes.
4. Click **Save** or **Update**.

### Hiding Content Without Deleting (Archive)

1. Go to the content listing.
2. Find the item and click **Archive**.
3. The item disappears from the public website but stays in the admin. You can unarchive later by editing and changing status back to **Published**.

### Permanently Deleting Content

You can only permanently delete **archived** items:

1. Find the archived item in the listing.
2. Click **Delete** (or **Permanently Delete**).
3. Confirm in the pop-up dialog.
4. The item is removed from the database and cannot be recovered.

---

## Status: Draft, Published, Archived

| Status | Meaning | Visible on Website? |
|--------|---------|---------------------|
| **Draft** | Work in progress | No |
| **Published** | Live content | Yes |
| **Archived** | Hidden, not deleted | No |

- Use **Draft** when you are still preparing content.
- Use **Published** when the content is ready for visitors.
- Use **Archive** when you want to hide content but keep it for records.

---

## Uploading Images

Projects, news articles, people, and partners can have images (photos, logos, featured images).

**Supported formats:** JPEG, PNG, GIF, WebP, SVG  
**Maximum size:** 5 MB per file

**To add or replace an image:**

1. In the form, find the image field (e.g., "Image", "Photo", "Logo", "Featured Image").
2. Click **Upload** or **Choose file**.
3. Select an image from your computer.
4. After upload, you will see a preview. Use **Replace** to change it or **Remove** to delete it.

---

## Tips and Reminders

### Unsaved Changes

If you leave a form without saving, the admin will ask: **"You have unsaved changes. Leave anyway?"** Choose **Cancel** to stay and save, or **OK** to discard your changes.

### Session Expired

If you see **"Session expired — please log in again"**, your login has timed out. Enter your email again and click the new magic link to continue.

### Ordering Content

Many content types have a **Display Order** field. Lower numbers appear first. For example, `1` appears before `2`.

### Slug (URL)

For projects and news, a **Slug** is a short URL-friendly version of the title (e.g., "My Project" → "my-project"). It is usually generated automatically. You can edit it if needed.

### Markdown

Project descriptions, news articles, and some page content use **Markdown** — a simple format for bold, lists, links, and headings. The editor shows a preview of how it will look on the site.

### Contact for Help

- **Technical issues** (can't log in, errors, missing features): Contact your site administrator or developer.
- **Content questions** (what to publish, style, tone): Follow your team's editorial guidelines.

---

*Last updated: July 2026*
