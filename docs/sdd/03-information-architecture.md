# Information Architecture (IA)

## SDG AI Lab Website Revamp

| Field | Value |
|-------|-------|
| **Document version** | 0.1.0 (Draft) |
| **Date** | February 2026 |
| **Status** | Draft -- pending client input on sitemap expansion |

---

## 1. Current Sitemap

The existing site has a flat 6-page structure with no hierarchy:

```
Home (index.html)
├── About Us (about-us.html)
├── Advisory Board (advisory-board.html)
├── Projects (active-projects.html)
├── Newsroom (newsroom.html)
└── Contact Us (contact-us.html)
```

**Issues with current IA:**
- Flat structure with no sub-pages or content depth
- "Projects" nav label says "projects" (lowercase) while page title says "Active Projects"
- No pathway for volunteers despite being central to the lab's model
- No publications, resources, or open-source repository visibility
- Newsroom is a dead-end with 5 stale external links
- No search, no filtering, no content discovery beyond the main nav

---

## 2. Proposed Sitemap (Expanded)

This proposed sitemap adds depth where the current site is thin. Each section is marked with its dependency on client confirmation.

```
Home
│
├── About
│   ├── Overview (lab mission, history, organizational placement)
│   ├── Team (named members with bios and photos)
│   └── Advisory Board (current member profiles)
│
├── Projects
│   ├── Active Projects (current project cards with SDG tags)
│   ├── Completed Projects (archived work with outcomes)
│   └── [Individual Project Pages] (optional deep-dive per project)
│
├── Resources [NEW]
│   ├── Publications (papers, reports, presentations)
│   ├── Open Source (links to GitHub repositories)
│   └── Datasets (if applicable)
│
├── News
│   ├── Article List (paginated, with categories)
│   └── [Individual Article Pages] (if hosting on-site)
│
├── Get Involved [NEW]
│   ├── Volunteer (data scientist application flow)
│   └── Partner With Us (partnership inquiry)
│
└── Contact
```

### Dependency Matrix

| Proposed Section | Depends On | Client Question |
|-----------------|------------|-----------------|
| Team (named members) | Client provides names, bios, photos | Q2.5 |
| Completed Projects | Client identifies which are completed | Q2.2 |
| Individual Project Pages | Client confirms depth is wanted | Q2.2 |
| Resources section | Client confirms interest | Q2.6 |
| On-site article hosting | Client newsroom strategy decision | Q2.3 |
| Volunteer portal | Client confirms interest | Q8.2 |
| Partner With Us | Client confirms interest | Q8.2 |

---

## 3. Navigation Design

### Primary Navigation (Desktop)

```
[Logo] SDG AI Lab     About ▾    Projects ▾    Resources    News    Get Involved ▾    Contact
                      ├ Overview  ├ Active                          ├ Volunteer
                      ├ Team      └ Completed                      └ Partner
                      └ Board
```

### Primary Navigation (Mobile)

Hamburger menu with expandable sections. Same hierarchy as desktop, but vertically stacked with accordion-style sub-items.

### Footer Navigation

