# Plan: Branding Rename — FreshForge (Hard Rename)

| Field | Value |
|-------|-------|
| Phase | `branding-rename-freshforge` |
| Date | 2026-06-23 |
| Status | complete |

## Goal

Hard rename from **AppForge** to **FreshForge** across display name, CLI, package, paths, validation, and distribution.

## Scope

### Rename map

| From | To |
|------|-----|
| AppForge | FreshForge |
| appforge | freshforge |
| APPFORGE | FRESHFORGE |
| `docs/appforge-development/` | `docs/freshforge-development/` |
| `dist/appforge-starter/` | `dist/freshforge-starter/` |
| `bin/appforge.mjs` | `bin/freshforge.mjs` |
| `scripts/install-appforge.mjs` | `scripts/install-freshforge.mjs` |
| `APPFORGE_README.md` | `FRESHFORGE_README.md` |
| `npx github:roasted-garlic/appforge` | `npx github:roasted-garlic/freshforge` |
| `Continue AppForge` alias | `Continue FreshForge` |

### Files to update

All starter surface + dev tooling: AGENTS.md, README, docs/, .cursor/, scripts/, bin/, package.json, .github/

### ADR

Supersede ADR-002 with ADR-003: canonical name FreshForge; AppForge and BuildPilot historical only.

## Out of scope

- Application source code
- Workflow behavior changes
- Renaming user's local folder (manual)

## Test strategy

`npm run validate`, `export:starter --clean`, `install --dry-run`, inspect `dist/freshforge-starter/`
