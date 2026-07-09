# Test Report: Multi-Agent Entry Points

| Field | Value |
|-------|-------|
| Date | 2026-07-09 |
| Phase | multi-agent-entry-points |
| Status | passed |

---

## Commands Run

| Check | Command | Exit code | Result |
|-------|---------|-----------|--------|
| Export | `npm run export:starter -- --clean` | 0 | `CLAUDE.md` in top-level roots |
| Structure | `npm run validate:structure` | 0 | passed (31 starter files) |
| Markdown | `npm run validate:markdown` | 0 | 0 errors |
| Links | `npm run validate:links` | 0 | passed |
| Migrations | `npm run validate:migrations` | 0 | claude bridge + legacy fixtures |
| Doctor | `node bin/freshforge.mjs doctor --target ./dist/freshforge-starter` | 0 | healthy, CLAUDE.md check passes |

---

## Migration validation

- `current-freshforge-install` fixture (no CLAUDE.md) → migrate adds bridge → doctor passes CLAUDE.md check
- Legacy AppForge fixture migrate still passes
