---
name: brand-profile-craft
displayName: Brand Profile Craft
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

# Brand Profile Craft

Harness craft skill for runtime LLM templates. Loaded by `lib/harness-skills/` (DB + disk fallback).

## System prompt

You synthesize brand research: positioning, competitors, archetypes, naming.

## Templates

### generate-search-query

Product (what it does; do not use in query): {{product}}
Target audience: {{audience}}
Niche keywords: {{keywords}}

From the product description and keywords, derive the market category (e.g. "AI SaaS branding tools", "brand identity software for indie developers"). Output a single search query (10–15 words max) that would find relevant market positioning, industry content, and competitors. Do NOT include the product or brand name in the query. Use only category descriptors, audience, and keywords. No quotes, no preamble, only the query.

### summarize-chunk

You are helping position THIS product for THIS audience.

Product: {{product}}
Audience: {{audience}}
Niche keywords: {{keywords}}

Below is text from one web search result. It may discuss competitors or generic trends in the same category (that is still useful for market and positioning).

Reply with exactly IRRELEVANT only when the industry or buyer is clearly wrong (e.g. consumer gaming when the product is B2B finance, or unrelated geography or regulation).

Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase instead.
If it helps understand the niche, buyer pains, trends, or how others position in this space, summarize in 1–3 sentences what matters for this product's brand strategy. Output only the summary or IRRELEVANT.

Text:
{{truncated}}

### synthesize-summary

You are a brand strategist writing an actionable market read for the founder. Be specific to this product and audience, not generic corporate language.

Product: {{product}}
Audience: {{audience}}
Niche keywords: {{keywords}}

Evidence from web research (may name competitors or adjacent tools, that is expected):
{{combined}}

Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase for a premium tone instead.
Write one short paragraph, 4–6 sentences, that answers: what is happening in this market right now, what buyers expect or compare, where messaging clusters, and what angle this product can credibly own. Ignore site chrome, footers, cookie banners, or navigation lists. If evidence is thin, say what is missing and what to validate next. Output only the paragraph.

### suggest-archetype

Pick brand archetypes that fit THIS product and THIS audience. Be specific—not generic.

Product: {{product}}
Audience: {{audience}}
Niche keywords: {{keywords}}

Positioning summary:
{{wholeSummary}}

Archetypes (use exactly these ids): {{archetype_ids}}.

Also suggest how much to lean on primary vs secondary: balance from 0 to 1 (1 = fully primary, 0 = fully secondary, 0.5 = equal). Give a short reason for that balance (1–2 sentences), e.g. why this mix fits the category or helps stand out.

Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase for a premium tone instead.
Respond with valid JSON only, no markdown. Rationale: 1–2 sentences for why these archetypes. balance_reason: 1–2 sentences for why this primary/secondary mix.
{"primary":"<id>","secondary":"<id or omit>","rationale":"<1-2 sentences>","balance":<0-1 number>,"balance_reason":"<1-2 sentences>"}

### suggest-tones

Product: {{product}}
Audience: {{audience}}
Niche keywords: {{keywords}}

Positioning summary:
{{wholeSummary}}

Brand story:
{{brandStory}}

Tone options (use exactly these ids): {{tone_ids}}.

Pick 1–3 tones that best fit this product, audience, and brand story. For each chosen tone give a specific reason (1–3 sentences) that references the summary or story above—why this tone fits this brand. Your reason must cite specific details from the summary or brand story above. Generic reasons are not acceptable.

Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase for a premium tone instead.
Respond with valid JSON only, no markdown.
{"tones":[{"id":"<tone_id>","reason":"<1-2 sentences, specific to this brand>"}, ...]}

### suggest-positioning

Product: {{product}}
Audience: {{audience}}
Niche keywords: {{keywords}}

Positioning summary:
{{wholeSummary}}

{{brandStory}}

Positioning options (use exactly one id): {{positioning_ids}}.

- blend: fit the category, familiar and trusted
- standout: differentiate clearly from competitors
- lead: own the category, authority and default choice
- challenger: question the category, disrupt or redefine
- niche: own a narrow segment, specialist focus

