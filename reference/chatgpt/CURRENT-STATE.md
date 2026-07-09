# ViewMyCOA.com — Current State

> **Living snapshot** — update this file every time the app changes (implement, test, or signoff). ChatGPT should read this first each session.

**Last updated:** 2026-07-09  
**Updated by:** Initial ChatGPT handoff creation

---

## Snapshot

| Item | Value |
|------|-------|
| **App status** | In production use `[INFERRED]` at viewmycoa.com |
| **Overall health** | Needs attention — security and testing gaps |
| **FreshForge version** | 0.2.0 (`.freshforge/version.json`) |
| **Test suite** | None |
| **Active managed phase** | Internal Label Maker — **plan complete, review pending** |
| **P0 deferred** | Security-hardening phase not yet started (by choice for label maker work) |

---

## What's In Flight

### Internal Label Maker (managed phase)

| Gate | Status |
|------|--------|
| Plan | ✅ Complete — `docs/workflow/plans/internal-label-maker-plan.md` |
| Review | ⏳ Pending human approval |
| Implement | ❌ Not started |
| Test | ❌ Not started |
| Signoff | ❌ Not started |

**Goal:** Add an internal label maker that can replace CraftMyPDF when enabled in Settings:

- Settings toggle: CraftMyPDF vs Internal Label Maker
- Template layout editor (2×1, 3×2, 4×6 inch presets) with drag-and-drop attribute placement
- In Internal mode: templates = attribute scaffold + label layout; PDF Template selects internal template (not CraftMyPDF)
- Product Label preview = generated static image (no label image upload)
- Generate PDF uses internal maker
- CraftMyPDF path unchanged when switch is off

**Human checkpoint:** Confirm open questions or accept proposed defaults (units/DPI, fields, editor chrome, label_qty, barcode, preview storage, PDF Template labeling).

**Workflow state file:** `.cursor/workflow/state.md`

---

## Recently Completed

| Date | Milestone |
|------|-----------|
| 2026-07-09 | Existing Project Intake — full docs baseline from code inspection |
| 2026-07-09 | FreshForge workflow kit installed (v0.2.0) |
| 2026-07-09 | Internal Label Maker plan written and revised |
| 2026-07-09 | ChatGPT handoff docs created (`chatgpt/` folder) |

---

## Current Production Behavior (unchanged)

These features work today; no code changes shipped yet for Internal Label Maker:

- Product CRUD with JSON attributes, images, COA upload
- CraftMyPDF label PDF generation
- Public batch search at `/` and `/batch/<batch_number>`
- Square catalog sync (sandbox/production toggle)
- User management (admin-only)
- Dev/prod asset sync scripts

---

## Open Risks (unchanged)

| ID | Risk | Status |
|----|------|--------|
| R-001 | Weak/missing FLASK_SECRET_KEY | Open |
| R-002 | Default admin/admin credentials | Open |
| R-003 | Unauthenticated dev sync APIs | Open |
| R-004 | No automated tests | Open |
| R-008 | Some destructive APIs not admin-gated | Open |

Do not weaken these during feature work.

---

## Recommended Next Steps (workflow)

1. **Review** Internal Label Maker plan (approve / changes / block)
2. **Implement** after review approval
3. **Test** and sign off Internal Label Maker phase
4. **Start** security-hardening phase (P0) when approved

---

## Change Log

| Date | Change | Files / areas |
|------|--------|---------------|
| 2026-07-09 | Created ChatGPT handoff folder | `chatgpt/README.md`, `PROJECT-OVERVIEW.md`, `ARCHITECTURE-AND-CODE.md`, `CURRENT-STATE.md` |
| 2026-07-09 | Intake docs populated | `docs/project/`, `docs/architecture/`, `docs/intake/` |
| 2026-07-09 | Internal Label Maker plan revised | `docs/workflow/plans/internal-label-maker-plan.md` |

---

## How Agents Should Update This File

On every **implement**, **test**, or **signoff** step:

1. Set **Last updated** date at top
2. Update **Snapshot** table (health, active phase, test status)
3. Move completed work to **Recently Completed**
4. Update **What's In Flight** gates
5. Add row to **Change Log**
6. If behavior changed, also update `PROJECT-OVERVIEW.md` and/or `ARCHITECTURE-AND-CODE.md`

Skill: `.cursor/skills/documentation-update`  
Rule: `.cursor/rules/documentation.mdc`
