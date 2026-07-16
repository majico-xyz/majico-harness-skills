---
name: email-sequences
displayName: Email Sequences
scope: global
is_system: true
research:
  web: true
  reddit: false
  github: false
  marketScan: false
  required: false
  maxQueries: 4
  fetchTopUrls: 1
generation:
  backend: harness-native
  backendRef: email-sequences
  async: true
canvas:
  frameType: markdownFrame
  exportFormats: [markdown]
---

# Email Sequences

Lifecycle email copy: onboarding, activation, re-engagement, and transactional messages aligned to brand voice.

## When to use

- User needs drip or lifecycle email copy for a product launch
- GTM strategy defines primary channel including email
- Complements landing-page CTAs with nurture paths

## When NOT to use

- User needs in-app copy only
- No brand voice or positioning context available

## Required inputs

- brand.md voice and tone
- Primary CTA from landing or GTM blueprint
- Optional research on audience pain points

## Workflow

1. Load brand voice + GTM primary message
2. Draft labeled sequence steps (onboarding → lifecycle → transactional)
3. One clear CTA per email; no duplicate landing hero copy
4. Export markdownFrame with step labels

## Failure patterns

| Issue                        | Fix                                       |
| ---------------------------- | ----------------------------------------- |
| Every email is a sales pitch | Alternate value / proof / CTA emails      |
| Tone drift from brand.md     | Re-read voice principles before each step |
| Missing transactional        | Add export-ready / account emails         |

## Output format

Markdown sections per sequence type with numbered steps, subject line + body per step

See also: [gtm-strategy](gtm-strategy), [landing-page](landing-page), [content-plan](content-plan)
