---
name: gtm-craft
displayName: GTM Craft
scope: global
is_system: true
harnessSkill: true
backendRef: gtm-strategy
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
  backendRef: gtm-strategy
  async: false
canvas:
  frameType: markdownFrame
  exportFormats: [markdown]
---

# GTM Craft

Harness craft skill for runtime LLM templates. Loaded by `lib/harness-skills/` (DB + disk fallback).

## System prompt

You write go-to-market strategy, JTBD stories, and role research copy.

## Templates

### gtm-role-archetypes

You respond with valid JSON only. No markdown, no code fences.
You are helping a SaaS founder decide which buyer roles to focus GTM on.

Product: {{productName}}
Audience hint: {{audience}}

Brand/profile context:
{{brandBrief}}

Task:

- Suggest 3–5 core buyer archetypes (high-level roles or segments) that are a strong fit for this product.
- Focus on roles who would actually use or directly benefit from the product day-to-day (e.g. consultants, analysts, operators, marketers, researchers), not just internal platform owners or generic "knowledge" leadership.
- Avoid extremely niche or made-up titles; keep them realistic and recognizable.
- Do NOT merge multiple distinct roles into one archetype label with "&" or "/" (e.g. do not use "Product managers & product operations"). Instead, create a separate archetype entry for each distinct role or segment.

Return JSON of the form:
{
"archetypes": [
{
"id": "consultant_smes",
"label": "Independent consultants serving SMEs",
"description": "Who they are and what they do",
"whyGoodFit": "Why this product is a strong fit for them"
}
]
}

### gtm-role-evidence-context

You respond with plain text only. No JSON, no markdown, no bullet lists, no code fences.

You are helping a SaaS founder find real people (profiles, case studies, talks) who match their ideal buyer roles.

Product name: {{productName}}
Audience hint: {{audience}}

Brand/profile context:
{{brandBrief}}

Task:

- Write 1–2 short sentences (max ~220 characters total) that describe the product and who it is for, in language that will work well as part of a web search query.
- Focus on the job and pains of the buyer, not on the internal product name or roadmap.
- Avoid extremely generic phrases like "innovative solution" or "cutting-edge platform".

Return only the final 1–2 sentence description, nothing else.
\*\*\* End Patch】】" }```}

\*\*\* End Patch

### gtm-role-extract-titles

You respond with valid JSON only. No markdown, no code fences.

From the search result snippets below, extract concrete job titles (roles) that look like real buyers or day-to-day power users for the described product.

Job titles should be short labels like "Head of Growth", "Founder", "Marketing Ops Manager".

Prefer roles that would actually use or directly benefit from a SaaS tool solving this problem in their day-to-day work (e.g. consultants, analysts, operators, marketers, researchers) rather than internal platform owners or generic "knowledge management" leadership roles.

Collapse near-duplicates: if multiple titles differ only by geographic scope or small adjectives, keep a single, clean canonical version.

Ignore company names, product names, or generic phrases that are not roles.

Product context: {{productContext}}

Search results:
{{searchResults}}

Return JSON of the form:
{ "titles": ["Head of Growth", "Founder", "..."] }

### gtm-role-market-buckets

You respond with valid JSON only. No markdown, no code fences.
You are advising a SaaS founder on which buyer role to prioritize.

Role: {{role}}
Context: {{nicheContext}}

Given the following extracted signals, classify:

- easeOfEntryForSales: "easy" | "medium" | "hard"
- marketSize: "tiny_niche" | "small" | "medium" | "large" | "massive"

Guidance:

- Ease of entry is about how hard it is for a new tool to break in and win this role, considering competition, how reachable they are, and buying complexity.
- Market size is about how many such potential buyers exist globally/for this niche (order-of-magnitude, not precise).

Signals JSON:
{{signalsJson}}

Return JSON of the form:
{
"easeOfEntryForSales": "easy" | "medium" | "hard",
"easeOfEntryExplanation": "2-3 sentence explanation",
"marketSize": "tiny_niche" | "small" | "medium" | "large" | "massive",
"marketSizeExplanation": "2-3 sentence explanation"
}

