# ViewMyCOA.com — Architecture & Code Reference

> Technical structure, file layout, routes, data model, scripts, and conventions. For product context see `PROJECT-OVERVIEW.md`.

**Last updated:** 2026-07-09  
**Source:** `docs/architecture/`, `docs/standards/`, codebase inspection

---

## Stack

| Layer | Technology | Version / notes |
|-------|------------|-----------------|
| Language | Python | 3.11+ |
| Web framework | Flask | 3.1+ |
| ORM | SQLAlchemy via Flask-SQLAlchemy | — |
| Migrations | Flask-Migrate / Alembic | `migrations/` |
| Auth | Flask-Login + custom `User` model | Signed cookie sessions |
| Templates | Jinja2 | Server-rendered HTML |
| CSS | Bootstrap 5 dark theme | Replit CDN + `static/css/custom.css` |
| JS | Vanilla JS | `static/js/main.js`, `product.js`, `template.js` |
| Database | PostgreSQL (prod) / SQLite (dev fallback) | — |
| Package manager | uv | `pyproject.toml`, `uv.lock` |
| Hosting | Replit | `REPLIT_DEPLOYMENT=1` in prod |

No separate frontend SPA. No build tool. No job queue.

---

## System Diagram

```
┌─────────────┐     HTTPS      ┌──────────────────────────────┐
│   Browser   │ ─────────────► │  Flask app (main.py / app.py) │
└─────────────┘                │  Jinja2 templates + static/    │
                               └───────────┬──────────────────┘
                                           │
              ┌────────────────────────────┼────────────────────────────┐
              ▼                            ▼                            ▼
     ┌────────────────┐          ┌─────────────────┐          ┌─────────────────┐
     │ PostgreSQL or  │          │ static/uploads  │          │ CraftMyPDF API  │
     │ SQLite (ORM)   │          │ static/pdfs     │          │ Square Catalog  │
     └────────────────┘          └─────────────────┘          └─────────────────┘
```

---

## Repository Layout

```
project-root/
├── main.py                    # Entry point: init DB, default admin, run server
├── app.py                     # Main Flask app (~1,800 lines, most routes)
├── models.py                  # SQLAlchemy models
├── utils.py                   # Batch/SKU/barcode generation, image validation
├── decorators.py              # @admin_required
├── routes/
│   ├── auth_routes.py         # Login, logout, user CRUD
│   └── admin_routes.py        # Partial admin route split (overview, product list)
├── square_product_sync.py     # Square product sync logic
├── square_category_sync.py    # Square category sync logic
├── square_image_upload.py     # Square image upload
├── sync_images.py             # Pull images from production (dev)
├── sync_pdfs.py               # Pull PDFs from production (dev)
├── startup_sync.py            # Dev boot sync orchestration
├── backup.py                  # SQLite + uploads backup
├── restart.py                 # Server restart helper
├── templates/                 # Jinja2 HTML templates
├── static/
│   ├── css/custom.css
│   ├── js/                    # main.js, product.js, template.js
│   ├── img/                   # Brand assets
│   ├── uploads/<product_id>/  # Product and label images
│   └── pdfs/<batch_number>/   # COA and generated label PDFs
├── migrations/                # Alembic migrations
├── instance/                  # SQLite DB (dev fallback)
├── backups/                   # Manual backup output
├── chatgpt/                   # External AI handoff docs (this folder)
├── docs/                      # FreshForge permanent documentation
├── .cursor/                   # FreshForge workflow (agents, skills, state)
├── AGENTS.md                  # Cursor AI entry point
├── pyproject.toml             # Python dependencies
└── .replit                    # Replit run/deploy config
```

---

## Application Layers

| Layer | Location | Responsibility |
|-------|----------|----------------|
| UI | `templates/`, `static/` | HTML, forms, client helpers |
| HTTP routes | `app.py`, `routes/*` | Request handling, auth, redirects |
| Domain helpers | `utils.py`, `decorators.py` | ID generation, image validation, admin guard |
| Integrations | `square_*.py` | External API orchestration |
| Sync jobs | `sync_*.py`, `startup_sync.py`, `backup.py` | Dev/prod asset sync, backups |
| Data | `models.py` | ORM models and `db` session |
| Migrations | `migrations/` | Schema versioning |

