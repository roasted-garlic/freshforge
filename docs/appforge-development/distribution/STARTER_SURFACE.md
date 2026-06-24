# Starter Surface

> What AppForge installs into target projects by default — the **distributed product** — versus what stays in the development repository only.

---

## What the Starter Surface Is

The **starter surface** is the set of files copied into new or existing application projects by the default install and export commands.

It is the product AppForge distributes. Improvements to agent behavior, workflow gates, skills, and baseline documentation must land here if they are meant to affect installed projects.

### Starter surface (default)

| Path | Contents |
|------|----------|
| `AGENTS.md` | Universal AI entry point |
| `.cursor/` | Rules, agents, skills, workflow templates, command aliases, hooks, idle state template |
| `docs/` | Baseline docs, project templates, empty `workflow/plans/`, `workflow/reviews/`, `workflow/setup/` |

Default install command:

```bash
npx github:roasted-garlic/appforge install
```

Default export:

```bash
npm run export:starter
```

Both copy **only** the starter surface unless optional flags are used.

---

## What Gets Installed by Default

### `AGENTS.md`

Session entry point, workflow summary, gates, and mode overview.

### `.cursor/`

| Area | Starter-facing content |
|------|------------------------|
| `rules/` | Agent behavior instructions |
| `agents/` | Specialist role definitions |
| `skills/` | Intake, bootstrap, managed phase, safe-change workflows |
| `workflow/` | State template, plan/review templates, command aliases, checklists |
| `hooks.json` | Session and tool safety hooks |

**Note:** Live development `state.md` is **not** shipped. Install/export map `state-template.md` → `state.md` so targets start idle.

### `docs/`

| Category | Path |
|----------|------|
| Core workflow | `AI_RULES.md`, `WORKFLOWS.md` (docs root) |
| Project context | `project/PROJECT_BRIEF.md`, `ROADMAP.md`, `PROJECT_HEALTH.md`, `TECH_DEBT.md`, `DECISIONS.md`, `RISK_REGISTER.md` |
| Architecture | `architecture/ARCHITECTURE.md`, `BACKEND.md`, `DATA_MODEL.md` |
| Standards | `standards/CODING_STANDARDS.md`, `STYLE_GUIDE.md`, `SECURITY.md`, `TESTING.md`, `DEPLOYMENT.md` |
| Intake | `intake/INTAKE_FINDINGS.md` |
| Active phase work | `workflow/plans/`, `workflow/reviews/`, `workflow/setup/` (README + `.gitkeep` only in clean starter) |

Distribution, installation, packaging, and starter-surface maintainer docs live under `docs/appforge-development/distribution/` in the **development repo only** — not in installed projects.

### Not installed by default

- `README.md` (AppForge dev documentation)
- `package.json` / `package-lock.json`
- `scripts/` (install, export, validation)
- `.github/` (CI)
- `.markdownlint-cli2.jsonc`
- `docs/appforge-development/` (maintainer history)
- `node_modules/`, `dist/`, env files, logs, archives, temp folders

---

## Optional Flags

| Flag | Adds to target |
|------|----------------|
| `--include-readme` | `APPFORGE_README.md` (install) or `README.md` (export) |
| `--include-validation` | `scripts/`, `package.json`, `package-lock.json`, `.markdownlint-cli2.jsonc`, `.github/workflows/validate.yml` |

Optional flags do **not** add `docs/appforge-development/` or development workflow history.

---

## Development-Only Files

These support building and maintaining AppForge. They may change how maintainers work on the repo but **do not affect installed projects** unless optional flags are used.

| Path | Purpose |
|------|---------|
| `scripts/` | Install, export, validation, shared distribution logic |
| `package.json` / `package-lock.json` | Dev dependencies and CLI bin |
| `.github/` | CI validation workflow |
| `.markdownlint-cli2.jsonc` | Markdown lint config |
| `README.md` | AppForge development repo overview |
| `docs/appforge-development/` | Completed phase plans, reviews, signoffs |
| `node_modules/` | Local npm dependencies |
| `dist/` | Local export output |
| `appforge-temp/`, `tmp-install-test/`, etc. | Temp install/export folders |

