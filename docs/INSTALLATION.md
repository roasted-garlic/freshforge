# Installation Guide

> How to install AppForge into a new or existing project from the GitHub development repository.

---

## What Gets Installed

### Default install

The default install command copies **only**:

| Path | Description |
|------|-------------|
| `AGENTS.md` | Universal AI entry point |
| `.cursor/` | Rules, agents, skills, workflow state, hooks |
| `docs/` | Baseline and project-template documentation |

It does **not** copy by default:

- `README.md`
- `package.json` / `package-lock.json`
- `scripts/` (validation tooling)
- `.github/` (CI workflow)
- `docs/appforge-development/` (maintainer history)

### Optional flags

| Flag | Effect |
|------|--------|
| `--include-readme` | Copy AppForge `README.md` as `APPFORGE_README.md` (never overwrites an existing `README.md`) |
| `--include-validation` | Also copy `scripts/`, `package.json`, `package-lock.json`, `.markdownlint-cli2.jsonc`, `.github/workflows/validate.yml` |
| `--force` | Overwrite existing target files that would otherwise conflict |
| `--dry-run` | Print what would be copied, skipped, blocked, or excluded without writing files |

Combine flags for a fuller install:

```bash
node appforge-temp/scripts/install-appforge.mjs --target . --include-readme --include-validation
```

---

## Prerequisites

- **Node.js 18+** (to run the install script)
- **Git** (to clone the AppForge repository)
- A target project directory (existing repo or new folder)

Official repository: [roasted-garlic/appforge](https://github.com/roasted-garlic/appforge).

---

## Workflow A: Existing Project Install

Install AppForge into a repository that already has application code:

```bash
git clone https://github.com/roasted-garlic/appforge.git appforge-temp
node appforge-temp/scripts/install-appforge.mjs --target .
rm -rf appforge-temp
```

Then open the project in **Cursor** and run:

**Existing Project** (or `Intake`, `Analyze this repo`)

---

## Workflow B: New Blank Project Install

Create a new folder, initialize your app repo, and install AppForge:

```bash
mkdir my-new-app
cd my-new-app
git clone https://github.com/roasted-garlic/appforge.git appforge-temp
node appforge-temp/scripts/install-appforge.mjs --target .
rm -rf appforge-temp
```

Then open the project in **Cursor** and run:

**New Project** or **Bootstrap**

---

## Workflow C: Optional README Install

Copy AppForge documentation as `APPFORGE_README.md` without touching your project `README.md`:

```bash
node appforge-temp/scripts/install-appforge.mjs --target . --include-readme
```

---

## Workflow D: Optional Validation Install

Include validation scripts and CI for maintaining workflow docs in the target repo:

```bash
node appforge-temp/scripts/install-appforge.mjs --target . --include-validation
```

After install, run `npm install` and `npm run validate` in the target project.

---

## Workflow E: Full Helper Install

README plus validation tooling:

```bash
node appforge-temp/scripts/install-appforge.mjs --target . --include-readme --include-validation
```

---

## Workflow F: After Install

| Target | Next step in Cursor |
|--------|---------------------|
| Existing codebase with app code | **Existing Project** / **Intake** |
| New or blank project | **New Project** / **Bootstrap** |

Intake inspects the codebase and fills `PROJECT_HEALTH.md`, `INTAKE_FINDINGS.md`, and `TECH_DEBT.md`. Bootstrap runs a questionnaire and generates project docs before any app implementation.

---

## Conflict Behavior

The install script **does not overwrite** existing files unless you pass `--force`:

| Existing target file | Behavior |
|---------------------|----------|
| `AGENTS.md` | Conflict — use `--force` to replace |
| Any file under `.cursor/` | Conflict |
| Any file under `docs/` | Conflict |
| `APPFORGE_README.md` (with `--include-readme`) | Conflict |
| `README.md` | Never overwritten; AppForge README goes to `APPFORGE_README.md` |

Run with `--dry-run` first to preview actions:

```bash
node appforge-temp/scripts/install-appforge.mjs --target . --dry-run
```

---

## What Is Always Excluded

Even when copying `docs/`, the install script skips:

- `docs/appforge-development/`
- Generated artifacts in `docs/plans/`, `docs/reviews/`, `docs/setup/` (only `README.md` and `.gitkeep` are copied)
- `node_modules/`, `.git/`, logs, archives, `.env` files, temp folders, and local export directories

---

## Related Documentation

- `docs/DISTRIBUTION.md` — development repo vs clean starter
- `docs/PACKAGING.md` — manual packaging checklist
- Root `README.md` — quick start and validation overview

---

## Revision History

| Date | Summary |
|------|---------|
| 2026-06-23 | Initial installation guide with install script workflows |
