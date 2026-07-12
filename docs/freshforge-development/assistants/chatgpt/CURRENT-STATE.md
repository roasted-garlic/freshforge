# FreshForge — Current State

> **Living snapshot** for FreshForge development. External assistants should read this first each session.

**Last updated:** 2026-07-11  
**Updated by:** human-checkpoint-next-prompt managed phase

---

## Snapshot

| Item | Value |
|------|-------|
| **Product status** | Active development; usable via GitHub install |
| **Overall health** | Good — validation green; distribution + migrate/doctor in place |
| **FreshForge version** | **0.2.2** (`.freshforge/version.json`) |
| **Test suite** | `npm run validate` + `validate:migrations` (structure, markdown, links, fixtures) |
| **Active managed phase** | None (idle) — human-checkpoint-next-prompt **signed off** |
| **P0 deferred** | npm publish for `npx freshforge` |

---

## What's In Flight

None. Workflow state is idle.

---

## Recently Completed

| Date | Milestone |
|------|-----------|
| 2026-07-11 | Suggested Next Prompt required on every human checkpoint pause — signed off |
| 2026-07-09 | External assistant handoff packs (`docs/assistants/` templates + skill) — signed off |
| 2026-07-09 | Multi-agent entry points (`CLAUDE.md` bridge) — signed off |
| 2026-07-09 | Migration and update system (`migrate`, `doctor`, version.json) — signed off |
| 2026-07-09 | Maintainer ChatGPT/Claude packs under `docs/freshforge-development/assistants/` |

---

## Current Shipped Behavior

- Install / export starter surface including `AGENTS.md`, `CLAUDE.md`, `.cursor/`, `docs/`, `.freshforge/`
- `docs/assistants/chatgpt` and `claude` **templates** for target apps
- CLI: install, export, migrate, doctor, validate
- Migrations: AppForge→FreshForge, CLAUDE.md bridge, assistant templates
- Cursor / Codex / Claude Code entry points documented

---

## Open Follow-ups

| Item | Status |
|------|--------|
| Publish to npm (`npx freshforge`) | Deferred |
| Auto-update CURRENT-STATE via hooks | Out of scope (skill-driven for now) |
| Keep maintainer packs in sync after each phase | Manual / skill on this folder |

---

## Recommended Next Steps

1. Use these packs in ChatGPT/Claude Projects for FreshForge planning discussions
2. After each FreshForge managed phase, refresh this `CURRENT-STATE.md` (and both packs)
3. Consider npm publish when ready for distribution

---

## Change Log

| Date | Change | Files / areas |
|------|--------|---------------|
| 2026-07-09 | Created maintainer assistant packs | `docs/freshforge-development/assistants/` |
| 2026-07-09 | Shipped app templates + assistant-handoff skill | `docs/assistants/`, `.cursor/skills/assistant-handoff/` |
| 2026-07-09 | Version 0.2.2 | `package.json`, `.freshforge/version.json` |
| 2026-07-09 | Fixed migrate: `--from appforge` now also runs CLAUDE + assistants upgrades; merge migrationHistory | `scripts/lib/freshforge-migrations.mjs` |

---

## How Maintainers Should Update This File

On every FreshForge managed-phase **implement**, **test**, or **signoff**:

1. Update **Last updated** and Snapshot
2. Move completed work to Recently Completed
3. Sync the same CURRENT-STATE into `claude/CURRENT-STATE.md`
4. If product surface changed, update PROJECT-OVERVIEW / ARCHITECTURE in both packs

Do **not** put FreshForge-specific filled content into `docs/assistants/` (those stay blank templates for apps).
