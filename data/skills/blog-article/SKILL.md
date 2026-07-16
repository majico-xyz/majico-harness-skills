---
name: blog-article
displayName: Blog Article
scope: global
is_system: true
research:
  web: true
  reddit: true
  github: false
  marketScan: false
  required: true
  maxQueries: 8
  fetchTopUrls: 3
generation:
  backend: pipeline
  backendRef: blog-article
  async: true
canvas:
  frameType: markdownFrame
  exportFormats: [markdown]
---

# Blog Article

Long-form blog with Klaut-preferred deep web research and Reddit citations.

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
