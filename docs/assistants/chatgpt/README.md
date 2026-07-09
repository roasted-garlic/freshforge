# ChatGPT Handoff Docs

> Self-contained project context for a **ChatGPT Project** (or Custom GPT). Upload these files so you can discuss **[PROJECT_NAME]** without pasting code each session.

**Last updated:** [TBD]

---

## What This Folder Is

| File | Purpose | Update frequency |
|------|---------|------------------|
| `PROJECT-OVERVIEW.md` | Product, users, features, workflows, integrations, risks | When product behavior or features change |
| `ARCHITECTURE-AND-CODE.md` | Stack, folder layout, routes, data model, scripts, deployment | When structure, APIs, or schema change |
| `CURRENT-STATE.md` | **Living snapshot** — active work, recent changes, health, blockers | **Every managed phase** (implement, test, signoff) |
| `INSTRUCTIONS.md` | ChatGPT Project Instructions prompt (copy-paste) | When handoff process or behavior rules change |

`docs/` remains the **source of truth** for Cursor/FreshForge agents. This folder is a **portable export** for ChatGPT.

---

## How to Use with ChatGPT

1. Create a ChatGPT **Project** (or Custom GPT) for **[PROJECT_NAME]**.
2. Paste **`INSTRUCTIONS.md`** into the Project **Instructions** field (copy the block between the markers).
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

---

## Related Docs (not uploaded to ChatGPT)

| Area | Location |
|------|----------|
| Full permanent docs | `docs/project/`, `docs/architecture/`, `docs/standards/` |
| Workflow state | `.cursor/workflow/state.md` |
| Active plans | `docs/workflow/plans/` |
| Sibling Claude pack | `docs/assistants/claude/` |