**Note:** No strict service layer. Route handlers call models and integrations directly. Documented tech debt (TD-001).

---

## Entry Points

| File | Role |
|------|------|
| `main.py` | Creates app, runs `db.create_all()`, seeds default admin if none exists, starts server on `0.0.0.0:PORT` |
| `app.py` | Flask app factory pattern inline; registers routes, login manager, error handlers, CORS header |

---

## Data Model

### User

| Field | Type | Notes |
|-------|------|-------|
| id | Integer PK | — |
| username | String(100) | Unique |
| password_hash | String(256) | Werkzeug hash |
| email | String(120) | Unique |
| is_admin | Boolean | Default false |
| created_at | DateTime | UTC |

### Product

| Field | Type | Notes |
|-------|------|-------|
| id | Integer PK | — |
| title | String(200) | Required |
| batch_number | String(8) | Public lookup key |
| sku | String(8) | Unique |
| barcode | String(12) | Unique UPC-A |
| attributes | Text (JSON) | Dynamic key/value pairs |
| cost, price | Float | Optional |
| product_image | String(500) | Path under `static/` |
| label_image | String(500) | Path under `static/` |
| coa_pdf | String(500) | COA document path |
| template_id | FK → ProductTemplate | Optional |
| craftmypdf_template_id | String(255) | External PDF template |
| label_qty | Integer | Labels per PDF (default 4) |
| square_catalog_id | String(255) | Square item ID |
| square_image_id | String(255) | Square image ID |
| square_variation_id | String(255) | Square variation ID |
| created_at | DateTime | UTC |

### ProductTemplate

| Field | Type | Notes |
|-------|------|-------|
| id | Integer PK | — |
| name | String(200) | — |
| attributes | Text (JSON) | Default attribute keys/values |
| created_at | DateTime | UTC |

### Category

| Field | Type | Notes |
|-------|------|-------|
| id | Integer PK | — |
| name | String(100) | Unique |
| description | Text | Optional |
| square_category_id | String(255) | Square mapping |
| created_at | DateTime | UTC |

### BatchHistory

Snapshot when batch number changes. Fields: `product_id`, `batch_number`, `attributes` (JSON), `coa_pdf`, `created_at`.

### GeneratedPDF

Metadata for CraftMyPDF-generated labels. Fields: `product_id`, `batch_history_id` (optional), `filename`, `pdf_url`, `created_at`.

### Settings (singleton)

| Field | Purpose |
|-------|---------|
| show_square_id_controls | Dev UI toggles |
| show_square_image_id_controls | Dev UI toggles |
| square_environment | `sandbox` or `production` |
| square_sandbox_access_token | **Sensitive** |
| square_sandbox_location_id | — |
| square_production_access_token | **Sensitive** |
| square_production_location_id | — |
| craftmypdf_api_key | **Sensitive** |

Access: `Settings.get_settings()` — creates row if missing.

### Relationships

```
Product ←→ Category        (many-to-many via product_categories)
Product → ProductTemplate  (many-to-one, SET NULL on delete)
Product → GeneratedPDF     (one-to-many, CASCADE)
Product → BatchHistory     (one-to-many, CASCADE)
BatchHistory → GeneratedPDF (one-to-many, optional FK)
```

---

## Route Inventory

### Public (no auth)

| Method | Path | Handler area | Purpose |
|--------|------|--------------|---------|
| GET | `/` | app.py | Search home |
| GET | `/search` | app.py | Search results |
| GET | `/batch/<batch_number>` | app.py | Public product detail |
| GET | `/health` | app.py | Health check |
| GET | `/static/pdfs/<path>` | app.py | PDF download |

### Auth

| Method | Path | File | Purpose |
|--------|------|------|---------|
| GET/POST | `/login` | auth_routes.py | Login form |
| GET | `/logout` | auth_routes.py | Logout |