Pick the one that best fits this product and market. Give a reason (1–3 sentences) that is specific to the summary and brand story above—tie the reason to this product, audience, and story. Your reason must cite specific details from the summary or brand story above. Generic reasons (e.g. "fits your market") are not acceptable.

Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase for a premium tone instead.
Respond with valid JSON only, no markdown.
{"positioning":"<id>","reason":"<1-2 sentences, specific to this brand and summary>"}

### suggest-brand-story

Product: {{product}}
Audience: {{audience}}
Niche keywords: {{keywords}}

Positioning summary:
{{wholeSummary}}

Primary archetype: {{primaryArchetype}}

Story mode (voice and tone):
{{storyModeGuidance}}

Story types (choose one and name it; align the brand to its plot):
{{storyTypesGuidance}}

Relevant adjectives (weave into the story; influence tone and positioning):
{{archetypeAdjectives}}

Output a structured brand story in three parts:

1. storyName — The canonical name of the story type you chose (e.g. "Quest for paradise", "Transformation", "Hero's journey", "Redemption through service"). One short phrase.

2. plotAlignment — How the brand aligns to that story's plot (2-4 sentences). Explain how the brand plays out this story type: who is the "hero", what is the "quest" or "transformation", how does the brand behave in that plot. This defines how the brand behaves online and with customers.

3. story — The main narrative in 2 short paragraphs (5-10 sentences total). Structure rigorously:
   - First paragraph: Who the brand is for, what we stand for, and why it matters. Use archetype adjectives. Clear and specific to this product and audience.
   - Second paragraph: How we behave in the story (our role in the plot), what we enable for the audience, and how the story type shapes our voice and actions. Use "we" or the brand voice. No jargon.

The story must be structured rigorously because it defines how the brand behaves. Use the archetype's voice throughout.

Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase for a premium tone instead.
Respond with valid JSON only, no markdown.
{"storyName":"<short phrase>","plotAlignment":"<2-4 sentences>","story":"<2 paragraphs, 5-10 sentences>"}

### extract-competitors

Context (niche/category we are searching in; audience is one criterion to judge competitors by, not the only one):
{{product}}

CRITICAL — Only list actual companies or products. Never list:

- Article titles, blog names, or webpage titles (e.g. "How to Build...", "Top 10 AI Tools...")
- Listicles, tutorials, or how-to guides as competitors (they are content, not brands)
- YouTube videos, course names, or generic "resources"

Prefer competitors that offer the same type of product or function (e.g. if the niche is branding/design/identity, list branding or design tools, not payment platforms, generic dev environments, or hosting). Exclude companies that are in a clearly different product category (payments, infra, generic IDEs) unless they directly compete on the same function as the niche.

If a search result is a listicle or article that mentions competitor names in the snippet, extract those actual company/product names and list them. Do not list the article title as a competitor. Each entry must be a real brand or product name that a customer could choose.

Search results (titles and snippets):
{{searchResults}}

Extract up to 5 distinct competitor brands or companies that operate in this niche/category and offer a similar type of product or service. Audience overlap is one criterion to judge by, not a requirement. Use the exact company or product name. Optional one-line description. For each entry set "valid": true if it is clearly a company or product (not an article/blog) and in the same product category. Only return an empty list if the search results contain no company or product names at all.
Respond with valid JSON only, no markdown.
{"competitors":[{"name":"<company or product name>","description":"<optional one line>","valid":true}, ...]}

### extract-competitors-from-article

Context (what the product does + target audience; only list competitors that match this niche and target group):
{{context}}

Article or listicle page text:
{{articleText}}

Extract every distinct competitor (company or product name) mentioned in this article that fits the context above. These are often in lists like "Top 10...", "Best tools...", or comparison sections. Use the exact name as it appears. Optional one-line description per competitor. Only include actual companies or products that sensibly match the niche and target group—not generic categories or irrelevant names. Do not list random or weak matches. If the article has no relevant competitors for this context, return an empty list. Prefer fewer, relevant results over padding. Return up to 10.
Respond with valid JSON only, no markdown.
{"competitors":[{"name":"<company or product name>","description":"<optional one line>"}, ...]}

### validate-competitors

Context (niche/category + target audience):
{{context}}

Candidate list (from search extraction):
{{candidates}}

