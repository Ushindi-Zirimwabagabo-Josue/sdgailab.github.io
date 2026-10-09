# Low-Fidelity Wireframes

## SDG AI Lab Website Revamp

| Field | Value |
|-------|-------|
| **Document version** | 0.1.0 (Draft) |
| **Date** | February 2026 |
| **Status** | Draft -- for client review before visual design |

These are text-based structural wireframes defining the layout and content placement for each key page. They should be translated into visual mockups (Figma or similar) once approved.

---

## Global Components

### Navigation Bar

```
┌──────────────────────────────────────────────────────────────────┐
│  [Logo] SDG AI Lab          About ▾  Projects ▾  Resources      │
│                             News     Get Involved ▾    Contact   │
└──────────────────────────────────────────────────────────────────┘
```

- Fixed top position, white background, subtle bottom shadow
- Logo + wordmark on left
- Primary nav links on right
- "About" and "Projects" have dropdown sub-menus
- Collapses to hamburger menu on mobile (< 768px)
- Active page indicator (underline or color highlight)

### Footer

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  [Logo] SDG AI Lab                                               │
│  UNDP Digital, AI and Innovation Hub                             │
│                                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ About    │ │ Projects │ │ Resources│ │ Connect  │           │
│  │ Overview │ │ Active   │ │ Papers   │ │ Contact  │           │
│  │ Team     │ │ Archive  │ │ Code     │ │ Volunteer│           │
│  │ Board    │ │          │ │ Data     │ │ Newsletter│          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
│                                                                  │
│  [X icon] [GitHub icon] [LinkedIn icon]                          │
│                                                                  │
│  © 2026 SDG AI Lab. All rights reserved.                         │
└──────────────────────────────────────────────────────────────────┘
```

---

## Page 1: Home

```
┌──────────────────────────────────────────────────────────────────┐
│                         [Navigation]                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    HERO SECTION (full-width)                      │
│          Background: gradient or subtle animation                 │
│                                                                  │
│         "Harnessing the potential of                              │
│          Artificial Intelligence for                              │
│          Sustainable Development"                                 │
│                                                                  │
│         [Explore Projects]  [Get Involved]                        │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                   IMPACT NUMBERS (3-4 cards)                      │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐    │
│  │  [icon]    │ │  [icon]    │ │  [icon]    │ │  [icon]    │    │
│  │  XX+       │ │  XX+       │ │  XX+       │ │  XX+       │    │
│  │  Projects  │ │  Volunteers│ │  Countries │ │  Partners  │    │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘    │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                   OUR APPROACH                                    │
│         Brief description of methodology                         │
│                                                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│  │  [icon]      │ │  [icon]      │ │  [icon]      │             │
│  │  Research    │ │  Recruit &   │ │  Deliver     │             │
│  │  Formulation │ │  Coordinate  │ │  Results     │             │
│  │  ...         │ │  ...         │ │  ...         │             │
│  └──────────────┘ └──────────────┘ └──────────────┘             │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                   FEATURED PROJECTS                               │
│                                                                  │
│  ┌─────────────────────┐ ┌─────────────────────┐                 │
│  │  [SDG icon badges]  │ │  [SDG icon badges]  │                 │
│  │  Project Title      │ │  Project Title      │                 │
│  │  Short description  │ │  Short description  │                 │
│  │  [Learn more →]     │ │  [Learn more →]     │                 │
│  └─────────────────────┘ └─────────────────────┘                 │
│                                                                  │
│                     [View all projects →]                         │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                   PARTNERS & SUPPORTERS                           │
│                                                                  │
│  [logo] [logo] [logo] [logo] [logo] [logo]                      │
│  [logo] [logo] [logo] [logo] [logo] [logo]                      │
│                                                                  │
│         "Grateful to the governments of our                       │
│          fully-funded volunteers"                                 │
│                                                                  │
│  [flag/logo] [flag/logo] [flag/logo] [flag/logo]                 │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                   CTA BANNER                                      │
│          "Interested in collaborating with us?"                   │
│          [Contact Us]  [Become a Volunteer]                       │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                         [Footer]                                 │
└──────────────────────────────────────────────────────────────────┘
```

### Mobile Layout Notes (Home)
- Hero: stack text vertically, single CTA button, smaller font
- Impact numbers: 2x2 grid instead of 4-across
- Approach cards: stack vertically
- Featured projects: single column, full-width cards
- Partner logos: wrap to multiple rows, smaller logos

---

## Page 2: About > Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                         [Navigation]                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  BREADCRUMB: Home > About > Overview                             │
│                                                                  │
│  PAGE HEADER                                                     │
│  "About SDG AI Lab"                                              │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────┐  ┌──────────────────────┐        │
│  │                            │  │                      │        │
│  │  Lab description text      │  │  [Lab photo or       │        │
│  │  (mission, history,        │  │   illustration]      │        │
│  │   organizational           │  │                      │        │
│  │   placement under          │  │                      │        │
│  │   Digital, AI and          │  │                      │        │
│  │   Innovation Hub)          │  │                      │        │
│  │                            │  │                      │        │
│  └────────────────────────────┘  └──────────────────────┘        │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  METHODOLOGY SECTION                                             │
│  "Our Approach"                                                  │
│                                                                  │
│  1. Research formulation and solution architecture                │
│  2. Recruit and coordinate volunteer data scientists              │
│  3. Establish teams and coordinate workflow                       │
│  4. Monitor R&D progress for quality                              │
│  5. Deliver prototypes, reports, presentations                    │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  LINKS TO SUB-PAGES                                              │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐                        │
│  │ Meet the Team → │  │ Advisory Board →│                        │
│  └─────────────────┘  └─────────────────┘                        │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                         [Footer]                                 │
└──────────────────────────────────────────────────────────────────┘
```

