# Migration: add-claude-md-bridge

| Field | Value |
|-------|-------|
| id | `add-claude-md-bridge` |
| from | `freshforge`, `partial`, `unknown` |
| to | `0.2.1` |
| Date | 2026-07-09 |

---

## Purpose

Add root `CLAUDE.md` to existing FreshForge installations so **Claude Code** loads the same instructions as Cursor and Codex, without duplicating `AGENTS.md`.

## Actions

1. Sync `CLAUDE.md` from current starter (thin `@AGENTS.md` bridge)
2. Append `add-claude-md-bridge` to `.freshforge/version.json` `migrationHistory`

Skipped when `CLAUDE.md` already has meaningful content (unless `--force-workflow`).

## Verification

```bash
node bin/freshforge.mjs doctor --target ./test-fixtures/current-freshforge-install
node bin/freshforge.mjs migrate --target ./test-fixtures/current-freshforge-install --dry-run
```
