# Installation Guide

> How to install FreshForge into a new or existing project.

---

## Recommended Install (CLI)

From your **target project directory** (existing repo or new folder):

```bash
npx github:roasted-garlic/freshforge install
```

No temporary clone or cleanup required. Default install copies **only** `AGENTS.md`, `.cursor/`, `docs/`, and `.freshforge/version.json`.

### Optional flags

```bash
npx github:roasted-garlic/freshforge install --include-readme
npx github:roasted-garlic/freshforge install --include-validation
npx github:roasted-garlic/freshforge install --target ../some-project
npx github:roasted-garlic/freshforge install --dry-run
npx github:roasted-garlic/freshforge install --force
```

### Future npm command

When published to npm:

```bash
npx freshforge install
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
- `docs/freshforge-development/` (maintainer history)
- `node_modules/`, `dist/`, env files, logs, archives, temp folders

### Optional flags

| Flag | Effect |
|------|--------|
| `--include-readme` | Copy FreshForge `README.md` as `FRESHFORGE_README.md` |
| `--include-validation` | Also copy validation scripts, `package.json`, CI workflow |
| `--target <path>` | Install into a directory (default: current working directory) |
| `--force` | Overwrite existing target files |
| `--dry-run` | Preview without writing files |

---

## Prerequisites

- **Node.js 18+**
- A target project directory

Official repository: [roasted-garlic/freshforge](https://github.com/roasted-garlic/freshforge).

---

## Workflow A: Existing Project Install

```bash
cd my-existing-app
npx github:roasted-garlic/freshforge install
```

Open in **Cursor** and run **Existing Project** (or `Intake`).

---

## Workflow B: New Blank Project Install

```bash
mkdir my-new-app && cd my-new-app
npx github:roasted-garlic/freshforge install
```

Open in **Cursor** and run **New Project** or **Bootstrap**.

---

## Workflow C: Optional README Install

```bash
npx github:roasted-garlic/freshforge install --include-readme
```

---

## Workflow D: Optional Validation Install

```bash
npx github:roasted-garlic/freshforge install --include-validation
```

Then in the target project: `npm install` and `npm run validate`.

---

## Workflow E: Full Helper Install

```bash
npx github:roasted-garlic/freshforge install --include-readme --include-validation
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
git clone https://github.com/roasted-garlic/freshforge.git freshforge-temp
node freshforge-temp/scripts/install-freshforge.mjs --target .
rm -rf freshforge-temp
```

On Windows PowerShell: `Remove-Item -Recurse -Force freshforge-temp`

---

---

## Workflow G: Upgrade Existing Installation (Migrate)

If the project already has an older **AppForge** or **FreshForge** workflow installation:

```bash
npx github:roasted-garlic/freshforge doctor
npx github:roasted-garlic/freshforge migrate --dry-run
npx github:roasted-garlic/freshforge migrate
```

### Migrate options

| Flag | Effect |
|------|--------|
| `--target <path>` | Target project directory (default: cwd) |
| `--dry-run` | Preview planned changes without writing |
| `--from appforge` | Hint legacy AppForge source |
| `--force-workflow` | Overwrite FreshForge-controlled workflow files from current starter |

Migrate **preserves** project-specific docs under `docs/project/`, `docs/architecture/`, `docs/standards/`, and `docs/intake/`. It **never** modifies application source, `.env`, Firebase config, or target `package.json`.

Backups are written to `.freshforge/backups/<timestamp>/` before changes.

### Future npm command

```bash
npx freshforge migrate
npx freshforge doctor
```

---

## Workflow H: Inspect Installation (Doctor)

Read-only health check:

```bash
npx github:roasted-garlic/freshforge doctor
npx github:roasted-garlic/freshforge doctor --target ../some-project
```

Doctor reports installed version, legacy AppForge references, old doc layout, and recommended fix commands.

---

## Conflict Behavior

The installer does not overwrite existing files unless you pass `--force`. Run `--dry-run` first to preview.

---

## Related Documentation

- `docs/freshforge-development/distribution/DISTRIBUTION.md` — development repo vs clean starter
- `docs/freshforge-development/distribution/PACKAGING.md` — manual packaging checklist
- Root `README.md` — quick start

---

## Revision History

| Date | Summary |
|------|---------|
| 2026-06-24 | Added migrate and doctor upgrade workflows; `.freshforge/version.json` in default install |
| 2026-06-23 | Added recommended `npx github:roasted-garlic/freshforge install` CLI flow |
| 2026-06-23 | Initial installation guide |
