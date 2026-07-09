# [PROJECT_NAME] — Current State

> **Living snapshot** — update this file every time the app changes (implement, test, or signoff). External assistants should read this first each session.

**Last updated:** [TBD]  
**Updated by:** [TBD]

---

## Snapshot

| Item | Value |
|------|-------|
| **App status** | [TBD] — e.g. early development / staging / production |
| **Overall health** | [TBD] |
| **FreshForge version** | See `.freshforge/version.json` |
| **Test suite** | [TBD] |
| **Active managed phase** | [TBD] or none |
| **P0 deferred** | [TBD] or none |

---

## What's In Flight

### [PHASE_NAME] (managed phase)

| Gate | Status |
|------|--------|
| Plan | Not started / Complete |
| Review | Pending / Approved / Blocked |
| Implement | Not started / In progress / Complete |
| Test | Not started / Passed / Failed documented |
| Signoff | Not started / Approved |

**Goal:** [TBD]

**Workflow state file:** `.cursor/workflow/state.md`

---

## Recently Completed

| Date | Milestone |
|------|-----------|
| [TBD] | |

---

## Current Production / Shipped Behavior

Features that work today (unchanged by in-flight work):

- [TBD]

---

## Open Risks

| ID | Risk | Status |
|----|------|--------|
| [TBD] | | Open |

Do not weaken security during feature work.

---

## Recommended Next Steps (workflow)

1. [TBD]

---

## Change Log

| Date | Change | Files / areas |
|------|--------|---------------|
| [TBD] | Created assistant handoff pack | `docs/assistants/` |

---

## How Agents Should Update This File

On every **implement**, **test**, or **signoff** step:

1. Set **Last updated** date at top
2. Update **Snapshot** table (health, active phase, test status)
3. Move completed work to **Recently Completed**
4. Update **What's In Flight** gates
5. Add row to **Change Log**
6. If behavior changed, also update `PROJECT-OVERVIEW.md` and/or `ARCHITECTURE-AND-CODE.md` in **both** `chatgpt/` and `claude/` packs

**Skill:** `.cursor/skills/assistant-handoff`  
**Rule:** `.cursor/rules/documentation.mdc`
