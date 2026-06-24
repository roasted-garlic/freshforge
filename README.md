# AppForge — AI Development Workflow Starter



A reusable, copy-paste workflow system for Cursor called **AppForge** that enforces safe, repeatable, agent-driven development: **Plan → Review → Implement → Test → Signoff**.



Works for web apps, mobile apps, desktop apps, SaaS, internal tools, marketplaces, dashboards, API services, Firebase/Supabase apps, and other common software projects. **Not tied to any single stack or product.**



---



## What This Is



This repository is **not an application**. It is a **starter kit** you copy into any app repo so AI agents:



- Start from **`AGENTS.md`** every session

- Read documentation as source of truth

- Follow mandatory workflow gates

- Delegate to specialist agent roles

- Run reusable skills for intake, bootstrap, and feature work

- Track progress in workflow state

- Stop only when human approval, manual testing, or production actions are required



---



## What This Is Not



- Not a scaffold for React, Firebase, or any specific framework

- Not an npm package — install `AGENTS.md`, `.cursor/`, and `docs/` into your project with the install script (see below)

- Not a replacement for human judgment on product, design, billing, or production



---



## Naming Standard

| Term | Meaning |
|------|---------|
| **AppForge** | Canonical name for this reusable Cursor workflow starter |
| **BuildPilot** | Historical folder/repo label only — not used in docs for the current project |

When copying AppForge into an application repository, use **AppForge** in documentation and agent prompts. Application product names belong in `PROJECT_BRIEF.md`, not in workflow starter branding.



---



## Repository Layout



```

AGENTS.md          # Universal AI entry point — read first every session



.cursor/

  rules/           # Agent behavior (always-on instructions)

  agents/          # Specialist role definitions

  skills/          # Reusable workflow procedures

  workflow/        # State file, templates, command-aliases.md

  hooks.json       # Session/tool safety hooks (adapt to your Cursor version)



docs/

  AI_RULES.md      # Detailed agent behavior source of truth

  CODING_STANDARDS.md

  SECURITY.md

  WORKFLOWS.md

  TESTING.md

  DEPLOYMENT.md

  DECISIONS.md

  RISK_REGISTER.md

  PACKAGING.md         # Clean copy and packaging guide

  PROJECT_BRIEF.md # Project-specific — customize per app

  ARCHITECTURE.md

  DATA_MODEL.md

  BACKEND.md

  STYLE_GUIDE.md

  ROADMAP.md

  PROJECT_HEALTH.md    # Health summary (populated during intake)

  INTAKE_FINDINGS.md   # Intake inspection record

  TECH_DEBT.md         # Tech debt register

  plans/           # Plan documents (README + .gitkeep until your first plan)

  reviews/         # Reviews, test reports, signoffs (README + .gitkeep until work begins)

  setup/           # Optional local setup notes

```



---



## Docs vs Rules vs Agents vs Skills vs State vs Hooks



| Layer | Purpose |

|-------|---------|

| **`AGENTS.md`** | Root entry point — session start, gates, mode summary |

| **Docs** (`docs/`) | Source of truth — what the product is and how it works |

| **Rules** (`.cursor/rules/`) | Behavior instructions; points to docs |

| **Agents** (`.cursor/agents/`) | Specialist roles (planning, review, implement, test, signoff, etc.) |

| **Skills** (`.cursor/skills/`) | Step-by-step workflows (intake, bootstrap, managed phase, safe changes) |

| **State** (`.cursor/workflow/state.md`) | Current phase, gates, blockers, next step — installed/exported from `state-template.md` |

| **Hooks** (`.cursor/hooks.json`) | Reminders at session start and risky shell commands |



The **Managing Agent** reads state and enforces gates. Specialist agents do not free-roam or change project direction independently.



---



## Development Repo vs Installed Starter

| | This repository (development source) | Target project after default install |
|--|-------------------------------------|--------------------------------------|
| Purpose | Build and maintain AppForge | Run workflow in your application |
| `docs/appforge-development/` | Maintainer history | Not copied |
| Validation / CI | Present here | Optional (`--include-validation`) |
| `README.md` | Full AppForge docs | Optional (`--include-readme` → `APPFORGE_README.md`) |
| `node_modules/` | Local dev only | Never copied — do not manual-copy |

