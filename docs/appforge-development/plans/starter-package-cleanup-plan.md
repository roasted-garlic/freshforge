# Plan: Starter Package Cleanup

| Field | Value |
|-------|-------|
| Date | 2026-06-23 |
| Author | Planning Agent |
| Status | ready_for_review |
| Workflow | managed-phase |
| Related | docs/reviews/starter-package-cleanup-review.md |

---

## Goal

Prepare AppForge for clean reuse as a copy-paste starter by archiving AppForge development workflow artifacts and resetting starter-facing locations to templates and idle state.

## Background

Managed phases (branding-clarification, starter-ci-validation) generated plans, reviews, test reports, and signoffs in `docs/plans/` and `docs/reviews/`. `ROADMAP.md` contains AppForge-specific phase history. These are valuable for AppForge maintenance but must not ship when copying into another project.

## Safety: Files to Move (AppForge development artifacts)

Confirmed **not** reusable starter templates — **move** to `docs/appforge-development/`:

### `docs/plans/` → `docs/appforge-development/plans/`
| File | Reason |
|------|--------|
| `branding-clarification-plan.md` | Completed managed phase plan for AppForge repo |
| `starter-ci-validation-plan.md` | Completed managed phase plan for AppForge repo |
| `starter-package-cleanup-plan.md` | This phase plan (archived at signoff) |

### `docs/reviews/` → `docs/appforge-development/reviews/`
| File | Reason |
|------|--------|
| `branding-clarification-review.md` | Phase review artifact |
| `branding-clarification-test-report.md` | Phase test report |
| `branding-clarification-signoff.md` | Phase signoff |
| `starter-ci-validation-review.md` | Phase review artifact |
| `starter-ci-validation-test-report.md` | Phase test report |
| `starter-ci-validation-signoff.md` | Phase signoff |
| `starter-package-cleanup-review.md` | This phase review |
| `starter-package-cleanup-test-report.md` | This phase test report |
| `starter-package-cleanup-signoff.md` | This phase signoff (archived at end) |

### Keep in starter folders (reusable)
| File | Location |
|------|----------|
| `README.md` | `docs/plans/`, `docs/reviews/`, `docs/setup/` |
| `.gitkeep` | `docs/plans/`, `docs/reviews/`, `docs/setup/` (add) |

### Reset (not moved — revert to template)
| File | Action |
|------|--------|
| `docs/ROADMAP.md` | Remove AppForge phase 0 content and dev revision history |
| `.cursor/workflow/state.md` | Reset to idle starter state |

### Unchanged (already templates or baseline)
| File | Notes |
|------|-------|
| `docs/PROJECT_BRIEF.md` | Template with generic starter note — keep |
| `docs/ARCHITECTURE.md` | Template with generic starter note — keep |
| `docs/INTAKE_FINDINGS.md` | Empty template — keep |
| `docs/PROJECT_HEALTH.md` | Empty template — keep |
| `docs/TECH_DEBT.md` | Empty template — keep |
| `docs/DECISIONS.md` | ADRs describe starter capabilities — keep |
| `docs/TESTING.md` | Validation commands for starter — keep |

---

## Scope

### In Scope
- Create `docs/appforge-development/` archive structure
- Move listed artifacts; clean `docs/plans/`, `docs/reviews/`, `docs/setup/`
- Reset `state.md` and `ROADMAP.md`
- Add `docs/PACKAGING.md` and README section
- Extend structure validation for clean starter folders
- Archive this phase plan + signoff at end

### Out of Scope
- Application source code
- `npm install`
- Removing rules, agents, skills, templates, baseline docs
- Deleting `docs/appforge-development/` from working repo (dev history preserved)

---

## Approach

1. Create `docs/appforge-development/` with README and subfolders
2. Move prior phase artifacts to archive
3. Reset ROADMAP and state.md
4. Add `.gitkeep` to plans/reviews/setup
5. Write `docs/PACKAGING.md` and README section
6. Update `validate-structure.mjs` for PACKAGING.md and clean-folder checks
7. Complete workflow; move this plan + signoff to archive
8. Run validation tests

---

## Test Strategy

| Check | Method |
|-------|--------|
| Clean folders | List `docs/plans/`, `docs/reviews/`, `docs/setup/` |
| Idle state | Read `state.md` |
| PACKAGING.md | File exists |
| No phase names in starter docs | ripgrep |
| Templates preserved | Spot-check `.cursor/`, baseline docs |
| Validation | `npm run validate` if node_modules present |

---

## Human Checkpoints
- [x] None

---

## Approval
- Review doc: docs/reviews/starter-package-cleanup-review.md
- Verdict: pending
