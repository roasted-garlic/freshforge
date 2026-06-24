# Signoff: Starter Workflow Folder Cleanup

| Field | Value |
|-------|-------|
| Phase | `starter-workflow-folder-cleanup` |
| Date | 2026-06-23 |
| Verdict | **approved** |

## Summary

Moved workflow artifact folders from `docs/plans/`, `docs/reviews/`, and `docs/setup/` to `docs/workflow/plans/`, `docs/workflow/reviews/`, and `docs/workflow/setup/`. Updated rules, agents, skills, templates, validation, and distribution exclusion so permanent project docs are clearly separated from generated workflow output.

## Workflow folders moved

| From | To |
|------|-----|
| `docs/plans/` | `docs/workflow/plans/` |
| `docs/reviews/` | `docs/workflow/reviews/` |
| `docs/setup/` | `docs/workflow/setup/` |

Each folder retains `README.md` and `.gitkeep` only in the clean starter.

## References updated

- `AGENTS.md` — workflow artifact guidance and Key Docs table
- `docs/WORKFLOWS.md` — Workflow Artifact Folders section
- `docs/AI_RULES.md`, `README.md`, standards and intake docs
- `.cursor/rules/`, `.cursor/agents/`, `.cursor/skills/`, `.cursor/workflow/` templates
- `docs/appforge-development/distribution/` (current-state paths)
- `scripts/validate-structure.mjs`, `scripts/lib/starter-distribution.mjs`

AppForge dev archive exception preserved: phase history remains under `docs/appforge-development/plans/` and `docs/appforge-development/reviews/`.

## Validation results

| Command | Result |
|---------|--------|
| `npm run validate` | exit 0 (structure, markdown, links) |
| `npm run export:starter -- --clean` | exit 0 — 74 files; legacy `docs/plans`, `docs/reviews`, `docs/setup` excluded |
| `node bin/appforge.mjs install --dry-run` | exit 0 — correct roots; legacy dirs excluded |

## Export contents verified

**Included:** `docs/workflow/plans/`, `docs/workflow/reviews/`, `docs/workflow/setup/` (README + `.gitkeep` each)

**Excluded:** `docs/plans/`, `docs/reviews/`, `docs/setup/`, `docs/appforge-development/`

Exported `.cursor/workflow/state.md` matches clean idle template.

## `docs/appforge-development/`

Unchanged in layout. Still excluded from default export/install.

## Outcome

The starter now separates **permanent project documentation** (`docs/project/`, `docs/architecture/`, `docs/standards/`, `docs/intake/`) from **workflow artifacts** (`docs/workflow/`).

## Note

Empty legacy directory shells (`docs/plans`, `docs/reviews`, `docs/setup`) may remain on local filesystem after `git mv`; they are excluded from export/install and contain no files. Safe to delete manually: `Remove-Item docs/plans, docs/reviews, docs/setup -Recurse -Force`.

## Manual checkpoints

None required.