### Admin UI (login required; most writes need admin)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/vmc-admin/overview` | Dashboard (any logged-in user) |
| GET | `/vmc-admin/dashboard` | Product dashboard |
| GET | `/vmc-admin/products` | Product list |
| GET | `/vmc-admin/products/detail/<id>` | Product detail |
| GET/POST | `/vmc-admin/products/new` | Create product |
| GET/POST | `/vmc-admin/products/<id>/edit` | Edit product |
| GET | `/vmc-admin/templates` | Template list |
| GET/POST | `/vmc-admin/template/new` | Create template |
| GET/POST | `/template/<id>/edit` | Edit template |
| GET | `/vmc-admin/categories` | Category management |
| GET/POST | `/vmc-admin/settings` | Integration settings |
| GET | `/vmc-admin/users` | User list |
| GET/POST | `/vmc-admin/users/new` | Create user |
| GET/POST | `/vmc-admin/users/<id>/edit` | Edit user |

### JSON API

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/generate_batch` | Login | Generate batch number |
| POST | `/api/generate_pdf/<id>` | Login | CraftMyPDF label generation |
| GET | `/api/generate_json/<id>` | Login | Label JSON preview |
| DELETE | `/api/delete_pdf/<id>` | Login | Delete PDF record |
| DELETE | `/api/delete_coa/<id>` | Login | Delete COA **(should be admin)** |
| DELETE | `/api/delete_batch_history/<id>` | Login | Delete history **(should be admin)** |
| POST | `/api/duplicate_product/<id>` | Admin | Duplicate product |
| DELETE | `/api/delete_product/<id>` | Admin | Delete product |
| POST | `/api/categories` | Admin | Create category |
| PUT | `/api/categories/<id>` | Admin | Update category |
| DELETE | `/api/categories/<id>` | Admin | Delete category |
| POST | `/api/categories/<id>/sync` | Admin | Sync category to Square |
| POST | `/api/categories/<id>/unsync` | Admin | Unsync category |
| GET | `/api/template/<id>` | Login | Get template JSON |
| POST | `/api/duplicate_template/<id>` | Admin | Duplicate template |
| DELETE | `/api/delete_template/<id>` | Admin | Delete template |
| POST | `/api/square/sync/<id>` | Admin | Sync product to Square |
| POST | `/api/square/unsync/<id>` | Admin | Unsync product |
| POST | `/api/square/unsync-all` | Login | Bulk unsync **(should be admin)** |
| POST | `/api/square/clear-id/<id>` | Admin | Clear Square catalog ID |
| POST | `/api/square/clear-image-id/<id>` | Admin | Clear Square image ID |
| DELETE | `/api/users/<id>` | Admin | Delete user |

### Dev-only sync (no auth — security gap)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/sync/images` | Pull images from production |
| POST | `/api/sync/pdfs` | Pull PDFs from production |

Returns 403 when `REPLIT_DEPLOYMENT=1`.

---

## Key Templates

| Template | Purpose |
|----------|---------|
| `base.html` | Admin shell (navbar, flash messages) |
| `search_home.html` | Public search landing |
| `product_list.html` | Admin product table |
| `product_detail.html` | Admin product view |
| `product_create.html` / `product_edit.html` | Product forms |
| `template_list.html` / `template_create.html` / `template_edit.html` | Template management |
| `settings.html` | Integration credentials |
| `user_list.html` / `user_edit.html` | User management |
| `404.html` | Not found |

---

## Utility Functions (`utils.py`)

| Function | Purpose |
|----------|---------|
| `generate_batch_number()` | 8-char alphanumeric batch ID |
| `generate_sku()` | 8-char SKU |
| `generate_barcode()` | 12-digit UPC-A |
| `is_valid_image()` | Pillow validation |
| `save_image()` | Resize (max 800×800), save to uploads |

---

## External API Integration

### CraftMyPDF