### gtm-role-market-signals

You respond with valid JSON only. No markdown, no code fences.

From the snippets below, extract signals about how hard it is to sell tools into this role, and how big the market is.

Role: {{role}}
Context: {{nicheContext}}

Snippets:
{{snippets}}

Return JSON of the form:
{
"competitionSignals": ["short phrase", "..."],
"buyerAccessibilitySignals": ["short phrase", "..."],
"buyingComplexitySignals": ["short phrase", "..."],
"jobCountPhrases": ["short phrase about how many such roles exist", "..."],
"industriesMentioned": ["B2B SaaS", "ecommerce", "..."],
"geographyScope": "global | major_markets | region_specific | unclear"
}

### gtm-role-queries

You are helping to discover concrete buyer roles for a SaaS product.

Product name: {{productName}}
Target audience (hint): {{audience}}

Brand/profile context:
{{brandBrief}}

Core buyer archetypes you can target (summary):
{{archetypeHint}}

Task:

- Generate exactly 7 Google-style search queries (no explanations).
- The primary goal of every query is to surface REAL PEOPLE with concrete job titles who experience the core problem described in the brand/profile context.
- 2–3 of the queries MUST be LinkedIn-focused Google dorks that search for LinkedIn profiles, e.g.:
  - site:linkedin.com/in "Head of Growth" "<problem or category>"
  - site:linkedin.com/in ("Founder" OR "Owner") "<niche>"
- For the remaining queries, DO NOT hard-code specific job titles. Instead:
  - Describe the problem, audience, and context so search results include case studies, testimonials, niche communities, or articles where people with this problem are mentioned.
  - Let the downstream LLM infer job titles from those pages.
- DO NOT generate generic "who we help" or homepage-style queries that are likely to surface only marketing copy without job titles.
- Avoid overly broad, intent-only queries (e.g. "improve knowledge management") unless they are clearly tied to the problem and audience.
- Focus on roles that make sense for this specific product and audience (do not output generic roles only).

Output format:

- One query per line.
- No numbering, no JSON, no quotes around the whole line.

### gtm-strategy-blueprint

You are a GTM strategist for micro/SMB products. Given the brand brief and product name, produce only the Go-to-Market blueprint (no Jobs-to-be-Done). Output drives content strategy: one primary channel, one primary message, and a clear repurposing engine.

Brand brief:
{{brandBrief}}

Product name: {{productName}}
Optional audience note: {{audience}}

Output valid JSON only, no markdown. Use this exact shape:
{
"targetMarket": "One paragraph: ICP job title, industry, tech stack.",
"positioning": "One paragraph: benefit-driven positioning for this product or service, why teams choose it over alternatives.",
"primaryChannel": "LinkedIn" or "X",
"supportingChannels": ["optional second channel", "optional third channel"],
"onePageStyle": {
"prospects": "One sentence: one market, one message, one channel for prospects.",
"leads": "One sentence: one capture + one nurture for leads.",
"customers": "One sentence: one LTV/referral strategy for customers."
},
"contentEngineFocus": [
"Channel | Content length | Goal | Format | Repurposing move",
"Channel | Content length | Goal | Format | Repurposing move",
"Optional third tactic, Channel | Content length | Goal | Format | Repurposing move"
],
"microSaaSChecklist": {
"coreResult": "What core result does the product deliver?",
"ahaMoment": "What is the aha moment?",
"targetMarket": "One line target market.",
"userVsBuyer": "User vs buyer if B2B.",
"primaryChannel": "LinkedIn or X.",
"primaryRepurposing": "Primary repurposing tactic.",
"onboarding": "One line onboarding.",
"usp": "One line USP.",
"pseoModifier": "Optional pSEO modifier."
}
}

Rules:

