# ChatGPT Handoff Docs

> Self-contained project context for external AI assistants (ChatGPT, Claude web, etc.). Upload these files to a ChatGPT project or custom GPT so you can discuss ViewMyCOA without pasting code each session.

**Last updated:** 2026-07-09

---

## What This Folder Is

| File | Purpose | Update frequency |
|------|---------|------------------|
| `PROJECT-OVERVIEW.md` | Product, users, features, workflows, integrations, risks | When product behavior or features change |
| `ARCHITECTURE-AND-CODE.md` | Stack, folder layout, routes, data model, scripts, deployment | When structure, APIs, or schema change |
| `CURRENT-STATE.md` | **Living snapshot** — active work, recent changes, health, blockers | **Every managed phase** (implement, test, signoff) |
| `INSTRUCTIONS.md` | ChatGPT Project Instructions prompt (copy-paste) | When handoff process or behavior rules change |

`docs/` remains the **source of truth** for Cursor/FreshForge agents. This folder is a **portable export** optimized for upload to other AI tools.

---

## How to Use with ChatGPT

1. Create a ChatGPT **Project** (or Custom GPT) for ViewMyCOA.
2. Paste **`INSTRUCTIONS.md`** into the Project **Instructions** field (copy the block between the markers).
3. Upload all three handoff markdown files as project knowledge.
4. After app changes in Cursor, re-upload the updated files (especially `CURRENT-STATE.md`).

### Full instructions prompt

See **`INSTRUCTIONS.md`** — copy-paste ready for ChatGPT Project Instructions. Covers casual chat behavior, doc reading order, guardrails, and what to help with vs avoid.

---

## FreshForge Maintenance Rules

Agents working in this repo **must** keep this folder aligned with `docs/`:

| Trigger | Action |
|---------|--------|
| Behavior or feature change | Update `PROJECT-OVERVIEW.md` and `CURRENT-STATE.md` |
| Architecture, routes, schema, or env change | Update `ARCHITECTURE-AND-CODE.md` and `CURRENT-STATE.md` |
| End of managed phase (signoff) | Refresh all three; `CURRENT-STATE.md` is mandatory |
| Intake or bootstrap | Create or refresh handoff docs from `docs/` |

Use skill: `.cursor/skills/documentation-update`  
Rule: `.cursor/rules/documentation.mdc`

---

## Related Docs (not uploaded to ChatGPT)

| Area | Location |
|------|----------|
| Full permanent docs | `docs/project/`, `docs/architecture/`, `docs/standards/` |
| Workflow state | `.cursor/workflow/state.md` |
| Active plans | `docs/workflow/plans/` |
