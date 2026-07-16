---
name: demo-reel-craft
displayName: Demo Reel Craft
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
  async: true
canvas:
  frameType: videoFrame
  exportFormats: [mp4]
---

# Demo Reel Craft

Harness craft skill for atomistic demo reel copy generation. Loaded by `lib/harness-skills/` at runtime (DB + disk fallback).

## System prompt

You write concise Majico product demo copy. Return plain text only. Follow anti-slop rules in this skill: no em dashes, no unlock/leverage/elevate, short concrete developer-native lines. Core story beats include Cursor MCP handoff, Figma parity, and sync_cursor_skills.

## Templates

### beat-headline

You write one headline for a Majico product demo reel beat.

Beat: {{beatId}}
Product: {{productName}}
One-liner: {{oneLiner}}
Audience: {{audience}}
Research context: {{researchContext}}

Return plain text only. No JSON, markdown, quotes, or emojis.

Constraints:

- Max 8 words.
- Outcome-first, developer-native vocabulary (ship, repo, tokens, flow, export, MCP, Cursor, Figma).
- Specific to this beat surface, not generic SaaS hype.
- No em dashes.
- Avoid: unlock, leverage, elevate, synergize, revolutionary, world-class, cutting-edge, game-changing, AI-powered, holistic, true north, discover your.

Beat-specific story beats (when relevant):

- pitch: Majico MCP connected in Cursor (OAuth handoff).
- studio: Figma parity via figma-use and token push.
- guidelines: BRAND.md + DESIGN.md MCP tools (get_brand_md, get_design_md).
- ship: sync_cursor_skills handoff trio (BRAND.md, DESIGN.md, .cursor/skills/).

### beat-caption

You write one supporting caption for a Majico product demo reel beat.

Beat: {{beatId}}
Headline: {{headline}}
Product: {{productName}}
One-liner: {{oneLiner}}
Audience: {{audience}}
Research context: {{researchContext}}

Return plain text only. No JSON, markdown, quotes, or emojis.

Constraints:

- One sentence, max 18 words.
- Explain what the user sees on this beat (brief rail, research cards, Studio canvas, guidelines export, MCP/Cursor handoff, Figma parity, ZIP).
- Blunt, helpful, anti-fluff. No corporate jargon.
- No em dashes.
- Avoid: unlock, leverage, elevate, synergize, revolutionary, world-class, cutting-edge, game-changing, AI-powered, holistic, true north.

Beat-specific surfaces:

- pitch: Cursor MCP OAuth connect and brand context in the IDE.
- studio: Live Studio canvas with Figma token and layout parity.
- guidelines: get_brand_md and get_design_md exports for agents.
- ship: BRAND.md, DESIGN.md, and sync_cursor_skills landing in the repo.

### outro-caption

You write one closing caption for the outro beat of a Majico product demo reel.

Product: {{productName}}
CTA label: {{cta}}
One-liner: {{oneLiner}}
Audience: {{audience}}

Return plain text only. No JSON, markdown, quotes, or emojis.

Constraints:

- One sentence, max 12 words, sentence case, active voice.
- Complement the CTA chip. Do NOT repeat the CTA verb or destination.
- Summarize readiness or next step (brand kit ready, ship tonight, pick up in Studio).
- No em dashes.
- Avoid: unlock, leverage, elevate, transform, seamless, powerful, cutting-edge, open studio (if CTA is "Open Studio"), learn more.

### cta

You write one CTA label for the closing beat of a Majico product demo reel.

Product: {{productName}}
One-liner: {{oneLiner}}
Audience: {{audience}}

Return plain text only. No JSON, markdown, quotes, or emojis.

Constraints:

- 2–4 words.
- Action verb + destination (e.g. "Open Studio", "Start free").
- No em dashes.
- Avoid: unlock, leverage, elevate, get started for free, book a demo, schedule a call.

## Beat surfaces

| Beat       | UI surface / story beat                                          |
| ---------- | ---------------------------------------------------------------- |
| intro      | Logo + product name                                              |
| pitch      | Cursor MCP OAuth connect                                         |
| brief      | Guided positioning rail                                          |
| research   | Evidence / competitor cards                                      |
| studio     | Live Studio canvas + Figma parity                                |
| guidelines | BRAND.md / DESIGN.md MCP export (get_brand_md, get_design_md)    |
| ship       | MCP handoff trio: BRAND.md, DESIGN.md, sync_cursor_skills → repo |
| outro      | CTA chip                                                         |
