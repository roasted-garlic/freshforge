# Starter Surface

> What FreshForge installs into target projects by default — the **distributed product** — versus what stays in the development repository only.

---

## What the Starter Surface Is

The **starter surface** is the set of files copied into new or existing application projects by the default install and export commands.

It is the product FreshForge distributes. Improvements to agent behavior, workflow gates, skills, and baseline documentation must land here if they are meant to affect installed projects.

### Starter surface (default)

| Path | Contents |
|------|----------|
| `AGENTS.md` | Universal AI entry point (canonical for Cursor and Codex) |
| `CLAUDE.md` | Thin Claude Code bridge (`@AGENTS.md` import) |
| `.cursor/` | Rules, agents, skills, workflow templates, command aliases, hooks, idle state template |
| `docs/` | Baseline docs, project templates, empty `workflow/plans/`, `workflow/reviews/`, `workflow/setup/` |
| `.freshforge/version.json` | Installation metadata (version, source, migration history) |

Default install command:

```bash
npx github:roasted-garlic/freshforge install
```

Default export:

```bash
npm run export:starter
```

Both copy **only** the starter surface unless optional flags are used.

---

## What Gets Installed by Default

### `AGENTS.md`

Session entry point, workflow summary, gates, and mode overview. **Single source of truth** for Cursor, Codex, and Claude Code (via `CLAUDE.md`).

### `CLAUDE.md`

Thin bridge for **Claude Code**. Imports `@AGENTS.md` at session start. Do not duplicate full rules here — edit `AGENTS.md` for shared instructions.

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
| External AI packs | `assistants/chatgpt/`, `assistants/claude/` (templates; fill via `assistant-handoff`) |
| Active phase work | `workflow/plans/`, `workflow/reviews/`, `workflow/setup/` (README + `.gitkeep` only in clean starter) |

Distribution, installation, packaging, and starter-surface maintainer docs live under `docs/freshforge-development/distribution/` in the **development repo only** — not in installed projects.

### Not installed by default

- `README.md` (FreshForge dev documentation)
- `package.json` / `package-lock.json`
- `scripts/` (install, export, validation)
- `.github/` (CI)
- `.markdownlint-cli2.jsonc`
- `docs/freshforge-development/` (maintainer history)
- `reference/` (maintainer example handoff packs only)
- `.freshforge/backups/` (migration backups — created in target projects only)
- `node_modules/`, `dist/`, env files, logs, archives, temp folders

---

## Optional Flags

| Flag | Adds to target |
|------|----------------|
| `--include-readme` | `FRESHFORGE_README.md` (install) or `README.md` (export) |
| `--include-validation` | `scripts/`, `package.json`, `package-lock.json`, `.markdownlint-cli2.jsonc`, `.github/workflows/validate.yml` |

Optional flags do **not** add `docs/freshforge-development/` or development workflow history.

---

## Development-Only Files

These support building and maintaining FreshForge. They may change how maintainers work on the repo but **do not affect installed projects** unless optional flags are used.

| Path | Purpose |
|------|---------|
| `scripts/` | Install, export, validation, shared distribution logic |
| `package.json` / `package-lock.json` | Dev dependencies and CLI bin |
| `.github/` | CI validation workflow |
| `.markdownlint-cli2.jsonc` | Markdown lint config |
| `README.md` | FreshForge development repo overview |
| `docs/freshforge-development/` | Completed phase plans, reviews, signoffs |
| `node_modules/` | Local npm dependencies |
| `dist/` | Local export output |
| `freshforge-temp/`, `tmp-install-test/`, etc. | Temp install/export folders |

**Distribution tools** (`bin/freshforge.mjs`, `scripts/install-freshforge.mjs`, `scripts/export-starter.mjs`) are development-only. They **deliver** the starter surface; they are not part of the default installed product.

---

## How to Classify FreshForge Improvements

Every FreshForge managed phase should classify impact in one or more areas:

| Area | Examples | Affects installed projects? |
|------|----------|----------------------------|
| **Starter Surface** | Rule changes, new skills, workflow gate updates, baseline doc changes | **Yes** — if default install is run again |
| **Development Tooling** | Validation scripts, markdownlint, CI workflow | Only with `--include-validation` |
| **Distribution/Installer** | CLI, install/export scripts, `starter-distribution.mjs` | Changes how surface is delivered, not what default surface contains |
| **Documentation** | Dev-only guides, `STARTER_SURFACE.md` itself | Surface docs yes; dev-only docs no |
| **Development History** | Phase plans/signoffs | **No** — archive under `docs/freshforge-development/` |

### Decision guide

| Question | If yes → |
|----------|----------|
| Should agents behave differently in **installed** projects? | Update **starter surface** (`.cursor/`, `AGENTS.md`, starter-facing `docs/`) |
| Should validation or CI change for **maintainers only**? | **Development tooling** |
| Should install/export commands change? | **Distribution/installer** |
| Is this a record of building FreshForge itself? | **Development history** → `docs/freshforge-development/` |

### Common mistakes to avoid

- Changing starter behavior only in `docs/freshforge-development/` or dev-only scripts
- Putting completed FreshForge phase history in `docs/workflow/plans/` or `docs/workflow/reviews/`
- Assuming changes to `scripts/` affect installed projects (they do not by default)
- Shipping `docs/freshforge-development/` in install/export output

---

## How to Know Whether a Change Affects Target Projects

1. **Check the path** — Is the file under `AGENTS.md`, `.cursor/`, or `docs/` (excluding `docs/freshforge-development/`)? → Affects surface.
2. **Run a dry-run** — `npx github:roasted-garlic/freshforge install --dry-run` or `node bin/freshforge.mjs install --dry-run`.
3. **Export and inspect** — `npm run export:starter` then open `dist/freshforge-starter/`.
4. **Read the plan** — Managed phases must list impact area and starter files changed.

Installed projects are affected when users re-run install with `--force`, run `freshforge migrate`, or receive a new export. Existing targets are not auto-updated.

### Upgrade path

```bash
npx github:roasted-garlic/freshforge doctor
npx github:roasted-garlic/freshforge migrate --dry-run
npx github:roasted-garlic/freshforge migrate
```

See `docs/freshforge-development/migrations/README.md` for migration registry details.

---

## How to Verify the Starter Surface

### Automated

```bash
npm run validate
npm run export:starter
```

Structure validation checks:

- `docs/freshforge-development/distribution/STARTER_SURFACE.md` exists in the **development repo**
- Default export roots: `AGENTS.md`, `CLAUDE.md`, `.cursor/`, `docs/`, `.freshforge/` only
- `docs/freshforge-development/` excluded from export/install
- Exported `state.md` is clean idle (from `state-template.md`)
- `docs/workflow/plans/`, `docs/workflow/reviews/`, `docs/workflow/setup/` contain only README + `.gitkeep`
- Reorganized doc folders present: `docs/project/`, `docs/architecture/`, `docs/standards/`, `docs/intake/`

### Manual

1. Inspect `dist/freshforge-starter/` after export.
2. Confirm top-level: `AGENTS.md`, `CLAUDE.md`, `.cursor/`, `docs/`, `.freshforge/`.
3. Confirm `docs/AI_RULES.md`, `docs/WORKFLOWS.md`, and subfolders `project/`, `architecture/`, `standards/`, `intake/` are present.
4. Confirm `docs/freshforge-development/` and legacy flat paths (`docs/INSTALLATION.md`, etc.) are absent.
5. Confirm no `node_modules/`, `scripts/`, or `.github/` (unless full export with `--include-validation`).

---

## Related Documentation

- `docs/freshforge-development/distribution/DISTRIBUTION.md` — install/export model
- `docs/freshforge-development/distribution/PACKAGING.md` — packaging checklist
- `docs/freshforge-development/distribution/INSTALLATION.md` — user install workflows
- `AGENTS.md` — Starter Surface Awareness section

---

## Revision History

| Date | Summary |
|------|---------|
| 2026-07-11 | Required Suggested Next Prompt on every human checkpoint pause |
| 2026-07-09 | Added `docs/assistants/` ChatGPT and Claude handoff packs + skill |
| 2026-07-09 | Added `CLAUDE.md` for Claude Code; multi-agent entry points |
| 2026-06-24 | Added `.freshforge/version.json`; migrate/doctor upgrade path |
| 2026-06-23 | Initial starter surface definition |
