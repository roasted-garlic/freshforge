# Plan: CI Export Before Validation

| Field | Value |
|-------|-------|
| Date | 2026-06-23 |
| Status | approved |

## Goal

CI must run `npm run export:starter` before `npm run validate` because `dist/` is gitignored.

## Changes

- `.github/workflows/validate.yml` — add export step before validate
- `scripts/validate-structure.mjs` — clearer missing-export error
- `docs/standards/TESTING.md`, `docs/appforge-development/distribution/DISTRIBUTION.md` — document CI export requirement
