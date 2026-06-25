# FreshForge Migrations

> Versioned migration system for upgrading installed workflow starters without overwriting project-specific documentation.

---

## Overview

FreshForge installs a **starter surface** into target projects. When the starter evolves (renames, doc layout changes, new workflow files), existing installations can upgrade safely with:

```bash
npx github:roasted-garlic/freshforge doctor
npx github:roasted-garlic/freshforge migrate --dry-run
npx github:roasted-garlic/freshforge migrate
```

Future npm:

```bash
npx freshforge migrate
npx freshforge doctor
```

---

## Installation Metadata

New installs and successful migrations write `.freshforge/version.json`:

```json
{
  "name": "FreshForge",
  "installedVersion": "0.2.0",
  "installedAt": "2026-06-24T00:00:00.000Z",
  "source": "github:roasted-garlic/freshforge",
  "previousName": null,
  "migrationHistory": []
}
```

Migrated AppForge installs set `"previousName": "AppForge"` and append migration history entries.

---

## Migration Registry

Migrations are registered in `scripts/lib/freshforge-migrations.mjs`:

| id | from | to | description |
|----|------|-----|-------------|
| `legacy-appforge-to-freshforge` | appforge, unknown, partial | 0.2.0 | Rename AppForge workflow references; move legacy doc paths; add metadata |

The runner skips migrations already listed in `migrationHistory`.

To add a future migration:

1. Implement a `plan(ctx)` function returning planned actions
2. Register in `MIGRATIONS` array with unique `id`
3. Document in `docs/freshforge-development/migrations/`
4. Add fixture coverage in `test-fixtures/` and `scripts/validate-migrations.mjs`

---

## File Classification

### FreshForge-controlled (safe to update)

- `AGENTS.md`, `.cursor/rules/`, `.cursor/skills/`, `.cursor/workflow/`, `.cursor/hooks.json`
- `docs/AI_RULES.md`, `docs/WORKFLOWS.md`
- `docs/workflow/plans/README.md`, `docs/workflow/reviews/README.md`, `docs/workflow/setup/README.md`

`--force-workflow` overwrites these from the current starter.

### Project-specific (preserve)

- `docs/project/`, `docs/architecture/`, `docs/standards/`, `docs/intake/`

Migrate moves legacy flat paths into these folders but **never** overwrites populated destination files with blank templates.

### Never touch

- Application source (`src/`, `app/`, etc.)
- `.env*`, `package.json`, Firebase config, deployment config

---

## Backups

Before applying changes, migrate copies affected files to:

```text
.freshforge/backups/<ISO-timestamp>/
```

If backup creation fails, migration aborts. Backups are not included in install/export.

---

## Related

- [legacy-appforge-to-freshforge.md](./legacy-appforge-to-freshforge.md) — first migration details
- [INSTALLATION.md](../distribution/INSTALLATION.md) — user commands
- [STARTER_SURFACE.md](../distribution/STARTER_SURFACE.md) — what gets installed
