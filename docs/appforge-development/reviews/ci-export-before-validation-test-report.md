# Test Report: CI Export Before Validation

| Field | Value |
|-------|-------|
| Date | 2026-06-23 |
| Status | **passed** |

---

## Commands

| Check | Exit | Result |
|-------|------|--------|
| `npm run export:starter` | 0 | Pass |
| `dist/appforge-starter/.cursor/workflow/state.md` exists | — | Yes |
| `npm run validate` | 0 | Pass |
| `npm run validate:structure` | 0 | Pass (via validate) |

## Assertions

| Assertion | Result |
|-----------|--------|
| `.github/workflows/validate.yml` runs export before validate | Pass |
| `dist/` remains in `.gitignore` | Pass |
| Exported starter checks not weakened | Pass |
| Improved missing-export error message | Pass |
