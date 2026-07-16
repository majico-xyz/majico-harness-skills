---
name: design-system
displayName: Design System
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
  backendRef: design-system
  async: true
canvas:
  frameType: markdownFrame
  exportFormats: [markdown]
---

# Design System

Component library and token documentation extending design.md — usage rules for agents and engineers.

## When to use

- design.md exists and user wants component + token reference doc
- Handoff to engineering or Cursor agents needs structured design system narrative
- Composes with guideline-html exports

## When NOT to use

- Tokens not generated yet (run brand profile + design.md first)
- User only wants a single landing page (use landing-page)

## Required inputs

- design.md sections (color, type, spacing, motion)
- brand.md voice for component copy examples

## Workflow

1. Read design.md from project context
2. Assemble token tables + component usage rules
3. Reference design-md-craft templates for section depth
4. Export markdownFrame

## Failure patterns

| Issue                     | Fix                                             |
| ------------------------- | ----------------------------------------------- |
| Stray hex in examples     | Map to CSS variables from tokens                |
| Missing motion tokens     | Include elevation-motion section from design-md |
| Components without states | Add hover/focus/disabled for each primitive     |

## Output format

Markdown: tokens (color, type, space, radius, motion), components (button, input, card), usage rules

See also: [guideline-html](guideline-html), [ui-polish](ui-polish)
