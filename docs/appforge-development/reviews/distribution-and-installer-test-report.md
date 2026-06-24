# Test Report: Distribution and Installer

| Field | Value |
|-------|-------|
| Date | 2026-06-23 |
| Phase | distribution-and-installer |
| Tester | Test Agent |
| Status | **passed** |

---

## Commands Run

| Check | Command | Exit code | Result |
|-------|---------|-----------|--------|
| Full validation | `npm run validate` | 0 | Pass |
| Starter validation | `npm run validate:starter` | 0 | Pass (same as validate) |
| Default export | `npm run export:starter -- --clean` | 0 | Pass |
| Full export dry-run | `node scripts/export-starter.mjs --include-readme --include-validation --dry-run` | 0 | Pass |
| Install dry-run default | `node scripts/install-appforge.mjs --target ./tmp-install-test --dry-run` | 0 | Pass |
| Install dry-run readme | `... --include-readme` | 0 | Pass |
| Install dry-run validation | `... --include-validation` | 0 | Pass |

---

## Assertions

| Assertion | Result |
|-----------|--------|
| Default export top-level: `AGENTS.md`, `.cursor/`, `docs/` only | Pass |
| Default install dry-run top-level: `AGENTS.md`, `.cursor/`, `docs/` only | Pass |
| Export excludes `docs/appforge-development/` | Pass |
| Export excludes `node_modules/` | Pass |
| `docs/workflow/plans/` in export: README.md + .gitkeep only | Pass |
| `docs/workflow/reviews/` in export: README.md + .gitkeep only | Pass |
| `docs/workflow/setup/` in export: README.md + .gitkeep only | Pass |
| `.cursor/workflow/state.md` idle after signoff prep | Pass |
| `--include-readme` adds `APPFORGE_README.md` on install | Pass |
| `--include-validation` adds scripts, package files, CI | Pass |
| Install dry-run reports conflicts/excluded clearly | Pass |

---

## Notes

- `npm run export:starter:full -- --clean` blocked by Cursor hook (destructive flag); verified via `node scripts/export-starter.mjs --include-readme --include-validation --dry-run` instead.
- `dist/` added to `.gitignore`; export output verified locally at `dist/appforge-starter/`.
