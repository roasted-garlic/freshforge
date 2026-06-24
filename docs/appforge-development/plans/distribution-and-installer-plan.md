# Plan: Distribution and Installer

| Field | Value |
|-------|-------|
| Date | 2026-06-23 |
| Author | Planning Agent |
| Status | ready_for_review |
| Workflow | managed-phase |
| Related | docs/appforge-development/reviews/distribution-and-installer-review.md |

---

## Goal

Prepare AppForge as a development repository that can install a clean workflow starter into new or existing app projects from GitHub, with documented install/export scripts, improved `.gitignore`, and validation that confirms default output contains only `AGENTS.md`, `.cursor/`, and `docs/`.

## Background

AppForge is maintained in a development repo with validation tooling, CI, and `docs/appforge-development/` history. Users need a terminal-based install from a cloned GitHub repo and maintainers need an export script — without manually copying files or shipping dev artifacts.

## Scope

### In Scope

- `docs/appforge-development/distribution/INSTALLATION.md` — install workflows A–F
- `docs/appforge-development/distribution/DISTRIBUTION.md` — dev repo vs starter, export, exclusions
- `scripts/install-appforge.mjs` — `--target`, `--include-readme`, `--include-validation`, `--force`, `--dry-run`
- `scripts/export-starter.mjs` — `--out`, `--include-readme`, `--include-validation`, `--clean`, `--dry-run`
- Update `README.md`, `docs/appforge-development/distribution/PACKAGING.md`, `docs/standards/TESTING.md`, `docs/WORKFLOWS.md`, `package.json`, `scripts/validate-structure.mjs`, `.gitignore`
- Shared copy/exclude logic: default `AGENTS.md` + `.cursor/` + `docs/`; optional README as `APPFORGE_README.md`; optional validation bundle
- Always exclude: `docs/appforge-development/`, non-starter files in `docs/plans|reviews|setup`, `node_modules`, `.git`, logs, archives, env, temp, local export folders
- `validate:starter` npm script; structure validation for dev repo + export/install dry-run checks

### Out of Scope

- Application source code
- `npm install` in target projects
- Removing reusable rules, agents, skills, docs, templates, or validation tooling from dev repo
- Hardcoded GitHub username (use `YOUR-USERNAME` placeholder)
- Default copy of `README.md`, `package.json`, `scripts/`, `.github/`

## Affected Areas

### Files / Modules (expected)

| Action | Path |
|--------|------|
| Create | `docs/appforge-development/distribution/INSTALLATION.md`, `docs/appforge-development/distribution/DISTRIBUTION.md` |
| Create | `scripts/install-appforge.mjs`, `scripts/export-starter.mjs` |
| Create | `scripts/lib/starter-distribution.mjs` (shared copy logic) |
| Update | `README.md`, `docs/appforge-development/distribution/PACKAGING.md`, `docs/standards/TESTING.md`, `docs/WORKFLOWS.md` |
| Update | `package.json`, `scripts/validate-structure.mjs`, `.gitignore` |
| Archive | `docs/appforge-development/plans/distribution-and-installer-plan.md` |
| Archive | `docs/appforge-development/reviews/distribution-and-installer-signoff.md` |

### Architecture Impact

- [x] None — distribution scripts only; stack-agnostic

### Security Impact

- [x] Details: Scripts must never copy `.env*`, secrets, or `node_modules`; conflict detection prevents silent overwrites

### Data Model Impact

- [ ] None

### Backend Impact

- [ ] None

### UI / UX Impact

- [ ] None

### Migration Impact

- [ ] None

## Approach

1. Implement `scripts/lib/starter-distribution.mjs` with file collection, exclusion rules, conflict detection, and summary reporting.
2. Implement `install-appforge.mjs` and `export-starter.mjs` using shared logic.
3. Write `INSTALLATION.md` and `DISTRIBUTION.md`.
4. Update packaging, testing, workflows, README, `package.json`, `.gitignore`.
5. Extend `validate-structure.mjs` for dev-repo checks and export/install dry-run verification.
6. Run full test matrix; reset workflow state to idle; sign off.

## Test Strategy

### Automated

| Check | Command | Required |
|-------|---------|----------|
| Structure + distribution | `npm run validate:starter` | yes |
| All validation | `npm run validate` | yes |
| Default export | `npm run export:starter` | yes |
| Full export | `npm run export:starter:full` | yes |
| Install dry-run default | `node scripts/install-appforge.mjs --target ./tmp-install-test --dry-run` | yes |
| Install dry-run readme | `... --include-readme` | yes |
| Install dry-run validation | `... --include-validation` | yes |

### Manual

- [ ] None — script output and dist inspection covered by automated checks

## Human Checkpoints Anticipated

- [ ] None — user granted autonomy

## Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Accidental overwrite in target project | medium | Conflict detection; `--force` required |
| Dev artifacts shipped to targets | high | Explicit exclude list; validation dry-runs |
| `docs/plans` polluted by this phase | low | Archive plan/signoff to `docs/appforge-development/` only |

## Rollback Plan

Revert new scripts and doc changes; restore prior `package.json` scripts and `.gitignore`.

## Documentation Updates Required

- [x] `docs/appforge-development/distribution/INSTALLATION.md`, `docs/appforge-development/distribution/DISTRIBUTION.md` (new)
- [x] `README.md`, `PACKAGING.md`, `TESTING.md`, `WORKFLOWS.md`

## Open Questions

- [x] None

## Approval

- Review doc: docs/appforge-development/reviews/distribution-and-installer-review.md
- Verdict: pending