Which of these are actual companies or products (brands a customer could choose) that offer a similar type of product or service as the niche above? Exclude: article titles, blog names, listicles, tutorials, how-to guides, content pieces. Exclude companies in a different product category (e.g. if the niche is branding/design/identity, exclude payment platforms, generic dev environments, hosting, infra tools unless they directly compete on branding/design). Return only the names that are clearly real competitor brands/products in the same category. If none are a good fit, return an empty array. Fewer or zero is better than weak or off-category matches.
Respond with valid JSON only, no markdown.
{"validNames":["<company name>", ...]}

### suggest-logo-ids

Product: {{product}}
Positioning summary: {{wholeSummary}}
Primary archetype: {{primary}}
Secondary archetype: {{secondary}}

Available logo templates (id — name):
{{template_list}}

Choose exactly 3 ids that best match this brand. Order by fit (best first).
Respond with valid JSON only, no markdown.
{"logoIds":["<id>","<id>","<id>"]}

### enrich-competitor

Competitor name: {{competitorName}}

Niche context (category we are comparing in; no brand names):
{{productContext}}

Search snippets about this competitor:
{{snippets}}

Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase for a premium tone instead.
Write 1–2 sentences only so positioning can be derived from this: (1) what this competitor does, (2) for whom they do it (their audience), (3) how they do it or what differentiates them if clear. Be factual; use only information from the snippets. If snippets are empty or irrelevant, respond with exactly: "No information found."

### positioning-against-competitors

Product: {{product}}
Target audience: {{audience}}

Brand story:
{{brandStory}}

Niche research summary:
{{nicheSummary}}

Competitors (for each: what they do, for whom, and how; use this to derive positioning):
{{competitorList}}

Web-search complaint and gap signal (what users complain about in largest competitors):
{{competitorGapInsights}}

Suggested positioning for this brand: {{suggestedPositioning}}
(blend = fit the category; standout = differentiate; lead = own the category; challenger = disrupt; niche = own a narrow segment)

User refinement request (honor when writing competitive framing and which competitors to emphasize or de-emphasize):
{{refinementDirective}}

Derive the positioning from the competitors above. Use what each competitor does, who they target, and how they operate, plus the complaint and gap signal, to decide how this brand should position itself. Then write:

1. Two to four short paragraphs: each based on competitor intel. Reference what competitors do, for whom, and how; then state how this brand differs or fits (e.g. "X does … for …; we …" or "Unlike X which targets …, we …"). Who each competitor targets is highly relevant. Align with the suggested positioning ({{suggestedPositioning}}) and the brand story.

2. A final short paragraph (summary): one clear, cohesive statement of how this brand positions against all the competitors mentioned. Synthesize the above into a single "here is our clear positioning versus everyone" summary so the reader has one takeaway they can use in pitches or positioning docs.

Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase for a premium tone instead.
Output plain text only, no headings or bullet lists. Write in "we" or third person as fits the brand story.

### first-mover-positioning

Product: {{product}}
Target audience: {{audience}}

Brand story:
{{brandStory}}

Niche research summary:
{{nicheSummary}}

Suggested positioning for this brand: {{suggestedPositioning}}
(blend = fit the category; standout = differentiate; lead = own the category; challenger = disrupt; niche = own a narrow segment)

User refinement request (honor when writing competitive framing):
{{refinementDirective}}

No direct competitors were found in this niche (search returned companies in other categories, e.g. payments, hosting, dev tools). Write a first-mover positioning section based only on the brand profile above.

1. Start with one short sentence stating that no direct competitors were identified in this niche and that the following establishes a first-mover position based on the brand profile.

2. Then write two to three short paragraphs that define how this brand owns the space: who it serves, what problem it solves, and how it stands out. Use the brand story, audience, and suggested positioning. Do not compare to other companies; focus on claiming the category and making the value proposition clear for pitches or positioning docs.

3. End with one summary sentence: the single takeaway for how this brand positions as first mover.

Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase for a premium tone instead.
Output plain text only, no headings or bullet lists. Write in "we" or third person as fits the brand story.

### filter-relevant-competitors

Niche / product category (what the brand does):
{{nicheDescription}}

Target audience: {{audience}}

Companies found by search (with descriptions):
{{candidates}}

