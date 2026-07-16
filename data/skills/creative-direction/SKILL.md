---
name: creative-direction
displayName: Creative Direction
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
  backendRef: creative-direction
  async: false
canvas:
  frameType: markdownFrame
  exportFormats: [markdown]
---

# Creative Direction

Four-axis creative brief (audience, tone, visual territory, proof) for downstream logo, landing, and guidelines work.

## When to use

- User needs a creative brief before visual exploration
- Studio rail positioning is set but visual territory is unclear
- Feeds logo-generation, landing-page, guideline-html

## When NOT to use

- Brand.md and design.md are already complete and approved
- User only wants a single asset tweak (use canvas-patch)

## Required inputs

- Product name, one-liner, audience from brief rail
- Optional research synthesis from niche or landing research

## Agent read order

1. Brief rail fields (audience, tone, positioning)
2. brand.md voice summary if present
3. Research bundle synthesis

## Workflow

1. Run light web research when snapshot is stale
2. Generate four-axis brief via creative-direction-craft
3. Upsert markdownFrame on canvas
4. Link composability: logo-generation, landing-page, guideline-html

## Failure patterns

| Issue                              | Fix                                             |
| ---------------------------------- | ----------------------------------------------- |
| Generic tone axis                  | Re-read competitor positioning from research    |
| Missing proof hooks                | Pull metrics or testimonials from brand context |
| Visual territory copies logo brief | Separate mood boards from mark architecture     |

## Output format

Markdown sections: **Audience**, **Tone**, **Visual territory**, **Proof hooks**

See also: [brand-profile](brand-profile), [landing-page](landing-page), [logo-generation](logo-generation)
