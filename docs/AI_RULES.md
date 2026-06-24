# AI Rules



> Detailed agent behavior for this repository. **Docs are source of truth; rules are behavior instructions.**

> **Naming:** This repository is the **AppForge** workflow starter — a reusable Cursor kit, not an application. See **Naming Standard** in `README.md` and `AGENTS.md`. Do not refer to the starter as BuildPilot in current documentation.



---



## Starting Point (Every Session)



Read in this order **before any work**:



1. **`AGENTS.md`** (repo root) — universal AI entry point; workflow summary and gates

2. **`.cursor/workflow/state.md`** — controls current workflow progress, phase, blockers, allowed actions

3. **This file (`docs/AI_RULES.md`)** — detailed behavior source of truth



Then read project docs below as needed for the current task.



---



## Entry Points Explained



| File | Role |

|------|------|

| **`AGENTS.md`** | Root AI entry point — start here every session |

| **`docs/AI_RULES.md`** | Detailed AI behavior, reading order, gates, modes |

| **`.cursor/workflow/state.md`** | Authoritative current progress — phase, next step, checkpoints |



Workflow state **controls what step comes next**. If state conflicts with a generic instruction, follow state.



---



## Required Reading Order (Project Context)



After the starting point above, read as needed:



1. `PROJECT_BRIEF.md` — product context

2. `SECURITY.md`

3. `ARCHITECTURE.md`

4. `DATA_MODEL.md`

5. `BACKEND.md`

6. `CODING_STANDARDS.md`

7. `STYLE_GUIDE.md`

8. `WORKFLOWS.md`

9. `TESTING.md`

10. `DEPLOYMENT.md`

11. `ROADMAP.md`

12. `DECISIONS.md`

13. `RISK_REGISTER.md`



**After Existing Project Intake**, also read:



14. `PROJECT_HEALTH.md` — health summary and priorities

15. `INTAKE_FINDINGS.md` — inspection record

16. `TECH_DEBT.md` — tracked debt



---



## Source of Truth



| Layer | Location | Role |

|-------|----------|------|

| Docs | `docs/` | What the product is and how it works |

| Rules | `.cursor/rules/` | How agents must behave |

| Agents | `.cursor/agents/` | Specialist roles |

| Skills | `.cursor/skills/` | Reusable workflows |

| State | `.cursor/workflow/state.md` | Current step and gates |

| Hooks | `.cursor/hooks.json` | Safety reminders at session/tool events |



Do not duplicate long documentation inside rules. Rules point here.



---



## Conflict Priority



When docs conflict, higher wins:



1. `SECURITY.md`

2. `ARCHITECTURE.md`

3. `DATA_MODEL.md`

4. `BACKEND.md`

5. `CODING_STANDARDS.md`

6. `STYLE_GUIDE.md`

7. `WORKFLOWS.md`

8. `ROADMAP.md`



Principles:

- Security wins over architecture

- Architecture wins over implementation convenience

- Data model consistency wins over shortcuts



---



## Mandatory Workflow



All scoped work follows:



**Plan → Review → Implement → Test → Signoff**



Hard gates:

- **No implementation** without a plan in `docs/plans/`

- **No implementation** without review approval

- **No signoff** without tests run or failures documented



The **Managing Agent** controls phase transitions. **Specialist agents do not free-roam.**



---



## Operating Modes



| Mode | Skill | Code changes? |

|------|-------|---------------|

| Existing Project Intake | `project-intake` | Docs only — inspect repo, health, findings, tech debt |

| New Project Bootstrap | `new-project-bootstrap` | Docs only until user approves implementation |

| Managed Phase | `managed-phase` | After review approval only |



---



## Command Aliases

AppForge supports **short commands**. When the user's message matches an alias (case-insensitive), execute the mapped workflow — do not ask which mode they meant.

Canonical reference: `.cursor/workflow/command-aliases.md` and `AGENTS.md`.

### Existing Project Intake

`Existing Project` · `Existing Project Intake` · `Project Intake` · `Intake` · `Intake this repo` · `Analyze this repo` · `Review this codebase` · `Document this project` · `Existing App`

### New Project Bootstrap

`New Project` · `Project Bootstrap` · `New Project Bootstrap` · `Bootstrap` · `Start App` · `Start New App` · `Blank Project`

### Managed Phase

`Managed Phase` · `Start Phase` · `Run Phase` · `Next Phase` · `Continue Workflow` · `Continue AppForge`

Managed phase aliases **start or continue** from `.cursor/workflow/state.md`.



---



## Human Checkpoints



Stop and ask the user when work requires:



- Manual UI/UX or **visual approval**

- Business, **pricing, billing**, or **customer policy** decisions

- **Production deploy**, migrations, destructive data changes

- Auth provider or **external service setup**

- **Secrets** or shared environment variable changes

- Console access outside the repo

- Unclear requirements that change product behavior



See `.cursor/rules/human-checkpoints.mdc`.



---



## Documentation Requirements



- Update docs when behavior, architecture, data, backend, security, testing, or deployment changes

- Use skill `documentation-update`

- Mark unknowns `[TBD]`, `[INFERRED]`, or `[NEEDS HUMAN INPUT]` — do not invent requirements

- Record significant decisions in `DECISIONS.md`

- During intake: update `PROJECT_HEALTH.md`, `INTAKE_FINDINGS.md`, `TECH_DEBT.md`



---



## Autonomy Goal



Continue through Plan, Review, Implement, Test, and Signoff **without asking** unless a human decision, manual test, credential, production action, or business approval is required.



---



## Starter Surface (AppForge Development)



When working on the **AppForge development repository** (not a target app), distinguish the **starter surface** — the distributed product — from development-only files.



### Starter surface definition



Default installed product:



- `AGENTS.md`
- `.cursor/`
- `docs/` (excluding `docs/appforge-development/`)



Source of truth: `docs/STARTER_SURFACE.md`.



### Required impact classification



Every AppForge managed phase plan must classify impact in one or more areas:



- **Starter Surface** — rules, agents, skills, workflow, baseline docs
- **Development Tooling** — validation, CI, package scripts
- **Distribution/Installer** — install/export CLI and scripts
- **Documentation** — docs that describe behavior (surface vs dev-only)
- **Development History** — phase artifacts under `docs/appforge-development/`



### Rules



- **Starter behavior changes** must update starter surface files if they should affect installed projects.
- Do not make starter behavior changes only in development-only docs, `docs/appforge-development/`, or maintainer scripts.
- **Development-only changes** must not be documented as if they affect default installed behavior.
- Archive AppForge phase history in `docs/appforge-development/`, not in `docs/plans/` or `docs/reviews/`.
- Never install or export `docs/appforge-development/`.



---



## Safety



- Prefer narrow, reversible changes

- Never silently expand scope

- Never claim tests passed without running them

- Never commit secrets

- Never perform production actions without human approval

- Do not add dependencies without justification (see `.cursor/rules/dependency-management.mdc`)


