---
name: logo-generation
displayName: Logo Generation
scope: global
is_system: true
research:
  web: false
  reddit: true
  github: true
  marketScan: false
  required: false
  maxQueries: 4
  fetchTopUrls: 1
generation:
  backend: pipeline
  backendRef: logo-generation
  async: true
canvas:
  frameType: logoGallery
  exportFormats: [svg, png]
---

# Logo Generation

Generate a batch of original **brand-mark** SVGs for a Majico project, then shortlist and select via Studio / MCP.

**Thesis:** `majico-logo-4b` is good at SVG. Bad marks are usually **bad skill/prompt input**. Fix prompts; do not claim curated folders are "good" while MCP still shows junk.

**Quality bar:** decent **brand marks** (distinctive identity, memorable metaphor, wordmark companion) — not elite agency work, and **not UI icons / system glyphs**.

## Authoritative SVG backends

| Priority | Backend | Model | When |
| --- | --- | --- | --- |
| **1 — Engine (preferred)** | Ollama LLM via `generate_logo_svg` | **`majico-logo-4b`** (`LOGO_LLM_MODEL`) | `LLM_PROVIDER=auto\|ollama` and engine Ollama is reachable (`OPENAI_BASE_URL`, typically `http://192.168.10.40:11434/v1`) |
| 2 — Quality alternate | Same LLM path | `majico-logo-9b` | Explicit override via `LOGO_LLM_MODEL=majico-logo-9b` |
| 3 — Cloud SVG API | Quiver | `arrow-1.1` (`QUIVER_LOGO_MODEL`) | Quiver keyed **and** Ollama logo route unavailable |
| Fallback | Mock / unavailable | — | `AI_ENGINE_MODE=mock` or no provider |

Routing: `@majico/logo` `resolveLogoGenBackend` — Ollama logo ops beat Quiver when reachable.

### Engine model contract (`majico-logo-4b`)

- Finetuned on Majico `generate-logo-svg` JSON prompts (`{"svg":"<svg …>"}`).
- Expects brand story + positioning + archetype + reference silhouettes + **brand-mark** variation hint.
- Output: `viewBox="0 0 48 48"`, `currentColor`, safe elements only, outline-first.

Env:

```bash
LLM_PROVIDER=auto
OPENAI_BASE_URL=http://192.168.10.40:11434/v1
OPENAI_API_KEY=ollama
LOGO_LLM_MODEL=majico-logo-4b
AI_ENGINE_MODE=real
```

MCP: `generate_asset` (`skillId: logo-generation`) → `get_asset_status` → `list_logo_candidates` → `select_logo`.

## Prompt contract (brand-profile-craft `generate-logo-svg`)

| Rule | Source idea |
| --- | --- |
| Metaphor → primitives → assemble | svg-logo-generator |
| Silhouette / squint test; ≤3 perceptual shapes; every path earns its place | svg-authoring |
| Lock one mark type; brand personality over chrome | svg-logo-designer + Majico |
| Path budget ≤8; 80% safe zone; stroke ~2.5–3.5; currentColor | Majico + svg-authoring |
| Asymmetric interest / negative space OK; wordmark companion | Majico brand creativity |

### Observed failure modes (never call these brand-usable)

From real bad MCP galleries:

1. Fragmented floating strokes / hooks / L-pieces with gaps
2. Letter-like accidental noise (t, Y, H glyphs)
3. Stacked unrelated shapes with whitespace gaps
4. Grid/jumble bars with no single silhouette
5. Random abstract sticks with no metaphor
6. Orphan chevrons / dots outside a container
7. **UI icons / tool glyphs** — check-in-circle/square, reticle/crosshair ticks, signal/wifi bars, upload-arrow-in-circle, gauge/needle widgets, Material/SF-symbol vibes, app-chrome container+stock-glyph

### Brand-usable bar (pass/fail)

**Pass** = cohesive silhouette, product metaphor with personality, would look odd as a Material/SF tab icon, works beside a wordmark.

**Fail** = fragments/letter-noise **or** reads as tab-bar / settings / dashboard chrome (even if geometrically clean).

Hard rejects: floating fragments, letter noise, empty/black tiles, crypto orb clichés, accidental letterforms, **UI affordance glyphs**.

## Agent loop — skill-adapt until >80% brand-usable

1. Analyze failures → tighten `generate-logo-svg` negatives + **brand-mark** variation hints (+ optional `LOGO_EXTRA_CONSTRAINTS`). Push creativity; ban UI-icon recipes.
2. Generate batch with `majico-logo-4b` (local loop script or worker).
3. Visually judge every candidate for **brand-usable** (MCP image blocks / Read PNG). Never Windows-path markdown.
4. Score `brand_usable_rate`. If <80%: adapt skill/prompt → regenerate. Minimum **10** full iterations before presenting when a long loop was requested.
5. When presenting: MCP `list_logo_candidates` must show the judged batch (sync into `project_generated_logos` if generated locally). Do not claim quality the picker does not show.

Scripts: `scripts/logo-skill-adapt-loop.ts`, `scripts/logo-quality-batch.ts`.

## Guardrails

- Never expose Quiver/Ollama credentials
- Do not overwrite user-selected logos without confirmation / delegated pick
- Do not call `quiver_generate_svg` and claim `majico-logo-4b`
- Do not call curated seed folders "100% good" while MCP still lists junk
- Do not present UI-icon packs as brand logos
