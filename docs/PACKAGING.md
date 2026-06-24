# Packaging Guide

> How to ship, install, export, and verify a **clean** AppForge workflow starter package.

---

## Development Repo vs Clean Starter

| | AppForge development repo (GitHub) | Default install / export |
|--|-----------------------------------|--------------------------|
| Purpose | Build and maintain AppForge | Drop into another project |
| `docs/appforge-development/` | Maintainer history | **Excluded** |
| `docs/plans/`, `docs/reviews/` | Clean in starter; dev artifacts archived | Only `README.md` + `.gitkeep` |
| Validation tooling | Present in dev repo | Optional (`--include-validation`) |
| `README.md` | Full dev documentation | Optional (`--include-readme`) |
| `node_modules/` | Local only | **Never copied** |

The GitHub repository may include development tooling, CI, and `docs/appforge-development/`. The **default** install and export includes only `AGENTS.md`, `.cursor/`, and `docs/`.

---

## What Ships (Default)

| Area | Included |
|------|----------|
| Entry point | `AGENTS.md` |
| Cursor workflow | `.cursor/rules/`, `.cursor/agents/`, `.cursor/skills/`, `.cursor/workflow/`, `.cursor/hooks.json` |
| Baseline docs | `docs/AI_RULES.md`, `SECURITY.md`, `WORKFLOWS.md`, `TESTING.md`, `CODING_STANDARDS.md`, `DEPLOYMENT.md`, `DECISIONS.md`, `RISK_REGISTER.md`, `PACKAGING.md`, `INSTALLATION.md`, `DISTRIBUTION.md` |
| Project templates | `docs/PROJECT_BRIEF.md`, `ARCHITECTURE.md`, `DATA_MODEL.md`, `BACKEND.md`, `STYLE_GUIDE.md`, `ROADMAP.md`, `PROJECT_HEALTH.md`, `INTAKE_FINDINGS.md`, `TECH_DEBT.md` |
| Empty workflow folders | `docs/plans/`, `docs/reviews/`, `docs/setup/` (each with `README.md` and `.gitkeep` only) |
| Idle workflow state | `.cursor/workflow/state.md` from `state-template.md` (`Current Mode: idle`, `DONE: no`) |

### Optional with flags

| Flag | Adds |
|------|------|
| `--include-readme` | `README.md` (export) or `APPFORGE_README.md` (install) |
| `--include-validation` | `package.json`, `package-lock.json`, `scripts/`, `.markdownlint-cli2.jsonc`, `.github/workflows/validate.yml` |

---

## What Does Not Ship

| Item | Reason |
|------|--------|
| `docs/appforge-development/` | AppForge maintainer history only |
| Completed plans in `docs/plans/` | Filtered; only README + .gitkeep |
| Completed reviews in `docs/reviews/` | Same |
| `node_modules/` | Regenerate with `npm install` if using validation |
| `.git/`, `.env*`, logs, archives, temp folders | Local or target-specific |

---

## Install Into Another Repo (Recommended)

From the target project directory:

```bash
npx github:roasted-garlic/appforge install
```

Optional flags: `--include-readme`, `--include-validation`, `--target`, `--force`, `--dry-run`.

### Fallback (clone temp repo)

```bash
git clone https://github.com/roasted-garlic/appforge.git appforge-temp
node appforge-temp/scripts/install-appforge.mjs --target .
rm -rf appforge-temp
```

---

## Export a Clean Starter (Maintainers)

```bash
npm run export:starter              # → dist/appforge-starter/
npm run export:starter:full         # includes README + validation
node scripts/export-starter.mjs --clean --dry-run
```

Details: `docs/DISTRIBUTION.md`.

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

Archive completed phase plans and signoffs to `docs/appforge-development/plans/` and `docs/appforge-development/reviews/`. Starter-facing `docs/plans/` and `docs/reviews/` must remain clean (only `README.md` and `.gitkeep`).

### Manual checklist

1. Move completed plans from `docs/plans/` to `docs/appforge-development/plans/`.
2. Move completed reviews, test reports, and signoffs from `docs/reviews/` to `docs/appforge-development/reviews/`.
3. Leave only `README.md` and `.gitkeep` in `docs/plans/`, `docs/reviews/`, and `docs/setup/`.
4. Reset project-specific docs if they contain AppForge-dev content.
5. Reset `.cursor/workflow/state.md` to match `state-template.md`.
6. Do **not** copy `docs/appforge-development/` into target repos.

---

## How to Verify the Starter Is Clean

### Folder contents

```text
docs/plans/     → README.md, .gitkeep only
docs/reviews/   → README.md, .gitkeep only
docs/setup/     → README.md, .gitkeep only
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

Search starter-facing docs (exclude `docs/appforge-development/`) for completed AppForge phase names. No matches should appear outside the development archive.

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
| 2026-06-23 | Added install/export scripts; default package is AGENTS.md + .cursor + docs |
| 2026-06-23 | Initial packaging guide |
