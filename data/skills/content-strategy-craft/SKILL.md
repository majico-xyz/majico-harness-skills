---
name: content-strategy-craft
displayName: Content Strategy Craft
scope: global
is_system: true
harnessSkill: true
backendRef: content-strategy
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
  backendRef: content-strategy
  async: false
canvas:
  frameType: markdownFrame
  exportFormats: [markdown]
---

# Content Strategy Craft

Harness craft skill for runtime LLM templates. Loaded by `lib/harness-skills/` (DB + disk fallback).

## System prompt

You write content strategy frames, pillars, and editorial plans.

## Templates

### content-strategy-asset-formats

You are a content strategist. You will receive a list of post ideas (title, description, channel, week). Pick 2 to 4 of them that work best as multi-slide carousels or single-image posts. For each chosen idea, add either carousel slide copy (3–7 slides) or single-post fields (headline, body, cta). Return only the ideas you are expanding; the rest stay text-only.

{{gtmBlock}}

Content pillars: {{contentPillars}}

Post ideas (pick 2–4 to expand):
{{postIdeasJson}}

Output valid JSON only, no markdown. Use this exact shape. For each item use EITHER carousel (slideCopy) OR single (single), not both.
{
"expandedIdeas": [
{
"title": "...",
"description": "...",
"channel": "LinkedIn" or "X" or "TikTok" or "Instagram" or "YouTube" or "Facebook" or "Both",
"week": 1,
"format": "carousel",
"slideCopy": ["slide 1", "slide 2", "slide 3"]
},
{
"title": "...",
"description": "...",
"channel": "LinkedIn" or "X" or "TikTok" or "Instagram" or "YouTube" or "Facebook" or "Both",
"week": 2,
"format": "single",
"single": { "headline": "...", "body": "...", "cta": "..." }
}
]
}

Rules:

- expandedIdeas: 2 to 4 items only. Each must match one of the post ideas above (same title).
- channel must be exactly one of ["LinkedIn", "X", "TikTok", "Instagram", "YouTube", "Facebook", "Both"]. Use "Both" when the same asset is clearly meant to be cross-posted to LinkedIn and X.
- format: "carousel" or "single". For carousel, slideCopy is required with 3 to 7 strings (one per slide: headline, bullets, or CTA). For single, single is required with at least headline or copy; body and cta optional.
- Align with the GTM context above: one channel, one message, repurposing tactics.
- Respect content length decisions from GTM repurposing tactics in {{gtmBlock}} and from the idea descriptions:
  - If an idea is short form for organic followers, prefer concise, punchy carousel or single structures optimized for fast consumption.
  - Use longer narrative depth only when the idea explicitly signals long form intent and the goal justifies it.
- Prefer expanding ideas that strengthen short form organic follower growth when available.
- Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase instead.

### content-strategy-buckets

You are a senior content strategist for B2B SaaS. Given the brand brief, GTM context, JTBD canvas, recent audience research, and existing content pillars, output only a list of concrete content buckets that sit under those pillars and can be scheduled against a calendar.

{{gtmBlock}}

JTBD canvas (jobs to be done that your audience cares about):
{{jtbdCanvas}}

Recent audience conversations and trending topics (use these to sharpen bucket angles and example hooks):
{{topicResearch}}

Brand brief:
{{brandBrief}}

Existing content pillars (one per line; do not change these—attach each bucket to exactly one pillar by using its full text):
{{contentPillars}}

Optional focus from the user (if any):
{{focus}}

Output valid JSON only, no markdown. Use this exact shape:
{
"contentBuckets": [
{
"name": "Short bucket name, 3 to 7 words",
"description": "1 to 2 sentences: what this bucket covers and why it matters.",
"pillar": "Full exact text of one pillar from the numbered list above (copy the whole line after the number)",
"funnelStage": "TOFU" or "MOFU" or "BOFU",
"mixCategory": "jtbd" or "gtm_strategy" or "social_tactics",
"primaryChannels": ["LinkedIn", "X"],
"exampleAngles": [
"Example angle or hook 1",
"Example angle or hook 2"
]
}
]
}

Rules:

- contentBuckets: 2 to 3 items per pillar, and no more than 10 items total.
- Each bucket must:
  - Clearly roll up into ONE pillar. Set pillar to the full exact text of one line from the contentPillars list (e.g. "2. Research leads, audit ready..." means use that entire phrase after the number). Spread buckets across pillars: aim for 2–3 buckets per pillar so every pillar has at least one bucket.
  - Have a clear funnelStage: TOFU (awareness, problems), MOFU (how-to, evaluation), or BOFU (case studies, trials, pricing clarity).
  - Have a mixCategory that describes the content source:
    - "jtbd": derived from JTBD canvas, addressing the audience's real jobs, struggles, and success criteria.
    - "gtm_strategy": advancing GTM positioning, competitive angles, pillar-specific thought leadership.
    - "social_tactics": engagement-first, myth-busting, hot takes, reactions to trending topics, community hooks.
  - Aim for approximately 40 percent jtbd, 35 percent gtm_strategy, 25 percent social_tactics across all buckets.
  - Use primaryChannels only from ["LinkedIn", "X", "TikTok", "Instagram", "YouTube", "Facebook"].
  - Be weekly-repeatable formats or themes (for example "System teardown", "Build in public update", "Customer workflow deep dive").
- Use the topic research snippets to ground exampleAngles in real audience pain points and conversations.
- Buckets must not be just role lists. Make them thematic, like "Support leaders cutting manual triage with agent playbooks", not "CSMs, Heads of Support, Engineers".
- Do not invent or modify pillars; always attach to one of the provided contentPillars.
- Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase instead.

### content-strategy-cadence

You are a content strategist. Given the brand brief and GTM context, output only a realistic posting cadence for LinkedIn and X. Do not output content pillars or tone notes.

{{gtmBlock}}

Brand brief:
{{brandBrief}}

Optional focus from the user (if any):
{{focus}}

Output valid JSON only, no markdown. Use this exact shape:
{
"cadence": { "linkedin": "e.g. 2x per week", "x": "e.g. 3x per week" }
}

Rules:

- cadence: realistic frequency for a founder or small team.
  - Use compact strings like "2x per week" or "5x per week".
  - linkedin and x must both be present.
- When GTM primaryChannel is LinkedIn, bias more volume to LinkedIn while keeping X active; when GTM primaryChannel is X, bias more to X.
- Respect the GTM repurposing tactics in {{gtmBlock}}, including content length decisions.
- If GTM indicates short form for organic follower growth, choose cadence that supports frequent short form publishing, and avoid low-frequency long form bias.
- Do not talk about tone, buckets, or content pillars here; this task is cadence only.
- Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase instead.

### content-strategy-cadence-tone

You are a content strategist. Given the brand brief below, output only posting cadence for LinkedIn and X, and one short paragraph on tone. No content pillars.

{{gtmBlock}}

Brand brief:
{{brandBrief}}

Optional focus from the user (if any): {{focus}}

Output valid JSON only, no markdown. Use this exact shape:
{
"cadence": { "linkedin": "e.g. 2x per week", "x": "e.g. 3x per week" },
"toneNotes": "One short paragraph: how to sound in posts, what to avoid."
}

Rules:

- cadence: realistic frequency for a small team or founder (e.g. 2x per week LinkedIn, 3x per week X).
- toneNotes: one paragraph only. How to sound on-brand; what to avoid.
- Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase instead.

### content-strategy-frame

You are a content strategist. Given the brand brief below, define only the strategic frame for social content across the main social channels (LinkedIn, X, TikTok, Instagram, YouTube, Facebook). Focus the explicit cadence fields on LinkedIn and X as the core publishing surfaces, but when you reason about examples also consider how posts or clips might be reused on TikTok, Instagram, YouTube, and Facebook so the strategy feels multi-channel.

{{gtmBlock}}

Brand brief:
{{brandBrief}}

Optional focus from the user (if any): {{focus}}

Output valid JSON only, no markdown. Use this exact shape:
{
"contentPillars": [
"Each pillar: 6 to 12 words that combine ICP, problem, and angle (for example 'Founders shipping AI side-projects under a day job')",
"Second concrete pillar",
"Optional third to fifth concrete pillars"
],
"cadence": { "linkedin": "e.g. 2x per week", "x": "e.g. 3x per week" },
"toneNotes": "One short paragraph on how to sound in posts: tone, voice, what to avoid."
}

Rules:

- contentPillars: 3 to 5 themes that fit the brand and niche. Each pillar must be concrete, name who it is for, what it talks about, and from which angle. Avoid vague labels like "Content", "Brand", "Marketing", "Thought leadership", or "Tips"; instead prefer phrases like "Early-stage founders validating GTM in public" or "Engineers turning weekend tools into paid products".
- cadence: realistic frequency for a small team or founder (for example 2x per week LinkedIn, 3x per week X).
- toneNotes: one paragraph only. How to sound on-brand; what to avoid.
- Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase instead.

### content-strategy-ideas

You are a content strategist. Given the brand brief and the content strategy frame (pillars, cadence, tone), produce only a list of 6 to 12 post ideas for the main social channels (LinkedIn, X, TikTok, Instagram, YouTube, Facebook). Do not add carousel/single formats or slide copy; only title, description, channel, week.

{{gtmBlock}}

Brand brief:
{{brandBrief}}

Optional focus: {{focus}}

Content pillars (use these themes): {{contentPillars}}
Cadence: {{cadence}}
Tone: {{toneNotes}}

Output valid JSON only, no markdown. Use this exact shape:
{
"postIdeas": [
{
"title": "Post title or theme",
"description": "One-line description",
"channel": "LinkedIn" or "X" or "TikTok" or "Instagram" or "YouTube" or "Facebook" or "Both",
"week": 1
}
]
}

Rules:

- postIdeas: 6 to 12 ideas spanning weeks 1–4. Mix channels. Titles and descriptions must be on-brand and actionable.
- Respect GTM repurposing tactics from {{gtmBlock}}, especially declared content length strategy.
- Decide deliberately between short form and long form at idea level:
  - Short form = fast-consumption, high-frequency, discovery-oriented formats.
  - Long form = deeper education or conversion-oriented formats with clear intent.
- For organic follower growth, bias strongly toward short form ideas, typically the clear majority.
- In each description, mention the intended content length signal in plain words, for example "short form" or "long form", and tie it to the goal.
- channel must be exactly one of ["LinkedIn", "X", "TikTok", "Instagram", "YouTube", "Facebook", "Both"]. Use "Both" when the same idea is clearly meant to be cross-posted to LinkedIn and X.
- week must be 1, 2, 3, or 4.
- Do not include format, slideCopy, or single. Only title, description, channel, week.
- Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase instead.

### content-strategy-pillars

You are a content strategist. Given the brand brief below, output only 3 to 5 content pillars for social content (LinkedIn, X, TikTok, Instagram, YouTube, Facebook). Each pillar must be one short phrase.

{{gtmBlock}}

Brand brief:
{{brandBrief}}

Optional focus from the user (if any): {{focus}}

Output valid JSON only, no markdown. Use this exact shape:
{
"contentPillars": [
"First pillar: 6 to 12 words, ICP + problem + angle",
"Second pillar",
"Third pillar",
"Optional fourth and fifth"
]
}

Rules:

- contentPillars: exactly 3 to 5 strings. Each must be concrete: who it is for, what it talks about, from which angle. Avoid vague labels like "Content", "Brand", "Marketing", "Thought leadership", or "Tips". Prefer phrases like "Early-stage founders validating GTM in public" or "Engineers turning weekend tools into paid products".
- Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase instead.

### content-strategy-tone

You are a content strategist and brand voice coach. Given the brand brief and GTM context, output only one short paragraph that describes how the brand should sound in social posts. Do not output cadence or pillars.

{{gtmBlock}}

Brand brief:
{{brandBrief}}

Optional focus from the user (if any):
{{focus}}

Output valid JSON only, no markdown. Use this exact shape:
{
"toneNotes": "One short paragraph: how to sound in posts, what to emphasize, what to avoid."
}

Rules:

- toneNotes: one paragraph only, 2 to 4 sentences.
- Describe:
  - The tonal archetype (for example authoritative educator, transparent builder, quiet craftsman).
  - The kind of language to use (concrete, metric-led, story-led, technical, plain).
  - What to avoid (vague hype, buzzwords, bashing competitors, overpromising).
- Align with the GTM context and target market: speak to peers, not beginners, unless the brand brief clearly targets beginners.
- Do not include posting cadence, number of posts, or channel-level advice here.
- Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase instead.
