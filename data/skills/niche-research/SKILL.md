---
name: niche-research
displayName: Niche Research
scope: global
is_system: true
research:
  web: true
  reddit: true
  github: true
  marketScan: true
  required: true
  maxQueries: 8
  fetchTopUrls: 3
generation:
  backend: pipeline
  backendRef: niche_research
  async: true
canvas:
  frameType: markdownFrame
  exportFormats: [markdown, pdf]
---

# Niche Research

Run a full market scan before drafting the brief. Surface category clarity, competitor gaps, audience pain points, and naming opportunities.

## When to use

- New project brief or repositioning
- User asks for market research, ICP, or niche validation
- Guided rail keywords / target-group steps need enriched context

## Research expectations

- Web search via SearXNG/Klaut for category and competitor queries
- Reddit dorks for frustrated-user and pain-point threads
- GitHub/npm/HN density scan for competitive landscape
- Fetch top URLs for evidence-backed summaries

## Output

- Markdown brief cards on the studio canvas (`markdownFrame`)
- Cite sources from the research bundle when summarizing findings
- Keep tone operator-led: short sentences, evidence over superlatives

## Guardrails

- Do not invent competitor names or metrics absent from research
- If research providers fail and `research.required` is true, block generation and ask the user to retry
- Prefer light refresh (2–3 queries) when a recent snapshot exists for the same project + skill
