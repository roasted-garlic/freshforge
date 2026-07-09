# Packaging Guide

> How to ship, install, export, and verify a **clean** FreshForge workflow starter package.

**Starter surface** (the installed product): `AGENTS.md`, `CLAUDE.md`, `.cursor/`, `docs/`, `.freshforge/version.json` — see `docs/freshforge-development/distribution/STARTER_SURFACE.md`.

**Distribution tools** (`bin/freshforge.mjs`, `scripts/install-freshforge.mjs`, `scripts/export-starter.mjs`) deliver the starter surface but are not part of the default installed product.

---

## Development Repo vs Clean Starter

| | FreshForge development repo (GitHub) | Default install / export |
|--|-----------------------------------|--------------------------|
| Purpose | Build and maintain FreshForge | Drop into another project |
| `docs/freshforge-development/` | Maintainer history | **Excluded** |
| `docs/workflow/plans/`, `docs/workflow/reviews/` | Clean in starter; dev artifacts archived | Only `README.md` + `.gitkeep` |
| Validation tooling | Present in dev repo | Optional (`--include-validation`) |
| `README.md` | Full dev documentation | Optional (`--include-readme`) |
| `node_modules/` | Local only | **Never copied** |

The GitHub repository may include development tooling, CI, and `docs/freshforge-development/`. The **default** install and export includes `AGENTS.md`, `CLAUDE.md`, `.cursor/`, `docs/`, and `.freshforge/version.json`.

---

## What Ships (Default)

| Area | Included |
|------|----------|
| Entry point | `AGENTS.md` |
| Claude Code bridge | `CLAUDE.md` (`@AGENTS.md` import) |
| Cursor workflow | `.cursor/rules/`, `.cursor/agents/`, `.cursor/skills/`, `.cursor/workflow/`, `.cursor/hooks.json` |
| Baseline docs | `docs/AI_RULES.md`, `SECURITY.md`, `WORKFLOWS.md`, `TESTING.md`, `CODING_STANDARDS.md`, `DEPLOYMENT.md`, `DECISIONS.md`, `RISK_REGISTER.md`, `PACKAGING.md`, `INSTALLATION.md`, `DISTRIBUTION.md` |
| Project templates | `docs/project/PROJECT_BRIEF.md`, `ARCHITECTURE.md`, `DATA_MODEL.md`, `BACKEND.md`, `STYLE_GUIDE.md`, `ROADMAP.md`, `PROJECT_HEALTH.md`, `INTAKE_FINDINGS.md`, `TECH_DEBT.md` |
| Empty workflow folders | `docs/workflow/plans/`, `docs/workflow/reviews/`, `docs/workflow/setup/` (each with `README.md` and `.gitkeep` only) |
| Idle workflow state | `.cursor/workflow/state.md` from `state-template.md` (`Current Mode: idle`, `DONE: no`) |
| Installation metadata | `.freshforge/version.json` |

### Optional with flags

| Flag | Adds |
|------|------|
| `--include-readme` | `README.md` (export) or `FRESHFORGE_README.md` (install) |
| `--include-validation` | `package.json`, `package-lock.json`, `scripts/`, `.markdownlint-cli2.jsonc`, `.github/workflows/validate.yml` |

---

## What Does Not Ship

| Item | Reason |
|------|--------|
| `docs/freshforge-development/` | FreshForge maintainer history only |
| `.freshforge/backups/` | Migration backups (created in target projects) |
| Completed plans in `docs/workflow/plans/` | Filtered; only README + .gitkeep |
| Completed reviews in `docs/workflow/reviews/` | Same |
| `node_modules/` | Regenerate with `npm install` if using validation |
| `.git/`, `.env*`, logs, archives, temp folders | Local or target-specific |

---

## Install Into Another Repo (Recommended)

From the target project directory:

```bash
npx github:roasted-garlic/freshforge install
```

Optional flags: `--include-readme`, `--include-validation`, `--target`, `--force`, `--dry-run`.

### Fallback (clone temp repo)

```bash
git clone https://github.com/roasted-garlic/freshforge.git freshforge-temp
node freshforge-temp/scripts/install-freshforge.mjs --target .
rm -rf freshforge-temp
```

---

## Export a Clean Starter (Maintainers)

```bash
npm run export:starter              # → dist/freshforge-starter/
npm run export:starter:full         # includes README + validation
node scripts/export-starter.mjs --clean --dry-run
```

Details: `docs/freshforge-development/distribution/DISTRIBUTION.md`.

---

## How to Reset Workflow State

The **development repo** may accumulate phase history in `.cursor/workflow/state.md`. The canonical clean starter state lives in `.cursor/workflow/state-template.md`.

**Install and export always write `state-template.md` → `state.md`** in the target or export folder. They never copy the development repo's active `state.md`.

Before pushing the development repo to GitHub, reset the dev copy:

```bash
cp .cursor/workflow/state-template.md .cursor/workflow/state.md
```

Or edit manually until `state.md` matches `state-template.md` exactly.

`.cursor/workflow/state.md` in a starter should reflect:

- `Current Mode: idle`
- `Current Phase: none`
- `DONE: no`
- `Blocked: no`

Run **starter-package-cleanup** managed phase to reset automatically, or edit manually.

---

## How to Clean Generated Artifacts

### Automated (recommended)

Start a managed phase:

```
Phase: starter-package-cleanup
Goal: Prepare clean starter package
```

Archive completed phase plans and signoffs to `docs/freshforge-development/plans/` and `docs/freshforge-development/reviews/`. Starter-facing `docs/workflow/plans/` and `docs/workflow/reviews/` must remain clean (only `README.md` and `.gitkeep`).

### Manual checklist

1. Move completed plans from `docs/workflow/plans/` to `docs/freshforge-development/plans/`.
2. Move completed reviews, test reports, and signoffs from `docs/workflow/reviews/` to `docs/freshforge-development/reviews/`.
3. Leave only `README.md` and `.gitkeep` in `docs/workflow/plans/`, `docs/workflow/reviews/`, and `docs/workflow/setup/`.
4. Reset project-specific docs if they contain FreshForge-dev content.
5. Reset `.cursor/workflow/state.md` to match `state-template.md`.
6. Do **not** copy `docs/freshforge-development/` into target repos.

---

## How to Verify the Starter Is Clean

### Folder contents

```text
docs/workflow/plans/     → README.md, .gitkeep only
docs/workflow/reviews/   → README.md, .gitkeep only
docs/workflow/setup/     → README.md, .gitkeep only
```

### Workflow state

Open `.cursor/workflow/state.md` and confirm it matches `state-template.md` (all fields idle / not_started / none).

### Validation (development repo)

```bash
npm install   # if needed
npm run validate
npm run validate:starter
npm run export:starter
```

Structure validation checks required files, clean starter folders, idle state, and default install/export output.

### Search

Search starter-facing docs (exclude `docs/freshforge-development/`) for completed FreshForge phase names. No matches should appear outside the development archive.

---

## After Copying or Installing

| Target repository | Next step in Cursor |
|-------------------|---------------------|
| Existing codebase with application code | **Existing Project Intake** (`Intake`) |
| New or blank project | **New Project Bootstrap** (`Bootstrap`) |

---

## Revision History

| Date | Summary |
|------|---------|
| 2026-06-23 | Added starter surface reference (`docs/freshforge-development/distribution/STARTER_SURFACE.md`) |
| 2026-06-23 | Added install/export scripts; default package is AGENTS.md + .cursor + docs |
| 2026-06-23 | Initial packaging guide |
