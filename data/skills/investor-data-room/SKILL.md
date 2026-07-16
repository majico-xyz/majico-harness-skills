---
name: investor-data-room
displayName: Investor Data Room
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
  backendRef: investor-data-room
  async: true
canvas:
  frameType: markdownFrame
  exportFormats: [md]
---

# Investor Data Room (Phase 2)

Generate a diligence checklist (`data-room-summary.md`) with Majico artifact links and `[Add …]` placeholders for user-owned documents.

## Prerequisite

- `harness-investor-pack` on canvas

## When to use

- User asks for a data room, diligence checklist, or investor data room summary
