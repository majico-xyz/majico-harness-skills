---
name: seo-foundations
displayName: SEO Foundations
scope: global
is_system: true
research:
  web: true
  reddit: false
  github: false
  marketScan: false
  required: true
  maxQueries: 6
  fetchTopUrls: 2
generation:
  backend: harness-native
  backendRef: seo-foundations
  async: true
canvas:
  frameType: markdownFrame
  exportFormats: [markdown]
---

# SEO Foundations

Tool-agnostic on-page, technical, and AEO/GEO audit checklist for marketing sites — no Ahrefs MCP in v1.

## When to use

- Landing page or marketing site is live or drafted
- User wants structured SEO audit before launch
- Research-heavy deliverable with web scan context

## When NOT to use

- User needs paid rank tracking suite (defer to future seo-audit-suite)
- No public URL or domain in brief

## Required inputs

- Primary domain or staging URL
- Positioning keyword from brief or GTM
- Landing page HTML export if available

## Workflow

1. Run web research on competitor SERP patterns
2. Apply on-page checklist (title, meta, H1, internal links)
3. Apply technical checklist (canonical, sitemap, CWV)
4. Add AEO/GEO structured-summary notes
5. Export audit markdownFrame

## Failure patterns

| Issue                        | Fix                                          |
| ---------------------------- | -------------------------------------------- |
| Generic checklist only       | Tie each item to product positioning keyword |
| Missing domain               | Block until user supplies domain in params   |
| Duplicate landing copy audit | Focus on discoverability not conversion copy |

## Output format

Markdown audit: On-page, Technical, AEO/GEO sections with checkboxes and findings

See also: [landing-page](landing-page), [blog-article](blog-article), [content-strategy](content-strategy)
