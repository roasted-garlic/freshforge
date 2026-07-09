# ViewMyCOA.com — Project Overview

> Product, users, features, and business context. For technical structure see `ARCHITECTURE-AND-CODE.md`. For what's happening now see `CURRENT-STATE.md`.

**Last updated:** 2026-07-09  
**Source:** `docs/project/PROJECT_BRIEF.md`, intake findings, codebase inspection

---

## One-Line Summary

**ViewMyCOA.com** is a Flask web application for managing batch-tracked products — structured attributes, COA (Certificate of Analysis) PDFs, printable labels, and Square POS catalog sync — with a public search portal where customers look up products by batch number.

Internal package name: `repl-nix-productattributemanager`

---

## Problem It Solves

Businesses selling batch-tracked products (supplements, specialty goods, etc.) need to:

- Store structured product attributes per batch/lot
- Publish COAs and labels tied to batch numbers
- Let customers search by batch number or product name
- Optionally sync catalog data to Square POS

The app serves as an internal admin tool plus a public-facing search site at **viewmycoa.com** `[INFERRED]`.

---

## Target Users

| Persona | Who | What they do |
|---------|-----|--------------|
| **Admin / operator** | Staff managing inventory and labels | Create/edit products, upload COAs, generate PDF labels, sync to Square |
| **Authenticated user** | Non-admin staff | View admin overview; limited access based on `is_admin` flag |
| **Public visitor** | Customer or regulator | Search batch number, view public product/COA details — no login |

---

## Core Workflows

### 1. Create product and generate label

1. Admin logs in → **Products → New**
2. Enters title, dynamic attributes, category, images, optional COA PDF, CraftMyPDF template
3. System auto-generates batch number (8 chars), SKU, UPC-A barcode
4. Admin generates label PDF via CraftMyPDF API → stored under `static/pdfs/<batch_number>/`
5. Public page live at `/batch/<batch_number>`

### 2. Public batch search

1. Visitor opens `/` (search home)
2. Searches by batch number or product title (SQL `ILIKE`)
3. Sees matching current products or historical batch records
4. Opens detail page with attributes and document links

### 3. Square catalog sync

1. Admin configures Square sandbox/production tokens in **Settings**
2. Syncs categories and products to Square Catalog API v2
3. Product records store `square_catalog_id`, `square_variation_id`, `square_image_id`

### 4. Batch number change (history)

When a product's batch number changes, the old batch is archived in **BatchHistory** with its attributes and COA path. Public search can still find historical batches.

---

## Feature Inventory

| Feature | Status | Description |
|---------|--------|-------------|
| Product CRUD | **Done** | Title, batch, SKU, barcode, cost, price, JSON attributes |
| Dynamic attributes | **Done** | Flexible key/value JSON on each product |
| Product templates | **Done** | Reusable attribute schemas (`ProductTemplate`) |
| Categories | **Done** | Many-to-many with products; Square category mapping |
| Batch history | **Done** | Snapshots when batch number changes |
| Product images | **Done** | Upload + resize (max 800×800); stored per product ID |
| Label images | **Done** | Separate uploaded label artwork |
| COA PDF upload | **Done** | Certificate of Analysis documents |
| CraftMyPDF labels | **Done** | External API generates printable label PDFs |
| Generated PDF tracking | **Done** | `GeneratedPDF` model stores metadata per product |
| Public search | **Done** | Unauthenticated home + search + batch detail |
| User management | **Done** | Admin-only CRUD for staff accounts |
| Settings / integrations | **Done** | Square tokens, CraftMyPDF API key in DB |
| Square catalog sync | **Done** | Products, categories, images to Square |
| Dev/prod asset sync | **Done** | Pull images/PDFs from production in dev |
| Health check | **Done** | `GET /health` |
| Internal Label Maker | **Planned** | Replace CraftMyPDF with drag-drop layout editor — see `CURRENT-STATE.md` |
| Automated tests | **Not started** | No pytest suite |
| CI/CD for app | **Not started** | Replit deploy only |

---

## URL Areas

