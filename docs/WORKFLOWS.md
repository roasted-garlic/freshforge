# Workflows



> Universal process baseline for agent-driven development in this repository (**AppForge** workflow starter).

This project uses the AppForge workflow starter. The active workflow surface is `AGENTS.md`, `.cursor/`, and `docs/`. AppForge development and distribution documentation is not part of installed target projects.

---



## Core Workflow



Every scoped change:



```

Plan → Review → Implement → Test → Signoff

```



| Phase | Output | Gate |

|-------|--------|------|

| Plan | `docs/workflow/plans/*.md` | — |

| Review | `docs/workflow/reviews/*-review.md` | Must approve before implement |

| Implement | Code + doc updates | Approved scope only |

| Test | `docs/workflow/reviews/*-test-report.md` | Honest results |

| Signoff | `docs/workflow/reviews/*-signoff.md` | Tests complete or documented |



State tracked in `.cursor/workflow/state.md`. Start every session with `AGENTS.md` → state → `AI_RULES.md`.

---

## Workflow Artifact Folders

Workflow output lives under `docs/workflow/` — separate from permanent project documentation:

| Folder | Purpose |
|--------|---------|
| `docs/workflow/plans/` | Plan documents (required before implementation) |
| `docs/workflow/reviews/` | Reviews, test reports, signoffs, human checkpoints |
| `docs/workflow/setup/` | Project-specific setup notes (optional; after intake or bootstrap) |

Permanent docs (`docs/project/`, `docs/architecture/`, `docs/standards/`, `docs/intake/`) describe what the product **is**. Workflow folders hold **phase artifacts** for the current or recent managed phase.

When idle, workflow folders contain only `README.md` and `.gitkeep`. Archive completed AppForge development phase history under `docs/appforge-development/` (development repo only — never installed or exported).

---



## Command Aliases

Short user messages map to full workflows. Agents recognize aliases **case-insensitively** and run the correct skill without asking for confirmation.

See `.cursor/workflow/command-aliases.md`.

| Say this | Starts |
|----------|--------|
| `Existing Project`, `Intake`, `Analyze this repo`, `Document this project`, … | **Existing Project Intake** |
| `New Project`, `Bootstrap`, `Start App`, `Blank Project`, … | **New Project Bootstrap** |
| `Continue Workflow`, `Next Phase`, `Run Phase`, `Continue AppForge`, … | **Managed Phase** (start or continue from state) |

Full alias lists: `AGENTS.md`, `docs/AI_RULES.md`.



---



## Existing Project Intake



**When:** AppForge dropped into an established codebase with application code.



**Skill:** `project-intake`



**Rule:** `.cursor/rules/project-intake.mdc`



**Checklist:** `.cursor/workflow/existing-project-intake-checklist.md`



### Flow



```

Plan

  → Repo Inspection

  → Documentation Generation

  → Project Health Review

  → Human Clarification List

  → Signoff

```



| Step | Output |

|------|--------|

| Plan | `docs/workflow/plans/project-intake-plan.md` **first** |

| Repo Inspection | Read-only scan of code, config, CI, tests |

| Documentation Generation | Project docs + intake docs (see below) |

| Project Health Review | `docs/project/PROJECT_HEALTH.md` with priorities |

| Human Clarification List | `[NEEDS HUMAN INPUT]` in `INTAKE_FINDINGS.md` |

| Signoff | `docs/workflow/reviews/project-intake-signoff.md` |



### Intake Is Docs-Only



- **Do not modify application code**

- **Do not install packages** or run destructive commands

- **Do not fix** issues found during intake



### Intake Must Identify (from code, not user alone)



- Actual architecture and layer boundaries

- Mismatches between docs and code

- Security concerns (secrets, client-only auth, validation gaps)

- Testing gaps (missing CI checks, no E2E, etc.)

- Dependency concerns (outdated, vulnerable, duplicate)

- Accessibility concerns when UI exists

- Deployment gaps (missing rollback, env docs)



Record in:

- `docs/intake/INTAKE_FINDINGS.md` — inspection log

- `docs/project/TECH_DEBT.md` — debt items with suggested phases

- `docs/project/RISK_REGISTER.md` — risks

- `docs/project/PROJECT_HEALTH.md` — domain health and priorities



### Docs Created or Updated



