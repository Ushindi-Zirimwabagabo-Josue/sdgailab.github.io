# Feature Specification: Dynamic CMS Revamp

**Feature Branch**: `001-dynamic-cms-revamp`  
**Created**: 2026-02-28  
**Status**: Draft  
**Input**: User description: "Revamp the SDG AI Lab website to make it easy for non-technical staff to keep content up to date, while preserving the site's current look and feel."

## Clarifications

### Session 2026-02-28

- Q: Beyond the particles hero and impact statistics cards, which additional content sections should appear on the homepage? → A: Statistics cards + featured projects preview (3–4 highlighted projects) + partner logos section.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Editor Publishes Homepage Statistics (Priority: P1)

An editor logs into the content management interface and creates a new impact statistic (e.g., "Active Projects: 23"). They set its status to "published." Without any developer involvement or site redeployment, a visitor refreshing the homepage sees the new statistic displayed as a prominent card above the fold.

**Why this priority**: The homepage is the most-visited page and the primary vehicle for communicating the lab's impact. Making statistics instantly editable by non-technical staff is the single highest-value change — it solves the core problem (outdated content) in the most visible place.

**Independent Test**: Can be fully tested by creating a statistic entry, publishing it, and confirming it appears on the live homepage within seconds. Delivers immediate value even if no other content type is dynamic yet.

**Acceptance Scenarios**:

1. **Given** the homepage has no published statistics, **When** an editor publishes a new statistic with label "Volunteers" and value "1,200", **Then** a visitor loading the homepage sees a card displaying "Volunteers — 1,200" in the statistics section.
2. **Given** a published statistic "Active Projects: 15" exists, **When** an editor updates the value to "18" and saves, **Then** a visitor refreshing the homepage sees "Active Projects: 18" within 60 seconds.
3. **Given** a published statistic exists, **When** an editor changes its status to "archived", **Then** the statistic no longer appears on the homepage.
4. **Given** multiple published statistics exist, **When** an editor reorders them via a display-order field, **Then** the homepage reflects the new order.

---

### User Story 2 — Editor Manages Projects with Status Indicators (Priority: P2)

An editor creates a new project entry with a title, description, status (e.g., "Active"), and optionally marks it as "deployed." They publish it, and the project immediately appears on the Projects page with a clear, visible status badge. Visitors can scan the full project list and quickly understand which projects are active, completed, under development, or on hold.

**Why this priority**: Projects are the lab's primary output. Showing current, accurately-labeled projects is essential for stakeholders, partners, and potential volunteers to understand the lab's work.

**Independent Test**: Can be fully tested by creating a project, assigning a status, publishing it, and confirming it appears on the projects page with the correct status indicator. Delivers standalone value as a browsable, always-current project portfolio.

**Acceptance Scenarios**:

1. **Given** the Projects page exists, **When** an editor publishes a project with status "Active", **Then** a visitor sees the project listed with an "Active" status indicator.
2. **Given** a published project has status "Active", **When** an editor changes its status to "Completed", **Then** visitors see the updated "Completed" indicator within 60 seconds.
3. **Given** a project is marked as "Deployed", **When** a visitor views the project listing, **Then** the deployed attribute is visible separately from the project status.
4. **Given** no published projects exist, **When** a visitor navigates to the Projects page, **Then** they see a meaningful empty-state message (not a blank page or error).
5. **Given** projects with different statuses exist, **When** a visitor views the Projects page, **Then** each project's status is distinguishable at a glance (e.g., through color-coded badges or labels).

---

### User Story 3 — Editor Publishes News Articles (Priority: P3)

An editor writes a news article with a title, body text, optional image, and publish date. They publish it, and the article immediately appears on the News page. Visitors can browse recent news in reverse-chronological order.

**Why this priority**: The team needs to communicate updates, announcements, and results frequently. A dynamic news section allows timely publishing without developer assistance, keeping the site fresh and relevant.

**Independent Test**: Can be fully tested by publishing a news article and confirming it appears at the top of the News listing. Delivers standalone value as a self-service news channel.

**Acceptance Scenarios**:

1. **Given** the News page exists, **When** an editor publishes an article titled "New Partnership Announced", **Then** a visitor sees it at the top of the news listing.
2. **Given** multiple published articles exist, **When** a visitor views the News page, **Then** articles are displayed in reverse-chronological order by publish date.
3. **Given** a published article exists, **When** an editor archives it, **Then** it no longer appears on the News page.
4. **Given** an editor creates an article with status "draft", **When** a visitor views the News page, **Then** the draft article is not visible.

