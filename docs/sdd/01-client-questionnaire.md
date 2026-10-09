# SDG AI Lab Website Revamp -- Client Requirements Questionnaire

**Prepared by:** SDG AI Lab Development Team
**Date:** February 2026
**Purpose:** Collect all critical requirements before beginning the Spec Driven Development (SDD) revamp of [sdgailab.org](https://sdgailab.org).

---

## How to Use This Document

Please answer each question below as completely as possible. Where multiple-choice options are suggested, feel free to pick more than one or write your own answer. A short "why" note accompanies each question to explain what the answer will influence in the build.

Mark your answers inline or return this document with responses filled in.

### Meeting transcript notes (Feb 2026)

- The answers below were partially pre-filled. I updated/augmented them with what was explicitly stated in the provided meeting transcript excerpt.
- Where the meeting did **not** cover a question (or the excerpt is inconclusive), I marked it as **TBD / not discussed** so we avoid guessing requirements.

---

## 1. Project Goals and Priorities

### 1.1 What is the primary driver for this revamp?

> *Examples: outdated content, modernize the look and feel, rebrand after the 2025 move under UNDP's Digital/AI/Innovation Hub, attract new partners, recruit volunteer data scientists*

**Your answer:** Missing pages, updating website via supabase, or json files, outdated content/information, ease of content update (headless CMS)

*Why this matters:* Establishes the north-star for every design and technical decision. Without a clear "why," scope will drift.

---

### 1.2 Who are the primary audiences for the site?

> *Examples: UNDP internal teams, partner organizations, volunteer data scientists, academic researchers, donors/funders, general public*

**Your answer:** Researcehers, volunteers, UNDP staff, partners, donors, job seekers, general public. Everyone who is interested in the lab's work.

*Why this matters:* Audience determines content depth, tone, navigation hierarchy, and which pages receive the most investment.

---

### 1.3 What are the top 3 actions you want a visitor to take after landing on the site?

> *Examples: contact the lab, explore projects, apply as a volunteer, read research outputs, download datasets*


- Information about the lab and its work
- Explore projects and research outputs
- Download...
- Contact the lab


*Why this matters:* Drives call-to-action placement, homepage layout, and conversion-oriented design decisions.

---

### 1.4 Are there mandatory UNDP branding guidelines or digital standards we must follow?

> *E.g., color palette, logo usage rules, typography, UNDP web templates or design system*

**Your answer:** keep it at sdgailab level, security standards, ...

*Why this matters:* The current site uses a custom Bootstrap theme. If a UNDP design system exists, we must align with it rather than designing from scratch.

---

### 1.5 Should the site explicitly reflect the new placement under the Digital, AI and Innovation Hub?

> *If so, what specific branding or messaging changes are needed?*

**Your answer:** Yes... 

*Why this matters:* The About Us text already references the 2025 organizational change, but navigation, footer, hero section, and partner logos may also need updates.

---

### 1.6 What does success look like? Are there KPIs?

> *Examples: increased contact form submissions, more volunteer applications, higher web traffic, press coverage, partner inquiries*

**Your answer:** how many visitors, how long they stay, contact, pages loading time, ... (analytics, but pay attention to what is being collected and how it is used)

*Why this matters:* Lets us embed analytics hooks and design for measurable outcomes from day one.

---

## 2. Content and Structure

### 2.1 Should the current 6-page structure be preserved, or are new pages needed?

> *Current pages: Home, About Us, Advisory Board, Projects, Newsroom, Contact Us.*
> *Possible additions: Publications, Blog, Resources/Tools, Volunteer Portal, Impact/Results*

**Your answer:** Add a dedicated **Volunteer / Volunteering with us** page (move “Volunteer Data Scientist Initiative” content there). Move “Our Approach” content into **About Us**. Consider adding **Blog/News** and **Publications/Resources**. Remove Advisory Board

*Why this matters:* A revamp is the right moment to expand or consolidate the sitemap. The current structure is very lean.

---

### 2.2 The "Active Projects" page lists 5 projects with ~2021 descriptions. Which are still active? Are there new ones? Should completed projects be archived or showcased separately?

Current projects listed:

- Nature, Energy, Climate Cluster (Document classification, NLP for Vertical Fund Portfolio)
- Connecting Business Initiative (AI R&D for disaster preparedness/response)
- Business Call to Action (Data visualization, NLP automation)
- PPMI/OSDG (SDG ontology, training data, ML classifier)
- Internal Work Streams (Country programme analysis, jobs/skills analysis)

**Still active:**

**New projects to add:**

**Completed / to archive:**

Does not matter if some projects are completed, but we should have a clear way to indicate status. Maybe a "Completed Projects" section or tag?

*Why this matters:* Stale project listings undermine credibility. We need a current, accurate inventory.

---

### 2.3 The Newsroom has only 5 articles (2020-2021), all linking to external IICPSD pages. Should we add newer news? Host articles on-site or keep linking externally?

- Add newer news articles
- Host articles directly on the site (requires blog/CMS capability)
- Continue linking to external pages
- Other: ___

**Your answer:** Add newer news. Hosting strategy is **TBD / not discussed in the provided excerpt** (options: keep external links for legacy items but host new updates on-site via a blog/CMS).

*Why this matters:* Determines whether we need a CMS/blog system or can keep the simple card-and-link approach.

---

### 2.4 Are the 8 Advisory Board members and their titles still current?

Current members listed: Boris Alberda, Hande Bilir, Samira Khan, Soonson Kwon, Prof. Ebru Akcapinar Sezer, Dr. Serdar Turkeli, Natalia Villalobos, Prof. Deniz Yuret

- All current -- no changes needed
- Some need updating (please specify)
- Members to remove: ___
- Members to add: ___

This page will be removed

*Why this matters:* Professional titles change frequently; outdated information reflects poorly on the organization.

---

### 2.5 The About Us page lists generic roles without names or photos. Should we add named team members with bios?

> *Current roles: Technical Advisor, Onsite Data Scientists, Online Data Scientists, Partnership & Outreach Analyst, Data Science Fellow*

- Yes -- add names, photos, and short bios
- Keep roles only, no personal details
- Other: ___

Remove the management section here, and add a "Our Team" page with more details about the people behind the lab (Check Jackson work on develop branch. Might have Our team page)

*Why this matters:* Named team members humanize the organization and build trust with potential partners and volunteers.

---

### 2.6 Do you want to showcase publications, research papers, datasets, or open-source tools the lab has produced?

- Yes -- dedicated Publications/Resources page
- Yes -- link to them from project pages
- No -- not a priority right now
- Other: ___

*Why this matters:* The lab's GitHub org has public repositories that could be surfaced. This is a major value-add for academic and technical audiences.

Datasets and publications can be on the same page

---

### 2.7 The homepage shows ~12 partner logos. Is this list current? Any to add or remove?

Current partners/supporters: GEF, The Global Fund, UNDP, Green Climate Fund, Connecting Business Initiative, Business Call to Action, UNOCHA, PPMI, UN Volunteers, IICPSD, and government supporters (China, Kazakhstan, South Korea, Turkey).

**Partners to add:**

**Partners to remove:**

*Why this matters:* Partner logos are a trust signal. In a UN context, displaying outdated logos can cause diplomatic sensitivity issues.

Have a dedicated Partners page (make this dynamic so we can easily update logos and links in the future without code changes)

---

### 2.8 The footer has Twitter and GitHub buttons. Twitter is now "X". Should we update social links? Add others?

- Update Twitter to X
- Add LinkedIn
- Add YouTube
- Remove social links entirely
- Other: ___

*Why this matters:* Social presence has likely evolved significantly since 2021.

---

### 2.9 Is there a multilingual requirement?

> *Currently English-only. Does the site need Arabic, Turkish, French, or other UN languages?*

- English only
- Add specific languages: ___
- Plan for multilingual later (not phase 1)

*Why this matters:* Multilingual support fundamentally impacts architecture choices (i18n framework, content management, URL strategy).

No need for multilingual support at this time, but we should design the architecture to allow adding it later without a major overhaul.

---

## 3. Design and User Experience

### 3.1 Are there reference websites (UN or otherwise) whose design you admire?

> *Please share 2-3 URLs and a brief note on what you like about each.*

**Your answer:** No specific reference sites. Maintain continuity with the current SDG AI Lab look and feel.





*Why this matters:* Reference sites accelerate design alignment and dramatically reduce revision cycles.

---

### 3.2 The hero section uses a particles.js animation on a dark blue background. Keep, refresh, or replace?

- Keep as-is
- Refresh / modernize the animation
- Replace with a new design (describe vision: ___)
- No strong preference

*Why this matters:* The particles animation is the site's most distinctive visual element but may feel dated in 2026.

**Your answer:** Keep as-is (retain particles.js hero).

---

### 3.3 Should we do a mobile-first responsive redesign?

- Yes -- mobile-first is a priority
- Responsive is fine, no need to prioritize mobile
- Other: ___

*Why this matters:* A UN audience in developing countries is likely heavily mobile. Over 50% of global web traffic is mobile.

**Your answer:** Yes — mobile-first is a priority.

---

### 3.4 Are there specific accessibility standards to meet?

- WCAG 2.1 AA (standard for UN properties)
- WCAG 2.1 AAA
- No specific requirement, but best effort
- Other: ___

*Why this matters:* A full revamp should target a defined standard with testable acceptance criteria.

**Your answer:** WCAG 2.1 AA.

---

### 3.5 Should the design support data-heavy visualizations?

> *E.g., interactive SDG impact maps, project dashboards, embedded charts*

- Yes -- this is important
- Maybe later, not for initial launch
- No

*Why this matters:* If yes, we need to plan for charting libraries and a layout strategy that accommodates dynamic content.

**Your answer:** Phase 1 should be light-weight: statistics cards (and optionally a simple world map view). No dashboards in the initial launch.

---

### 3.6 Do you want a dark mode option?

- Yes
- No
- Nice to have, not critical

*Why this matters:* Increasingly expected in modern tech-oriented sites. Affects the entire design token system.

No need

---

## 4. Technical and Functional Requirements

### 4.1 Should we migrate to a modern framework/static site generator, or stay with plain HTML?

> *Options: Next.js, Astro, Hugo, 11ty, or remain on plain HTML/Bootstrap*

**Your preference:** Prefer moving to a modern framework/SSG. Meeting note: another branch/version was checked and it used **Gatsby** (“other branch… used Gatsby”). Final choice between Gatsby vs alternatives (Astro/Next/Hugo/11ty) is **TBD**.

*Why this matters:* The current site duplicates navigation and footer code across 6 HTML files. A framework enables reusable components, build optimization, and easier long-term maintenance.

---

### 4.2 Is a CMS needed so non-technical team members can update content?

> *Options: headless CMS (Sanity, Strapi), Markdown-based (Decap CMS), or keep manual editing*

- Yes -- essential
- Nice to have
- No -- developers will handle content updates

*Why this matters:* The lab will keep producing news and project updates. Manual HTML editing does not scale.

**Your answer:** Yes — essential (Phase 1). CMS should be Supabase-backed.

---

### 4.3 Should the site remain on GitHub Pages, or move to another host?

- Stay on GitHub Pages
- Move to Netlify
- Move to Vercel
- Move to Azure Static Web Apps
- UNDP internal hosting
- No preference

*Why this matters:* Hosting choice affects CI/CD pipeline, form handling, serverless functions, preview deployments, and domain management.

Stay on Github pages

---

### 4.4 The contact form currently uses `mailto:` (opens the user's email client). Should we implement a real form backend?

- Yes -- implement a proper form submission (Formspree, Netlify Forms, EmailJS, or custom)
- No -- mailto is fine
- Other: ___

*Why this matters:* The current form does not submit data to a server. It is unreliable and loses submissions silently when users don't have a configured email client.

No need

---

### 4.5 Should we integrate analytics?

- Google Analytics
- Plausible (privacy-focused)
- Matomo
- UNDP's analytics platform
- No analytics needed
- Other: ___

*Why this matters:* Currently there is zero visibility into who visits the site or how they use it.

Yes

---

### 4.6 Do you need search functionality on the site?

- Yes
- Only if we add a blog/publications section
- No

*Why this matters:* Becomes important if we add publications, a blog, or a large project portfolio.

No need, but can be added later

---

### 4.7 Are there any third-party integrations needed?

> *Examples: GitHub activity feeds, UNDP APIs, newsletter signup (Mailchimp), calendar/events, RSS feeds*

**Your answer:** No

*Why this matters:* Integrations affect architecture and may require API keys or backend support.

---

### 4.8 Are there security or compliance requirements?

> *Examples: Content Security Policy headers, cookie consent (GDPR), data retention policies for form submissions*

**Your answer:** Google Analytics is acceptable. Implement cookie consent if required. Follow UNDP/UN security guidance where applicable, and define privacy notice + data retention rules (especially if storing form submissions or volunteer applications).

*Why this matters:* UN digital properties often have specific security and privacy mandates.

---

## 5. Data, Visualization, and Impact Reporting

### 5.1 Does the lab produce dashboards, interactive tools, or visualizations that should be embedded or linked?

> *E.g., the OSDG classifier, GIS prototypes, Jupyter notebooks*

**Your answer:** **TBD / not discussed in the provided excerpt.** Related meeting idea: show **impact statistics** prominently (potentially with a world map) rather than long descriptive text on the homepage.

*Why this matters:* Showcasing AI work interactively would be a powerful differentiator for the lab's site.

---

### 5.2 Should the site display impact metrics?

> *E.g., "X volunteer hours contributed", "Y countries reached", "Z projects completed"*

- Yes -- prominently on the homepage
- Yes -- on a dedicated Impact page
- No

*Why this matters:* Impact numbers are compelling for donors, partners, and volunteer recruitment.

Yes — prominently on the homepage. Meeting direction: replace “in your face” descriptive blocks with **statistics cards** (and potentially a **world map** view showing volunteer reach/metrics). Also: move “Volunteer Data Scientist Initiative” to a dedicated **Volunteer** page, and move “Our Approach” to **About Us**.

---

### 5.3 Should project pages include status indicators, timelines, or progress tracking?

- Yes
- No -- keep it simple
- Other: ___

*Why this matters:* Transforms static project cards into something dynamic and informative.

At least a status indicator would be good to have. Meeting categories discussed: **Active**, **Completed**, **Under development**, and possibly **On hold**; also discussed that “deployed / not deployed” is a different dimension and needs a clear mix (e.g., separate badges or fields). Timeline/progress tracking:  **not** in initial scope.

---

## 6. Timeline, Budget, and Deliverables

### 6.1 What is the target launch date?

**Your answer:** No fixed date stated in the provided excerpt. Meeting sentiment: urgency is high (“timeline is yesterday after now”). Proposed approach: define a near-term Phase 1 launch + phased follow-ups. (**TBD**: confirm an actual launch date.)

*Why this matters:* Determines whether we do a phased rollout or a single launch.

---

### 6.2 Is there an event, report release, or organizational milestone the launch should align with?

**Your answer:** **No.**

*Why this matters:* External deadlines are non-negotiable and must be planned around.

---

### 6.3 Should we plan for a phased approach?

> *Example: Phase 1 -- content refresh + new design; Phase 2 -- CMS + blog; Phase 3 -- interactive features/dashboards*

- Yes -- phased is preferred
- No -- deliver everything at once
- Open to suggestions

*Why this matters:* Phasing reduces risk and delivers value incrementally, which aligns naturally with SDD.

**Your answer:** No — deliver everything at once (single launch).

---

### 6.4 What is the budget situation?

> *Are paid tools, hosting, or services an option, or must everything be free/open-source?*

- Budget available for paid tools
- Must be free/open-source only
- Small budget -- case-by-case
- Other: ___

*Why this matters:* Affects choices for CMS, hosting, form handling, analytics, and design assets.

**Your answer:** Must be free/open-source only.

---

### 6.5 Who will provide content (text, images, bios, project descriptions)? What is their availability?

**Content owner(s):**

**Availability:**

*Why this matters:* Content is almost always the bottleneck. Identifying the content owner early prevents delays.

---

## 7. Feedback and Review Process

### 7.1 Who are the decision-makers and stakeholders who must approve design and content?

**Your answer:** From the meeting transcript excerpt, participants/stakeholders include **Dina Akylbekova** and **Gokhan Dikmener**. Final decision-maker / approver list is **TBD** (needs confirmation of who signs off on content vs design vs technical decisions).

*Why this matters:* Knowing the approval chain prevents last-minute surprises and scope changes.

---

### 7.2 What is the preferred review cadence?

- Weekly demos / check-ins
- Milestone-based reviews
- Async PR reviews on GitHub
- Other: ___

*Why this matters:* SDD works best with structured feedback loops tied to spec milestones.

**Your answer:** No formal cadence required (ad-hoc check-ins as needed).

---

### 7.3 Should we set up a staging/preview environment for reviews?

- Yes -- essential
- Nice to have
- Not needed

*Why this matters:* Lets stakeholders review changes in-browser before anything goes live.

**Your answer:** Not needed.

---

### 7.4 Preferred communication channel for feedback?

- GitHub Issues
- Email
- Microsoft Teams
- Slack
- Other: ___

*Why this matters:* Centralizing feedback prevents it from being scattered and lost.

**Your answer:** No preference / not required (use ad-hoc communication as needed).

---

### 7.5 Are there past redesign attempts or mockups we should reference?

> *Note: we found `blog-style-newsroom` and `nav-colors` branches in the repository that suggest prior exploration.*

**Your answer:** No. no need to reference past redesign attempts

*Why this matters:* Knowing what was previously tried and why it was abandoned avoids redoing rejected ideas.

---

## 8. Proactive Suggestions

We would like to propose the following enhancements. Please indicate your interest level for each.


| #   | Proposal                                                                                                                              | Interest                                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| 8.1 | **AI Showcase page** -- live demos or embedded apps (Gradio/Streamlit) demonstrating the lab's work                                   | [ ] High [ ] Medium [ ] Low [ ] Not interested |
| 8.2 | **Volunteer Portal** -- application flow for data scientists to express interest                                                      | [ ] High [ ] Medium [ ] Low [ ] Not interested |
| 8.3 | **Interactive Impact Timeline** -- visual history of the lab from 2019 to present                                                     | [ ] High [ ] Medium [ ] Low [ ] Not interested |
| 8.4 | **SEO overhaul** -- add meta descriptions, Open Graph tags, structured data (currently none exist)                                    | [ ] High [ ] Medium [ ] Low [ ] Not interested |
| 8.5 | **Newsletter / Subscribe for Updates** feature                                                                                        | [ ] High [ ] Medium [ ] Low [ ] Not interested |
| 8.6 | **Open Source section** -- link to the lab's GitHub repositories                                                                      | [ ] High [ ] Medium [ ] Low [ ] Not interested |
| 8.7 | **SDG tagging** -- tag each project with SDG icons (Goals 1-17)                                                                       | [ ] High [ ] Medium [ ] Low [ ] Not interested |
| 8.8 | **Performance optimization** -- modern build pipeline to reduce load time (current site loads 12+ CSS and 10+ JS files synchronously) | [ ] High [ ] Medium [ ] Low [ ] Not interested |


**Any other ideas or features you'd like to see?**

---

## Next Steps

Once this questionnaire is returned, we will:

1. Synthesize answers into a **Product Requirements Document (PRD)**
2. Create the **Information Architecture** (revised sitemap and page hierarchy)
3. Finalize the **Tech Stack** with an Architecture Decision Record
4. Build **low-fidelity wireframes** for client sign-off
5. Set up the **project scaffold** with CI/CD and preview deploys
6. Establish a **content pipeline** with assignments and due dates
7. Write the **detailed SDD spec** with acceptance criteria per page/feature
8. Begin **iterative development** following the spec-build-review cycle

---

*Thank you for taking the time to answer these questions thoroughly. Your responses will directly shape the specification and ensure the revamp meets your needs.*