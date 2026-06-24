# Distribution Guide

> How AppForge is developed, exported, and installed as a clean workflow starter.

---

The GitHub repository may include development tooling, CI, and `docs/appforge-development/`. The **starter surface** — the product installed by default — is defined in `docs/appforge-development/distribution/STARTER_SURFACE.md`.

| | AppForge development repo | Starter surface (default install) |
|--|---------------------------|-----------------------------------|
| **Product** | Builds and maintains AppForge | What target projects receive |
| **Default paths** | Full repo | `AGENTS.md`, `.cursor/`, `docs/` only |
| **Install/export scripts** | Distribution tools | Not included by default |

---

## Development Repo vs Clean Starter

| | AppForge development repo (this GitHub repo) | Target project after default install |
|--|---------------------------------------------|--------------------------------------|
| Purpose | Build and maintain AppForge | Run agent-driven development in your app |
| `docs/appforge-development/` | Maintainer plans, reviews, signoffs | **Not copied** |
| `docs/workflow/plans/`, `docs/workflow/reviews/` | Clean in starter; dev history archived | Only `README.md` + `.gitkeep` |
| Validation tooling | `package.json`, `scripts/`, `.github/` | Optional via `--include-validation` |
| `README.md` | Full AppForge documentation | Optional via `--include-readme` (as `APPFORGE_README.md` on install) |
| `node_modules/` | Local dev dependency | **Never copied or committed** |

This working repository is **not** the final shipped artifact for end users. It is the **source** from which a clean starter is installed or exported.

---

## Default Install and Export

Both the `appforge` CLI and `install-appforge.mjs` / `export-starter.mjs` copy **only** these paths by default:

- `AGENTS.md`
- `.cursor/`
- `docs/` (with exclusions below)

They do **not** include by default:

- `README.md`
- `package.json` / `package-lock.json`
- `scripts/`
- `.github/`

### Optional README

- **Install:** `--include-readme` → `APPFORGE_README.md` (preserves target `README.md`)
- **Export:** `--include-readme` → `README.md` in output folder

### Optional validation

`--include-validation` adds:

- `scripts/`
- `package.json`
- `package-lock.json`
- `.markdownlint-cli2.jsonc`
- `.github/workflows/validate.yml`

---

## What Is Copied Into a Target Project

### Always (default)

| Area | Contents |
|------|----------|
| `AGENTS.md` | Session entry point |
| `.cursor/rules/`, `agents/`, `skills/`, `workflow/`, `hooks.json` | Agent workflow system |
| `docs/` | Baseline docs, project templates, empty `plans/` / `reviews/` / `setup/` |

### Never copied

| Item | Reason |
|------|--------|
| `docs/appforge-development/` | Maintainer-only history |
| Completed plans/reviews in starter folders | Dev artifacts filtered out |
| `node_modules/` | Regenerate with `npm install` if using validation |
| `.git/` | Target project has its own repository |
| `.env`, `.env.*` | Secrets stay local |
| `*.log`, `logs/` | Local runtime output |
| `*.zip`, `*.tar`, archives | Local packaging artifacts |
| `dist/`, `appforge-temp/`, `tmp-install-test/` | Local export and test folders |

---

## Export a Clean Starter

From the AppForge development repository:

```bash
# Default export → dist/appforge-starter/
npm run export:starter

# Remove previous output and export fresh
node scripts/export-starter.mjs --clean

# Full export with README and validation tooling
npm run export:starter:full

# Preview without writing files
node scripts/export-starter.mjs --dry-run
```

Custom output path:

```bash
node scripts/export-starter.mjs --out ./my-export --clean
```

---

## Verify Export Output

1. **Inspect folder structure:**

   ```text
   dist/appforge-starter/
     AGENTS.md
     .cursor/
     docs/          (no appforge-development/)
   ```

2. **Confirm exclusions:** no `node_modules/`, `.git/`, `docs/appforge-development/`, or env files.

3. **Confirm clean workflow folders:**

   ```text
   docs/workflow/plans/     → README.md, .gitkeep only
   docs/workflow/reviews/   → README.md, .gitkeep only
   docs/workflow/setup/     → README.md, .gitkeep only
   ```

4. **Run development-repo validation** (export first — `dist/` is not committed):

   ```bash
   npm run export:starter
   npm run validate
   ```

5. **Test install dry-run** against a temp folder (see `docs/standards/TESTING.md`).

---

## Prepare Before Pushing to GitHub

1. Ensure `docs/workflow/plans/`, `docs/workflow/reviews/`, and `docs/workflow/setup/` contain only `README.md` and `.gitkeep` in starter-facing locations.
2. Archive completed managed-phase artifacts under `docs/appforge-development/`.
3. Reset `.cursor/workflow/state.md` to match `state-template.md` in the dev repo (install/export always ship the template as `state.md`).
4. Confirm `.gitignore` excludes `node_modules/`, `dist/`, env files, logs, and local temp folders.
5. Run export then validation locally (same order as CI):

   ```bash
   npm run export:starter
   npm run validate
   ```

6. Do **not** commit `node_modules/` or `dist/` — `dist/` is generated by export and recreated in CI.

---

## Why `node_modules` Must Never Be Committed or Copied

- Dependencies are environment-specific and large.
- Validation tooling is optional in target projects (`--include-validation`).
- Targets run `npm install` themselves when they opt into validation.
- Copying `node_modules` risks shipping incompatible or vulnerable packages.

---

## Why `docs/appforge-development/` Stays in the Development Repo Only

This folder records AppForge maintenance history: completed plans, reviews, test reports, and signoffs from building the starter itself. Target application projects should not receive this context — they start with clean `docs/workflow/plans/` and `docs/workflow/reviews/` for their own work.

Install and export scripts **always exclude** `docs/appforge-development/`.

### Clean workflow state

The AppForge **development repo** uses `.cursor/workflow/state.md` during Managed Phases and may contain phase history, decision logs, and signoff status.

**Installed and exported starters never receive that file.** Install and export map:

- **Source:** `.cursor/workflow/state-template.md` (canonical idle starter state)
- **Target:** `.cursor/workflow/state.md` (what agents read in the target project)

The live development `state.md` is excluded from install/export output. `state-template.md` is also copied as a reusable reference template.

---

## Install From GitHub

**Recommended:**

```bash
npx github:roasted-garlic/appforge install
```

**Fallback** (if CLI unavailable):

```bash
git clone https://github.com/roasted-garlic/appforge.git appforge-temp
node appforge-temp/scripts/install-appforge.mjs --target .
rm -rf appforge-temp
```

---

## Related Documentation

- `docs/appforge-development/distribution/STARTER_SURFACE.md` — starter surface definition (installed product)
- `docs/appforge-development/distribution/INSTALLATION.md` — end-user install workflows
- `docs/appforge-development/distribution/PACKAGING.md` — manual cleanup and packaging checklist
- `docs/standards/TESTING.md` — validation and install/export test commands

---

## Revision History

| Date | Summary |
|------|---------|
| 2026-06-23 | CI runs export before validate; `dist/` is generated, not committed |
| 2026-06-23 | Added starter surface definition reference (`docs/appforge-development/distribution/STARTER_SURFACE.md`) |
| 2026-06-23 | Added workflow state-template install/export behavior |
| 2026-06-23 | Initial distribution guide with install/export model |
