# FreshForge — Claude Code entry point

@AGENTS.md

## Claude-specific notes

This project uses the **FreshForge** workflow starter. `AGENTS.md` is the canonical instruction file for all agents.

**Start every session:**

1. Read `docs/AI_RULES.md` — detailed behavior, gates, and reading order
2. Read `.cursor/workflow/state.md` — current mode, phase, blockers, next step
3. Obey **Allowed Actions** and **Forbidden Actions** in workflow state

Do not maintain a parallel rule set in this file. Edit `AGENTS.md` for shared project instructions.

**Tool coverage:** Cursor and Codex read `AGENTS.md` directly; Claude Code loads it via this file.
