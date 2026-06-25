# Signoff: Clean CLI Installer

| Field | Value |
|-------|-------|
| Date | 2026-06-23 |
| Final status | **approved** |

---

## Summary

Added `bin/freshforge.mjs` CLI with `install`, `export`, and `validate` commands. Refactored shared logic into `scripts/lib/run-install.mjs` and `scripts/lib/run-export.mjs`. Package renamed to `freshforge` with bin entry. Docs recommend `npx github:roasted-garlic/freshforge install`.

## Files Created

- `bin/freshforge.mjs`
- `scripts/lib/run-install.mjs`
- `scripts/lib/run-export.mjs`
- `scripts/lib/run-validate.mjs`

## Official Install Command

```bash
npx github:roasted-garlic/freshforge install
```

## Fallback

```bash
git clone https://github.com/roasted-garlic/freshforge.git freshforge-temp
node freshforge-temp/scripts/install-freshforge.mjs --target .
rm -rf freshforge-temp
```

## GitHub Readiness

**Yes** — push updated package to GitHub for `npx github:roasted-garlic/freshforge install`.
