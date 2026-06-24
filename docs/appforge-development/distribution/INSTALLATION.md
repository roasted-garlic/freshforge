# Installation Guide

> How to install AppForge into a new or existing project.

---

## Recommended Install (CLI)

From your **target project directory** (existing repo or new folder):

```bash
npx github:roasted-garlic/appforge install
```

No temporary clone or cleanup required. Default install copies **only** `AGENTS.md`, `.cursor/`, and `docs/`.

### Optional flags

```bash
npx github:roasted-garlic/appforge install --include-readme
npx github:roasted-garlic/appforge install --include-validation
npx github:roasted-garlic/appforge install --target ../some-project
npx github:roasted-garlic/appforge install --dry-run
npx github:roasted-garlic/appforge install --force
```

### Future npm command

When published to npm:

```bash
npx appforge install
```

---

## What Gets Installed

### Default install

| Path | Description |
|------|-------------|
| `AGENTS.md` | Universal AI entry point |
| `.cursor/` | Rules, agents, skills, workflow state, hooks |
| `docs/` | Baseline and project-template documentation |

Clean idle workflow state is written from `.cursor/workflow/state-template.md` → `.cursor/workflow/state.md`.

### Not copied by default

- `README.md`
- `package.json` / `package-lock.json`
- `scripts/` (validation tooling)
- `.github/` (CI workflow)
- `docs/appforge-development/` (maintainer history)
- `node_modules/`, `dist/`, env files, logs, archives, temp folders

### Optional flags

| Flag | Effect |
|------|--------|
| `--include-readme` | Copy AppForge `README.md` as `APPFORGE_README.md` |
| `--include-validation` | Also copy validation scripts, `package.json`, CI workflow |
| `--target <path>` | Install into a directory (default: current working directory) |
| `--force` | Overwrite existing target files |
| `--dry-run` | Preview without writing files |

---

## Prerequisites

- **Node.js 18+**
- A target project directory

Official repository: [roasted-garlic/appforge](https://github.com/roasted-garlic/appforge).

---

## Workflow A: Existing Project Install

```bash
cd my-existing-app
npx github:roasted-garlic/appforge install
```

Open in **Cursor** and run **Existing Project** (or `Intake`).

---

## Workflow B: New Blank Project Install

```bash
mkdir my-new-app && cd my-new-app
npx github:roasted-garlic/appforge install
```

Open in **Cursor** and run **New Project** or **Bootstrap**.

---

## Workflow C: Optional README Install

```bash
npx github:roasted-garlic/appforge install --include-readme
```

---

## Workflow D: Optional Validation Install

```bash
npx github:roasted-garlic/appforge install --include-validation
```

Then in the target project: `npm install` and `npm run validate`.

---

## Workflow E: Full Helper Install

```bash
npx github:roasted-garlic/appforge install --include-readme --include-validation
```

---

## Workflow F: After Install

| Target | Next step in Cursor |
|--------|---------------------|
| Existing codebase with app code | **Existing Project** / **Intake** |
| New or blank project | **New Project** / **Bootstrap** |

---

## Fallback Install (clone temp repo)

Use only if the CLI is unavailable:

```bash
git clone https://github.com/roasted-garlic/appforge.git appforge-temp
node appforge-temp/scripts/install-appforge.mjs --target .
rm -rf appforge-temp
```

On Windows PowerShell: `Remove-Item -Recurse -Force appforge-temp`

---

## Conflict Behavior

The installer does not overwrite existing files unless you pass `--force`. Run `--dry-run` first to preview.

---

## Related Documentation

- `docs/appforge-development/distribution/DISTRIBUTION.md` — development repo vs clean starter
- `docs/appforge-development/distribution/PACKAGING.md` — manual packaging checklist
- Root `README.md` — quick start

---

## Revision History

| Date | Summary |
|------|---------|
| 2026-06-23 | Added recommended `npx github:roasted-garlic/appforge install` CLI flow |
| 2026-06-23 | Initial installation guide |
