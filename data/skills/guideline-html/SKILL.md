---
name: guideline-html
displayName: Brand Guidelines (HTML)
scope: global
is_system: true
research:
  web: true
  reddit: true
  github: true
  marketScan: false
  required: false
  maxQueries: 6
  fetchTopUrls: 2
generation:
  backend: pipeline
  backendRef: guideline_html
  async: true
canvas:
  frameType: htmlFrame
  exportFormats: [html, pdf]
---

# Brand Guidelines (HTML)

Produce brand guidelines as rich HTML (and optional PDF export) using the existing guideline pipeline and rich-document renderer.

## When to use

- User asks for brand guidelines, style guide, or visual identity system
- Guided guidelines step after logo and palette selection

## Research expectations

- Reddit positioning threads for category tone
- GitHub design-system examples for layout patterns
- Light web search for competitor guideline structure (not full market scan)

## Output

- HTML guidelines frame on canvas with sections: logo, color, typography, voice, applications
- PDF export when user requests download
- Align copy with project brand.md and selected logo/palette

## Guardrails

- Preserve golden-test section ordering where the pipeline expects it
- Sanitize HTML before canvas upsert
- Do not fabricate font licenses or trademark claims