- **Endpoints used:** `POST /v1/create`, `GET /v1/list-templates`
- **Auth:** `X-API-KEY` header from Settings
- **Flow:** Product data + template ID → PDF bytes → saved to `static/pdfs/<batch>/`
- **Trigger:** `POST /api/generate_pdf/<product_id>`

### Square Catalog API v2

- **Modules:** `square_product_sync.py`, `square_category_sync.py`, `square_image_upload.py`
- **Auth:** Bearer token from Settings (sandbox or production)
- **Stored IDs:** `square_catalog_id`, `square_variation_id`, `square_image_id` on Product; `square_category_id` on Category

---

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `FLASK_SECRET_KEY` | Yes (prod) | Session signing — **has weak fallback if missing** |
| `DATABASE_URL` | Recommended | PostgreSQL connection string |
| `PGUSER`, `PGPASSWORD`, `PGHOST`, `PGPORT`, `PGDATABASE` | Alt | Postgres components |
| `REPLIT_DEPLOYMENT` | Auto | `1` when deployed |
| `PORT` | No | HTTP port (default 5000) |

Integration secrets (Square, CraftMyPDF) are in the **Settings database table**, not env vars.

---

## Scripts & Commands

| Command | Purpose |
|---------|---------|
| `PORT=5000 python main.py` | Start dev/prod server |
| `python sync_images.py` | Pull images from production |
| `python sync_pdfs.py` | Pull PDFs from production |
| `python startup_sync.py [--debug]` | Dev boot sync |
| `python backup.py` | SQLite + uploads backup |

No test or lint commands configured.

---

## Migrations

| Date | Migration | Change |
|------|-----------|--------|
| 2025-03-05 | `c7901f193a36` | Add `square_variation_id` to Product |

**Gap:** Only one Alembic migration; schema also created via `db.create_all()` at startup (TD-009).

---

## UI Conventions

- Bootstrap 5 dark theme (`data-bs-theme="dark"`)
- Font Awesome 6.4 icons
- Minimal custom CSS in `static/css/custom.css`
- Admin brand: "Product Manager" in navbar `[INFERRED]`
- Public brand: ViewMyCOA.com with logo at `static/img/ViewMyCOA_1.png`
- Flash messages via Bootstrap alerts

---

## Security Architecture Notes

| Topic | Current state |
|-------|---------------|
| Auth | Flask-Login signed cookies |
| Authorization | `@login_required`, `@admin_required` — **inconsistent on some APIs** |
| CORS | `Access-Control-Allow-Origin: *` on all responses |
| CSRF | Not explicitly implemented |
| Rate limiting | None |
| File access | Path-based; no signed URLs |
| Secrets | DB Settings row + env vars |

---

## Tech Debt Highlights

| ID | Issue | Severity |
|----|-------|----------|
| TD-001 | Monolithic `app.py` (~40 routes) | Medium |
| TD-002 | Default admin/admin on first boot | Critical |
| TD-003 | No automated tests | High |
| TD-006 | Weak FLASK_SECRET_KEY fallback | Critical |
| TD-007 | Unauthenticated dev sync APIs | High |
| TD-009 | `db.create_all()` + Alembic | Medium |
| TD-012 | `auto_sync` imported but module missing | Medium |
| TD-014 | Destructive APIs lack `@admin_required` | High |

Full register: `docs/project/TECH_DEBT.md`

---

## Architecture Decisions (ADRs)

| ADR | Decision |
|-----|----------|
| ADR-007 | Flask monolith on Replit |
| ADR-008 | Square Catalog API for POS sync |
| ADR-009 | CraftMyPDF for label generation |
| ADR-010 | Local filesystem for uploads and PDFs |

Full log: `docs/project/DECISIONS.md`

---

## Coding Conventions

- Python: follow existing patterns in `app.py` and `models.py`
- Templates: Jinja2 with Bootstrap components
- No strict service layer — match existing direct route → model pattern
- JSON attributes stored as Text columns, parsed via helper methods
- Logging at DEBUG in several modules

See `docs/standards/CODING_STANDARDS.md` for full standards.
