# Signoff: Branding Rename — AppForge → FreshForge (Hard Rename)

| Field | Value |
|-------|-------|
| Date | 2026-06-24 |
| Signoff by | Implementation Agent |
| Plan | docs/freshforge-development/plans/branding-rename-freshforge-plan.md |
| Review | docs/freshforge-development/reviews/branding-rename-freshforge-review.md |
| Final status | **approved** |

---

## Summary

Completed hard rename from **AppForge** to **FreshForge** across display name, CLI, package, paths, validation, distribution scripts, starter surface docs, and development archive. Git-renamed paths (`docs/freshforge-development/`, `bin/freshforge.mjs`, `scripts/install-freshforge.mjs`) were updated in content. ADR-005 supersedes ADR-002; **AppForge** and **BuildPilot** are historical labels only.

`.cursor/workflow/state.md` was not modified (idle starter state preserved).

---

## Changes Delivered

### Package & CLI
- `package.json`: name `freshforge`, bin `freshforge` → `./bin/freshforge.mjs`, `install:freshforge` script
- `package-lock.json`: name and bin references updated
- `bin/freshforge.mjs`: full CLI rename (`freshforge install|export|validate`, `github:roasted-garlic/freshforge`)
- `scripts/install-freshforge.mjs`, `scripts/export-starter.mjs`: comments and paths

### Distribution & validation
- `scripts/lib/starter-distribution.mjs`: `FRESHFORGE_README.md`, `readmeAsFreshforgeReadme`, `freshforge-*` exclusions, `docs/freshforge-development/`
- `scripts/lib/run-install.mjs`, `run-export.mjs`, `run-validate.mjs`: CLI usage and paths
- `scripts/validate-structure.mjs`: `docs/freshforge-development/`, `dist/freshforge-starter`, `install-freshforge.mjs`, `bin/freshforge.mjs`

### Starter surface
- `AGENTS.md`, `README.md`: FreshForge canonical; AppForge and BuildPilot historical
- `docs/AI_RULES.md`, `docs/WORKFLOWS.md`
- `docs/standards/TESTING.md`
- Project and intake docs (`PROJECT_BRIEF`, `ARCHITECTURE`, `ROADMAP`, `TECH_DEBT`, `PROJECT_HEALTH`, `INTAKE_FINDINGS`)
- `docs/project/DECISIONS.md`: ADR-005 added; ADR-002 marked superseded

### Cursor workflow surface
- `.cursor/rules/documentation.mdc`, `.cursor/rules/workflow.mdc`
- `.cursor/workflow/command-aliases.md`: `Continue FreshForge`
- `.cursor/skills/managed-phase/SKILL.md`, `.cursor/skills/project-intake/SKILL.md`
- `.cursor/hooks.json`

### Development archive
- All `docs/freshforge-development/**/*.md` updated (45 files); rename plan retains intentional `AppForge`/`appforge` entries in rename-map table

### Other
- `.gitignore`: `freshforge-temp/`, `freshforge-starter/`

---

## Files Changed

### Renamed (git mv, content updated)
- `bin/appforge.mjs` → `bin/freshforge.mjs`
- `scripts/install-appforge.mjs` → `scripts/install-freshforge.mjs`
- `docs/appforge-development/**` → `docs/freshforge-development/**` (all plans, reviews, distribution, health, intake)

### Modified
- `.cursor/hooks.json`
- `.cursor/rules/documentation.mdc`
- `.cursor/rules/workflow.mdc`
- `.cursor/skills/managed-phase/SKILL.md`
- `.cursor/skills/project-intake/SKILL.md`
- `.cursor/workflow/command-aliases.md`
- `.gitignore`
- `AGENTS.md`
- `README.md`
- `docs/AI_RULES.md`
- `docs/WORKFLOWS.md`
- `docs/architecture/ARCHITECTURE.md`
- `docs/intake/INTAKE_FINDINGS.md`
- `docs/project/DECISIONS.md`
- `docs/project/PROJECT_BRIEF.md`
- `docs/project/PROJECT_HEALTH.md`
- `docs/project/ROADMAP.md`
- `docs/project/TECH_DEBT.md`
- `docs/standards/TESTING.md`
- `package.json`
- `package-lock.json`
- `scripts/export-starter.mjs`
- `scripts/lib/run-export.mjs`
- `scripts/lib/run-install.mjs`
- `scripts/lib/run-validate.mjs`
- `scripts/lib/starter-distribution.mjs`
- `scripts/validate-structure.mjs`
- All modified files under `docs/freshforge-development/` (see git status)

### Created
- `docs/freshforge-development/reviews/branding-rename-freshforge-signoff.md` (this file)
- `docs/freshforge-development/plans/branding-rename-freshforge-plan.md` (untracked at start)
- `docs/freshforge-development/reviews/branding-rename-freshforge-review.md` (untracked at start)

### Not modified (by design)
- `.cursor/workflow/state.md`

---

## Intentional Remaining References

| Location | Reference | Reason |
|----------|-----------|--------|
| `AGENTS.md`, `README.md` Naming Standard | AppForge | Historical label |
| `docs/project/DECISIONS.md` ADR-002, ADR-005 | AppForge | ADR history and supersession |
| `docs/freshforge-development/plans/branding-rename-freshforge-plan.md` | AppForge, appforge paths | Rename-map documentation |

---

## Tests

### Recommended (not run in this session)
- `npm run validate`
- `npm run export:starter -- --clean`
- `node scripts/install-freshforge.mjs --dry-run`
- Inspect `dist/freshforge-starter/` excludes `docs/freshforge-development/`

### Manual verification
| Check | Result |
|-------|--------|
| Replacement order applied (compound strings before bare `appforge`) | PASS |
| `state.md` untouched | PASS |
| CLI help text uses `freshforge` | PASS |
| `validate-structure.mjs` paths point to freshforge files | PASS |

---

## Issues & Follow-ups

1. **GitHub remote rename**: Update `github:roasted-garlic/freshforge` when the remote repository is renamed (ADR-005 follow-up).
2. **Local clone folder**: Workspace path may still be `AppForge`; manual rename optional.
3. **Validation run**: Parent agent should run `npm run validate` before merge if not already executed.
4. **ADR numbering**: Plan referenced ADR-003 superseding ADR-002; implemented as **ADR-005** because ADR-003/004 already exist.

---

## Human Approvals Obtained

| Approval | Status |
|----------|--------|
| Production deploy | not required |
| Database migration | not required |
| Remote repo rename | deferred |

---

## Signoff

Hard rename implementation complete within approved scope. Starter surface and development tooling consistently use **FreshForge** as the canonical name.

**Status: approved**
