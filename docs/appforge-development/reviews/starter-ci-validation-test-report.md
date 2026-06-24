# Test Report: Starter CI Validation

| Field | Value |
|-------|-------|
| Date | 2026-06-23 |
| Tester | Test Agent |
| Plan | docs/plans/starter-ci-validation-plan.md |
| Result | **passed** |

---

## Commands Run

### `npm install`

```
added 80 packages, and audited 81 packages in 2s
```

Exit code: 0

### `npm run validate:structure`

```
> validate:structure
> node scripts/validate-structure.mjs

Structure validation passed (28 files, 9 directories).
```

Exit code: 0

### `npm run validate:markdown`

```
> validate:markdown
> markdownlint-cli2

markdownlint-cli2 v0.17.2 (markdownlint v0.37.4)
Finding: README.md AGENTS.md docs/**/*.md !node_modules/**
Linting: 28 file(s)
Summary: 0 error(s)
```

Exit code: 0

### `npm run validate:links`

```
> validate:links
> node scripts/validate-links.mjs

Link validation passed (64 markdown files checked).
```

Exit code: 0

### `npm run validate`

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

Exit code: 0

---

## Notes

- `npm audit` reported 4 moderate vulnerabilities in transitive devDependencies; not addressed in this phase (validation-only tooling).
- Markdown lint is scoped to entry docs (`README.md`, `AGENTS.md`, `docs/**`) with focused rules to avoid mass template reformatting.

---

## Verdict

**passed** — Ready for signoff.
