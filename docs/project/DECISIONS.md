# Architecture Decision Records (DECisions)

> Log significant technical and process decisions. Universal format; project-specific entries below.

---

## How to Use

When a decision affects architecture, security, data, backend, or workflow:

1. Add a new ADR entry below (newest first)
2. Reference in plans and signoff docs
3. Update related docs (`ARCHITECTURE.md`, `BACKEND.md`, etc.)

---

## ADR Template

```markdown
### ADR-NNN: [Title]

| Field | Value |
|-------|-------|
| Date | YYYY-MM-DD |
| Status | proposed / accepted / deprecated / superseded |
| Deciders | [names or roles] |

**Context**
[What problem or constraint led to this decision?]

**Options considered**
1. [Option A] — pros/cons
2. [Option B] — pros/cons

**Decision**
[What was chosen]

**Consequences**
- Positive: ...
- Negative: ...
- Follow-ups: ...
```

---

## Decisions

### ADR-006: Versioned migration system for installed starters

| Field | Value |
|-------|-------|
| Date | 2026-06-24 |
| Status | accepted |
| Deciders | Project team |

**Context**
Projects with older AppForge or FreshForge workflow installations need a safe upgrade path. Re-running `install --force` risks overwriting project-specific documentation.

**Options considered**
1. One-off AppForge rename script — not reusable for future releases
2. General migration registry with `migrate` and `doctor` CLI commands — extensible, safe classification of controlled vs project-specific files

**Decision**
Implement a versioned migration system with `.freshforge/version.json`, `freshforge migrate`, `freshforge doctor`, backups, and a registered migration list. First migration: `legacy-appforge-to-freshforge`.

**Consequences**
- Positive: Safe upgrades; future migrations register without CLI redesign
- Negative: Additional distribution complexity and fixture maintenance
- Follow-ups: Publish to npm; add migrations for future starter releases

---

### ADR-005: Canonical project name is FreshForge

| Field | Value |
|-------|-------|
| Date | 2026-06-24 |
| Status | accepted |
| Deciders | Project team |
| Supersedes | ADR-002 |

**Context**
The workflow starter was renamed from **AppForge** to **FreshForge** across CLI, package, paths, and documentation. ADR-002 established AppForge as canonical; this ADR updates the canonical name after the hard rename.

**Options considered**
1. Keep AppForge as display name with freshforge package slug — confusing dual branding
2. Hard rename to FreshForge everywhere — single canonical name; AppForge and BuildPilot historical only

**Decision**
Use **FreshForge** as the canonical name everywhere the starter is described. **AppForge** and **BuildPilot** may appear only in historical notes (e.g. former package name, local folder name), clearly labeled.

**Consequences**
- Positive: Consistent branding in README, AGENTS.md, CLI, and workflow docs
- Negative: Existing installs referencing `github:roasted-garlic/appforge` must migrate
- Follow-ups: Update remote repo name when ready

---

### ADR-004: Separate development archive from clean starter package

| Field | Value |
|-------|-------|
| Date | 2026-06-23 |
| Status | accepted |
| Deciders | Project team |

**Context**
FreshForge developed inside its own workflow left completed plans, reviews, and signoffs in starter-facing folders, confusing adopters copying the kit.

**Decision**
Archive FreshForge development artifacts under `docs/freshforge-development/`. Keep `docs/workflow/plans/`, `docs/workflow/reviews/`, and `docs/workflow/setup/` clean (README + `.gitkeep` only) before copying. Document process in `docs/freshforge-development/distribution/PACKAGING.md`.

**Consequences**
- Positive: Clear separation between maintainer history and adopters' workflow folders
- Negative: Maintainers must run cleanup before shipping a copy
- Follow-ups: `validate:structure` enforces clean starter folders

---

### ADR-003: Lightweight validation for starter repo

| Field | Value |
|-------|-------|
| Date | 2026-06-23 |
| Status | accepted |
| Deciders | Project team |

**Context**
The FreshForge starter is markdown-only with no application tests. Contributors and adopters need a simple way to verify required workflow files, markdown quality, and internal links.

**Options considered**
1. Shell-only scripts — no Node dependency but weak markdown linting
2. Minimal Node `package.json` for validation scripts only — one devDependency (`markdownlint-cli2`) plus stdlib link/structure scripts
3. Full monorepo tooling — overkill for a copy-paste starter

**Decision**
Add a private `package.json` with `validate`, `validate:structure`, `validate:markdown`, and `validate:links` scripts. Use GitHub Actions to run `npm run validate` on push/PR. Validation is optional when copying the starter into app repos (adopters may omit `package.json`).

**Consequences**
- Positive: CI catches doc/structure regressions; clear local commands in TESTING.md
- Negative: Requires Node 18+ for local validation
- Follow-ups: None

---

### ADR-002: Canonical project name is AppForge

| Field | Value |
|-------|-------|
| Date | 2026-06-23 |
| Status | superseded (by ADR-005) |
| Deciders | Project team |

**Context**
The workflow starter was referenced as both AppForge and BuildPilot, causing confusion in docs and agent prompts.

**Options considered**
1. Keep dual naming (AppForge / BuildPilot) — familiar to early adopters but ambiguous
2. Standardize on AppForge — single canonical name; BuildPilot retained only as historical folder label

**Decision**
Use **AppForge** as the canonical name everywhere the starter is described. **BuildPilot** may appear only in historical notes (e.g. local folder name), clearly labeled.

**Consequences**
- Positive: Consistent branding in README, AGENTS.md, and workflow docs
- Negative: Local clone folder may still be named BuildPilot until manually renamed
- Follow-ups: Superseded by ADR-005 (FreshForge rename)

---

### ADR-001: Adopt managed AI workflow (Plan → Review → Implement → Test → Signoff)

| Field | Value |
|-------|-------|
| Date | YYYY-MM-DD |
| Status | accepted |
| Deciders | Project team |

**Context**
Need a repeatable, safe agent-driven development process that works across project types.

**Options considered**
1. Ad-hoc agent prompts — fast but inconsistent, risky for production
2. Full workflow starter with gates and docs — more structure, safer

**Decision**
Adopt the Cursor workflow starter with mandatory phases, human checkpoints, and documentation as source of truth.

**Consequences**
- Positive: Safer changes, clearer audit trail, less scope creep
- Negative: More overhead for trivial changes
- Follow-ups: Customize docs during intake or bootstrap

---

<!-- Add project-specific ADRs below -->
