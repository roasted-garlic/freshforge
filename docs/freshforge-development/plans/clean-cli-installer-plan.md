# Plan: Clean CLI Installer

| Field | Value |
|-------|-------|
| Date | 2026-06-23 |
| Status | approved |
| Workflow | managed-phase |

## Goal

Add `bin/freshforge.mjs` so users can run `npx github:roasted-garlic/freshforge install` without clone-temp-delete.

## Approach

1. Extract `runInstall` / `runExport` into `scripts/lib/`.
2. Thin wrappers in existing install/export scripts.
3. Add `bin/freshforge.mjs` routing install, export, validate.
4. Update `package.json` name + bin.
5. Update docs; keep clone flow as fallback.

## Test Strategy

`npm run validate`, CLI dry-run commands for install/export.
