# Plan: Dev Environment Cleanup

| Field | Value |
|-------|-------|
| Date | 2026-06-23 |
| Status | ready_for_review |
| Workflow | managed-phase |

---

## Goal

Remove local-only generated files and dependency folders so AppForge is ready for ongoing development and safe to push to GitHub.

## Scope

### Remove if present
`node_modules/`, `dist/`, `build/`, `coverage/`, `.cache/`, `.tmp/`, `temp/`, `tmp/`, `tmp-install-test/`, `appforge-temp/`, `appforge-starter/`, `logs/`, `*.log`, archives, `.DS_Store`, `Thumbs.db`

### Preserve
All reusable source: `.cursor/`, `docs/`, `scripts/`, `.github/`, `package.json`, `package-lock.json`, `AGENTS.md`, `README.md`, `.gitignore`, `.markdownlint-cli2.jsonc`, `docs/appforge-development/`

### Git
- Untrack local-only files with `git rm --cached` if tracked
- Confirm `.gitignore` coverage

### Verify
- `state.md` matches `state-template.md`
- Starter folders clean
- `npm run validate`, export, install dry-run

## Test Strategy

`npm install`, `npm run validate`, `node scripts/export-starter.mjs --clean`, install dry-run
