# FreshForge — External AI Assistant Packs (Development Repo)

> **Maintainer-only.** These packs describe **FreshForge itself** for ChatGPT / Claude (web).  
> They are **not** installed into target projects. Starter templates for apps live in `docs/assistants/`.

---

## Packs

| Pack | Path |
|------|------|
| ChatGPT | [`chatgpt/`](./chatgpt/) |
| Claude | [`claude/`](./claude/) |

## How to use

1. Paste `INSTRUCTIONS.md` into the ChatGPT or Claude Project instructions field.
2. Upload `CURRENT-STATE.md`, `PROJECT-OVERVIEW.md`, and `ARCHITECTURE-AND-CODE.md`.
3. After FreshForge managed phases, refresh **CURRENT-STATE** in both packs (and overview/architecture if the product surface changed).

## vs starter templates

| Path | Audience | Installed? |
|------|----------|------------|
| `docs/assistants/` | Apps that install FreshForge | **Yes** (blank templates) |
| `docs/freshforge-development/assistants/` | FreshForge maintainers | **No** |
