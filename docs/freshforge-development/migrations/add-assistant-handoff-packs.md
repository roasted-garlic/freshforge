# Migration: add-assistant-handoff-packs

| Field | Value |
|-------|-------|
| id | `add-assistant-handoff-packs` |
| from | `freshforge`, `partial`, `unknown` |
| to | `0.2.2` |
| Date | 2026-07-09 |

---

## Purpose

Add `docs/assistants/` ChatGPT and Claude handoff **templates** to existing FreshForge installs that lack them.

## Safety

- Syncs only **missing** or empty/stub template files
- **Never** overwrites populated `PROJECT-OVERVIEW.md`, `ARCHITECTURE-AND-CODE.md`, or `CURRENT-STATE.md` that no longer look like starter templates
- Does not install `reference/`

## Verification

```bash
node bin/freshforge.mjs doctor --target ./dist/freshforge-starter
node bin/freshforge.mjs migrate --dry-run
```
