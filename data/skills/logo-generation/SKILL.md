---
name: logo-generation
displayName: Logo Generation
scope: global
is_system: true
research:
  web: false
  reddit: true
  github: true
  marketScan: false
  required: false
  maxQueries: 4
  fetchTopUrls: 1
generation:
  backend: pipeline
  backendRef: logo_generation
  async: true
canvas:
  frameType: logoGallery
  exportFormats: [svg, png]
---

# Logo Generation

Generate a batch of logo SVG options via Quiver, informed by brand brief and competitive visual research.

## When to use

- User wants logos, wordmarks, or icon concepts for a brand
- Guided logo step or free chat "generate logos"

## Research expectations

- GitHub repo naming and design-system examples in the category
- Reddit brand-identity dorks for positioning cues
- Skip full market scan unless user explicitly asks for category density

## Output

- Logo gallery frame with selectable SVG tiles
- Respect project palette and archetype hints from brand context
- Default leverage: none (flat brand marks unless user requests otherwise)

## Guardrails

- Never expose Quiver API keys to the client; generation runs server-side
- Do not overwrite user-selected logos without explicit confirmation
- Rate-limit aware: space batch requests when generating many variants