---

### User Story 4 — Editor Updates People Listings (Priority: P4)

An editor adds a new team member by entering their name, role, photo, and short biography. They publish the person and they immediately appear on the Team page. (The Advisory Board page has been removed; advisory board data remains in the data model for potential future use per constitution.)

**Why this priority**: Staff and advisors change over time. Keeping these listings current is important for credibility and transparency, and editors should be able to do it without waiting for a developer.

**Independent Test**: Can be fully tested by adding a person, assigning them to a group, publishing, and confirming they appear on the correct page. Delivers standalone value as an always-current team directory.

**Acceptance Scenarios**:

1. **Given** the Team page exists, **When** an editor publishes a person in the "Team" group, **Then** a visitor sees that person listed on the Team page.
2. ~~**Given** the Advisory Board page exists, **When** an editor publishes a person in the "Advisory Board" group, **Then** a visitor sees that person listed on the Advisory Board page (not the Team page).~~ *(Removed — Advisory Board page removed from scope.)*
3. **Given** a published team member exists, **When** an editor changes their role title and saves, **Then** the updated title appears on the site within 60 seconds.
4. **Given** multiple people exist in a group, **When** an editor adjusts their display order, **Then** the page reflects the new ordering.

---

### User Story 5 — Editor Manages Partners (Priority: P5)

An editor adds a partner by uploading a logo, entering the partner's name and website URL, and publishing. The partner immediately appears in the Partners section (on the homepage and/or a dedicated Partners page). Removing or archiving a partner removes them from the site.

**Why this priority**: Partner visibility matters for institutional credibility and relationship management, but it changes less frequently than news or projects. Still, editors need self-service control.

**Independent Test**: Can be fully tested by adding a partner with a logo and URL, publishing, and confirming it appears. Delivers standalone value as a maintained partner showcase.

**Acceptance Scenarios**:

1. **Given** the Partners section exists, **When** an editor publishes a partner with a logo and URL, **Then** visitors see the partner logo displayed with a link to the partner's website.
2. **Given** a published partner exists, **When** an editor archives it, **Then** the partner no longer appears on the site.
3. **Given** a partner logo fails to load, **When** a visitor views the Partners section, **Then** the partner's name is displayed as a text fallback (not a broken image).

---

### User Story 6 — Visitor Experiences Restructured Homepage (Priority: P1)

A visitor arrives at the SDG AI Lab homepage. Instead of long descriptive text blocks, they see the particles hero followed by prominent impact statistics cards. Below the statistics, a featured projects preview highlights 3–4 key projects with their status. Further down, a partner logos section showcases institutional partners. The "Our Approach" narrative is no longer on the homepage; it lives on the About page. The "Volunteer Data Scientist Initiative" content is no longer on the homepage; it has its own dedicated Volunteer page accessible from the site navigation.

**Why this priority**: This restructuring is tightly coupled with Story 1 (homepage statistics) and represents the primary content-architecture change. Together they deliver the redesigned homepage experience the client explicitly requested.

**Independent Test**: Can be fully tested by loading the homepage and verifying that statistics are prominent, featured projects are previewed, partner logos are displayed, "Our Approach" content is absent (and present on About), and "Volunteer Initiative" content is absent (and present on the Volunteer page).

**Acceptance Scenarios**:

1. **Given** a visitor loads the homepage, **When** the page renders, **Then** impact statistics cards are visible above the fold.
2. **Given** the homepage has loaded, **When** a visitor scrolls past the statistics section, **Then** a featured projects preview section is visible showing 3–4 highlighted projects with their status indicators.
3. **Given** the homepage has loaded, **When** a visitor scrolls further, **Then** a partner logos section is visible with clickable logos linking to partner websites.
4. **Given** the homepage has loaded, **When** a visitor scans the page, **Then** no "Our Approach" content block is present.
5. **Given** the homepage has loaded, **When** a visitor scans the page, **Then** no "Volunteer Data Scientist Initiative" content block is present.
6. **Given** a visitor navigates to the About page, **When** the page renders, **Then** the "Our Approach" content is present.
7. **Given** the site navigation is visible, **When** a visitor looks for the Volunteer page, **Then** a clearly-labeled link to "Volunteer" (or "Volunteering with Us") is available and leads to a page with the initiative content.
8. **Given** a visitor views the homepage on a mobile device, **When** the page renders, **Then** the particles hero effect is visible, statistics cards are readable, featured projects are visible, and partner logos are displayed — all without horizontal scrolling.