---

## Page 3: Projects (Active)

```
┌──────────────────────────────────────────────────────────────────┐
│                         [Navigation]                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PAGE HEADER                                                     │
│  "Our Projects"                                                  │
│  Brief intro text about the lab's project areas                  │
│                                                                  │
│  [Active]  [Completed]    <-- tab/toggle                         │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  FILTER BAR (optional)                                           │
│  [All SDGs ▾]  [All Topics ▾]  [Search...]                       │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PROJECT GRID (2-3 columns)                                      │
│                                                                  │
│  ┌─────────────────────┐ ┌─────────────────────┐                 │
│  │ [SDG 7] [SDG 13]    │ │ [SDG 11] [SDG 17]   │                │
│  │ ────────────────     │ │ ────────────────     │                │
│  │ Project Title        │ │ Project Title        │                │
│  │                      │ │                      │                │
│  │ Short description    │ │ Short description    │                │
│  │ up to 2-3 lines...   │ │ up to 2-3 lines...   │               │
│  │                      │ │                      │                │
│  │ Status: ● Active     │ │ Status: ● Active     │                │
│  │ [Learn more →]       │ │ [Learn more →]       │                │
│  └─────────────────────┘ └─────────────────────┘                 │
│                                                                  │
│  ┌─────────────────────┐ ┌─────────────────────┐                 │
│  │ [SDG 1] [SDG 8]     │ │ [SDG 9] [SDG 16]    │                │
│  │ ────────────────     │ │ ────────────────     │                │
│  │ Project Title        │ │ Project Title        │                │
│  │ ...                  │ │ ...                  │                │
│  └─────────────────────┘ └─────────────────────┘                 │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                         [Footer]                                 │
└──────────────────────────────────────────────────────────────────┘
```

### Mobile: single-column card stack, full-width. Filter bar collapses to icon toggle.

---

## Page 4: News

```
┌──────────────────────────────────────────────────────────────────┐
│                         [Navigation]                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PAGE HEADER                                                     │
│  "News & Updates"                                                │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  FEATURED ARTICLE (latest, full-width)                           │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  [Large image]                                           │    │
│  │  Category tag  ·  February 2026                          │    │
│  │  "Article Title Here"                                    │    │
│  │  Excerpt text up to 2-3 lines...                         │    │
│  │  [Read more →]                                           │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ARTICLE GRID                                                    │
│                                                                  │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐        │
│  │  [image]       │ │  [image]       │ │  [image]       │        │
│  │  Date          │ │  Date          │ │  Date          │        │
│  │  Title         │ │  Title         │ │  Title         │        │
│  │  Excerpt...    │ │  Excerpt...    │ │  Excerpt...    │        │
│  │  [Read →]      │ │  [Read →]      │ │  [Read →]      │        │
│  └────────────────┘ └────────────────┘ └────────────────┘        │
│                                                                  │
│  [Load more] or pagination                                       │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                         [Footer]                                 │
└──────────────────────────────────────────────────────────────────┘
```

