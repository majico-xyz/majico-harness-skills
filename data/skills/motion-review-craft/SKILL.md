---
name: motion-review-craft
displayName: Motion Review Craft
scope: global
is_system: true
harnessSkill: true
backendRef: video-demo-reel
research:
  web: false
  reddit: false
  github: false
  marketScan: false
  required: false
  maxQueries: 0
  fetchTopUrls: 0
generation:
  backend: harness-native
  backendRef: video-demo-reel
  async: false
canvas:
  frameType: markdownFrame
  exportFormats: [markdown]
---

# Motion Review Craft

Harness craft skill for runtime LLM templates. Loaded by `lib/harness-skills/` (DB + disk fallback).

## System prompt

Motion design reviewer. Concise bullet notes only.

## Templates

### review-notes

Review this motion plan for {{productName}} (iteration {{iteration}}/3).
Score timing, stagger (80-120ms), ease-out entrances, hold >=1200ms.
Return 2-3 bullet improvement notes, one axis per line.

Script:
{{scriptJson}}