Push this repo to GitHub as the development source. Use `install-appforge.mjs` or `export-starter.mjs` to deliver a clean starter. See `docs/DISTRIBUTION.md`.



---



## Installing AppForge Into a Project

**Default install** copies only:

- `AGENTS.md`
- `.cursor/`
- `docs/`

Use optional flags when you need more:

- `--include-readme` — copies AppForge README as `APPFORGE_README.md` (does not overwrite your `README.md`)
- `--include-validation` — copies `scripts/`, `package.json`, `package-lock.json`, `.markdownlint-cli2.jsonc`, `.github/workflows/validate.yml`

### Existing Project Quick Start

```bash
git clone https://github.com/roasted-garlic/appforge.git appforge-temp
node appforge-temp/scripts/install-appforge.mjs --target .
rm -rf appforge-temp
```

Open in Cursor and run **Existing Project** (or `Intake`).

### New Project Quick Start

```bash
mkdir my-new-app && cd my-new-app
git clone https://github.com/roasted-garlic/appforge.git appforge-temp
node appforge-temp/scripts/install-appforge.mjs --target .
rm -rf appforge-temp
```

Open in Cursor and run **New Project** or **Bootstrap**.

Full workflows: `docs/INSTALLATION.md`.



---



## Exporting a Clean Starter

Maintainers export a clean copy from this development repo:

```bash
npm run export:starter              # → dist/appforge-starter/
npm run export:starter:full         # includes README + validation tooling
node scripts/export-starter.mjs --clean --dry-run
```

Default export: `AGENTS.md`, `.cursor/`, and `docs/` only. Never includes `docs/appforge-development/`, `node_modules/`, dev artifacts, or live development `state.md`. Maps `state-template.md` → `state.md`.

Details: `docs/DISTRIBUTION.md` and `docs/PACKAGING.md`.

### Workflow state in dev vs installed starter

This development repo uses `.cursor/workflow/state.md` during AppForge maintenance. **Install and export never ship that file.** They always write `.cursor/workflow/state-template.md` to `.cursor/workflow/state.md` in the target so new projects start with a clean idle state.



---



## Installation (Manual Reference)



### Into an Existing Project



1. Copy into your app repo root:

   - **`AGENTS.md`**

   - `.cursor/` (entire folder)

   - `docs/` (entire folder)

   - This `README.md` (merge or replace project README section)

2. Commit the workflow files to version control

3. Open the project in Cursor

4. Run **Existing Project Intake** — or type **`Existing Project`** / **`Intake`**

5. Review `INTAKE_FINDINGS.md`, `PROJECT_HEALTH.md`, `TECH_DEBT.md`; fill `[NEEDS HUMAN INPUT]` items



### For a New Project



1. Create your empty app repo (or use this repo as the initial commit)

2. Ensure `AGENTS.md`, `.cursor/`, and `docs/` are present

3. Run **New Project Bootstrap** — or type **`Bootstrap`** / **`New Project`**

4. Answer essential questionnaire questions

5. Review generated docs before approving first implementation phase



---



## Two Operating Modes



### 1. Existing Project Intake (Established Codebase)



**Docs-only.** No application code changes.



Uses combined inputs:



| Input | Role |

|-------|------|

| **Actual repo inspection** | Primary — stack, architecture, scripts, tests, CI from code |

| **User input** | Business context, confirmations for `[NEEDS HUMAN INPUT]` |

| **AI-discovered risks** | → `RISK_REGISTER.md` |

| **AI-discovered tech debt** | → `TECH_DEBT.md` |

| **AI-discovered missing/stale docs** | → doc updates + `INTAKE_FINDINGS.md` |

| **Security & testing gaps** | → `PROJECT_HEALTH.md` priorities |



**Flow:** Plan → Repo Inspection → Documentation Generation → Project Health Review → Human Clarification List → Signoff



Recommends cleanup phases on `ROADMAP.md` — **does not fix issues** until an approved Managed Phase.



