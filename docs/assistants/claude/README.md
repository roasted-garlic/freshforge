# Claude Handoff Docs

> Self-contained project context for a **Claude Project** (or Claude.ai chat with file uploads). Upload these files so you can discuss **[PROJECT_NAME]** without pasting code each session.

**Last updated:** [TBD]

---

## What This Folder Is

| File | Purpose | Update frequency |
|------|---------|------------------|
| `PROJECT-OVERVIEW.md` | Product, users, features, workflows, integrations, risks | When product behavior or features change |
| `ARCHITECTURE-AND-CODE.md` | Stack, folder layout, routes, data model, scripts, deployment | When structure, APIs, or schema change |
| `CURRENT-STATE.md` | **Living snapshot** — active work, recent changes, health, blockers | **Every managed phase** (implement, test, signoff) |
| `INSTRUCTIONS.md` | Claude Project / custom instructions prompt (copy-paste) | When handoff process or behavior rules change |

`docs/` remains the **source of truth** for Cursor/FreshForge agents (including Claude Code via `CLAUDE.md`). This folder is a **portable export** for Claude **web** / Projects — not a replacement for repo-local Claude Code instructions.

---

## How to Use with Claude

1. Create a Claude **Project** for **[PROJECT_NAME]** (or start a chat and attach files).
2. Paste **`INSTRUCTIONS.md`** into the Project **custom instructions** / instructions field (copy the block between the markers).
3. Upload as project knowledge:
   - `CURRENT-STATE.md`
   - `PROJECT-OVERVIEW.md`
   - `ARCHITECTURE-AND-CODE.md`
4. After app changes in Cursor, re-upload updated files (especially `CURRENT-STATE.md`).

---

## FreshForge Maintenance Rules

| Trigger | Action |
|---------|--------|
| Behavior or feature change | Update `PROJECT-OVERVIEW.md` and `CURRENT-STATE.md` |
| Architecture, routes, schema, or env change | Update `ARCHITECTURE-AND-CODE.md` and `CURRENT-STATE.md` |
| End of managed phase (signoff) | Refresh content docs; `CURRENT-STATE.md` is mandatory |
| Intake or bootstrap | Create or refresh handoff docs from `docs/` |

**Skill:** `.cursor/skills/assistant-handoff`  
**Also:** `.cursor/skills/documentation-update`

Keep this pack aligned with `docs/assistants/chatgpt/` — same facts, Claude-specific instructions only.

---

## Related Docs (not uploaded to Claude web)

| Area | Location |
|------|----------|
| Full permanent docs | `docs/project/`, `docs/architecture/`, `docs/standards/` |
| Workflow state | `.cursor/workflow/state.md` |
| Active plans | `docs/workflow/plans/` |
| Sibling ChatGPT pack | `docs/assistants/chatgpt/` |
| Claude Code in-repo bridge | `CLAUDE.md` (imports `AGENTS.md`) |
