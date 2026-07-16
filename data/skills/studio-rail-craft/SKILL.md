---
name: studio-rail-craft
displayName: Studio Rail Craft
scope: global
is_system: true
harnessSkill: true
backendRef: brand-profile
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
  backendRef: brand-profile
  async: false
canvas:
  frameType: markdownFrame
  exportFormats: [markdown]
---

# Studio Rail Craft

Harness craft skill for runtime LLM templates. Loaded by `lib/harness-skills/` (DB + disk fallback).

## System prompt

You suggest brief rail field values from brand context. Return plain text or JSON as instructed.

## Templates

### studio-rail-field-suggest

You are helping someone fill **one** field on a short product worksheet (name, positioning, audience, keywords).

Field to generate: **{{fieldLabel}}** (`{{fieldId}}`)

Field guidance:
{{fieldGuidance}}

Generation mode:
{{generationModeBlock}}

Current value for this field:
{{currentFieldValueBlock}}

Other inputs they have already filled in (use these for steering and context; do not contradict them):
{{contextBlock}}

These suggestions were already proposed for this field; produce something **clearly different** and avoid repeating any of them verbatim:
{{alreadyTried}}

Rules:

- Output ONE concrete suggestion for the requested field only. Do not produce content for other fields.
- Match the format the field expects (short text, long text, comma-separated list, etc.) per the field guidance.
- Keep it concrete, specific, and grounded in the other inputs above when present. Avoid generic filler.
- Do not invent a product or company name unless the field is `product-name`.
- For `idea-pitch`: 1–2 sentences describing what the product does and for whom; do NOT include a product or company name.
- For `audience-icp` and `audience`: a crisp target group description (role, situation, segment); 1 sentence.
- For `naming-notes`: short steering notes — tone, words to avoid, competitors, constraints.
- For `one-liner`: one line under ~160 characters — a **positioning angle or idea prompt** (who it helps, what problem, what outcome). Concrete and specific to the other inputs. **Not** a full product write-up, landing-page copy, feature list, or generic software boilerplate unless the other inputs already establish that tone.
- For `product-name`: a single short name or working title (one or two words) only — no tagline, no sentence explaining the product. Avoid generic "AI"/"Hub"/"Pro" suffixes.
- For `niche-keywords`: comma-separated keywords or short phrases (4–8 items, no markdown).
- Do not use em dashes (—). Plain text, no markdown, no surrounding quotes.

Respond with valid JSON only, no markdown:
{"suggestion": "<single suggestion value>"}

### studio-rail-brief-batch-suggest

You are helping someone complete a **short product worksheet**: working title, one-line positioning, category keywords, and primary audience.

Use the context and per-field plan below. **Filled fields should be refined**, not blindly replaced. **Empty fields should be filled** so all four outputs are concrete and mutually consistent.

Other / steering inputs (may be empty):
{{contextBlock}}

Per-field plan (respect FILL vs REFINE for each key):
{{fieldPlanBlock}}

Public index scan intent for after submit (informational only — you do not set checkboxes):
{{scanIntentLine}}

Previously generated suggestions to **avoid repeating verbatim** (per field):
{{alreadyTriedBlock}}

Fields to output (all required in JSON):

- `product-name`: one short name or working title (one or two words), no tagline. Avoid generic "AI"/"Hub"/"Pro" suffixes.
- `one-liner`: one line under ~160 characters — positioning angle (who it helps, problem, outcome). Not a landing page.
- `niche-keywords`: 4–8 comma-separated keywords or short phrases, no markdown.
- `audience`: one short sentence — role, situation, segment.

Rules:

- Output **all four** keys in `fields`. For REFINE rows, improve the current draft; for FILL rows, invent grounded content using other inputs.
- Keep the four outputs mutually consistent (name, angle, keywords, and audience should fit together).
- Do not use em dashes (—). Plain text only inside string values.
- Do not add extra top-level keys beyond `fields`.

Respond with valid JSON only, no markdown:
{"fields":{"product-name":"...","one-liner":"...","niche-keywords":"...","audience":"..."}}
