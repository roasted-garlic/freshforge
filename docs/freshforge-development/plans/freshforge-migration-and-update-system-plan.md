# Plan: FreshForge Migration and Update System

| Field | Value |
|-------|-------|
| Date | 2026-06-24 |
| Author | Planning Agent |
| Status | ready_for_review |
| Workflow | managed-phase |
| Related | docs/workflow/reviews/freshforge-migration-and-update-system-review.md |

---

## Goal

Add a general, versioned migration and update capability so projects with older AppForge or FreshForge workflow installations can safely upgrade to the current FreshForge starter without overwriting project-specific documentation. AppForge → FreshForge is the first legacy migration; future FreshForge releases can register additional migrations.

## Background

FreshForge distributes a workflow starter via `install` and `export`. Existing installed projects have no safe upgrade path. Re-running `install --force` would overwrite project-specific docs. This phase introduces:

- Installation metadata (`.freshforge/version.json`)
- `migrate` and `doctor` CLI commands
- A reusable migration registry and runner
- First migration: `legacy-appforge-to-freshforge`
- Backups before changes
- Validation updates preserving install/export safety

Prior phases completed branding rename and starter surface definition. CLI is `bin/freshforge.mjs`; no `appforge.mjs` remains.

## FreshForge Impact Classification

| Area | Impact |
|------|--------|
| **Starter Surface** | `.freshforge/version.json` added to default install/export; `AGENTS.md`, `docs/AI_RULES.md`, `docs/WORKFLOWS.md` updated with migrate/doctor guidance |
| **Development Tooling** | New migration/doctor libs, validation checks, package scripts, test fixtures |
| **Distribution/Installer** | CLI commands `migrate`, `doctor`; install creates version.json |
| **Documentation** | `docs/freshforge-development/migrations/`, distribution docs updated |
| **Development History** | This plan/review/signoff archived under `docs/freshforge-development/` |

## Scope

### In Scope

- `.freshforge/version.json` metadata for new installs and migrated projects
- Update `DEFAULT_ROOT_ENTRIES` to include `.freshforge/` (excluding `.freshforge/backups/`)
- `freshforge migrate` with `--target`, `--dry-run`, `--from`, `--force-workflow`
- `freshforge doctor` (read-only inspection)
- Migration library: `run-migrate.mjs`, `run-doctor.mjs`, `freshforge-version.mjs`, `freshforge-migrations.mjs`
- First migration `legacy-appforge-to-freshforge` (rename workflow refs, doc path moves, version.json)
- Backup to `.freshforge/backups/<timestamp>/` before changes
- Validation updates in `validate-structure.mjs`
- Development docs under `docs/freshforge-development/migrations/`
- Test fixtures: `test-fixtures/legacy-appforge-install/`, `current-freshforge-install/`, `no-install/`
- Package version field in `package.json` for `installedVersion`
- Add `tmp-test-legacy-appforge` and `test-fixtures/` to `.gitignore` patterns as needed

### Out of Scope

- Application source code in target projects
- npm package publish (future `npx freshforge migrate` documented only)
- AppForge CLI compatibility alias (rename complete; no `bin/appforge.mjs`)
- Modifying target `package.json`, `.env`, Firebase rules, deployment config
- Auto-migration on install (migrate is explicit command)

---

## Affected Areas

### Files / Modules (expected)

**New:**
- `.freshforge/version.json` (template in dev repo for export)
- `scripts/lib/run-migrate.mjs`
- `scripts/lib/run-doctor.mjs`
- `scripts/lib/freshforge-version.mjs`
- `scripts/lib/freshforge-migrations.mjs`
- `docs/freshforge-development/migrations/README.md`
- `docs/freshforge-development/migrations/legacy-appforge-to-freshforge.md`
- `test-fixtures/legacy-appforge-install/` (minimal legacy layout)
- `test-fixtures/current-freshforge-install/`
- `test-fixtures/no-install/`

