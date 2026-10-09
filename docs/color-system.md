# SDG AI Lab color system note

This note records the implemented color direction based on Gokhan's feedback that the website should not continue changing between random palettes.

## Implemented palette direction

The current implementation uses the selected graphite/blue direction:

| Role | Token | Value | Purpose |
| --- | --- | --- | --- |
| Primary base | `lab.base` / `--lab-base` | `#22242A` | Main dark grey background, close to the Google-like graphite reference rather than pure black. |
| Section base | `lab.section` / `--lab-section` | `#2B2E36` | Secondary dark grey for section contrast. |
| Surface | `lab.surface` / `--lab-surface` | `#343843` | Cards, panels, CMS surfaces and elevated blocks. |
| Elevated | `lab.elevated` / `--lab-elevated` | `#3B404C` | Higher-emphasis surfaces. |
| Primary text | `lab.text` / `--lab-text` | `#E4E6EB` | Light grey text, not pure white. |
| Muted text | `lab.muted` / `--lab-muted` | `#B8BEC8` | Secondary text. |
| Accent | `lab.accent` / `--lab-accent` | `#4C8DFF` | Controlled blue accent for CTAs, focus states and highlights. |

## Usage principle

The intended balance follows Gokhan's 70/20/10 guidance:

- Around 70% graphite/dark grey base and section colors.
- Around 20% elevated surfaces and muted contrast.
- Around 10% blue accent for calls to action, active navigation, focus rings and key highlights.

## Exceptions

Official SDG colors, UNDP/ICPSD logos and partner logos are intentionally preserved and should not be forced into the site palette.