### 2. New Project Bootstrap (Blank / Greenfield)



**Docs before code.** No implementation until you approve.



Uses:



| Input | Role |

|-------|------|

| **User questionnaire** | Essential product and stack questions |

| **Assumptions clearly marked** | `[ASSUMED]`, `[NEEDS HUMAN INPUT]`, `[TBD]` |

| **Docs first** | PROJECT_BRIEF, ARCHITECTURE, DATA_MODEL, etc. |

| **No app code** | Until explicit approval of first implementation phase |



---



## Command Aliases

You do not need the full copy-paste prompts. Type a **short command** and the agent runs the matching workflow.

| Workflow | Example commands |
|----------|------------------|
| **Existing Project Intake** | `Existing Project` · `Intake` · `Analyze this repo` · `Document this project` |
| **New Project Bootstrap** | `New Project` · `Bootstrap` · `Start App` · `Blank Project` |
| **Managed Phase** | `Continue Workflow` · `Next Phase` · `Run Phase` · `Continue AppForge` |

Full lists: `AGENTS.md` and `.cursor/workflow/command-aliases.md`.

**Try it:** type **`Existing Project`** in Cursor chat to start intake on an established codebase.

---



## Core Workflow (Feature Work)



```

Plan → Review → Implement → Test → Signoff

```



- No implementation without a plan in `docs/plans/`

- No implementation without review approval

- No signoff without tests run or failures documented

- Human checkpoints for UI review, business decisions, production, migrations, secrets, etc.



---



## Copy-Paste Prompts



### Prompt 1: Existing Project Intake



```

Start Existing Project Intake.



Goal:

Inspect this codebase, understand the application, identify the tech stack, map the architecture, assess project health, record findings and tech debt, and generate or update the project documentation.



Follow:

Plan → Repo Inspection → Documentation Generation → Project Health Review → Human Clarification List → Signoff



Use actual repo inspection as the primary source. Tag inferred facts [INFERRED] and uncertain facts [NEEDS HUMAN INPUT].



Create or update PROJECT_HEALTH.md, INTAKE_FINDINGS.md, and TECH_DEBT.md.



Autonomy:

Continue without asking me unless you need a business decision, design preference, production credential, external service access, or clarification that cannot be inferred from the repo.



Do not modify application code. Do not fix tech debt during intake — recommend managed phases instead.

```



### Prompt 2: New Project Bootstrap



```

Start New Project Bootstrap.



Goal:

Help me define a new application and generate the project documentation needed before implementation.



Ask only the essential questions needed to create the first version of the docs.



Mark assumptions clearly as [ASSUMED] or [NEEDS HUMAN INPUT].



Follow:

Questionnaire → Plan → Review → Create docs → Signoff



Do not implement app code until I approve the first implementation phase.

```



### Prompt 3: Managed Phase



```

Start Managed Phase.



Phase:

[phase name]



Goal:

[plain English goal]



Follow:

Plan → Review → Implement → Test → Signoff



Autonomy:

Continue without asking me unless manual testing, visual review, production deploy, destructive migration, external service setup, secret management, billing, pricing, customer-facing policy, or business approval is required.

```



---



## Recommended First Prompt After Installation



**Existing codebase:** type **`Existing Project`** or **`Intake`** (or use Prompt 1 below).



**Blank or new repo:** type **`Bootstrap`** or **`New Project`** (or use Prompt 2 below).



Intake populates `PROJECT_HEALTH.md`, `INTAKE_FINDINGS.md`, `TECH_DEBT.md`, and core project docs so later feature work is safe.



---



## When the Agent Should Stop for You



The agent continues autonomously unless:



- Manual UI/UX or visual review is needed

- Business, pricing, billing, or policy decision is required

- Production deploy, migration, or destructive data change

- Auth provider or external service console setup

- Secrets or shared environment variable changes

- Anything requiring credentials or access outside the repo

- Review is **blocked** or tests fail outside approved fix scope



Check `.cursor/workflow/state.md` for `Human Checkpoint Required` and `Blocked`.



---



## Human Checkpoints



