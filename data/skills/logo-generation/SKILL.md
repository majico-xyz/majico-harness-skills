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
  backendRef: logo_generation
  async: true
canvas:
  frameType: logoGallery
  exportFormats: [svg, png]
---

# Logo Generation

Generate a batch of logo SVG options via **Quiver** (`arrow-1.1` by default), informed by brand brief and competitive visual research.

## SVG generation model (authoritative)

| Setting | Value |
| --- | --- |
| Primary backend | **Quiver** (`QUIVER_AI_API_KEY` / `QUIVER_API_KEY`) |
| Default model | **`arrow-1.1`** (`QUIVER_LOGO_MODEL`, see `@majico/quiver` `getDefaultLogoQuiverModel`) |
| API | `POST https://api.quiver.ai/v1/svgs/generations` |
| MCP tools | `quiver_generate_svg`, `quiver_vectorize_svg` |
| Fallback | Ollama / LLM text→SVG only when Quiver is unavailable (`resolveLogoGenBackend`) |

Do **not** document or call generic image models (DALL·E, Flux, etc.) for Majico brand marks. Prefer Quiver SVG generation; template marks (e.g. `book-open`) are valid shortlist candidates when no generated batch exists.

Eval / finetune adapters (`majico-logo-4b`, `majico-logo-9b`) are research-only — not the production Studio/MCP path.

## When to use

- User wants logos, wordmarks, or icon concepts for a brand
- Guided logo step or free chat "generate logos"

## Research expectations

- GitHub repo naming and design-system examples in the category
- Reddit brand-identity dorks for positioning cues
- Skip full market scan unless user explicitly asks for category density

## Output

- Logo gallery frame with selectable SVG tiles
- Respect project palette and archetype hints from brand context
- Prefer `currentColor` stroke/fill marks so theming works; MCP chat previews rasterize with a light pad + concrete ink color

## Guardrails

- Never expose Quiver API keys to the client; generation runs server-side
- Do not overwrite user-selected logos without explicit confirmation
- Rate-limit aware: space batch requests when generating many variants
- MCP `list_logo_candidates` must present inline PNG image blocks (not only `0.0.0.0` preview URLs)
