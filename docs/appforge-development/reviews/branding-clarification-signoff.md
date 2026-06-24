# Signoff: Branding Clarification — AppForge Canonical Naming

| Field | Value |
|-------|-------|
| Date | 2026-06-23 |
| Signoff by | Signoff Agent |
| Plan | docs/appforge-development/plans/branding-clarification-plan.md |
| Review | docs/appforge-development/reviews/branding-clarification-review.md |
| Test report | docs/appforge-development/reviews/branding-clarification-test-report.md |
| Final status | **approved** |

---

## Summary

Standardized the reusable Cursor workflow starter under the canonical name **AppForge**. Removed confusing dual-naming (`AppForge / BuildPilot`, `BuildPilot workflow starter`) from entry-point documentation. Added **Naming Standard** sections to `README.md` and `AGENTS.md`, context notes to project-specific template docs, and ADR-002 in `DECISIONS.md`. No application code or workflow model changes.

---

## Changes Delivered

### Behavior
- AppForge is the single canonical name for the workflow starter in user-facing docs
- BuildPilot retained only in clearly labeled historical contexts (Naming Standard table, ADR-002)
- Template docs (`PROJECT_BRIEF`, `ARCHITECTURE`, etc.) clarify they describe target applications, not the starter itself

### Files Created
- docs/appforge-development/plans/branding-clarification-plan.md
- docs/appforge-development/reviews/branding-clarification-review.md
- docs/appforge-development/reviews/branding-clarification-test-report.md
- docs/appforge-development/reviews/branding-clarification-signoff.md

### Files Modified
- README.md
- AGENTS.md
- docs/AI_RULES.md
- docs/WORKFLOWS.md
- docs/project/PROJECT_BRIEF.md
- docs/architecture/ARCHITECTURE.md
- docs/project/ROADMAP.md
- docs/intake/INTAKE_FINDINGS.md
- docs/project/PROJECT_HEALTH.md
- docs/project/TECH_DEBT.md
- docs/project/DECISIONS.md
- .cursor/workflow/state.md

### Documentation Updated
- Naming Standard in README.md and AGENTS.md
- ADR-002 in DECISIONS.md
- AppForge starter notes on template docs
- ROADMAP Phase 0 updated for starter documentation

---

## Tests

### Automated
- `rg -i BuildPilot` — exit 0; remaining references audited as historical or workflow artifacts

### Manual
| Test | Result | Approved by |
|------|--------|-------------|
| README.md AppForge consistency | PASS | agent |
| AGENTS.md AppForge consistency | PASS | agent |
| Starter vs application clarity | PASS | agent |

---

## Human Approvals Obtained
| Approval | Status | Date | Notes |
|----------|--------|------|-------|
| Production deploy | not required | | |
| Database migration | not required | | |
| Design / UX | not required | | |
| Business / policy | not required | | |
| Secrets / env | not required | | |

---

## Risks & Known Issues

| Item | Severity | Mitigation / follow-up |
|------|----------|------------------------|
| Local folder may still be named BuildPilot | low | Documented in Naming Standard; optional manual rename |

---

## Deferred Items (Roadmap)
- First application bootstrap when user defines a real app (Phase 1)
- Optional: rename local git folder/remote to AppForge (outside repo content)

---

## Open Blockers
- [x] None

---

## Verdict

**approved** — Branding clarification complete. AppForge is canonical; BuildPilot is historical only.

---

## Workflow Complete
- [x] `.cursor/workflow/state.md` updated with `DONE: yes`
- [x] ROADMAP.md updated
- [x] RISK_REGISTER.md updated if needed (no changes required)

**Recommended next action for user:** Run **New Project Bootstrap** or copy AppForge into an application repo and run **Existing Project Intake**.
