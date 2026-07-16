---
name: widget-pulse-calendar
displayName: Pulse Content Calendar
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
  backendRef: widget-pulse-calendar
  async: false
canvas:
  frameType: widgetFrame
  exportFormats: [html]
---

# Pulse Content Calendar

Widget frame for Pulse content calendar scheduling — pairs with widget-pulse and content-plan deliverables.

## When to use

- User manages social/content calendar inside Studio Pulse widget
- Content plan exists and needs calendar visualization

## Output

HTML widget frame synced to Pulse calendar backend.

See also: [widget-pulse](widget-pulse), [content-plan](content-plan)
