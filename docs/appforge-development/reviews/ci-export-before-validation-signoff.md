# Signoff: CI Export Before Validation

| Field | Value |
|-------|-------|
| Date | 2026-06-23 |
| Final status | **approved** |

---

## Summary

GitHub Actions now runs `npm run export:starter` before `npm run validate`. `dist/` stays gitignored. Structure validation export checks unchanged.

## Workflow order

1. Checkout
2. Setup Node.js 20
3. `npm ci`
4. `npm run export:starter`
5. `npm run validate`

## Files updated

- `.github/workflows/validate.yml`
- `scripts/validate-structure.mjs` (error message)
- `docs/standards/TESTING.md`
- `docs/appforge-development/distribution/DISTRIBUTION.md`

## GitHub CI

Should pass on next push/PR once this workflow is on the default branch.
