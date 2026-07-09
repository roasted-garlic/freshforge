---
name: assistant-handoff
description: Create or refresh portable ChatGPT and Claude handoff packs under docs/assistants/ from project docs and workflow state.
---

# Assistant Handoff

## Command Aliases

If the user says any of the following (**case-insensitive**), run this skill:

`Assistant Handoff` · `Update Assistants` · `Refresh Assistants` · `Refresh CURRENT-STATE` · `Update ChatGPT Docs` · `Update Claude Docs`

## Purpose

Keep `docs/assistants/chatgpt/` and `docs/assistants/claude/` aligned with permanent project docs so users can upload packs to ChatGPT or Claude (web) without pasting the whole repo.

**Source of truth:** `docs/project/`, `docs/architecture/`, `docs/standards/`, `docs/intake/`, `.cursor/workflow/state.md`  
**Portable export:** `docs/assistants/`

## When to Use

- User asks for ChatGPT / Claude handoff docs
- After intake or bootstrap (create or fully refresh packs)
- After implement / test / signoff (at least `CURRENT-STATE.md`)
- When documentation-update notes assistant packs need refresh

## Modes

| User intent | Mode |
|-------------|------|
| First-time setup / intake / bootstrap | **Create or full refresh** both packs |
| `Refresh CURRENT-STATE` only | **CURRENT-STATE only** (both packs) |
| `Update ChatGPT Docs` / `Update Claude Docs` | Refresh **one** pack |
| Default `Assistant Handoff` / `Update Assistants` | Refresh both; prioritize CURRENT-STATE; update overview/architecture if docs changed |

## Steps

1. Read `.cursor/workflow/state.md` and relevant `docs/` (PROJECT_BRIEF, ARCHITECTURE, DATA_MODEL, BACKEND, ROADMAP, RISK_REGISTER, PROJECT_HEALTH, INTAKE_FINDINGS).
2. Determine mode from user message.
3. For **create / full refresh**:
   - Fill `PROJECT-OVERVIEW.md` from project docs (both packs — same content).
   - Fill `ARCHITECTURE-AND-CODE.md` from architecture/standards (both packs — same content).
   - Fill `CURRENT-STATE.md` from workflow state + health/risks (both packs).
   - Keep pack-specific `README.md` and `INSTRUCTIONS.md`; replace `[PROJECT_NAME]` and `[ONE_LINE_SUMMARY]` placeholders.
4. For **CURRENT-STATE only**: update Snapshot, What's In Flight, Recently Completed, Change Log in **both** packs.
5. Never invent product facts. Tag `[INFERRED]` / `[NEEDS HUMAN INPUT]` / `[TBD]`.
6. **Never** put secrets, API keys, or `.env` values in assistant packs.
7. Tell the user which files to re-upload (usually `CURRENT-STATE.md`).

## File map

```
docs/assistants/
  README.md
  chatgpt/   README, INSTRUCTIONS, PROJECT-OVERVIEW, ARCHITECTURE-AND-CODE, CURRENT-STATE
  claude/    README, INSTRUCTIONS, PROJECT-OVERVIEW, ARCHITECTURE-AND-CODE, CURRENT-STATE
```

Overview and architecture content should stay **identical** across chatgpt and claude; only README and INSTRUCTIONS differ by tool.

## Outputs

- Updated markdown under `docs/assistants/`
- Short summary: what changed, what to upload externally

## Stop Conditions

- Missing project docs → recommend intake/bootstrap first; leave templates with `[TBD]` rather than inventing
- Business/policy copy needs human approval → checkpoint