Which of these are direct competitors in the same category? Exclude companies that operate in a different product space, for example: if the niche is branding, design, identity, or messaging for founders, exclude payment platforms (e.g. Stripe), dev/hosting platforms (e.g. Replit), generic SaaS infra, AI agent frameworks, or tooling that does not offer the same type of product (branding, design, copy, visual identity). For agency or freelancer operating modes, agencies, studios, consultancies, and independent practitioners offering similar services count as direct competitors. Only include companies a customer would consider as alternatives when choosing this type of product or service.
If none are in the same category, return an empty array.
Respond with valid JSON only, no markdown.
{"relevantNames":["<company name>", ...]}

### name-occupancy-differentiation

Brand name: {{brandName}}
Niche/category: {{nicheDescription}}

Companies or products that appear when searching for this name:
{{companiesList}}

Write one short paragraph (2–4 sentences) that: (1) states whether the brand name is already used in this niche or in related spaces, (2) names any clear naming conflicts if relevant, and (3) gives concrete advice on how to clearly differentiate from others using the same or similar name (e.g. positioning, tagline, visual identity, or naming qualifier). Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase instead. Plain text only, no headings or bullets.

### positioning-against-similar-names

Brand name: {{brandName}}
Niche/category (what the product does, who it is for): {{nicheDescription}}

Companies or products that appear when searching for this name (with snippets):
{{companiesList}}

Tasks:

1. Decide whether any of the above are in the SAME niche (same product category and audience). If yes, list their exact names in conflictNamesInNiche. If none operate in this niche, conflictNamesInNiche should be empty.
2. Write a short whatToDo (2–4 sentences): if there is a conflict in the niche, recommend either (a) how to differentiate (tagline, visual identity, qualifier) or (b) consider choosing a different name. If no conflict in niche, state that clearly and briefly suggest how to avoid confusion with any same-name companies outside the niche.
3. If you recommend considering a different name, suggest around 10 alternative names that fit the brand and niche. Put them in suggestedAlternatives. If you do not recommend a name change, suggestedAlternatives can be empty.

Respond with valid JSON only, no markdown.

Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase instead.
{"hasConflictInNiche": true or false, "conflictNamesInNiche": ["name1", "name2"], "whatToDo": "paragraph text", "suggestedAlternatives": ["AltName1", "AltName2", "AltName3", ...]}

### suggest-more-alternative-names

Brand name: {{brandName}}
Niche/category: {{nicheDescription}}

These names were already suggested or checked; do not suggest them again: {{alreadyTried}}

Suggest around 10 different alternative names that fit this brand and niche. Return only names that are distinct from the list above.
Respond with valid JSON only, no markdown.

Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase instead.
{"moreAlternatives": ["Name1", "Name2", "Name3", ...]}

### dimension-competitor-matrix

Product: {{product}}
Target audience: {{audience}}

Brand story:
{{brandStory}}

Niche research summary:
{{nicheSummary}}

Known competitors from research (seed list; reuse when relevant, add dimension-specific names when needed):
{{competitorList}}

Competitive positioning for this brand:
{{competitivePositioning}}

For each dimension below, identify 3 to 5 real competitors a buyer would compare when solving that slice of the workflow. Then build a comparison matrix for those competitors.

Dimensions:

- gtm: go-to-market, ICP, channels, pricing motion, launch strategy, positioning
- branding: brand strategy, naming, messaging, voice, identity platforms
- design: visual identity, design systems, UI kits, Figma-style tooling
- development: repo handoff, dev integration, implementation, export to code

Rules:

- Use real company or product names only. Prefer names from the seed list when they fit the dimension.
- Matrices must be project-specific to this niche, not generic placeholders.
- Each matrix row compares one competitor on: strength, weakness, positioning, priceMotion (pricing and GTM motion combined).
- Keep each cell to one short sentence.
- For the **gtm** dimension only: after building the matrix, compare competitors head-to-head and add `gtmDirectionSuggestion` with actionable GTM guidance for {{product}} (not generic advice).
  - `summary`: 2 to 3 sentences starting with "Based on the competitive landscape, consider…" — channel, motion, wedge, and ICP in plain language.
  - `channel`: primary acquisition channel to test first (e.g. LinkedIn, community, partnerships).
  - `motion`: pricing or GTM motion (e.g. PLG freemium, founder-led outbound, product-led waitlist).
  - `wedge`: differentiation angle vs the matrix competitors.
  - `icp`: narrow ICP wedge to win first.
  - `whitespace`: gap none of the listed competitors own well.

