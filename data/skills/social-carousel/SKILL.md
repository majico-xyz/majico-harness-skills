---
name: social-carousel
displayName: Social Carousel Assets
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
  backendRef: social-carousel-assets
  async: true
canvas:
  frameType: imageFrame
  exportFormats: [png]
---

# Social Carousel Assets Skill

Generate three-tier social asset kit for deliverable ZIP.

## Tier A — Signature (5–6)

MotionPlan method-beat backgrounds; same art as reel heroes.

## Tier B — Carousel expansion

One background per content-plan slide (`slideCount` × posts).

## Tier C — Social kit (3 fixed)

MotionPlan method-beat backgrounds; same art as reel heroes.

## Tier B — Carousel expansion

One background per content-plan slide (`slideCount` × posts).

## Tier C — Social kit (3 fixed)

- `og-share.png` (1200×630)
- `story-frame.png` (1080×1920)
- `square-poster.png` (1080×1080)

## Backend

`social-carousel-assets` harness backend; canvas frame `socialCarouselGallery`.

## Composition

`social-carousel-assets` harness backend; canvas frame `socialCarouselGallery`.

## Composition

Token gradient + optional chips via BrandBackgroundEngine. Variation seeds per slide.
