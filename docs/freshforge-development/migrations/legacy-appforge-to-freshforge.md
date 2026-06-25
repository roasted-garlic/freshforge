# Migration: legacy-appforge-to-freshforge

| Field | Value |
|-------|-------|
| id | `legacy-appforge-to-freshforge` |
| from | `appforge`, `unknown`, `partial` |
| to | `0.2.0` |
| Date | 2026-06-24 |

---

## Purpose

Upgrade projects that installed the workflow starter under the **AppForge** name or legacy doc layout to **FreshForge** without losing project-specific documentation.

This is the first registered migration. Future FreshForge releases add new migration IDs; this one handles the AppForge → FreshForge rename and doc reorganization.

---

## Triggers

Migration applies when:

- Legacy AppForge workflow references exist in controlled files
- Old flat doc paths exist (e.g. `docs/PROJECT_BRIEF.md`)
- `--from appforge` is specified
- FreshForge install has legacy signals and migration not yet in `migrationHistory`

Skipped when `migrationHistory` already contains `legacy-appforge-to-freshforge`.

---

## Actions

### 1. Rename workflow references

In FreshForge-controlled files only, replace:

- `AppForge` → `FreshForge`
- `appforge` → `freshforge` (CLI/path context)
- `docs/appforge-development` → `docs/freshforge-development`
- `github:roasted-garlic/appforge` → `github:roasted-garlic/freshforge`

Does **not** rename unrelated user content or application code.

### 2. Move legacy doc paths

| Old | New |
|-----|-----|
| `docs/PROJECT_BRIEF.md` | `docs/project/PROJECT_BRIEF.md` |
| `docs/ROADMAP.md` | `docs/project/ROADMAP.md` |
| `docs/ARCHITECTURE.md` | `docs/architecture/ARCHITECTURE.md` |
| `docs/SECURITY.md` | `docs/standards/SECURITY.md` |
| … | (see `DOC_PATH_MOVES` in `freshforge-version.mjs`) |

If both source and destination have meaningful content → **conflict**; migration stops unless resolved manually.

### 3. Move old workflow folders

- `docs/plans/` → `docs/workflow/plans/`
- `docs/reviews/` → `docs/workflow/reviews/`
- `docs/setup/` → `docs/workflow/setup/`

### 4. Sync controlled workflow files

Missing or AppForge-referenced controlled files are synced from the current starter. `--force-workflow` syncs all controlled files.

### 5. Write metadata

Creates or updates `.freshforge/version.json` with `previousName: "AppForge"` when applicable and appends migration history.

---

## Safety

- Backups before writes
- No app source changes
- No `.env` or Firebase config changes
- No target `package.json` changes
- Development-only paths (`docs/freshforge-development/`, `scripts/`) are not installed

---

## Verification

```bash
node bin/freshforge.mjs migrate --target ./test-fixtures/legacy-appforge-install --dry-run --from appforge
node bin/freshforge.mjs doctor --target ./test-fixtures/legacy-appforge-install
```

Or run `npm run validate:migrations` in the development repo.
