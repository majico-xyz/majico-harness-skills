# Studio asset harness skills

System skills under `data/skills/` power the Majico Studio asset harness (`lib/studio/asset-harness`).

## Standard deliverable output

After the harness test pipeline, run:

```bash
npm run deliverable:harness
```

This produces **one ZIP** (`deliverables/harness/majico-harness-deliverable.zip`) containing:

- Self-brand harness assets (video reel, office ODT/XLSX, landing HTML)
- `REPORT.md` / `REPORT.json` — unit test summary, coverage, UX audit
- Test logs and coverage artifacts
- `manifest.json`

Use `npm run deliverable:harness:full` to attempt Playwright harness e2e. Add `--catbox` via `deliverable:harness:catbox` for a public mirror URL.

Individual asset generation (no report/ZIP): `bun scripts/dev/generate-majico-self-assets.ts --offline`
