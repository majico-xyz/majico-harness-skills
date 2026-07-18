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

Generate a batch of original brand-mark SVGs for a Majico project, then shortlist and select via Studio / MCP.

## Authoritative SVG backends

| Priority | Backend | Model | When |
| --- | --- | --- | --- |
| **1 — Engine (preferred)** | Ollama LLM via `generate_logo_svg` | **`majico-logo-4b`** (`LOGO_LLM_MODEL`) | `LLM_PROVIDER=auto\|ollama` and engine Ollama is reachable (`OPENAI_BASE_URL`, typically `http://192.168.10.40:11434/v1`) |
| 2 — Quality alternate | Same LLM path | `majico-logo-9b` | Explicit override via `LOGO_LLM_MODEL=majico-logo-9b` |
| 3 — Cloud SVG API | Quiver | `arrow-1.1` (`QUIVER_LOGO_MODEL`) | Quiver keyed **and** Ollama logo route unavailable |
| Fallback | Mock / unavailable | — | `AI_ENGINE_MODE=mock` or no provider |

Routing lives in `@majico/logo` `resolveLogoGenBackend`: **Ollama logo ops beat Quiver** when the engine route resolves. Do not document DALL·E / Flux / raster-to-logo as the brand-mark path.

### Engine model contract (`majico-logo-4b`)

- Finetuned on Majico `generate-logo-svg` JSON prompts (`{"svg":"<svg …>"}`).
- Expects brand story + positioning + archetype + reference silhouettes + variation hint.
- Output must be `viewBox="0 0 48 48"`, `currentColor` stroke/fill, safe elements only.
- Prefer **outline / line** marks over heavy fills — readable at favicon size.

Env (dev / staging worker):

```bash
LLM_PROVIDER=auto
OPENAI_BASE_URL=http://192.168.10.40:11434/v1   # engine
OPENAI_API_KEY=ollama
LOGO_LLM_MODEL=majico-logo-4b
AI_ENGINE_MODE=real
```

MCP tools for the batch path: `generate_asset` (`skillId: logo-generation`) → poll `get_asset_status` → `list_logo_candidates` → `select_logo`.
Direct Quiver probe (not the 4b path): `quiver_generate_svg` / `quiver_vectorize_svg`.

`backendRef` **must** be `logo-generation` (hyphen). Underscore `logo_generation` is accepted only as a pipeline-adapter alias.

## When to use

- User wants logos, wordmarks, or icon concepts for a brand
- Guided logo step or free chat "generate logos"
- Agent delegated to iterate until a **feature-killer** mark (see rubric below)

## Research expectations

- GitHub repo naming and design-system examples in the category
- Reddit brand-identity dorks for positioning cues
- Skip full market scan unless user explicitly asks for category density

## Agent loop — feature-killer logos (MCP staging)

Use when the user delegates visual judgment ("you pick", "iterate until killer", "reseed and improve").

1. **Scope** — `ping` + confirmed `projectId` (never auto-switch).
2. **Brief** — If reseeding: `submit_brief` with productName + oneLiner (+ audience/goals). Wait for niche/brand jobs if needed.
3. **Engine batch** — Prefer a worker `logo_batch` with `LOGO_LLM_MODEL=majico-logo-4b`. `generate_asset` with `skillId: "logo-generation"` also works when the pipeline adapter resolves. Poll until completed. Confirm worker used `backend: llm` / `majico-logo-4b`, not Quiver, unless Quiver was intentional.
4. **Render** — `list_logo_candidates`. Prefer inline PNG image blocks. If MCP returns black tiles (`currentColor` on dark), re-rasterize locally with light pad + `#111` ink before judging. Reject `0.0.0.0` picker hosts; use session public origin.
5. **Judge visually** (agent reads each preview image):

| Dimension | Killer bar |
| --- | --- |
| Distinctiveness | Not a generic crypto orb, letter-in-circle, or stock "yield leaf" |
| Brand fit | Reads as product story (checkpoint, ledger, scope, clarity) without spelling the name |
| Simplicity | Holds at 16–24px; no hairline clutter |
| Geometry | Intentional symmetry or deliberate asymmetry; no broken mirrors |
| Theming | Works as `currentColor` on light and dark |

6. **Select** — Only with `userConfirmed: true` **or** `userDelegatedPick: true` when the user explicitly delegated. Same turn as list is OK under delegation.
7. **Show progress** — After each selection, render the winning mark in chat (light-bg PNG) so the human sees iteration.
8. **Iterate** — If not killer: another `logo_batch`, or `refineLogoSvg` with a precise brief ("scope + yield triangle", "less house silhouette"). Repeat until the bar is met or the user stops.

Hard rejects: black/empty preview tiles, template-only shortlists when a 4b batch was requested, clip-art, text-as-logo, photo-like fills, accidental letterforms.

## Output

- Logo gallery frame with selectable SVG tiles
- Respect project palette and archetype hints from brand context
- Prefer `currentColor` stroke/fill marks so theming works; MCP chat previews must ink `currentColor` for visibility

## Guardrails

- Never expose Quiver or Ollama credentials to the client; generation runs server-side / worker
- Do not overwrite user-selected logos without explicit confirmation or delegated pick
- Rate-limit aware: space batch requests when generating many variants
- MCP `list_logo_candidates` must present inline PNG image blocks (not only unreachable preview URLs)
- Do not call `quiver_generate_svg` and claim it used `majico-logo-4b` — different backends
