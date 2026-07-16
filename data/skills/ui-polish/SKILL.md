---
name: ui-polish
displayName: UI Polish (ui-skills)
scope: global
is_system: true
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
  backendRef: social-carousel
  async: true
canvas:
  frameType: imageFrame
  exportFormats: [png]
---

# UI polish skill routing

Apply [ui-skills.com](https://www.ui-skills.com/) design-engineering skills to Majico social assets, landing carousel, and demo reel motion.

## Invocation

```bash
npx ui-skills baseline-ui --context social-carousel
npx ui-skills make-interfaces-feel-better --context chip-styling
npx ui-skills fixing-motion-performance --context reel-css
npx ui-skills 12-principles-of-animation --context stagger-timing
npx ui-skills fixing-accessibility --context contrast-check
```

## Skill → asset mapping

| ui-skills skill                 | Apply to                                                                   |
| ------------------------------- | -------------------------------------------------------------------------- |
| **baseline-ui**                 | Spacing, hierarchy, typography in `BrandBackgroundEngine` social templates |
| **make-interfaces-feel-better** | Chip styling, safe zones (80px inset on 1080×1080)                         |
| **fixing-motion-performance**   | Compositor-friendly gradients in reel CSS; `will-change` on animate items  |
| **12-principles-of-animation**  | Stagger 80–120ms, ease-out entrances in `__REEL_ANIMATE_BEAT__`            |
| **fixing-accessibility**        | Contrast ≥ 4.5:1 on social backgrounds via `contrastRatio()`               |
| ui-skills skill                 | Apply to                                                                   |
| ------------------------------- | -------------------------------------------------------------------------- |
| **baseline-ui**                 | Spacing, hierarchy, typography in `BrandBackgroundEngine` social templates |
| **make-interfaces-feel-better** | Chip styling, safe zones (80px inset on 1080×1080)                         |
| **fixing-motion-performance**   | Compositor-friendly gradients in reel CSS; `will-change` on animate items  |
| **12-principles-of-animation**  | Stagger 80–120ms, ease-out entrances in `__REEL_ANIMATE_BEAT__`            |
| **fixing-accessibility**        | Contrast ≥ 4.5:1 on social backgrounds via `contrastRatio()`               |

## Code touchpoints

- `lib/studio/asset-harness/backends/brand-background-engine.ts` — safe zones, typography scale, Tier B copy overlay
- `lib/studio/asset-harness/backends/demo-reel/generate-method-frames.ts` — motion player + hero PNG backgrounds
- `lib/studio/asset-harness/backends/landing-bundle.ts` — carousel crossfade + `prefers-reduced-motion`

## Constraints

- Backgrounds stay textless in Tier A; carousel copy renders in Tier B second Sharp pass
- No linear opacity-only hero motion — use transform + opacity with ease-out
- OG (1200×630) and story (1080×1920) use aspect-specific crops, not stretch
