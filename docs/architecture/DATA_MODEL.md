# Data Model

> **Project-specific** — customize during intake or bootstrap. Canonical reference for persisted entities and relationships.

---

## Overview
<!-- Brief description of data domains -->

`[TBD]`

---

## Conventions

| Convention | Rule |
|------------|------|
| IDs | `[UUID / auto-increment / provider-native]` |
| Timestamps | `createdAt`, `updatedAt` on primary records |
| Audit actors | `createdBy`, `updatedBy` where user actions matter |
| Soft delete | `[yes/no — field name if yes]` |
| Naming | `[camelCase / snake_case in DB vs code]` |

---

## Entities

### `[EntityName]`

**Purpose:** `[TBD]`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | | yes | |
| createdAt | | yes | |
| updatedAt | | yes | |
| | | | |

**Indexes:**
- `[TBD]`

**Permissions:**

| Action | Who |
|--------|-----|
| read | |
| create | |
| update | |
| delete | |

---

### `[EntityName 2]`
`[Duplicate section per entity]`

---

## Relationships

| From | To | Type | Notes |
|------|-----|------|-------|
| | | one-to-many / many-to-many | cascade delete? |

---

## Status Values & State Machines

### `[EntityName].[statusField]`

| Status | Meaning | Allowed transitions to |
|--------|---------|------------------------|
| | | |

---

## Permissions Model Summary
<!-- Link to roles/claims; detail per entity above -->

`[TBD]`

---

## Sensitive Data Classification

| Entity.Field | Classification | Handling |
|--------------|----------------|----------|
| | PII / financial / public | |

---

## Migrations

| Date | Migration | Description | Rollback notes |
|------|-----------|-------------|----------------|
| | | | |

Migration files location: `[TBD path]`

---

## Validation Rules
<!-- Cross-field rules, invariants -->

- `[TBD]`

---

## Related Documents
- `BACKEND.md` — storage and access patterns
- `SECURITY.md` — authorization baseline
- `ARCHITECTURE.md` — data layer placement

---

## Revision History

| Date | Summary |
|------|---------|
| YYYY-MM-DD | Initial template |
