# Plan: Branding Clarification — AppForge Canonical Naming

| Field | Value |
|-------|-------|
| Date | 2026-06-23 |
| Author | Planning Agent |
| Status | ready_for_review |
| Workflow | managed-phase |
| Related | docs/appforge-development/reviews/branding-clarification-review.md |

---

## Goal

Standardize the reusable Cursor workflow starter under the canonical name **AppForge** and remove confusing **BuildPilot** / **BuildPilot-AppForge** dual-naming. Docs must clearly describe this repository as a workflow starter kit, not an application.

## Background

The starter was introduced with overlapping names (AppForge as working name, BuildPilot as folder/repo label). Three explicit `BuildPilot` references remain in `README.md`, `AGENTS.md`, and `docs/WORKFLOWS.md`. Canonical naming reduces agent and user confusion when copying the starter into other repos.

## Scope

### In Scope
- Replace `BuildPilot` references with `AppForge` where they describe the current project
- Add a short **Naming Standard** section (README.md and AGENTS.md)
- Update listed docs: README.md, AGENTS.md, docs/AI_RULES.md, docs/project/PROJECT_BRIEF.md, docs/architecture/ARCHITECTURE.md, docs/WORKFLOWS.md, docs/project/ROADMAP.md, docs/intake/INTAKE_FINDINGS.md, docs/project/PROJECT_HEALTH.md, docs/project/TECH_DEBT.md
- Add ADR in docs/project/DECISIONS.md for canonical naming
- Clarify template docs describe *target applications*; AppForge itself is the workflow starter
- Post-change repo search for remaining `BuildPilot` references

### Out of Scope
- Application source code
- Package installation
- Workflow model changes beyond naming
- Renaming the local filesystem folder or git remote (historical; outside repo content)
- Changing command aliases (e.g. `Continue AppForge` stays)

---

## Affected Areas

### Files / Modules (expected)
- `README.md` — intro line, Naming Standard section
- `AGENTS.md` — tagline, Naming Standard section
- `docs/WORKFLOWS.md` — subtitle
- `docs/AI_RULES.md` — naming note if needed
- `docs/project/PROJECT_BRIEF.md` — AppForge starter context note
- `docs/architecture/ARCHITECTURE.md` — AppForge starter context note
- `docs/project/ROADMAP.md` — starter vs app roadmap note
- `docs/intake/INTAKE_FINDINGS.md`, `docs/project/PROJECT_HEALTH.md`, `docs/project/TECH_DEBT.md` — starter context in intros
- `docs/project/DECISIONS.md` — ADR-002 canonical naming
- `.cursor/workflow/state.md` — workflow tracking

### Architecture Impact
- [x] None

### Security Impact
- [x] None

### Data Model Impact
- [x] None

### Backend Impact
- [x] None

### UI / UX Impact
- [x] None

### Migration Impact
- [x] None

---

## Approach

1. Update the three files with explicit `BuildPilot` strings to use `AppForge` only
2. Add **Naming Standard** sections to README.md and AGENTS.md (canonical name, historical note for BuildPilot folder name)
3. Add brief intro notes to project-specific template docs clarifying they apply to *applications built with AppForge*, not the starter itself
4. Record ADR-002 in DECISIONS.md
5. Grep repo for `BuildPilot`; document any remaining references as historical or fix
6. Verify README.md and AGENTS.md consistency

---

## Test Strategy

### Automated
| Check | Command | Required |
|-------|---------|----------|
| Typecheck | N/A — no app code | no |
| Lint | N/A | no |
| Unit tests | N/A | no |
| Build | N/A | no |
| Repo search | `rg -i BuildPilot` | yes |

### Manual
- [x] Confirm README.md describes workflow starter, not application
- [x] Confirm AGENTS.md uses AppForge consistently
- [x] Confirm remaining BuildPilot references are historical only or absent

---

## Human Checkpoints Anticipated
- [x] None — naming is specified; no product conflict

---

## Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Missed BuildPilot references in obscure files | low | Full-repo ripgrep after changes |
| Users expect folder rename | low | Historical note in Naming Standard |

---

## Rollback Plan

Revert doc commits; no runtime impact.

---

## Documentation Updates Required
- [x] README.md, AGENTS.md, WORKFLOWS.md, AI_RULES.md
- [x] PROJECT_BRIEF.md, ARCHITECTURE.md, ROADMAP.md
- [x] INTAKE_FINDINGS.md, PROJECT_HEALTH.md, TECH_DEBT.md
- [x] DECISIONS.md (ADR)
- [ ] Other: none

---

## Open Questions
- [x] None

---

## Approval
- Review doc: docs/appforge-development/reviews/branding-clarification-review.md
- Verdict: pending