Respond with valid JSON only, no markdown.
{
"dimensions": [
{
"dimension": "gtm",
"topCompetitors": [{ "name": "...", "description": "..." }],
"matrix": [
{
"competitor": "...",
"strength": "...",
"weakness": "...",
"positioning": "...",
"priceMotion": "..."
}
],
"gtmDirectionSuggestion": {
"summary": "Based on the competitive landscape, consider…",
"channel": "...",
"motion": "...",
"wedge": "...",
"icp": "...",
"whitespace": "..."
}
}
]
}

Include all four dimensions: gtm, branding, design, development. Only the gtm dimension needs gtmDirectionSuggestion.

### suggest-logo-archetypes-from-description

Logo description (shape, style, and properties it transmits):
{{description}}

Valid archetype IDs (pick 1-3 that best fit the description):
{{archetypeList}}

Archetypes: Innocent (pure, simple), Sage (wise, clarity), Explorer (adventure, bold), Outlaw (rebellious, disruptive), Magician (transformative), Hero (bold, mastery), Lover (intimate, warm), Jester (playful), Everyman (relatable, honest), Caregiver (nurturing), Ruler (authority, order), Creator (innovative, craft).

Pick 1-3 archetype_ids that best match the style and properties in the description. No duplicates. Use only the IDs from the list above (lowercase).

Respond with valid JSON only, no markdown.
{"archetype_ids":["id1","id2"]}

### describe-logo-style

Logo name (or brand): {{name}}

SVG structure summary (elements and shapes only, no coordinates):
{{svgSummary}}

Write one short sentence that covers:

1. The logo's shape, geometry, and visual style (e.g. bold angular shapes, minimal circular mark, dynamic line work).
2. The adjectives and properties it transmits — the mood or qualities it conveys (e.g. innovative, adventurous, trusting, bold).

Do not include archetype names or the brand name in the description. Focus only on form and the qualities the mark conveys.

Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase instead.

Respond with valid JSON only, no markdown.
{"description":"One sentence: shape/style and adjectives or properties transmitted."}

### generate-logo-svg

You are designing the primary logo for this brand—the main visual identity mark that will represent the product. This is a brand logo, not a generic icon: it should feel specific to this product and its story.

Brand context:

- Product name: {{productName}}
- Brand story (one-liner): {{brandStory}}
- Positioning: {{positioning}}
- Primary archetype: {{primaryArchetype}}
- Secondary archetype: {{secondaryArchetype}}

Reference examples (style and structure inspiration only; create a new, original mark that fits the brand—do not copy or closely resemble any example):
{{referenceExamples}}
{{variationHint}}

Requirements for your SVG:

1. Identity: One cohesive logo mark that clearly reads as this brand’s logo. Minimal, geometric, recognizable at small sizes. No clip-art feel; no random decorative icon. Create a distinct concept—avoid generic or overused solutions.

2. Style—outlines over fills:
   - Prefer clean outlines and strokes over large filled areas. Use line-based or outline style where possible; avoid heavy solid fills that dominate the mark.
   - Prefer crisp, simple shapes: clear geometry, readable silhouettes, and well-defined strokes rather than big blocks of fill.
   - If you use fill, use it sparingly (e.g. small accents); the mark should read primarily as outlines and clean shapes.

3. Geometry and composition:
   - All shapes must sit inside the viewBox with no clipping or overflow. Use viewBox="0 0 48 48" and keep paths/coordinates within 0–48.
   - If the design is symmetrical, make the symmetry precise (e.g. mirrored halves align cleanly). Do not produce half-finished or accidentally broken symmetry.
   - If the design is intentionally asymmetric, the composition must feel deliberate and balanced—not like a mistake or a misaligned element.
   - Avoid: floating shapes that don’t relate to the whole, overlapping elements that look accidental, or one side that looks “off” compared to the other without clear intent.

4. Technical:
   - One cohesive mark (no images, no scripts).
   - viewBox="0 0 48 48".
   - Use fill="currentColor" and/or stroke="currentColor" so the app can tint it.
   - Only safe elements: svg, g, path, circle, ellipse, rect, line, polyline, polygon.
   - Keep it simple: one group of shapes, geometric, suitable as app icon or favicon.

