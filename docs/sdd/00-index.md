# SDG AI Lab Website Revamp -- SDD Document Index

**Spec Driven Development (SDD) documentation for the sdgailab.org revamp.**

| # | Document | Status | Description |
|---|----------|--------|-------------|
| 01 | [Client Questionnaire](01-client-questionnaire.md) | Ready to send | 45 questions across 8 categories for gathering client requirements |
| 02 | [Product Requirements Document](02-product-requirements-document.md) | Draft (v0.1.0) | Goals, audiences, functional/non-functional requirements, constraints, risks |
| 03 | [Information Architecture](03-information-architecture.md) | Draft (v0.1.0) | Sitemap, navigation design, page hierarchy, URL structure, content types |
| 04 | [Architecture Decision Record](04-architecture-decision-record.md) | Proposed | 7 ADRs: framework, hosting, CSS, forms, CMS, analytics, icons |
| 05 | [Wireframes](05-wireframes.md) | Draft (v0.1.0) | Text-based structural wireframes for 6 key pages + global components |
| 06 | [Project Scaffold](06-project-scaffold.md) | Ready to execute | Astro project setup, directory structure, config files, CI/CD, migration checklist |
| 07 | [Content Pipeline](07-content-pipeline.md) | Template | Content inventory, delivery tracker, image specs, review checklist |
| 08 | [Detailed Specification](08-detailed-spec.md) | Draft (v0.1.0) | 17 specs with acceptance criteria, organized into 3 development phases |

## Workflow

```
[01 Questionnaire] → client answers → [02 PRD v1.0] → [03 IA v1.0]
                                        ↓
                                  [04 ADR confirmed]
                                        ↓
                         [05 Wireframes] → visual mockups (Figma)
                                        ↓
                              [06 Scaffold] → project setup
                                        ↓
              [07 Content Pipeline] → content delivered in parallel
                                        ↓
                    [08 Spec] → build → review → approve → next spec
```

## Current Status

All documents are at draft / v0.1.0 status. The next milestone is receiving client responses to the questionnaire (document 01), which will unlock finalizing all other documents to v1.0.0.
