# Signoff: FreshForge Migration and Update System

| Field | Value |
|-------|-------|
| Date | 2026-06-24 |
| Signoff by | Signoff Agent |
| Plan | docs/freshforge-development/plans/freshforge-migration-and-update-system-plan.md |
| Review | docs/freshforge-development/reviews/freshforge-migration-and-update-system-review.md |
| Test report | docs/freshforge-development/reviews/freshforge-migration-and-update-system-test-report.md |
| Final status | **approved** |

---

## Summary

Delivered a general versioned migration and update system for FreshForge installed projects: installation metadata (`.freshforge/version.json`), `migrate` and `doctor` CLI commands, backup-before-write safety, controlled vs project-specific file classification, and the first migration `legacy-appforge-to-freshforge`. Default install/export now includes `.freshforge/version.json` and excludes `.freshforge/backups/`.

---

## Changes Delivered

### Behavior

- `freshforge migrate` — safe upgrade with `--target`, `--dry-run`, `--from`, `--force-workflow`
- `freshforge doctor` — read-only installation health inspection
- New installs write `.freshforge/version.json` with package version
- Migration registry supports future migrations; skips completed IDs in `migrationHistory`
- Backups to `.freshforge/backups/<timestamp>/` before migrate writes

### Files Created

- `.freshforge/version.json` (starter template)
- `scripts/lib/freshforge-version.mjs`
- `scripts/lib/freshforge-migrations.mjs`
- `scripts/lib/run-migrate.mjs`
- `scripts/lib/run-doctor.mjs`
- `scripts/validate-migrations.mjs`
- `docs/freshforge-development/migrations/README.md`
- `docs/freshforge-development/migrations/legacy-appforge-to-freshforge.md`
- `test-fixtures/legacy-appforge-install/`, `current-freshforge-install/`, `no-install/`

### Files Modified

- `bin/freshforge.mjs` — migrate, doctor commands
- `scripts/lib/starter-distribution.mjs` — `.freshforge/` in default roots; exclude backups
- `scripts/lib/run-install.mjs` — writes version.json on install
- `scripts/validate-structure.mjs` — version.json, migration libs, updated roots
- `package.json` — version `0.2.0`, new scripts
- `AGENTS.md`, `docs/AI_RULES.md`, `docs/WORKFLOWS.md`, `docs/project/DECISIONS.md`
- Distribution docs and `docs/standards/TESTING.md`
- `.gitignore`

### Documentation Updated

- `docs/freshforge-development/distribution/INSTALLATION.md`, `DISTRIBUTION.md`, `PACKAGING.md`, `STARTER_SURFACE.md`
- Starter-facing upgrade guidance in `AGENTS.md`, `docs/AI_RULES.md`, `docs/WORKFLOWS.md`
- ADR-006 in `docs/project/DECISIONS.md`

### Starter Surface Files Changed

- `AGENTS.md`
- `docs/AI_RULES.md`
- `docs/WORKFLOWS.md`
- `docs/project/DECISIONS.md`
- `.freshforge/version.json` (new default install root)

---

## Tests

### Automated

- `npm run export:starter -- --clean` — passed
- `npm run validate` — passed (structure, markdown, links)
- `node bin/freshforge.mjs doctor --target ./dist/freshforge-starter` — passed
- `node bin/freshforge.mjs migrate --dry-run --from appforge` on legacy fixture — passed
- `npm run validate:migrations` — passed

### Manual

| Test | Result | Approved by |
|------|--------|-------------|
| N/A | N/A | N/A |

---

## Human Approvals Obtained

| Approval | Status | Date | Notes |
|----------|--------|------|-------|
| Production deploy | not required | | |
| Database migration | not required | | |
| Design / UX | not required | | |
| Business / policy | not required | | |
| Secrets / env | not required | | |

---

## Risks & Known Issues

| Item | Severity | Mitigation / follow-up |
|------|----------|------------------------|
| Doc path conflict if both old and new paths populated | medium | Migration stops and reports conflict |
| npm publish for `npx freshforge migrate` | low | Documented; GitHub CLI works now |

---

## Deferred Items (Roadmap)

- Publish to npm for `npx freshforge migrate`
- Add migrations for future FreshForge starter releases as needed

---

## Open Blockers

- [x] None

---

## Verdict

**Approved.** All required scope delivered; tests passed; validation unchanged in strictness; project-specific docs preserved by design.

---

## Workflow Complete

- [x] `.cursor/workflow/state.md` reset to idle template
- [x] Phase artifacts archived under `docs/freshforge-development/`
- [x] `docs/workflow/plans/` and `docs/workflow/reviews/` remain clean

**Recommended next action for user:**

Upgrade an existing installed project:

```bash
npx github:roasted-garlic/freshforge doctor
npx github:roasted-garlic/freshforge migrate --dry-run
npx github:roasted-garlic/freshforge migrate
```
