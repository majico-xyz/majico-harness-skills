---
name: investor-one-pager
displayName: Investor One-Pager
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
  backendRef: investor-one-pager
  async: true
canvas:
  frameType: pdfFrame
  exportFormats: [pdf]
---

# Investor One-Pager (Phase 2)

Generate a branded one-page PDF summary for investors. Explicit request only — not auto-derived from the pitch deck.

## Prerequisite

- `harness-investor-pack` exists on canvas (deck generated first)

## When to use

- User asks for an investor one-pager or single-page summary