---

## Page 5: Contact

```
┌──────────────────────────────────────────────────────────────────┐
│                         [Navigation]                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PAGE HEADER                                                     │
│  "Contact Us"                                                    │
│  "Have a question or want to collaborate? Get in touch."         │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────┐  ┌──────────────────────┐          │
│  │                          │  │                      │          │
│  │  CONTACT FORM            │  │  CONTACT INFO        │          │
│  │                          │  │                      │          │
│  │  Name: [____________]    │  │  Email:              │          │
│  │  Email: [____________]   │  │  sdgailab@undp.org   │          │
│  │  Subject: [__________]   │  │                      │          │
│  │  Message:                │  │  Location:           │          │
│  │  [                    ]  │  │  Istanbul, Turkey    │          │
│  │  [                    ]  │  │                      │          │
│  │  [                    ]  │  │  Social:             │          │
│  │                          │  │  [X] [GitHub] [LI]   │          │
│  │  [Send Message]          │  │                      │          │
│  │                          │  │                      │          │
│  └──────────────────────────┘  └──────────────────────┘          │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                         [Footer]                                 │
└──────────────────────────────────────────────────────────────────┘
```

### Form Behavior
- Client-side validation on all required fields (name, email, message)
- Submit to Netlify Forms (or Formspree fallback)
- Show success message inline after submission
- Show error message if submission fails
- Honeypot field for spam prevention (hidden from users)

---

## Page 6: Get Involved > Volunteer

```
┌──────────────────────────────────────────────────────────────────┐
│                         [Navigation]                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PAGE HEADER                                                     │
│  "Volunteer With Us"                                             │
│  "Join our global network of data scientists                     │
│   working on sustainable development challenges."                │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  HOW IT WORKS (3 steps)                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                       │
│  │ 1. Apply │→│ 2. Match │→│ 3. Work  │                       │
│  │ Submit   │  │ Get      │  │ Join a   │                       │
│  │ your     │  │ matched  │  │ project  │                       │
│  │ profile  │  │ to a     │  │ team and │                       │
│  │          │  │ project  │  │ deliver  │                       │
│  └──────────┘  └──────────┘  └──────────┘                       │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  WHAT WE LOOK FOR                                                │
│  - Data science / ML skills                                      │
│  - Commitment of X hours/week                                    │
│  - Interest in sustainable development                           │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  APPLICATION FORM                                                │
│  Name, Email, LinkedIn, Skills, Availability, Motivation         │
│  [Submit Application]                                            │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                         [Footer]                                 │
└──────────────────────────────────────────────────────────────────┘
```

---

## Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|---------------|
| Mobile | < 640px | Single column, hamburger nav, stacked cards |
| Tablet | 640px - 1024px | 2-column grids, expanded nav with dropdowns |
| Desktop | > 1024px | Full layout as shown in wireframes above |

---

## Design Tokens (to be refined in visual design phase)

| Token | Proposed Value | Notes |
|-------|---------------|-------|
| Primary color | UNDP Blue (#0468B1) or current dark blue | Confirm with UNDP branding (Q1.4) |
| Secondary color | SDG-related accent | TBD |
| Background | White (#FFFFFF) / Light gray (#F8F9FA) | Clean, professional |
| Text | Dark gray (#1A1A2E) | High contrast for accessibility |
| Font family | Open Sans (current) or Inter | Confirm preference |
| Base font size | 16px | Standard for readability |
| Border radius | 8px (cards), 4px (buttons) | Modern but not overly rounded |
| Spacing scale | 4px base unit (4, 8, 12, 16, 24, 32, 48, 64) | Consistent vertical rhythm |

---

_These wireframes will be translated into visual mockups once the client confirms the sitemap and design direction. The visual design phase will produce high-fidelity Figma files for each page and responsive breakpoint._