**Modified:**
- `bin/freshforge.mjs` — add `migrate`, `doctor` commands
- `scripts/lib/starter-distribution.mjs` — `.freshforge/` in default roots; exclude backups
- `scripts/lib/run-install.mjs` — generate/update version.json on install
- `scripts/validate-structure.mjs` — version.json, migration/doctor scripts, updated roots
- `package.json` — version field, scripts `migrate:dry-run`, `doctor`, `validate:migrations`
- `docs/freshforge-development/distribution/INSTALLATION.md`
- `docs/freshforge-development/distribution/DISTRIBUTION.md`
- `docs/freshforge-development/distribution/PACKAGING.md`
- `docs/freshforge-development/distribution/STARTER_SURFACE.md`
- `AGENTS.md`, `docs/AI_RULES.md`, `docs/WORKFLOWS.md` (starter-facing migrate/doctor mentions)
- `.gitignore`

### Architecture Impact

- [x] Details: New distribution layer modules (`freshforge-migrations.mjs` registry, `freshforge-version.mjs` metadata, `run-migrate.mjs` orchestration, `run-doctor.mjs` diagnostics). Reuses `starter-distribution.mjs` for controlled file classification. No application layer changes.

### Security Impact

- [x] Details: Migrate must never touch secrets, `.env`, auth config, or app source. Path traversal prevented by resolving `--target` and rejecting paths outside target. `--force-workflow` limited to FreshForge-controlled files only. Backups created before writes; failure stops migration.

### Data Model Impact

- [x] Details: `.freshforge/version.json` schema:
  - `name`, `installedVersion`, `installedAt`, `source`, `previousName`, `migrationHistory[]` with `{ id, ranAt }`
  - Not a database entity; file-based metadata only

### Backend Impact

- [ ] None — CLI-only, no server APIs

### UI / UX Impact

- [ ] None — CLI output only

### Migration Impact

- [x] Forward steps:
  1. Detect install state (version.json, AppForge refs, doc layout)
  2. Plan pending migrations from registry, skip completed IDs
  3. Backup files to be changed/moved
  4. Run `legacy-appforge-to-freshforge`: rename workflow refs, move old doc paths, sync controlled workflow files from source, write version.json
  5. Future migrations register in `freshforge-migrations.mjs`
- [x] Rollback: Restore from `.freshforge/backups/<timestamp>/`; migrator does not delete backups

---

## Approach

### 1. Version metadata (`freshforge-version.mjs`)

- Define `VERSION_JSON_REL = '.freshforge/version.json'`
- `readVersion(targetRoot)`, `writeVersion(targetRoot, data)`, `createFreshInstallVersion(packageVersion)`
- `detectInstallState(targetRoot)` → `{ kind: 'freshforge' | 'appforge' | 'partial' | 'none', version, legacyPaths }`
- Read package version from dev repo `package.json` (add `"version": "0.2.0"`)

### 2. Controlled vs project-specific file classification (`freshforge-migrations.mjs`)

- **Controlled workflow files** (safe to update/replace with `--force-workflow` or migration):
  - `AGENTS.md`, `.cursor/rules/`, `.cursor/skills/`, `.cursor/workflow/`, `.cursor/hooks.json`
  - `docs/AI_RULES.md`, `docs/WORKFLOWS.md`
  - `docs/workflow/plans/README.md`, `docs/workflow/reviews/README.md`, `docs/workflow/setup/README.md`
- **Project-specific** (never blind overwrite):
  - `docs/project/`, `docs/architecture/`, `docs/standards/`, `docs/intake/` and listed files
- **Development-only** (must not be installed/migrated into targets):
  - `docs/freshforge-development/`, `docs/appforge-development/`, `scripts/`, `bin/`, etc.
- **Never touch**: app source patterns, `.env*`, `firebase.json`, `firestore.rules`, `storage.rules`, target `package.json`

### 3. Migration registry

```javascript
export const MIGRATIONS = [
  {
    id: 'legacy-appforge-to-freshforge',
    description: 'Rename AppForge workflow references and add FreshForge metadata.',
    from: ['appforge', 'unknown'],
    to: '0.2.0',
    run: runLegacyAppforgeToFreshforge,
  },
];
```

Runner: filter by `--from`, skip IDs in `migrationHistory`, run in order.

### 4. Legacy migration (`legacy-appforge-to-freshforge`)