See `.cursor/rules/human-checkpoints.mdc` and `docs/AI_RULES.md`. Feedback is recorded in workflow state `Decision Log` and signoff docs.



---



## Safe Change Skills



| Skill | Use for |

|-------|---------|

| `safe-backend-change` | Auth, API, storage, functions, webhooks |

| `safe-database-change` | Schema, migrations, status values |

| `safe-deployment` | Production deploy, CI/CD, env vars |

| `manual-test-checkpoint` | User-driven UI/UX verification |



---



## Hooks (Manual Setup)



`.cursor/hooks.json` includes conservative **prompt hooks** for:



- Session start: read workflow state and respect gates

- Shell execution: flag destructive/production commands



**Adapt to your Cursor version:** open **Cursor Settings → Hooks**, verify events and syntax, and adjust matchers.



---



## Limitations



- **Templates are not truth** until intake or bootstrap fills them

- **Hooks** are placeholders — validate against your Cursor version

- **Agents/skills** guide behavior via markdown; not auto-executing subagents unless you wire them

- **Validation** requires Node 18+ for local checks; optional when copying into app repos (see Validation below)

- **Stack-agnostic** — add optional `FIREBASE.md`, `SUPABASE.md`, etc. when relevant



---



## Validation Commands

Lightweight checks for this development repo (structure, markdown, internal links, distribution output). Requires **Node.js 18+**.

```bash
npm install          # first time only
npm run validate     # all checks
npm run validate:starter
npm run export:starter
npm run export:starter:full
```

| Script | Purpose |
|--------|---------|
| `npm run validate:structure` | Required files, clean folders, idle state, default install/export output |
| `npm run validate:markdown` | Markdown formatting (markdownlint) |
| `npm run validate:links` | Relative markdown link targets |
| `npm run export:starter` | Export clean starter to `dist/appforge-starter/` |
| `npm run install:appforge` | Install starter into a target directory |

CI runs validation via `.github/workflows/validate.yml` on push and pull requests.

When installing into an application repo, pass `--include-validation` if you want these checks in the target project. See `docs/TESTING.md`.



---



## Preparing a Clean Starter Copy

Use `npm run export:starter` or the install script — they automatically exclude `docs/appforge-development/`, dev artifacts, and `node_modules/`.

Before pushing this development repo to GitHub:

1. Confirm `docs/plans/`, `docs/reviews/`, and `docs/setup/` contain only `README.md` and `.gitkeep`.
2. Archive completed phase artifacts under `docs/appforge-development/`.
3. Confirm `.cursor/workflow/state.md` matches `state-template.md`.
4. Run `npm run validate`.

After installing into a target repo:

| Target repository | Next step |
|-------------------|-----------|
| Existing codebase with application code | **Existing Project** (`Intake`) |
| New or blank project | **New Project Bootstrap** (`Bootstrap`) |

Full details: `docs/PACKAGING.md`, `docs/DISTRIBUTION.md`, `docs/INSTALLATION.md`.



---



## Quick Reference



| I want to… | Use |

|------------|-----|

| Start any agent session | Read `AGENTS.md` first |

| Document an existing repo | **`Existing Project`** or **`Intake`** — or Prompt 1 |

| Start a new app with docs first | **`Bootstrap`** or **`New Project`** — or Prompt 2 |

| Build a feature safely | **`Continue Workflow`** or **`Next Phase`** — or Prompt 3 |

| See current step | `.cursor/workflow/state.md` |

| See health & debt after intake | `PROJECT_HEALTH.md`, `TECH_DEBT.md` |

| Understand process | `docs/WORKFLOWS.md` |

| Detailed agent rules | `docs/AI_RULES.md` + `.cursor/rules/` |

| Run starter validation | `npm run validate` or `npm run validate:starter` |

| Install into another repo | `docs/INSTALLATION.md` |

| Export clean starter | `npm run export:starter` — see `docs/DISTRIBUTION.md` |

| Prepare clean copy for another repo | `docs/PACKAGING.md` |



---



## License



Use and adapt freely in your projects. Attribution appreciated but not required.


