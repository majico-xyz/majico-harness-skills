---
name: gtm-jtbd
displayName: GTM JTBD
scope: global
is_system: true
research:
  web: true
  reddit: true
  github: false
  marketScan: false
  required: false
  maxQueries: 6
  fetchTopUrls: 2
generation:
  backend: pipeline
  backendRef: gtm-jtbd
  async: true
canvas:
  frameType: htmlFrame
  exportFormats: [html, pdf]
---

# GTM JTBD

Jobs-to-be-done canvas with Reddit and HN pain-point research.

## When to use

- User explicitly requests this deliverable in Studio or harness chat
- Upstream research and brand context are available (or refresh is requested)

## When NOT to use

- Required upstream artifacts are missing (see Prerequisites in skill body)
- User wants a quick canvas patch only (use canvas-patch)

## Required inputs

- Project brief rail: product, audience, positioning
- brand.md / design.md when the deliverable references visual or voice rules

## Failure patterns

| Issue                 | Fix                                                    |
| --------------------- | ------------------------------------------------------ |
| Generic output        | Re-run research; cite evidence in agent reply          |
| Voice drift           | Re-read brand.md voice section before regenerating     |
| Skipped prerequisites | Block generation until brief + research snapshot exist |

## Output format

See canvas frameType and exportFormats in frontmatter. Summarize decisions in the agent reply.