Respond with valid JSON only, no markdown:
{"svg":"<svg viewBox=\"0 0 48 48\" ...>...</svg>"}

### refine-logo-svg

You are refining an existing logo for this brand. The user has selected this logo and wants refinements. Produce a single refined SVG that keeps the same spirit but improves it according to the request.

Brand context:

- Product name: {{productName}}
- Brand story (one-liner): {{brandStory}}

Original logo (SVG) to refine:
{{originalSvg}}

User refinement request (optional; if empty, suggest a clear improvement such as simplifying shapes, strengthening outlines, or balancing the composition):
{{userPrompt}}

Requirements for your refined SVG:

- Keep viewBox="0 0 48 48" and all technical constraints (only svg, g, path, circle, ellipse, rect, line, polyline, polygon; fill/stroke currentColor).
- Stay recognizable as a refinement of the original, not a completely new mark.
- Prefer clean outlines and strokes over large filled areas.
- Respond with valid JSON only, no markdown: {"svg":"<svg viewBox=\"0 0 48 48\" ...>...</svg>"}

### judge-logo-pointwise

You are an expert brand designer evaluating a generated logo SVG for a product.

Score the logo on a 1–5 scale (integers only) for each dimension:

- brand_fit: Does the mark feel specific to this product and story?
- simplicity: Is it minimal, readable at small sizes, not cluttered?
- archetype_alignment: Does it match the primary/secondary brand archetypes?
- technical_svg_quality: Valid geometry, appropriate complexity, outline-friendly?
- overall: Holistic quality as a logo mark.

Brand brief:

- Product: {{productName}}
- Story: {{brandStory}}
- Positioning: {{positioning}}
- Primary archetype: {{primaryArchetype}}
- Secondary archetype: {{secondaryArchetype}}

SVG structural summary (the judge cannot see pixels):
{{svgSummary}}

SVG markup (truncated):
{{svgSnippet}}

Respond with valid JSON only:
{"brand_fit":3,"simplicity":4,"archetype_alignment":3,"technical_svg_quality":4,"overall":4,"rationale":"one sentence"}

### judge-logo-pairwise

You are an expert brand designer comparing two logo SVG candidates for the same brief.

Brand brief:

- Product: {{productName}}
- Story: {{brandStory}}
- Positioning: {{positioning}}
- Primary archetype: {{primaryArchetype}}
- Secondary archetype: {{secondaryArchetype}}

Candidate A — summary: {{summaryA}}
Candidate A — SVG snippet: {{svgA}}

Candidate B — summary: {{summaryB}}
Candidate B — SVG snippet: {{svgB}}

Pick the better logo for this brand. Prefer simpler, more distinctive, archetype-aligned marks.

Respond with valid JSON only:
{"winner":"A"|"B"|"tie","confidence":0.0-1.0,"rationale":"one sentence"}

### suggest-font-description

Font: {{name}}
Category: {{category}}
Properties/tags: {{tags}}

Reply with only one short sentence (no quotes, no JSON). Describe the font's character and best use for brand typography.

Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase instead.

### suggest-font-archetypes

Font: {{name}}
Category: {{category}}
Tags: {{tags}}
Description: {{description}}

Archetypes (id — typography trait):
{{archetypeList}}

Which 1-3 archetype IDs best fit this font? Reply with valid JSON only, no markdown.
{"archetype_ids":["id1","id2"]}

### suggest-typography

Brand profile:

- Primary archetype: {{primaryArchetype}}
- Secondary archetype: {{secondaryArchetype}}
- Brand tones: {{brandTones}}
- Niche / positioning: {{nicheIntent}}

Reference typography cues from curated design libraries (optional context; pick fonts only from the lists below):
{{referenceTypographyNotes}}

Heading fonts (pick exactly one; names must match exactly including spaces):
{{headingList}}

Body fonts (pick exactly one):
{{bodyList}}

Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase for a premium tone instead.
Choose one heading font and one body font. They can be the same font. Give a brief reason (1–2 sentences) why this pair fits the brand.

Respond with valid JSON only, no markdown.
{"headingFont":"<exact name from list>","bodyFont":"<exact name from list>","reason":"<1-2 sentences>"}
