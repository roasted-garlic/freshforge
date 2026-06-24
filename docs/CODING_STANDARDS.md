# Coding Standards

> Universal baseline for readable, maintainable code. Adapt examples to your stack; principles apply everywhere.

---

## Priorities

1. **Readability** over cleverness
2. **Consistency** over personal preference
3. **Simplicity** over complexity
4. **Maintainability** over speed

---

## General Principles

- Match existing project patterns unless a plan explicitly improves them
- One logical concern per file when practical
- Explicit over implicit; avoid magic numbers and strings — use named constants
- Fail fast with clear errors at boundaries
- No dead code or unjustified commented-out blocks

---

## File Organization

- **Feature-based** folders when the app grows: group by domain (`features/orders/`, `modules/billing/`)
- **Shared** code in documented shared locations (`shared/`, `lib/`, `common/`)
- **Colocate** tests near source or in parallel `__tests__` / `tests/` trees per project convention
- **Barrel exports** (`index.ts`) sparingly — avoid circular import traps
- Document structure in `ARCHITECTURE.md`

---

## Naming

| Kind | Convention | Example |
|------|------------|---------|
| Files | kebab-case or language idioms | `user-service.ts`, `user_service.py` |
| Components / classes | PascalCase | `OrderSummary` |
| Functions / methods | camelCase or snake_case per language | `calculateTotal` |
| Constants | UPPER_SNAKE or language norm | `MAX_RETRY_COUNT` |
| Types / interfaces | PascalCase, descriptive | `OrderStatus` |
| Booleans | `is`, `has`, `can`, `should` prefix | `isPublished` |

Names describe **behavior and domain**, not implementation trivia.

---

## Types

- Use static typing when the project supports it (TypeScript, typed Python, Go, Rust, etc.)
- Avoid `any` and untyped escape hatches without documented reason
- Shared domain types in one module; map DTOs at boundaries
- Prefer discriminated unions or enums for finite states — document in `DATA_MODEL.md`

---

## Components (UI)

> Applies to React, Vue, Svelte, SwiftUI, Flutter widgets, etc.

- **Thin components**: render UI; delegate logic to hooks/services
- Props typed explicitly; sensible defaults documented
- Avoid business rules in JSX/template beyond presentation
- Accessibility: labels, roles, keyboard nav, focus management (see `STYLE_GUIDE.md`)
- Split when file exceeds ~200–300 lines **and** mixes concerns

---

## Hooks / State Coordinators

- Coordinate UI state and service calls
- No direct low-level API/database access
- Custom hooks: prefix `use` in React; equivalent patterns elsewhere
- Side effects isolated; cleanup on unmount where applicable

---

## Services

- Own business logic and orchestration
- Validate inputs at service boundary
- Return typed results; throw or return errors consistently per project pattern
- No UI imports in services

---

## Utilities

- Pure functions when possible
- Single responsibility; no hidden I/O
- Test utilities independently

---

## API / Data Access

- Centralize HTTP/SDK clients
- Timeouts, retries, and error mapping in one place
- Never expose raw provider responses to UI without mapping
- Document endpoints in `BACKEND.md`

---

## Error Handling

- Catch at boundaries; do not swallow errors
- User-facing messages: safe, actionable, non-technical
- Logs: include correlation IDs and context; **no secrets or unnecessary PII**
- Use typed error categories where the stack supports it

---

## Logging

- Structured logging preferred in backend/services
- Levels: debug (dev), info (operations), warn (recoverable), error (failures)
- Never log passwords, tokens, full payment details

---

## Tests

- Name tests after behavior: `it('rejects expired tokens')`
- Arrange–Act–Assert structure
- Mock external services at boundaries, not internal helpers unnecessarily
- See `TESTING.md` for commands

---

## Dependencies

- Prefer existing project utilities over new packages for trivial tasks
- New dependencies require plan/review acknowledgment
- Pin versions per project policy; audit security periodically

---

## Comments & Documentation

- Code should be self-explanatory; comment **why**, not **what**
- Public APIs: docstrings or TSDoc where the team expects it
- TODOs include ticket or roadmap reference — not indefinite `// fix later`

---

## Formatting

- Follow project formatter/linter config
- No unrelated formatting churn in narrow tasks
- Import order per linter or team convention

---

## Git / Change Hygiene

- Small, reviewable diffs aligned with approved plan
- Commit messages: complete sentences describing **why**
- Do not commit generated artifacts, secrets, or local env files
