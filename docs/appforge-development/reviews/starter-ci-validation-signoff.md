# Signoff: Starter CI Validation

| Field | Value |
|-------|-------|
| Date | 2026-06-23 |
| Signoff by | Signoff Agent |
| Plan | docs/plans/starter-ci-validation-plan.md |
| Review | docs/reviews/starter-ci-validation-review.md |
| Test report | docs/reviews/starter-ci-validation-test-report.md |
| Final status | **approved** |

---

## Summary

Added lightweight validation for the AppForge workflow starter: structure checks, focused markdown linting, internal link verification, npm scripts, GitHub Actions CI, and documentation in `README.md` and `docs/TESTING.md`. No application source code.

---

## Changes Delivered

### Behavior
- `npm run validate` runs structure, markdown, and link checks in sequence
- CI runs the same validation on push/PR to `main` or `master`
- Adopters may omit validation files when copying into app repos

### Files Created
- `package.json`, `package-lock.json`
- `.gitignore`
- `.markdownlint-cli2.jsonc`
- `scripts/validate-structure.mjs`
- `scripts/validate-links.mjs`
- `.github/workflows/validate.yml`
- `docs/plans/starter-ci-validation-plan.md`
- `docs/reviews/starter-ci-validation-review.md`
- `docs/reviews/starter-ci-validation-test-report.md`
- `docs/reviews/starter-ci-validation-signoff.md`

### Files Modified
- `README.md` — Validation section, limitations update, quick reference
- `docs/TESTING.md` — commands, CI, markdown scope
- `docs/DECISIONS.md` — ADR-003
- `docs/ROADMAP.md` — Phase 0 exit criteria
- `.cursor/workflow/state.md`

---

## Tests

### Exact command output

#### `npm run validate:structure`

```
> validate:structure
> node scripts/validate-structure.mjs

Structure validation passed (28 files, 9 directories).
```

Exit code: **0**

#### `npm run validate:markdown`

```
> validate:markdown
> markdownlint-cli2

markdownlint-cli2 v0.17.2 (markdownlint v0.37.4)
Finding: README.md AGENTS.md docs/**/*.md !node_modules/**
Linting: 28 file(s)
Summary: 0 error(s)
```

Exit code: **0**

#### `npm run validate:links`

```
> validate:links
> node scripts/validate-links.mjs

Link validation passed (64 markdown files checked).
```

Exit code: **0**

#### `npm run validate`

```
> validate
> npm run validate:structure && npm run validate:markdown && npm run validate:links

> validate:structure
> node scripts/validate-structure.mjs

Structure validation passed (28 files, 9 directories).

> validate:markdown
> markdownlint-cli2

markdownlint-cli2 v0.17.2 (markdownlint v0.37.4)
Finding: README.md AGENTS.md docs/**/*.md !node_modules/**
Linting: 28 file(s)
Summary: 0 error(s)

> validate:links
> node scripts/validate-links.mjs

Link validation passed (64 markdown files checked).
```

Exit code: **0**

### Manual
| Test | Result |
|------|--------|
| README documents validation | PASS |
| TESTING.md documents all scripts | PASS |
| CI workflow present | PASS |

---

## Human Approvals Obtained
| Approval | Status |
|----------|--------|
| Production deploy | not required |
| External account setup | not required (GitHub Actions uses repo only) |

---

## Risks & Known Issues

| Item | Severity | Mitigation |
|------|----------|------------|
| npm audit moderate advisories in dev deps | low | Track; upgrade markdownlint-cli2 when convenient |
| Markdown lint excludes `.cursor/` templates | low | Documented in TESTING.md; intentional low-noise scope |
| Local validation requires Node 18+ | low | Documented; CI covers PRs |

---

## Deferred Items (Roadmap)
- First application bootstrap when user defines a real app
- Optional: expand markdown lint scope to `.cursor/` after template cleanup phase

---

## Open Blockers
- [x] None

---

## Verdict

**approved** — Starter validation and CI in place.

---

## Workflow Complete
- [x] `.cursor/workflow/state.md` updated with `DONE: yes`
- [x] ROADMAP.md updated
- [x] RISK_REGISTER.md — no changes required

**Recommended next action:** Push to GitHub to enable CI, or run **New Project Bootstrap** / **Existing Project Intake** on a target app.
