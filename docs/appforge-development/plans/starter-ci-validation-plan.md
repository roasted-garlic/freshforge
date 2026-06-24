# Plan: Starter CI Validation

| Field | Value |
|-------|-------|
| Date | 2026-06-23 |
| Author | Planning Agent |
| Status | ready_for_review |
| Workflow | managed-phase |
| Related | docs/reviews/starter-ci-validation-review.md |

---

## Goal

Add lightweight, low-maintenance validation so the AppForge workflow starter can verify required structure, markdown formatting, and internal markdown links locally and in CI.

## Background

The starter is markdown-only with no `package.json` or CI today. Copy-paste adopters and contributors need a simple way to catch broken docs, missing workflow files, and bad links before merge.

## Scope

### In Scope
- Minimal `package.json` (private, validation-only; not an application)
- Scripts: `validate`, `validate:structure`, `validate:markdown`, `validate:links`
- `scripts/validate-structure.mjs` — required AppForge files and folders
- `scripts/validate-links.mjs` — relative/internal markdown link targets
- `markdownlint-cli2` for markdown formatting
- `.gitignore` for `node_modules`
- GitHub Actions workflow (standard for reusable starters; no external account beyond GitHub)
- Document commands in `README.md` and `docs/TESTING.md`
- ADR in `docs/DECISIONS.md`

### Out of Scope
- Application source code
- Runtime/deploy validation
- External URL checking (network-flaky; internal links only)
- Heavy lint ecosystems (ESLint, Prettier for code)

---

## Affected Areas

### Files / Modules (expected)
- `package.json`, `package-lock.json` (new)
- `.gitignore` (new)
- `.markdownlint-cli2.jsonc` (new)
- `scripts/validate-structure.mjs` (new)
- `scripts/validate-links.mjs` (new)
- `.github/workflows/validate.yml` (new)
- `README.md`, `docs/TESTING.md`, `docs/DECISIONS.md`
- `.cursor/workflow/state.md`

### Architecture Impact
- [x] None — validation is orthogonal to workflow layers

### Security Impact
- [x] None — dev-only tooling; no secrets

### Data Model Impact
- [x] None

### Backend Impact
- [x] None

### UI / UX Impact
- [x] None

### Migration Impact
- [x] None

---

## Approach

1. Add private `package.json` with single devDependency: `markdownlint-cli2`
2. Structure script checks paths from README repository layout
3. Links script walks `**/*.md`, parses `[text](path)` relative links, verifies files exist
4. Markdown script runs `markdownlint-cli2` with lenient config (disable noisy rules for starter docs)
5. `validate` runs all three in sequence
6. GitHub Actions: Node 20, `npm ci`, `npm run validate` on push/PR
7. Update README (Validation section) and TESTING.md (commands + CI)

### Dependency justification
- `markdownlint-cli2`: maintained markdown linter; avoids hand-rolling style rules
- Link/structure checks: Node stdlib only (no extra packages)

---

## Test Strategy

### Automated
| Check | Command | Required |
|-------|---------|----------|
| Structure | `npm run validate:structure` | yes |
| Markdown | `npm run validate:markdown` | yes |
| Links | `npm run validate:links` | yes |
| All | `npm run validate` | yes |

### Manual
- [ ] README explains validation for adopters
- [ ] CI workflow file is valid YAML

---

## Human Checkpoints Anticipated
- [x] None — GitHub Actions is standard; no secrets or external setup

---

## Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| markdownlint flags existing doc style | medium | Lenient config; fix only blocking issues |
| Adopters without Node | low | Document that validation is optional for copy-paste |
| node_modules in repo | low | `.gitignore` |

---

## Rollback Plan

Remove `package.json`, scripts, workflow, and revert doc updates.

---

## Documentation Updates Required
- [x] README.md
- [x] TESTING.md
- [x] DECISIONS.md (ADR-003)

---

## Open Questions
- [x] None

---

## Approval
- Review doc: docs/reviews/starter-ci-validation-review.md
- Verdict: pending