**Distribution tools** (`bin/appforge.mjs`, `scripts/install-appforge.mjs`, `scripts/export-starter.mjs`) are development-only. They **deliver** the starter surface; they are not part of the default installed product.

---

## How to Classify AppForge Improvements

Every AppForge managed phase should classify impact in one or more areas:

| Area | Examples | Affects installed projects? |
|------|----------|----------------------------|
| **Starter Surface** | Rule changes, new skills, workflow gate updates, baseline doc changes | **Yes** — if default install is run again |
| **Development Tooling** | Validation scripts, markdownlint, CI workflow | Only with `--include-validation` |
| **Distribution/Installer** | CLI, install/export scripts, `starter-distribution.mjs` | Changes how surface is delivered, not what default surface contains |
| **Documentation** | Dev-only guides, `STARTER_SURFACE.md` itself | Surface docs yes; dev-only docs no |
| **Development History** | Phase plans/signoffs | **No** — archive under `docs/appforge-development/` |

### Decision guide

| Question | If yes → |
|----------|----------|
| Should agents behave differently in **installed** projects? | Update **starter surface** (`.cursor/`, `AGENTS.md`, starter-facing `docs/`) |
| Should validation or CI change for **maintainers only**? | **Development tooling** |
| Should install/export commands change? | **Distribution/installer** |
| Is this a record of building AppForge itself? | **Development history** → `docs/appforge-development/` |

### Common mistakes to avoid

- Changing starter behavior only in `docs/appforge-development/` or dev-only scripts
- Putting completed AppForge phase history in `docs/workflow/plans/` or `docs/workflow/reviews/`
- Assuming changes to `scripts/` affect installed projects (they do not by default)
- Shipping `docs/appforge-development/` in install/export output

---

## How to Know Whether a Change Affects Target Projects

1. **Check the path** — Is the file under `AGENTS.md`, `.cursor/`, or `docs/` (excluding `docs/appforge-development/`)? → Affects surface.
2. **Run a dry-run** — `npx github:roasted-garlic/appforge install --dry-run` or `node bin/appforge.mjs install --dry-run`.
3. **Export and inspect** — `npm run export:starter` then open `dist/appforge-starter/`.
4. **Read the plan** — Managed phases must list impact area and starter files changed.

Installed projects are affected when users re-run install with `--force`, or when they receive a new export. Existing targets are not auto-updated.

---

## How to Verify the Starter Surface

### Automated

```bash
npm run validate
npm run export:starter
```

Structure validation checks:

- `docs/appforge-development/distribution/STARTER_SURFACE.md` exists in the **development repo**
- Default export roots: `AGENTS.md`, `.cursor/`, `docs/` only
- `docs/appforge-development/` excluded from export/install
- Exported `state.md` is clean idle (from `state-template.md`)
- `docs/workflow/plans/`, `docs/workflow/reviews/`, `docs/workflow/setup/` contain only README + `.gitkeep`
- Reorganized doc folders present: `docs/project/`, `docs/architecture/`, `docs/standards/`, `docs/intake/`

### Manual

1. Inspect `dist/appforge-starter/` after export.
2. Confirm top-level: `AGENTS.md`, `.cursor/`, `docs/`.
3. Confirm `docs/AI_RULES.md`, `docs/WORKFLOWS.md`, and subfolders `project/`, `architecture/`, `standards/`, `intake/` are present.
4. Confirm `docs/appforge-development/` and legacy flat paths (`docs/INSTALLATION.md`, etc.) are absent.
5. Confirm no `node_modules/`, `scripts/`, or `.github/` (unless full export with `--include-validation`).

---

## Related Documentation

- `docs/appforge-development/distribution/DISTRIBUTION.md` — install/export model
- `docs/appforge-development/distribution/PACKAGING.md` — packaging checklist
- `docs/appforge-development/distribution/INSTALLATION.md` — user install workflows
- `AGENTS.md` — Starter Surface Awareness section

---

## Revision History

| Date | Summary |
|------|---------|
| 2026-06-23 | Initial starter surface definition |
