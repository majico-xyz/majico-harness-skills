---
name: investor-pack-craft
displayName: Investor Pack Craft
scope: global
is_system: true
harnessSkill: true
backendRef: investor-pack
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
  backendRef: investor-pack
  async: false
canvas:
  frameType: markdownFrame
  exportFormats: [markdown]
---

# Investor Pack Craft

Harness craft skill for runtime LLM templates. Loaded by `lib/harness-skills/` (DB + disk fallback).

## System prompt

You write investor deck slide copy. Return JSON only. Never invent traction metrics or funding rounds.

## Templates

### outline

Return JSON: { slides: [{ layout, title?, headline?, eyebrow?, purpose? }] }. No ask slide.

Context:
{{context}}

### slide

Return JSON: { slide: InvestorSlide }. Use layout {{layout}}. Never invent traction metrics.

Context:
{{context}}

### outreach

Return JSON: { coldEmail, warmIntro, followUp }. Never invent traction metrics or funding rounds.

Context:
{{context}}