`PROJECT_BRIEF`, `ARCHITECTURE`, `DATA_MODEL`, `BACKEND`, `STYLE_GUIDE`, `ROADMAP`, `TESTING`, `DEPLOYMENT`, `DECISIONS`, `RISK_REGISTER`, **`PROJECT_HEALTH`**, **`INTAKE_FINDINGS`**, **`TECH_DEBT`**



### Recommended Future Phases



Intake **must** recommend cleanup/improvement phases on `ROADMAP.md` and `PROJECT_HEALTH.md`.



Each fix requires a separate **Managed Phase** with Plan → Review → Implement → Test → Signoff — **not** during intake.



### Inputs Combined



- **Actual repo inspection** (primary)

- **User input** (business context, confirmations)

- **AI-discovered** risks, tech debt, missing docs, security/testing gaps



Tag inferred facts `[INFERRED]`. Tag uncertain facts `[NEEDS HUMAN INPUT]`.



---



## New Project Bootstrap



**When:** Blank or greenfield app; documentation before implementation.



**Skill:** `new-project-bootstrap`



### Flow



```

Questionnaire → Plan → Review → Create docs → Signoff

```



### Rules



- Ask **essential questions only** (see `.cursor/workflow/bootstrap-questionnaire.md`)

- **Docs first** — populate project templates

- Mark assumptions clearly: `[ASSUMED]`, `[NEEDS HUMAN INPUT]`, `[TBD]`

- Generate `PROJECT_BRIEF`, `ARCHITECTURE`, `DATA_MODEL`, `BACKEND`, `STYLE_GUIDE`, `ROADMAP`

- **No app code** until user explicitly approves first implementation phase

- `PROJECT_HEALTH`, `INTAKE_FINDINGS`, `TECH_DEBT` remain templates until code exists (optional light seeding of greenfield risks in `RISK_REGISTER`)



---



## Feature Development Workflow



**When:** New feature or enhancement.



**Skill:** `managed-phase`



1. User provides phase name and goal (see README prompts)

2. Plan with impacts and test strategy

3. Review (architecture + security as needed)

4. Implement approved scope

5. Test automated + manual if needed

6. Signoff



---



## Bug Fix Workflow



**When:** Defect with known reproduction.



**Skill:** `managed-phase` (narrow scope)



1. Plan: repro, root cause hypothesis, fix approach, regression tests

2. Review: security/data impact if touching sensitive paths

3. Implement minimal fix

4. Test: add regression test when feasible

5. Signoff



Hotfixes use same gates; production deploy requires human approval (`safe-deployment`).



---



## Hotfix Workflow



**When:** Urgent production issue.



1. Plan (abbreviated but required): issue, fix, rollback, test plan

2. Review (expedited; security agent for auth/data paths)

3. Implement minimal fix

4. Test on staging or local prod-like env

5. Signoff with human approval for production deploy



Never skip review entirely — abbreviate, don't omit.



---



## Documentation Update Workflow



**When:** Behavior or structure changes.



**Skill:** `documentation-update`



1. Identify affected docs via change type table in skill

2. Update docs using conflict priority

3. Add ADR to `DECISIONS.md` if architectural

4. Include in feature signoff if part of managed phase



---



## Manual Testing Workflow



**When:** UI/UX, visual, or environment-specific verification.



**Skill:** `manual-test-checkpoint`



1. Agent sets `Human Checkpoint Required: yes`

2. Agent provides steps and expected results (template in `.cursor/workflow/`)

3. User replies PASS / FAIL / PASS WITH NOTES

4. Agent records in state and test report

5. Resume or block signoff per result



---



## Release Workflow



**When:** Shipping to staging or production.



**Skill:** `safe-deployment`



1. Plan includes env, rollback, checklist

2. Review deployment impact

3. Verify build and tests

4. Update `DEPLOYMENT.md`

5. **Human approval** for production

6. Signoff records release



---



## Safe Change Workflows



| Skill | Triggers |

|-------|----------|

| `safe-backend-change` | Auth, API, storage, functions, webhooks |

| `safe-database-change` | Schema, migrations, statuses |

| `safe-deployment` | Prod deploy, CI/CD, env vars |



---



## Roles



| Agent | Role |

|-------|------|

| Managing Agent | Orchestrates workflow and state |

