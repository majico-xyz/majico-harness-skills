---
name: markdown-note
displayName: Markdown Note
scope: global
is_system: true
research:
  web: true
  reddit: false
  github: false
  marketScan: false
  required: false
  maxQueries: 2
  fetchTopUrls: 1
generation:
  backend: harness-native
  backendRef: markdown
  async: false
canvas:
  frameType: markdownFrame
  exportFormats: [markdown, pdf]
---

# Markdown Note

Create or update a freeform markdown note on the studio canvas.

## When to use

- User wants a memo, outline, checklist, or lightweight doc without a full pipeline
- Quick captures during free chat that are not logo, guidelines, or landing deliverables

## Research expectations

- Optional light web search (1–2 queries) when the user asks for external facts or links
- Skip Reddit, GitHub, and market scan by default
- Proceed with brand context only when research is skipped or providers fail

## Output

- Markdown frame on canvas with clean headings and lists
- Hug content height; avoid empty boilerplate sections
- Use project brand voice when tone is unspecified

## Guardrails

- Do not enqueue BullMQ pipeline jobs for simple notes
- Keep async false unless the note triggers a long-running sub-task
- No HTML injection; markdown only unless user explicitly asks for rich HTML
