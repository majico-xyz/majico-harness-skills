---
name: motion-design
displayName: Motion Design
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
  backendRef: video-demo-reel
  async: true
canvas:
  frameType: videoFrame
  exportFormats: [mp4]
---

# Motion Design Skill

Universal motion principles for Majico Studio deliverables (demo reel, social, landing).

## Timing

- Stagger delays: **80–120ms** between sibling elements — never simultaneous pop-in
- Hold beats: **≥ 1.2s** readable before transition
- Crossfade: **680ms max** unless plan specifies otherwise

## Easing

- Entrances: **ease-out**
- Exits: **ease-in**
- Never linear opacity on hero elements

## Choreography

- Logo → headline → chips (staggered)
- Hero background fades in before text
- One focal element per beat

## Accessibility

- `prefers-reduced-motion`: instant final state, skip stagger

## Review loop (MotionReviewer)

- Grill-me pattern: one improvement axis per loop
- 3 iterations; capture highest-scoring plan
- Not a hard export gate

- `prefers-reduced-motion`: instant final state, skip stagger

## Review loop (MotionReviewer)

- Grill-me pattern: one improvement axis per loop
- 3 iterations; capture highest-scoring plan
- **MP4 export gate:** score must be ≥ 80 after review loops; `motion-plan.json` always ships with `motionPlanPassedGate` metadata
