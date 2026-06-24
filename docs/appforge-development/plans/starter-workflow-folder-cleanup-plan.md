# Plan: Starter Workflow Folder Cleanup

| Field | Value |
|-------|-------|
| Phase | `starter-workflow-folder-cleanup` |
| Date | 2026-06-23 |
| Status | complete |

## Goal

Move workflow artifact folders from `docs/plans/`, `docs/reviews/`, `docs/setup/` to `docs/workflow/plans/`, `docs/workflow/reviews/`, `docs/workflow/setup/` so permanent project docs are separated from generated workflow output.

## Scope

- Move six files (README + `.gitkeep` per folder) under new `docs/workflow/` tree
- Update all references in starter surface (AGENTS.md, .cursor/, docs/, scripts/, bin/)
- Update `validate-structure.mjs` and `starter-distribution.mjs` clean-folder logic
- Add forbidden checks for old `docs/plans/`, `docs/reviews/`, `docs/setup/` paths
- Archive plan/signoff to `docs/appforge-development/` (starter workflow folders stay clean)

## Out of scope

- `docs/appforge-development/` layout (except reference clarifications)
- Top-level install roots
- Application code

## Implementation steps

1. `git mv` workflow folders to `docs/workflow/`
2. Bulk-update `docs/plans/` → `docs/workflow/plans/` (and reviews, setup)
3. Update AGENTS.md, WORKFLOWS.md, rules, skills, agents, templates
4. Update validation and distribution exclusion logic
5. Run `npm run validate`, export, install dry-run
6. Signoff in `docs/appforge-development/reviews/`

## Test strategy

- `npm run validate` (structure, markdown, links)
- `npm run export:starter -- --clean`
- `node bin/appforge.mjs install --dry-run`
- Inspect `dist/appforge-starter/docs/workflow/`

## Risks

- Accidental replacement of `docs/appforge-development/plans/` — mitigated by exact `docs/plans/` prefix only