| Planning Agent | Plans only |

| Review Agent | Approves or blocks |

| Implementation Agent | Code within scope |

| Test Agent | Runs and records tests |

| Signoff Agent | Closes workflow |

| Documentation Agent | Docs and intake/bootstrap |

| Security Agent | Security review |

| Architecture Agent | Structure review |



See `.cursor/agents/` for details.



---



## AppForge Installation Workflow

**When:** Installing AppForge from the GitHub development repository into a new or existing project.

**Docs:** `docs/appforge-development/distribution/INSTALLATION.md`, `docs/appforge-development/distribution/DISTRIBUTION.md`

### Flow

```
npx github:roasted-garlic/appforge install → open in Cursor → intake or bootstrap
```

### Recommended install

```bash
npx github:roasted-garlic/appforge install
```

### Fallback

```bash
git clone https://github.com/roasted-garlic/appforge.git appforge-temp
node appforge-temp/scripts/install-appforge.mjs --target .
rm -rf appforge-temp
```

---

## Clean Starter Export Workflow

**When:** Maintainers prepare a clean starter copy from the AppForge development repo.

**Docs:** `docs/appforge-development/distribution/DISTRIBUTION.md`, `docs/appforge-development/distribution/PACKAGING.md`

### Flow

```
validate → export-starter → inspect dist/appforge-starter → push dev repo to GitHub
```

### Commands

```bash
npm run export:starter
npm run export:starter:full    # with README + validation
node scripts/export-starter.mjs --clean --dry-run
```

Default export: `AGENTS.md`, `.cursor/`, `docs/` only. Excludes `docs/appforge-development/`, `node_modules/`, dev artifacts, and live development `state.md`. Maps `state-template.md` → `state.md`.

---

## Existing Project After-Install Workflow

**When:** AppForge installed into a repository that already has application code.

**Skill:** `project-intake`

**Command alias:** `Existing Project`, `Intake`, `Analyze this repo`

### Flow

```
Install AppForge → Existing Project Intake → review health/debt docs → managed phases for fixes
```

Intake is docs-only. Do not fix tech debt during intake.

---

## New Project After-Install Workflow

**When:** AppForge installed into a blank or greenfield repository.

**Skill:** `new-project-bootstrap`

**Command alias:** `New Project`, `Bootstrap`, `Start App`

### Flow

```
Install AppForge → New Project Bootstrap → review generated docs → approve first implementation phase
```

No app code until user approves first implementation phase.

---

## Workflow State in Development vs Installed Starter

**Development repo:** `.cursor/workflow/state.md` tracks active Managed Phases, signoffs, and decision logs while building AppForge.

**Installed/exported starter:** Install and export scripts always write `.cursor/workflow/state-template.md` to `.cursor/workflow/state.md`. Target projects never inherit AppForge development workflow history.

Canonical clean state: `.cursor/workflow/state-template.md`. Validation requires dev `state.md` to match before push.

---

## AppForge Self-Development Workflow

**When:** Improving AppForge itself in the development repository (not a target application).

**Docs:** `docs/appforge-development/distribution/STARTER_SURFACE.md`, `docs/AI_RULES.md`

### Flow

```
Plan → Review → Implement → Test → Signoff
```

### During Plan

- **Classify impact area:** Starter Surface, Development Tooling, Distribution/Installer, Documentation, Development History
- If **Starter Surface** is affected → list starter files to change (`AGENTS.md`, `.cursor/*`, starter-facing `docs/`)
- If **Development Tooling** is affected → list `scripts/`, `package.json`, `.github/`, etc.
- If **Distribution/Installer** is affected → verify install/export dry-runs
- If **Development History** is affected → archive under `docs/appforge-development/`, keep `docs/workflow/plans/` and `docs/workflow/reviews/` clean

### During Signoff

- State whether **installed projects** will be affected
- State what **default install/export** includes (`AGENTS.md`, `.cursor/`, `docs/` unless flags used)
- State whether **starter surface** files changed
- Archive plan/signoff to `docs/appforge-development/` when working on AppForge itself

---

## Autonomy



Agents proceed autonomously through safe phases. They stop only for human checkpoints listed in `AGENTS.md`, `AI_RULES.md`, and `.cursor/rules/human-checkpoints.mdc`.


