# Signoff: Starter Docs Surface Cleanup

| Field | Value |
|-------|-------|
| Phase | `starter-docs-surface-cleanup` |
| Date | 2026-06-23 |
| Verdict | **approved** |

## Summary

Reorganized starter-facing documentation into subfolders under `docs/` and moved AppForge-only installation, distribution, packaging, and starter-surface docs into `docs/appforge-development/distribution/`. Updated references across rules, agents, skills, scripts, and validation. Default export/install continues to ship `AGENTS.md`, `.cursor/`, and `docs/` only.

## New docs structure

```
docs/
  AI_RULES.md
  WORKFLOWS.md
  project/          PROJECT_BRIEF, ROADMAP, PROJECT_HEALTH, TECH_DEBT, DECISIONS, RISK_REGISTER
  architecture/     ARCHITECTURE, BACKEND, DATA_MODEL
  standards/        CODING_STANDARDS, STYLE_GUIDE, SECURITY, TESTING, DEPLOYMENT
  intake/           INTAKE_FINDINGS
  plans/            README.md, .gitkeep
  workflow/         plans/, reviews/, setup/ (workflow artifacts)
```

AppForge development only:

```
docs/appforge-development/distribution/
  INSTALLATION.md, DISTRIBUTION.md, PACKAGING.md, STARTER_SURFACE.md
```

## Files moved

**Starter-facing:** 16 docs from flat `docs/` into `project/`, `architecture/`, `standards/`, `intake/`.

**AppForge-only:** `INSTALLATION.md`, `DISTRIBUTION.md`, `PACKAGING.md`, `STARTER_SURFACE.md` → `docs/appforge-development/distribution/`.

## References updated

- `AGENTS.md`, `README.md`, `docs/WORKFLOWS.md`
- `.cursor/rules/*.mdc`, `.cursor/agents/*.md`, `.cursor/skills/**/SKILL.md`, `.cursor/workflow/*.md`
- `scripts/validate-structure.mjs`, `scripts/lib/starter-distribution.mjs`, install/export scripts
- Distribution docs internal cross-links

## Validation results

| Command | Result |
|---------|--------|
| `npm ci` | exit 0 |
| `npm run validate` | exit 0 (structure, markdown, links) |
| `npm run export:starter -- --clean` | exit 0 — 74 files exported |
| `node bin/appforge.mjs install --dry-run` | exit 0 — correct roots and conflicts in dev repo |

## Export contents verified

**Included:** `docs/AI_RULES.md`, `docs/WORKFLOWS.md`, `docs/project/`, `docs/architecture/`, `docs/standards/`, `docs/intake/`, `docs/workflow/plans/`, `docs/workflow/reviews/`, `docs/workflow/setup/`

**Excluded:** `docs/appforge-development/`, legacy flat paths (`docs/INSTALLATION.md`, etc.)

**Clean folders:** `docs/workflow/plans/`, `docs/workflow/reviews/`, `docs/workflow/setup/` contain only README + `.gitkeep`

**State:** exported `.cursor/workflow/state.md` matches clean idle template

## Outcome

The distributed starter now ships only target-project workflow documentation. AppForge operator docs remain in the development repo under `docs/appforge-development/` and are excluded from default install/export.

## Manual checkpoints

None required.

## Open follow-ups

None.
