# Plan: Starter State Reset

| Field | Value |
|-------|-------|
| Date | 2026-06-23 |
| Author | Planning Agent |
| Status | ready_for_review |
| Workflow | managed-phase |
| Related | docs/appforge-development/reviews/starter-state-reset-review.md |

---

## Goal

Ensure install and export never ship AppForge development workflow history in `.cursor/workflow/state.md`. Targets always receive clean idle state from `state-template.md`.

## Scope

### In Scope

- Create `.cursor/workflow/state-template.md` (canonical idle starter state)
- Reset dev `state.md` to match template
- Map `state-template.md` → `state.md` in install/export (exclude live dev `state.md`)
- Full workflow state validation in `validate-structure.mjs`
- Verify export/install output uses clean state mapping
- Update README, DISTRIBUTION, PACKAGING, TESTING, WORKFLOWS

### Out of Scope

- Application code, package installs, removing starter files

## Approach

1. Add `state-template.md` with exact idle starter content.
2. Update `starter-distribution.mjs`: exclude dev `state.md`; inject template→state mapping.
3. Expand validation: full field checks, forbidden dev strings, mapping verification.
4. Reset `state.md`; update docs; test and sign off.

## Test Strategy

- `npm run validate`
- `npm run export:starter -- --clean`
- Install dry-run confirms `state-template.md → state.md` mapping
- Exported `dist/.../state.md` matches template; no dev history strings

## Approval

- Verdict: pending
