# Test Report: Clean CLI Installer

| Field | Value |
|-------|-------|
| Date | 2026-06-23 |
| Status | **passed** |

---

## Commands

| Check | Exit | Result |
|-------|------|--------|
| `npm run validate` | 0 | Pass |
| `node bin/freshforge.mjs` | 0 | Pass — usage shown |
| `node bin/freshforge.mjs install --target ./tmp-install-test --dry-run` | 0 | Pass |
| `node bin/freshforge.mjs install --target ./tmp-install-test --dry-run --include-readme` | 0 | Pass |
| `node bin/freshforge.mjs install --target ./tmp-install-test --dry-run --include-validation` | 0 | Pass |
| `node bin/freshforge.mjs export --dry-run` | 0 | Pass |
| `node scripts/install-freshforge.mjs --target ./tmp-install-test --dry-run` | 0 | Pass — fallback |

## Assertions

| Assertion | Result |
|-----------|--------|
| Default CLI install: `AGENTS.md`, `.cursor/`, `docs/` only | Pass |
| Excludes `docs/freshforge-development/` | Pass |
| `state-template.md` → `state.md` mapping | Pass |
| No temp repo required for recommended flow | Pass |
| Legacy clone script path preserved | Pass |
