# External AI Assistant Packs

> Portable project snapshots for **ChatGPT** and **Claude** (web) projects. Upload these packs so you can discuss the app without pasting code each session.

`docs/` (project, architecture, standards, intake) remains the **source of truth** for FreshForge agents in Cursor, Codex, and Claude Code. This folder is a **derived export** optimized for external AI tools.

---

## Packs

| Pack | Path | Use for |
|------|------|---------|
| ChatGPT | [`chatgpt/`](./chatgpt/) | ChatGPT Projects / Custom GPTs |
| Claude | [`claude/`](./claude/) | Claude Projects / Claude.ai chats with uploads |

Each pack contains:

| File | Purpose |
|------|---------|
| `README.md` | How to upload and maintain the pack |
| `INSTRUCTIONS.md` | Copy-paste system / project instructions |
| `PROJECT-OVERVIEW.md` | Product, users, features, risks |
| `ARCHITECTURE-AND-CODE.md` | Stack, layout, data, deployment |
| `CURRENT-STATE.md` | **Living snapshot** — refresh often |

---

## Quick start

1. After intake or bootstrap, run **Assistant Handoff** (or skill `assistant-handoff`) to fill both packs from `docs/`.
2. Create a ChatGPT Project and/or Claude Project for this app.
3. Paste `INSTRUCTIONS.md` into the tool’s instructions field.
4. Upload `PROJECT-OVERVIEW.md`, `ARCHITECTURE-AND-CODE.md`, and `CURRENT-STATE.md`.
5. After Cursor work, re-upload at least `CURRENT-STATE.md` (or run **Refresh CURRENT-STATE**).

---

## Maintenance

| Trigger | Action |
|---------|--------|
| Behavior / feature change | Update overview + CURRENT-STATE (both packs) |
| Architecture / schema / env change | Update architecture + CURRENT-STATE |
| Managed phase signoff | Refresh CURRENT-STATE (mandatory); refresh others if behavior changed |
| Intake / bootstrap | Create or fully refresh both packs |

**Skill:** `.cursor/skills/assistant-handoff`  
**Also:** `.cursor/skills/documentation-update`

---

## Security

Never put secrets, API keys, `.env` values, or production credentials in these packs. They are meant to be uploaded to third-party AI products.
