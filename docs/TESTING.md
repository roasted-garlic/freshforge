# Testing

> AppForge workflow starter validation and testing expectations. For application projects using AppForge, customize commands during intake or bootstrap.

---

## Overview

This repository is a **markdown-only workflow starter**, not an application. Automated checks verify:

- Required AppForge files and folders exist
- Markdown formatting (markdownlint)
- Relative markdown link targets resolve

Application tests (unit, E2e, build) are added to target repos during intake or bootstrap.

---

## Required Checks Before Signoff

| Check | Command | When required |
|-------|---------|---------------|
| Structure | `npm run validate:structure` | Starter doc/structure changes |
| Markdown | `npm run validate:markdown` | Markdown changes |
| Links | `npm run validate:links` | Markdown with relative links |
| All validation | `npm run validate` | Before signoff on starter changes |

If Node is unavailable, run checks in CI or document why validation was skipped.

**Never claim tests passed unless they were actually run.**

---

## Commands Reference

### Prerequisites

- Node.js 18 or newer
- npm (bundled with Node)

```bash
# Install validation dependencies (first time only)
npm install

# Run all starter validation checks
npm run validate

# Starter-focused validation (structure + markdown + links)
npm run validate:starter

# Individual checks
npm run validate:structure
npm run validate:markdown
npm run validate:links
```

### Distribution and install scripts

```bash
# Recommended install (from target project)
npx github:roasted-garlic/appforge install
npx github:roasted-garlic/appforge install --dry-run

# CLI (local development)
node bin/appforge.mjs install --dry-run
node bin/appforge.mjs install --target ./tmp-install-test --dry-run
node bin/appforge.mjs export --dry-run

# Export clean starter to dist/appforge-starter/
npm run export:starter

# Legacy script entry points (fallback / development)
node scripts/install-appforge.mjs --target ./tmp-install-test --dry-run
```

### What each check does

| Script | Purpose |
|--------|---------|
| `validate:structure` | Required files, clean folders, idle workflow state, state-template mapping, default install/export output |
| `validate:markdown` | Markdownlint on `README.md`, `AGENTS.md`, and `docs/**/*.md` (see `.markdownlint-cli2.jsonc`) |
| `validate:links` | Relative `[text](path)` links point to existing files |
| `validate` / `validate:starter` | Runs all of the above in sequence |
| `export:starter` | Export default starter to `dist/appforge-starter/` |
| `export:starter:full` | Export with `--include-readme --include-validation` |
| `install:appforge` | Install starter via legacy script entry point |
| `bin/appforge.mjs` | CLI: `install`, `export`, `validate` |

**Markdown scope:** Focused rules only (`MD001`, `MD034`, `MD042`, `MD047`). `.cursor/` workflow templates are excluded to keep validation low-noise.

### Starter surface verification

The **starter surface** is the default installed product: `AGENTS.md`, `.cursor/`, `docs/`. See `docs/STARTER_SURFACE.md`.

```bash
npm run validate
npm run export:starter
```

After export, inspect `dist/appforge-starter/`:

| Check | Expected |
|-------|----------|
| Top-level roots | `AGENTS.md`, `.cursor/`, `docs/` only |
| `docs/STARTER_SURFACE.md` | Present in export |
| `docs/appforge-development/` | Absent |
| `.cursor/workflow/state.md` | Clean idle (from `state-template.md`) |
| Starter behavior changes | Visible in exported `.cursor/` and `docs/` |

Structure validation enforces starter surface rules automatically. Re-run export after starter surface changes to confirm they appear in `dist/appforge-starter/`.

### Manual inspection: export output

After `npm run export:starter`:

1. Open `dist/appforge-starter/`
2. Confirm top-level entries: `AGENTS.md`, `.cursor/`, `docs/` only (default)
3. Confirm `docs/appforge-development/` is absent
4. Confirm `docs/plans/`, `docs/reviews/`, `docs/setup/` contain only `README.md` and `.gitkeep`
5. Confirm `dist/appforge-starter/.cursor/workflow/state.md` matches `state-template.md` (no dev phase history)
6. Confirm no `node_modules/`, `.git/`, `.env`, or log files

### Manual inspection: install dry-run

```bash
node scripts/install-appforge.mjs --target ./tmp-install-test --dry-run
```

Confirm summary lists only `AGENTS.md`, `.cursor/`, and `docs/` for default install. Confirm dry-run shows `state-template.md → state.md` and does not copy development `state.md`. With `--include-readme`, expect `APPFORGE_README.md`. With `--include-validation`, expect `scripts/`, `package.json`, etc.

See `docs/INSTALLATION.md` and `docs/DISTRIBUTION.md` for full workflows.

---

## Test Types (Application Projects)

After copying AppForge into an application repo, intake or bootstrap should fill in:

### Unit Tests
- **Location:** `[TBD path]`
- **Framework:** `[Jest / Vitest / pytest / etc.]`

### Integration Tests
- **Location:** `[TBD]`

### E2E Tests
- **Location:** `[TBD]`
- **Framework:** `[Playwright / Cypress / etc.]`

### Backend / Rules Tests
- **Location:** `[TBD]`

---

## Manual Testing

| Area | Why manual | Last verified |
|------|------------|---------------|
| Cursor agent behavior | Requires IDE session | |
| Hooks configuration | Cursor version-specific | |

---

### Local validation order

`dist/` is **generated output** and is gitignored — do not commit it. Structure validation checks exported files under `dist/appforge-starter/`, so generate the export first:

```bash
npm run export:starter
npm run validate
```

Or run structure validation alone after export:

```bash
npm run export:starter
npm run validate:structure
```

---

## CI Expectations

| Platform | Config file | Checks run |
|----------|-------------|------------|
| GitHub Actions | `.github/workflows/validate.yml` | `npm ci` → `npm run export:starter` → `npm run validate` |

CI generates `dist/appforge-starter/` during the workflow because `dist/` is not committed. The export step must run **before** validation.

PRs to `main` / `master` should pass validation when CI is enabled.

---

## Coverage (if tracked)
- Tool: none (starter repo)
- Application repos: configure during intake

---

## Revision History

| Date | Summary |
|------|---------|
| 2026-06-23 | CI runs `export:starter` before `validate`; document local export-first order |
| 2026-06-23 | Added starter surface verification tests and `docs/STARTER_SURFACE.md` |
| 2026-06-23 | Added CLI install/export test commands (`bin/appforge.mjs`) |
| 2026-06-23 | Added workflow state-template install/export and full state validation |
| 2026-06-23 | Added distribution/install test commands and export inspection |
| 2026-06-23 | Added starter validation commands and CI |
| YYYY-MM-DD | Initial template |