```
┌─────────────────────────────────────────────────────────────────┐
│  SDG AI Lab                                                     │
│                                                                 │
│  About          Projects       Resources      Connect           │
│  · Overview     · Active       · Publications  · Contact Us     │
│  · Team         · Completed    · Open Source    · Volunteer      │
│  · Board                       · Datasets       · Newsletter    │
│                                                                 │
│  [X] [GitHub] [LinkedIn]                                        │
│                                                                 │
│  © 2026 SDG AI Lab | UNDP Digital, AI and Innovation Hub        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Page Hierarchy and Content Map

### 4.1 Home

| Section | Content | Priority |
|---------|---------|----------|
| Hero | Tagline, CTA button(s), background visual | Must have |
| Mission / Approach | Brief lab description with key methodology points | Must have |
| Impact Numbers | Key metrics (projects, volunteers, countries) | Should have |
| Featured Projects | 2-3 highlighted project cards | Should have |
| Partners | Logo grid of current supporters | Must have |
| CTA Banner | "Get Involved" or "Contact Us" call-to-action | Should have |

### 4.2 About > Overview

| Section | Content | Priority |
|---------|---------|----------|
| Lab Description | Mission, history (est. 2019), organizational placement | Must have |
| Timeline | Key milestones from 2019 to present | Could have |
| Methodology | Approach to AI research for SDGs | Must have |

### 4.3 About > Team

| Section | Content | Priority |
|---------|---------|----------|
| Team Grid | Named members with photo, title, short bio | Must have (if client approves named members) |
| Organizational Chart | Visual hierarchy of roles and streams | Could have |

### 4.4 About > Advisory Board

| Section | Content | Priority |
|---------|---------|----------|
| Board Members | Photo, name, title, affiliation, short bio | Must have |

### 4.5 Projects > Active

| Section | Content | Priority |
|---------|---------|----------|
| Project Cards | Title, description, SDG tags, status indicator | Must have |
| Filter/Search | Filter by SDG goal, status, or topic | Could have |

### 4.6 Projects > Completed

| Section | Content | Priority |
|---------|---------|----------|
| Archived Cards | Title, description, outcomes, date range | Should have |

### 4.7 Resources

| Section | Content | Priority |
|---------|---------|----------|
| Publications List | Title, authors, date, abstract, download/link | Could have |
| GitHub Repos | Repository cards pulled from GitHub API or manually listed | Could have |
| Datasets | Name, description, download/link | Could have |

### 4.8 News

| Section | Content | Priority |
|---------|---------|----------|
| Article List | Title, date, excerpt, image, category tag | Must have |
| Article Page | Full article content (if hosted on-site) | Depends on Q2.3 |

### 4.9 Get Involved > Volunteer

| Section | Content | Priority |
|---------|---------|----------|
| Program Description | What the volunteer program is, expectations, benefits | Could have |
| Application Form | Name, skills, availability, motivation | Could have |

### 4.10 Contact

| Section | Content | Priority |
|---------|---------|----------|
| Contact Form | Name, email, subject, message -- with real backend | Must have |
| Email / Address | Direct contact info | Should have |
| Map | Istanbul office location (optional) | Could have |

---

## 5. URL Structure

Proposed clean URL scheme (assuming a framework with routing):

| Page | URL |
|------|-----|
| Home | `/` |
| About Overview | `/about` |
| Team | `/about/team` |
| Advisory Board | `/about/advisory-board` |
| Active Projects | `/projects` |
| Completed Projects | `/projects/completed` |
| Individual Project | `/projects/[slug]` |
| Resources | `/resources` |
| Publications | `/resources/publications` |
| Open Source | `/resources/open-source` |
| News List | `/news` |
| Individual Article | `/news/[slug]` |
| Volunteer | `/get-involved/volunteer` |
| Partner | `/get-involved/partner` |
| Contact | `/contact` |

If remaining on static HTML (no framework), URLs will be file-path based:

| Page | URL |
|------|-----|
| Home | `/index.html` |
| About | `/about.html` |
| Team | `/team.html` |
| Advisory Board | `/advisory-board.html` |
| Projects | `/projects.html` |
| etc. | etc. |

---

## 6. Content Types

| Content Type | Fields | Source |
|-------------|--------|--------|
| **Page** | title, slug, body content, meta description, OG image | Manual / CMS |
| **Project** | title, slug, description, SDG tags[], status, date range, outcomes | Manual / CMS |
| **Team Member** | name, title, photo, bio, stream (Technical/Operational/Professional) | Manual / CMS |
| **Board Member** | name, title, affiliation, photo, bio | Manual / CMS |
| **News Article** | title, slug, date, author, excerpt, body, image, category, external URL (if linking out) | Manual / CMS |
| **Partner** | name, logo image, website URL, category (partner/supporter/government) | Manual / CMS |
| **Publication** | title, authors, date, abstract, PDF/link, tags | Manual / CMS |

---

## 7. User Flows

### 7.1 Primary: "Learn about the lab"

```
Home → About Overview → Team → Advisory Board
```

### 7.2 Primary: "Explore projects"

```
Home → Projects (Active) → Individual Project → Related Resources
```

### 7.3 Primary: "Volunteer as a data scientist"

```
Home → Get Involved → Volunteer → Submit Application
```

### 7.4 Primary: "Contact the lab"

```
Any page → Contact (via nav or CTA) → Submit Form → Confirmation
```

### 7.5 Secondary: "Read latest news"

```
Home → News → Individual Article
```

### 7.6 Secondary: "Find publications / open-source tools"

```
Home → Resources → Publications / Open Source → Download/Link
```

---

## 8. Fallback: Minimal IA (if client prefers lean site)

If the client does not want an expanded sitemap, the minimal viable IA is:

```
Home
├── About (combines overview + team + board)
├── Projects (active only, no archive)
├── News (card links to external articles)
└── Contact (working form)
```

This keeps the current 6-page spirit but fixes critical issues (broken form, stale content, missing SEO).

---

_This IA will be finalized to version 1.0.0 once the client confirms the sitemap and section priorities._
