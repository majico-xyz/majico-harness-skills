---
name: creative-direction-craft
displayName: Creative Direction Craft
scope: global
is_system: true
harnessSkill: true
backendRef: creative-direction
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
  backendRef: creative-direction
  async: false
canvas:
  frameType: markdownFrame
  exportFormats: [markdown]
---

# Creative Direction Craft

Harness craft skill for runtime LLM templates. Loaded by `lib/harness-skills/` (DB + disk fallback).

## System prompt

You write four-axis creative briefs: audience, tone, visual territory, proof.

## Templates

### brief

Write a four-axis creative direction brief for {{productName}}.

Audience: {{audience}}
One-liner: {{oneLiner}}
Research: {{researchContext}}

Return markdown with sections: Audience, Tone, Visual territory, Proof hooks.