| Area | Prefix | Auth | Purpose |
|------|--------|------|---------|
| Public search | `/`, `/search`, `/batch/<id>` | None | Customer batch lookup |
| Admin UI | `/vmc-admin/*` | Login required | Product, template, category, settings management |
| Auth | `/login`, `/logout` | — | Staff login |
| JSON API | `/api/*` | Mostly login/admin | CRUD helpers, PDF gen, Square sync |
| Health | `/health` | None | Uptime check |
| Static files | `/static/*` | None | Images, CSS, JS, PDFs |

---

## External Integrations

| Service | Purpose | Config location |
|---------|---------|-----------------|
| **CraftMyPDF** | Generate label PDFs from remote templates | Settings table → `craftmypdf_api_key`; per-product `craftmypdf_template_id` |
| **Square Catalog API** | Sync categories, products, images to POS | Settings table → sandbox/production tokens and location IDs |
| **Twilio** | Listed in dependencies | **Unused** — candidate for removal |

---

## Data at a Glance

| Entity | Purpose |
|--------|---------|
| `User` | Staff login (username, hashed password, `is_admin`) |
| `Product` | Current batch record with attributes, media paths, Square IDs |
| `ProductTemplate` | Reusable attribute schema for new products |
| `Category` | Product grouping + Square category ID |
| `BatchHistory` | Archived batch when number changes |
| `GeneratedPDF` | Metadata for generated label PDFs |
| `Settings` | Singleton row for integration credentials |

Files (images, COAs, labels) live on disk under `static/uploads/` and `static/pdfs/`. Database stores relative paths only.

---

## Hosting & Environments

| Environment | Platform | Notes |
|-------------|----------|-------|
| Development | Replit workspace | SQLite fallback; pulls prod assets on startup |
| Production | Replit deployment → viewmycoa.com `[INFERRED]` | PostgreSQL preferred |
| Staging | None detected | — |

**Run command:** `PORT=5000 python main.py`

---

## Project Health Summary

**Overall: needs attention** (as of 2026-07-09 intake)

| Domain | Rating | Key issue |
|--------|--------|-----------|
| Features | Good | Core workflows work in production `[INFERRED]` |
| Security | Poor | Default admin, weak secret fallback, open dev sync APIs |
| Testing | Poor | Zero automated tests |
| Architecture | Fair | Monolithic `app.py` (~1,800 lines) |
| Documentation | Fair | Aligned post-intake; FreshForge workflow installed |

---

## Known Risks (do not weaken)

| ID | Risk | Severity |
|----|------|----------|
| R-001 | Weak/missing `FLASK_SECRET_KEY` in production | Critical |
| R-002 | Default `admin`/`admin` on first boot | Critical |
| R-003 | Unauthenticated dev sync APIs | High |
| R-004 | No automated tests | High |
| R-005 | API keys stored in Settings DB row | High |
| R-008 | Some destructive APIs lack `@admin_required` | High |

Full list: `docs/project/RISK_REGISTER.md`

---

## Roadmap (Recommended Phases)

| Priority | Phase | Goal |
|----------|-------|------|
| P0 | security-hardening | Close critical auth/secret gaps |
| P1 | test-foundation | pytest + smoke CI |
| P1 | architecture-cleanup | Split `app.py` into blueprints |
| P2 | ops-and-storage | Object storage, monitoring, staging |
| Active | internal-label-maker | Internal PDF label generation (in plan/review) |

---

## Non-Goals

- Multi-tenant SaaS
- Mobile native apps
- Real-time inventory or order management (Square sync is catalog-only)
- Automated test suite (recommended future, not present today)

---

## Open Questions `[NEEDS HUMAN INPUT]`

1. Is `https://viewmycoa.com` the canonical production URL?
2. What compliance rules apply to COA/batch data (retention, access logging)?
3. Has the default `admin` password been changed in production?
4. Is PostgreSQL configured in production (not SQLite fallback)?
5. Who is the product owner for prioritizing roadmap phases?

---

## FreshForge Workflow Context

This repo uses **FreshForge** — an AI development workflow kit (`AGENTS.md`, `.cursor/`, `docs/`). All scoped changes follow:

**Plan → Review → Implement → Test → Signoff**

Workflow state lives in `.cursor/workflow/state.md`. This ChatGPT folder is maintained in parallel with `docs/` for external AI handoff.
