# Signoff: Distribution and Installer

| Field | Value |
|-------|-------|
| Date | 2026-06-23 |
| Signoff by | Signoff Agent |
| Plan | docs/appforge-development/plans/distribution-and-installer-plan.md |
| Review | docs/appforge-development/reviews/distribution-and-installer-review.md |
| Test report | docs/appforge-development/reviews/distribution-and-installer-test-report.md |
| Final status | **approved** |

---

## Summary

AppForge is ready as a GitHub development source with install and export scripts that deliver a clean starter by default (`AGENTS.md`, `.cursor/`, `docs/`). Optional flags add README and validation tooling. Development artifacts stay in `docs/appforge-development/` and are excluded from install/export output.

---

## Files Created

- `docs/appforge-development/distribution/INSTALLATION.md`
- `docs/appforge-development/distribution/DISTRIBUTION.md`
- `scripts/install-appforge.mjs`
- `scripts/export-starter.mjs`
- `scripts/lib/starter-distribution.mjs`
- `docs/appforge-development/plans/distribution-and-installer-plan.md`
- `docs/appforge-development/reviews/distribution-and-installer-review.md`
- `docs/appforge-development/reviews/distribution-and-installer-test-report.md`
- `docs/appforge-development/reviews/distribution-and-installer-signoff.md`

## Files Updated

- `README.md`
- `docs/appforge-development/distribution/PACKAGING.md`
- `docs/standards/TESTING.md`
- `docs/WORKFLOWS.md`
- `package.json`
- `scripts/validate-structure.mjs`
- `.gitignore`
- `.cursor/workflow/state.md` (reset to idle)

---

## Install Command

```bash
git clone https://github.com/roasted-garlic/appforge.git appforge-temp
node appforge-temp/scripts/install-appforge.mjs --target .
rm -rf appforge-temp
```

## Export Command

```bash
npm run export:starter
```

## Validation Commands

```bash
npm run validate
npm run validate:starter
```

---

## Default Install/Export Copies

- `AGENTS.md`
- `.cursor/`
- `docs/` (excluding `docs/appforge-development/` and non-starter artifacts in plans/reviews/setup)

## Optional Flags

| Flag | Adds |
|------|------|
| `--include-readme` | Install: `APPFORGE_README.md`; Export: `README.md` |
| `--include-validation` | `scripts/`, `package.json`, `package-lock.json`, `.markdownlint-cli2.jsonc`, `.github/workflows/validate.yml` |

## Always Excluded

`docs/appforge-development/`, generated plans/reviews artifacts, `node_modules/`, `.git/`, logs, archives, env files, temp/export folders.

---

## Tests

All required checks passed. See test report.

## Human Checkpoints

None required.

## GitHub Readiness

**Yes** — AppForge is ready to push to GitHub as the development source. Users clone and run `install-appforge.mjs`; maintainers use `export-starter.mjs` and `npm run validate` before push.

---

## Open Follow-ups

- GitHub repo published at `https://github.com/roasted-garlic/appforge`.
- Consider tagging a release after first push.
