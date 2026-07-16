---
name: landing-page
displayName: Landing Page
scope: global
is_system: true
research:
  web: true
  reddit: true
  github: true
  marketScan: false
  required: true
  maxQueries: 8
  fetchTopUrls: 3
generation:
  backend: harness-native
  backendRef: landing-bundle
  async: true
canvas:
  frameType: htmlFrame
  exportFormats: [html, pdf, zip]
---

# Landing Page

Build a conversion-focused marketing landing page as a sanitized HTML/CSS/JS bundle on the studio canvas.

## When to use

- User asks to build or refresh a landing page, marketing site, or agency homepage
- Collins-style agency landings with hero carousel, demo section, testimonials, FAQ

## Prerequisites

1. Read project **brand.md** and **design.md** (or studio equivalents) for voice and tokens.
2. Run full asset research (web + Reddit + GitHub) before drafting copy or layout.
3. Confirm primary CTA and positioning (agency vs SaaS) from the brief.

## Agent read order

1. Brand context — voice, positioning, CTAs, services, testimonials
2. Design tokens — color, typography, motion
3. Research bundle — competitor landings, Reddit pain points, GitHub examples
4. Canvas target — upsert `htmlFrame` with index.html, styles.css, script.js

## Eleven conversion elements

Map each element to a landing section. Do not drop elements when refactoring.

| #   | Element               | Surface                                                      |
| --- | --------------------- | ------------------------------------------------------------ |
| 1   | Category clarity      | Hero eyebrow                                                 |
| 2   | Value headline        | Hero h1                                                      |
| 3   | Supporting promise    | Hero lede                                                    |
| 4   | Primary CTA           | Book a strategy call (header, hero, close)                   |
| 5   | Secondary CTA         | Watch the demo                                               |
| 6   | Above-fold proof      | Stat grid + avatar row                                       |
| 7   | Process visualization | Hero method carousel (generated cards, not page screenshots) |
| 8   | Service depth         | Services grid (canonical names from brand)                   |
| 9   | Productized proof     | Demo theater (video or static beat sync)                     |
| 10  | Social proof          | Testimonials with role + company                             |
| 11  | Objection + close     | FAQ + final CTA                                              |
| #   | Element               | Surface                                                      |
| --- | --------------------- | ------------------------------------------------------------ |
| 1   | Category clarity      | Hero eyebrow                                                 |
| 2   | Value headline        | Hero h1                                                      |
| 3   | Supporting promise    | Hero lede                                                    |
| 4   | Primary CTA           | Book a strategy call (header, hero, close)                   |
| 5   | Secondary CTA         | Watch the demo                                               |
| 6   | Above-fold proof      | Stat grid + avatar row                                       |
| 7   | Process visualization | Hero method carousel (generated cards, not page screenshots) |
| 8   | Service depth         | Services grid (canonical names from brand)                   |
| 9   | Productized proof     | Demo theater (video or static beat sync)                     |
| 10  | Social proof          | Testimonials with role + company                             |
| 11  | Objection + close     | FAQ + final CTA                                              |

## Positioning rules

- Match brief positioning (agency vs SaaS). Do not assume trial/sign-up CTAs unless the brief is SaaS.
- Short sentences. Operator-led tone. Evidence over superlatives.
- No em dashes. Use periods or commas instead.
- Testimonials need role + company attribution when available in brand context.

## Visual system

- Apply design tokens via CSS variables; avoid stray hex in components.
- Dark-first or light themes follow project design.md, not a fixed Collins palette.
- Honor `prefers-reduced-motion`: instant reveals, no infinite CTA pulse.
- Hero carousel: poster crossfade; no Ken Burns zoom unless design spec requires it.

## Demo section

- Prefer video demo when assets exist; otherwise static beat-synced captions from a manifest.
- Subtitle overlay above native video controls when using `<video controls>`.
- Sync captions from hyperframe/manifest timing, not duplicate text stacks.

## Output

- Sanitized HTML bundle in `htmlFrame`
- Export formats: html, pdf, zip
- Cite research sources in agent reply when summarizing positioning choices

## Pitfalls

| Issue                       | Fix                                                                         |
| --------------------------- | --------------------------------------------------------------------------- |
| SaaS CTAs on agency brief   | Re-read brand positioning; use brief CTAs                                   |
| Em dashes in copy           | Search and rewrite with short sentences                                     |
| Hero shows page screenshots | Use generated method cards or approved assets                               |
| Stray hex in CSS            | Map to CSS variables from design tokens                                     |
| Skipping research           | Required for this skill; block or light-refresh only when snapshot is fresh |
| Issue                       | Fix                                                                         |
| --------------------------- | --------------------------------------------------------------------------- |
| SaaS CTAs on agency brief   | Re-read brand positioning; use brief CTAs                                   |
| Em dashes in copy           | Search and rewrite with short sentences                                     |
| Hero shows page screenshots | Use generated method cards or approved assets                               |
| Stray hex in CSS            | Map to CSS variables from design tokens                                     |
| Skipping research           | Required for this skill; block or light-refresh only when snapshot is fresh |