---

### User Story 7 — Visitor Contacts the Lab (Priority: P6)

A visitor navigates to the Contact page and finds a clear, working way to reach the SDG AI Lab team via email.

**Why this priority**: Contact is essential but simple in scope for this phase. A basic email-based contact method is sufficient and carries low implementation risk.

**Independent Test**: Can be fully tested by navigating to the Contact page and verifying the email contact method works.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the Contact page, **When** the page renders, **Then** an email address or mailto link is clearly visible.
2. **Given** a visitor is on a mobile device, **When** they tap the email contact link, **Then** their device's default email application opens with the lab's address pre-filled.

---

### Edge Cases

- **Content service unavailable**: If the content service is temporarily unreachable, the site should display a user-friendly loading state or cached content rather than a blank page or error trace.
- **Empty content sections**: If no published items exist for a content type (statistics, projects, news, people, partners), the corresponding page or section should show a graceful empty state with appropriate messaging (e.g., "No news articles yet") — not a broken layout.
- **Very long content**: If an editor publishes an extremely long news article or project description, the layout should handle overflow gracefully (text wrapping, truncation in listings with "read more" links).
- **Oversized or malformed images**: If an editor uploads a very large or non-standard image (for a person's photo, partner logo, or news article), the site should resize/constrain it rather than breaking the layout.
- **Concurrent edits**: If two editors update the same content simultaneously, the last save wins and no data corruption occurs. Editors see the most recent version upon reload.
- **Rapid content changes**: If an editor publishes and then immediately archives an item, the site reflects only the final state — visitors never see stale or flickering content.

## Requirements *(mandatory)*

### Functional Requirements

**Content Management**

- **FR-001**: All primary content types (statistics, projects, news articles, people, partners) MUST be editable by authorized non-technical staff through a management interface outside the website codebase.
- **FR-002**: Content changes MUST appear on the live site within 60 seconds of publishing, without code changes or redeployment.
- **FR-003**: Every content type MUST support a publish lifecycle with at minimum three states: draft, published, and archived. Only content in the "published" state is visible to site visitors.
- **FR-004**: Only published content MUST be accessible to unauthenticated site visitors. Draft and archived content MUST NOT be exposed to the public under any circumstance.

**Homepage**

- **FR-005**: The homepage MUST display impact statistics as visually prominent cards.
- **FR-006**: Each statistic card MUST display at minimum a label and a value (e.g., "Active Projects — 23").
- **FR-007**: Statistics MUST support editor-controlled display ordering.
- **FR-008**: The homepage MUST display a featured projects preview section showing 3–4 highlighted projects with their status indicators. Featured projects MUST be selectable by editors (e.g., via a "featured" flag or display-order ranking).
- **FR-009**: The homepage MUST display a partner logos section showing published partners with clickable logos linking to their websites.
- **FR-010**: The homepage MUST NOT contain the "Our Approach" content block (moved to About page per FR-017).
- **FR-011**: The homepage MUST NOT contain the "Volunteer Data Scientist Initiative" content block (moved to Volunteer page per FR-018).
- **FR-012**: The homepage MUST retain the particles hero visual effect.
- **FR-013**: The homepage section order MUST be: particles hero → statistics cards → featured projects preview → partner logos.

**Projects**

- **FR-014**: The Projects page MUST display a list of published projects, each with a clearly visible status indicator.
- **FR-015**: Supported project statuses MUST include at minimum: Active, Completed, Under Development, On Hold. "Deployed/not deployed" MUST be treated as a separate attribute if included, not as a status value.
- **FR-016**: Individual projects MUST have their own detail page accessible by clicking from the listing. Each detail page MUST show the full project description, status, and deployed flag (if applicable).

**Content Restructuring**

- **FR-017**: An About page MUST exist and MUST include the "Our Approach" content (relocated from the homepage).
- **FR-018**: A Volunteer page MUST exist (labeled "Volunteer" or "Volunteering with Us") and MUST include the "Volunteer Data Scientist Initiative" content (relocated from the homepage).

**News**

- **FR-019**: The News page MUST display published articles in reverse-chronological order by publish date.
- **FR-020**: Each news article MUST have at minimum: a title, body content, and a publish date.
- **FR-021**: Individual news articles MUST have their own detail page accessible by clicking from the listing.

**People**

- **FR-022**: The site MUST display people on a Team page. *(Advisory Board page removed from scope; the data model retains the `advisory_board` group type for future use.)*
- **FR-023**: Each person entry MUST include at minimum: name, role/title, and photo. A short biography is optional but supported.
- **FR-024**: People MUST support editor-controlled display ordering within each group.

**Partners**

- **FR-025**: The site MUST display published partners with their logo and a link to their website, both on the homepage partner logos section and on a dedicated Partners page.
- **FR-026**: If a partner logo fails to load, the partner's name MUST be displayed as a text fallback.

**Contact**

- **FR-027**: The Contact page MUST provide a working email-based contact method (mailto link or displayed email address).

**Accessibility & Responsiveness**

- **FR-028**: All pages MUST be mobile-first responsive, providing a usable experience across phone, tablet, and desktop screen sizes.
- **FR-029**: All pages MUST meet WCAG 2.1 AA accessibility standards.
- **FR-030**: No content or functionality MUST depend solely on hover interactions, color alone, or mouse-only input.

**Design & Brand**

- **FR-031**: The site MUST preserve the existing SDG AI Lab visual identity (colors, typography, overall aesthetic). This is a modernization, not a rebrand.
- **FR-032**: The particles hero effect MUST be retained on the homepage.

**Future-Proofing**

- **FR-033**: The site architecture MUST NOT preclude adding multilingual support in the future, even though it is not required now.

**Cost**

- **FR-034**: All tools, services, and dependencies MUST be free or open-source.

### Key Entities

- **Statistic**: Represents a single impact metric displayed on the homepage. Attributes: label, value, optional icon/image, display order, publish status.
- **Project**: Represents a lab project. Attributes: title, description, status (active / completed / under_development / on_hold), optional deployed flag, optional featured flag (for homepage preview), optional image, display order, publish status.
- **News Article**: Represents a news or blog post. Attributes: title, body, optional summary, optional featured image, author name, publish date, publish status.
- **Person**: Represents a team member (the data model also supports an `advisory_board` group for future use). Attributes: name, role/title, photo, group (team / advisory_board), optional biography, display order, publish status.
- **Partner**: Represents an institutional partner. Attributes: name, logo image, website URL, display order, publish status.
- **Page Content**: Represents editable content blocks for semi-static pages (About, Volunteer, Contact). Attributes: page identifier, section identifier, body content, publish status.

## Assumptions

- Editors access the content management interface separately from the public website; the public site itself does not include an editor login or admin panel.
- The content management service provides its own authentication for editors; the public-facing website requires no visitor login.
- All editors have equal access to all content types (no per-content-type permission restrictions). If granular permissions are needed later, they can be layered on without restructuring.
- Content will be in English only for this launch; multilingual fields are not required now.
- The particles hero effect is the only required visual/animation effect; no other complex animations are in scope.
- Homepage composition (top to bottom): particles hero → impact statistics cards → featured projects preview (3–4 items) → partner logos section.
- Homepage statistics are simple label + value pairs displayed as cards. A world map visualization is a nice-to-have (not a launch requirement).
- News articles and projects each have individual detail pages (click-through from their respective listing pages).
- Partners appear in two places: a logo strip on the homepage and a dedicated Partners page with fuller detail.
- "Immediately" means within seconds (under 60s) of an editor publishing — no manual rebuild or deployment step in between.
- If the content service is temporarily unreachable, the site shows a brief loading indicator followed by a user-friendly fallback message. Cached/stale content is not required.
- SEO and social-sharing optimization for individual news or project detail pages is not a priority for this phase.
- Site search functionality is not in scope.
- A staging or preview environment for draft content is not required.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A non-technical editor can publish a new homepage statistic and see it live on the site within 60 seconds, without any developer assistance.
- **SC-002**: A non-technical editor can add or update a project (including its status) and see the change reflected on the Projects page within 60 seconds.
- **SC-003**: A non-technical editor can publish a news article and see it listed on the News page within 60 seconds.
- **SC-004**: A non-technical editor can update a team member's information and see the change reflected within 60 seconds.
- **SC-005**: A non-technical editor can add or remove a partner and see the change on the site within 60 seconds.
- **SC-006**: All pages pass automated WCAG 2.1 AA accessibility checks with zero critical violations.
- **SC-007**: All pages are fully usable on a mobile device (360px-width viewport) without horizontal scrolling or overlapping content.
- **SC-008**: The homepage displays impact statistics above the fold on both mobile and desktop viewports.
- **SC-009**: Every listed project displays its status in a way that is distinguishable at a glance (e.g., color-coded or labeled badges).
- **SC-010**: The site's visual identity is recognizable as the same SDG AI Lab brand, as confirmed by the client team.