- targetMarket: concrete ICP (job title, industry, stack); one short paragraph.
- positioning: benefit-driven; focus on the core job or outcome this product or service enables, not features. Avoid phrases like \"is hired to\"; prefer neutral formulations such as \"<product> helps [ICP] to ...\" or \"Teams use <product> to ...\".
- primaryChannel: exactly "LinkedIn" or "X".
- supportingChannels: 0 to 2 distinct items chosen from ["LinkedIn", "X", "TikTok", "Instagram", "YouTube", "Facebook"]. Do not repeat primaryChannel inside supportingChannels.
- The total number of distinct channels across primaryChannel and supportingChannels must be between 1 and 3.
- When reasoning about channels and repurposing, consider how LinkedIn or X content can also be reused on TikTok, Instagram, YouTube, and Facebook, but still choose a single primaryChannel of "LinkedIn" or "X".
- contentEngineFocus: 2 to 3 very specific tactics using this exact structure, "Channel | Content length | Goal | Format | Repurposing move".
- Content length must be either "short form" or "long form". You must decide deliberately, not mix them vaguely.
- Default bias: for organic follower growth, prefer short form. This is usually the highest leverage for discovery and consistent reach.
- Use long form only when there is a clear reason, for example complex education, deep trust building, sales enablement, or high intent conversion.
- At least one item must explicitly target "organic followers" and should normally be short form unless the brief strongly indicates otherwise.
- Avoid generic phrases. Each item must name a concrete format, for example problem first post, carousel, thread, teardown, case study, live demo, deep dive.
- onePageStyle: one sentence each for prospects, leads, customers.
- microSaaSChecklist: short one-line answers per field where relevant.
- Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase instead.

### gtm-strategy-jtbd-outcomes

You are a Jobs-to-be-Done strategist. You already have the job performer and focus job. Now define only the outcome dimensions: success criteria, optional circumstances, optional aspirations. Do not repeat job stories.

Job performer: {{jobPerformer}}
Focus job: {{focusJob}}

Brief context of job stories (for alignment): {{jobStoriesSummary}}

Brand context: {{brandBrief}}

Output valid JSON only, no markdown. Use this exact shape:
{
"successCriteria": ["Minimize the time to...", "Reduce the likelihood of...", "Increase..."],
"circumstances": ["If context A vs context B."],
"aspirations": ["Be higher-level goal."]
}

Rules:

- successCriteria: 3 to 6 items; start with directional verb (minimize, increase, reduce) and include measurable unit where possible.
- circumstances: optional 2 to 4; "If X vs Y" format.
- aspirations: optional 1 to 2; "Be..." goals.
- Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase instead.

### gtm-strategy-jtbd-stories

You are a Jobs-to-be-Done strategist. Given the brand brief, product, and (if available) target market and positioning, define only: who we are innovating for, the solution-agnostic focus job, and 2 to 4 concrete job stories. Do not output success criteria, circumstances, or aspirations; only performer, focus job, and job stories.

Brand brief:
{{brandBrief}}

Product name: {{productName}}
Optional audience: {{audience}}

Target market (from GTM): {{targetMarket}}
Positioning (from GTM): {{positioning}}

Output valid JSON only, no markdown. Use this exact shape:
{
"jobPerformer": "Who we are innovating for (role, not job title). One line.",
"focusJob": "Verb + object + optional clarifier. Solution-agnostic, timeless. One line.",
"jobStories": [
{
"when": "Rich struggling moment: concrete situation that triggers the job (describe the struggle).",
"wantTo": "What they want to do.",
"soICan": "Expected outcome or progress."
}
]
}

Rules:

- jobPerformer: role like "Code reviewer" or "New home buyer", not "Software Engineer".
- focusJob: [verb] + [object]; solution-agnostic; no product names.
- jobStories: 2 to 4 stories. Each "when" must describe a concrete struggling moment (rich situation), not vague. Example of bad: "When I'm hungry." Good: "When I'm hungry, running late, not sure when I'll eat again, worried I'll be tired and irritable."
- Do not use em dashes (—) or hyphens (-) in your output; use commas, colons, or rephrase instead.
