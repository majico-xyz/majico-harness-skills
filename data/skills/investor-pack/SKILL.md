---
name: investor-pack
displayName: Investor Pack
scope: global
is_system: true
research:
  web: true
  reddit: true
  github: true
  marketScan: true
  required: true
  maxQueries: 8
  fetchTopUrls: 3
generation:
  backend: harness-native
  backendRef: investor-pack
  async: true
canvas:
  frameType: htmlFrame
  exportFormats: [html, pptx, pdf, md]
---

# Investor Pack

Generate a branded investor pitch deck (16:9 HTML slides) and outreach copy from verified brand context, GTM blueprint, team, and traction.

## When to use

- User asks to generate an investor pack, pitch deck, or fundraising materials
- Team and traction canvas elements are populated and brand chain is complete

## Pre-flight (agent must confirm before enqueue)

1. **Brand chain complete** — `studio_brand_md` job finished and palette verified (strict gate; no scaffold decks)
2. **GTM complete** — `gtm_blueprint` present (hard block if missing)
3. **Team** — `investor-team` canvas has ≥1 member (or `params.team`)
4. **Traction** — `investor-traction` canvas has ≥1 metric or alternative proof (pilots, LOIs, waitlist, design partners, shipped MVP)
5. Optional: `params.includeSlides` (`competition`, `financials`, `roadmap`)

Worker-side `validateInvestorPackPreflight()` mirrors these gates.

## Agent read order

1. `brand.md` — voice, positioning, proof quotes
2. `design.md` — typography, color tokens, layout rules
3. Research bundle — market signals, investor objections, deck patterns
4. `gtm_blueprint` — ICP, JTBD, distribution, competitive positioning
5. Team + traction snapshots

## Design skills (read in order)

1. [ui-polish](../ui-polish/SKILL.md) — spacing, hierarchy, contrast ≥ 4.5:1
2. [motion-design](../motion-design/SKILL.md) — slide stagger 80–120ms; honor `prefers-reduced-motion`
3. [guideline-html](../guideline-html/SKILL.md) — export-safe slide HTML via `htmlLayout: slides`
4. Landing-bundle visual patterns — gradient heroes, elevated cards, CTA pills

## Slide schema (core)

Always render when pre-flight passes:

| #   | Layout      | Content                                   |
| --- | ----------- | ----------------------------------------- |
| 1   | cover       | Logo, product, one-liner, accent hero     |
| 2   | statement   | Problem headline                          |
| 3   | split       | Problem / solution with accent rail       |
| 4   | statement   | Why now / market timing                   |
| 5   | icp-jtbd    | Persona chips + jobs from GTM             |
| 6   | stat-grid   | Traction metrics or alternative proof     |
| 7   | competition | Auto when GTM has competitive positioning |
| 8   | timeline    | GTM phases                                |
| 9   | team        | Founders from team snapshot               |
| 10  | quote       | Testimonial from brand.md (omit if none)  |
| 11  | contact     | Next steps + CTA pill (no raise details)  |

Optional via `params.includeSlides`: `competition`, `financials`, `roadmap`.

**Deferred:** `ask` slide — append only when user supplies `raiseAmount` + `useOfFunds` (patch job).

## Research profile

- Required: **hard fail** when providers are down (`ResearchRequiredError`)
- Queries: pitch deck examples, funding narrative, TAM, investor objections (Reddit), seed deck structure, GitHub OSS decks

## Output

- `harness-investor-pack` — sanitized `htmlFrame` deck (board tier, 16:9)
- `harness-investor-outreach` — sibling `markdownFrame` with `## Cold email`, `## Warm intro`, `## Follow-up`
- Export: html, pptx, pdf, md (ZIP under `investor/`)

## Guardrails

- Never invent traction metrics or funding rounds
- Strict brand gate — stub + `canvasUrl` until brand job + palette verified
- GTM hard block — refuse enqueue without `gtm_blueprint`
- Research hard-fail — no deck without research bundle
- Copy tone from brand.md voice — not generic VC boilerplate
- PPTX export uses export-safe CSS (system fonts, inline SVG, no motion)

## Post-generation

When user provides `raiseAmount` + `useOfFunds`, patch the same `harness-investor-pack` element in-place with an `ask` slide.