- Replace AppForge → FreshForge in controlled files only (regex scoped to workflow context)
- Move old flat doc paths to new folder layout (preserve content; conflict if dest has meaningful content)
- Remove stale `docs/plans/`, `docs/reviews/`, `docs/setup/` if empty after move
- Sync current controlled workflow files from package source (like install subset)
- Create `.freshforge/version.json` with `previousName: 'AppForge'` when applicable
- Append migration history entry

### 5. Install/export updates

- Add `.freshforge/` to `DEFAULT_ROOT_ENTRIES`; exclude `.freshforge/backups/` in walk
- Ship template `version.json` in export; install overwrites `installedAt`/`installedVersion` on fresh install
- `EXPECTED_DEFAULT_ROOTS` becomes `['.cursor', '.freshforge', 'AGENTS.md', 'docs']`

### 6. CLI (`bin/freshforge.mjs`)

- `migrate` → `runMigrate(argv, { sourceRoot })`
- `doctor` → `runDoctor(argv, { sourceRoot })`
- Update root usage text

### 7. Doctor (`run-doctor.mjs`)

Read-only report: installed?, version, AppForge refs, version.json, required paths, old layout, dev-only docs, recommended fix command.

### 8. Backups

Before migrate writes: `.freshforge/backups/<ISO-timestamp>/` copies only planned change/move targets. Abort if backup fails.

### 9. Validation

- Require migration/doctor lib files and CLI commands
- Default export includes `.freshforge/version.json`, excludes `.freshforge/backups/`
- `validate:migrations` script runs doctor/migrate dry-run against fixtures

### 10. Test fixtures

Minimal synthetic legacy AppForge install with old doc paths and AppForge strings in AGENTS.md.

### 11. Documentation

- Migration README and legacy migration doc in `docs/freshforge-development/migrations/`
- Update distribution docs with migrate/doctor commands
- Starter-facing docs mention upgrade path

---

## Test Strategy

### Automated

| Check | Command | Required |
|-------|---------|----------|
| Structure | `npm run validate:structure` | yes |
| Markdown | `npm run validate:markdown` | yes |
| Links | `npm run validate:links` | yes |
| Export | `npm run export:starter -- --clean` | yes |
| Doctor (exported) | `node bin/freshforge.mjs doctor --target ./dist/freshforge-starter` | yes |
| Migrate dry-run | `node bin/freshforge.mjs migrate --target ./tmp-test-legacy-appforge --dry-run` | yes |
| Migrate real | Copy fixture → tmp, run migrate, verify version.json + backups | yes |
| Doctor post-migrate | `node bin/freshforge.mjs doctor --target ./tmp-test-legacy-appforge` | yes |

### Manual

- [ ] None — CLI behavior covered by fixture tests

---

## Human Checkpoints Anticipated

- [ ] None — no production deploy, no target app code changes, no secrets

---

## Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Overwrite populated project docs | high | Conflict detection; never replace non-empty dest with template |
| Touch app source | high | Explicit allowlist; migrate only classified paths |
| Weaken validation | medium | Extend checks; do not remove existing forbidden paths |
| False-positive AppForge rename | medium | Scope renames to controlled files and workflow context |
| Missing package version | low | Add version to package.json |

---

## Rollback Plan

Users restore from `.freshforge/backups/<timestamp>/`. Development repo changes revert via git. No production deployment.

---

## Documentation Updates Required

- [x] `docs/freshforge-development/distribution/INSTALLATION.md`
- [x] `docs/freshforge-development/distribution/DISTRIBUTION.md`
- [x] `docs/freshforge-development/distribution/PACKAGING.md`
- [x] `docs/freshforge-development/distribution/STARTER_SURFACE.md`
- [x] `docs/freshforge-development/migrations/README.md` (new)
- [x] `docs/freshforge-development/migrations/legacy-appforge-to-freshforge.md` (new)
- [x] `AGENTS.md`
- [x] `docs/AI_RULES.md`
- [x] `docs/WORKFLOWS.md`
- [x] `docs/project/DECISIONS.md` (ADR for migration system)

---

## Open Questions

- [x] None — CLI is `freshforge.mjs`; AppForge rename complete

---

## Approval

- Review doc: docs/workflow/reviews/freshforge-migration-and-update-system-review.md
- Verdict: pending
