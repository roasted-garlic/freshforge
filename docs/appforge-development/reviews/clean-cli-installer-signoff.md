# Signoff: Clean CLI Installer

| Field | Value |
|-------|-------|
| Date | 2026-06-23 |
| Final status | **approved** |

---

## Summary

Added `bin/appforge.mjs` CLI with `install`, `export`, and `validate` commands. Refactored shared logic into `scripts/lib/run-install.mjs` and `scripts/lib/run-export.mjs`. Package renamed to `appforge` with bin entry. Docs recommend `npx github:roasted-garlic/appforge install`.

## Files Created

- `bin/appforge.mjs`
- `scripts/lib/run-install.mjs`
- `scripts/lib/run-export.mjs`
- `scripts/lib/run-validate.mjs`

## Official Install Command

```bash
npx github:roasted-garlic/appforge install
```

## Fallback

```bash
git clone https://github.com/roasted-garlic/appforge.git appforge-temp
node appforge-temp/scripts/install-appforge.mjs --target .
rm -rf appforge-temp
```

## GitHub Readiness

**Yes** — push updated package to GitHub for `npx github:roasted-garlic/appforge install`.
