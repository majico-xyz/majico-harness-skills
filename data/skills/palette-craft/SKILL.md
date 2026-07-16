---
name: palette-craft
displayName: Palette Craft
scope: global
is_system: true
harnessSkill: true
backendRef: logo-generation
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
  backendRef: logo-generation
  async: false
canvas:
  frameType: markdownFrame
  exportFormats: [markdown]
---

# Palette Craft

Harness craft skill for runtime LLM templates. Loaded by `lib/harness-skills/` (DB + disk fallback).

## System prompt

You suggest and grade brand color palettes. Return JSON or plain text as instructed.

## Templates

### suggest-palette

Brand profile:

- Primary archetype: {{primaryArchetype}}
- Secondary archetype: {{secondaryArchetype}}
- Brand tones: {{brandTones}}
- Niche / positioning: {{nicheIntent}}
- Product name: {{productName}}
- Brand story: {{brandStory}}

The backend will show color palettes built from these harmonies (in order): {{harmonyIds}}. You may suggest an optional global nudge to bias the main set, and 0–2 variation requests.

Allowed seed nudges (use exactly these strings): {{nudgeList}}
Allowed harmony IDs (for variations, use exactly): monochromatic, analogous, complementary, split_complementary, triadic, tetradic, achromatic

Tasks:

1. strong_colors_summary: One sentence describing the strong color directions for this brand (e.g. "Warm, earthy accents with a touch of contrast for key actions"). No hexes.
2. globalSeedNudge: Optional. One of the allowed nudges, or null. Use only if the brand profile clearly suggests it (e.g. warmer for food/wellness, muted for serious B2B).
3. variations: Array of 0–2 objects. Each has: seedNudge (one of allowed), optional harmonyId (one of allowed), and reason (1–2 sentences why this variation fits the brand). Do not suggest more than 2 variations.

Respond with valid JSON only, no markdown.

Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase instead.
{"strong_colors_summary":"<one sentence>","globalSeedNudge":null,"variations":[{"seedNudge":"<allowed>","harmonyId":"<allowed or omit>","reason":"<1-2 sentences>"}]}

### suggest-palette-colors

Brand profile:

- Primary archetype: {{primaryArchetype}}
- Secondary archetype: {{secondaryArchetype}}
- Brand tones: {{brandTones}}
- Niche / positioning: {{nicheIntent}}
- Product name: {{productName}}
- Brand story: {{brandStory}}

Reference color mood snippets from curated design libraries (optional; inspiration only):
{{referencePaletteNotes}}

We will build up to 8 color schemes from your suggested color(s), one per harmony (monochromatic, analogous, complementary, etc.). Pick 1–3 hex colors that best represent the brand's primary accent direction. Use lowercase hex with # (e.g. #2d5016, #dc2626). Prefer on-brand colors with clear hue direction; we derive both refined muted and more vivid harmony variants automatically, so the seed does not need to be fully saturated.

Tasks:

1. strong_colors_summary: One sentence describing the strong color direction for this brand (no hexes).
2. accent_hexes: Array of 1–3 hex strings. First color is the main seed; optional second/third can blend. Must be valid CSS hex (e.g. #abc or #aabbcc).

Respond with valid JSON only, no markdown.

Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase instead.
{"strong_colors_summary":"<one sentence>","accent_hexes":["#hex1","#hex2"]}

### grade-palette-options

Product: {{productName}}
Brand story: {{brandStory}}

We generated 8 color schemes from the brand's suggested colors (one per harmony). Each option has: index (1–8), harmony name, primary accent hex, muted/secondary accent hex.

Options (JSON array):
{{optionsJson}}

Grade each option for fit with the brand (personality, niche, story). Pick exactly the 2 best that differ in color character: e.g. one refined or muted and one more vivid, or clearly different hues. Do not pick two schemes that look nearly identical (same gray/beige/teal family and similar saturation). Return the indices of the 2 best (use 1-based indices 1–8 as in the list above).

Respond with valid JSON only, no markdown.

Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase instead.
{"best_indices":[3,7],"reason":"<1-2 sentences why these two fit the brand best>"}

### improve-palette-pair

Product: {{productName}}

We chose 2 schemes as the best fit. Suggest one improvement per palette (optional). Allowed tweaks (use exactly these strings, lowercase, or null for no change): {{nudgeList}}

The 2 palettes (each has accent and accent_muted hex for light theme):
{{palettesJson}}

For each palette, suggest at most one nudge to refine it (e.g. warmer, bolder, muted). Use null if no change. Return an array of 2 objects: one per palette in the same order.

Respond with valid JSON only, no markdown.

Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase instead.
{"improvements":[{"nudge":"warmer","reason":"<optional short reason>"},{"nudge":null,"reason":null}]}
