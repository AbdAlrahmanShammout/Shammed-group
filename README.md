# Shammed Group — Web Platform

Full-stack website for Shammed Group, a medical equipment and pharmaceutical services company based in Damascus, Syria.

- **Public site** — marketing pages (home, about, services, products, partners, contact)
- **Admin panel** — CMS for all content, media, catalog, and company information
- **Backend API** — NestJS REST API with MariaDB and local file storage

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Prerequisites](#prerequisites)
3. [Project Structure](#project-structure)
4. [Environment Setup](#environment-setup)
5. [Running Locally](#running-locally)
6. [Database](#database)
7. [Seeding and Restoring Data](#seeding-and-restoring-data)
8. [Media Files](#media-files)
9. [Admin Panel](#admin-panel)
10. [Public Site Routes](#public-site-routes)
11. [Testing](#testing)
12. [Deploying to a New Server](#deploying-to-a-new-server)
13. [Useful Commands Reference](#useful-commands-reference)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend framework | [NestJS](https://nestjs.com/) |
| Database | MariaDB (MySQL-compatible) via [Prisma ORM](https://www.prisma.io/) |
| File storage | Local filesystem (configurable path) |
| Frontend framework | [React](https://react.dev/) + [Vite](https://vitejs.dev/) |
| UI components | [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/) |
| Data fetching | [TanStack Query](https://tanstack.com/query) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Routing | [React Router](https://reactrouter.com/) |
| E2E tests | [Playwright](https://playwright.dev/) |
| Package manager | [pnpm](https://pnpm.io/) (workspaces) |

---

## Prerequisites

Install these before starting:

| Tool | Required version | Install |
|------|-----------------|---------|
| Node.js | ≥ 20.0.0 | https://nodejs.org |
| pnpm | ≥ 11.0.0 | `npm install -g pnpm` |
| MariaDB | ≥ 10.6 (or MySQL ≥ 8) | Plesk, Homebrew, or https://mariadb.org/download/ |

---

## Project Structure

```
Shammed_Group/
├── backend/                  NestJS API
│   ├── prisma/
│   │   ├── schema.prisma     Database schema
│   │   ├── migrations/       Migration history
│   │   └── seed.ts           Data seed script
│   ├── scripts/
│   │   ├── restore-all.mjs   Upload + attach all media (run after seed)
│   │   └── cleanup-unused-media.mjs  Delete orphaned media files
│   ├── src/
│   │   ├── modules/          Feature modules (media, product, service, …)
│   │   ├── providers/        Storage, database, email providers
│   │   └── config/           Environment configuration
│   ├── storage/              Uploaded media files (git-ignored)
│   ├── tmp/
│   │   ├── brand-assets/     logo.jpg, favicon-32.png
│   │   └── content-media/    Page and partner images
│   └── .env                  Backend environment variables
├── frontend/                 React + Vite dashboard and public site
│   ├── src/
│   │   ├── app/              Routes and app shell
│   │   ├── features/         Feature modules (products, services, …)
│   │   ├── components/       Shared UI components
│   │   ├── pages/            Thin route page components
│   │   └── generated/        API contract types
│   └── .env                  Frontend environment variables
├── docs/                     Architecture and content specifications
└── package.json              Root workspace scripts
```

---

## Environment Setup

### 1. Backend — `backend/.env`

Copy the template and fill in the required values:

```bash
cp backend/.env.example backend/.env   # if .env.example exists
# or create backend/.env manually
```

```env
# ── Required ─────────────────────────────────────────────
NODE_ENV=development
PORT=3000

# MariaDB connection string (Prisma uses the mysql:// protocol for MariaDB)
DATABASE_URL=mysql://YOUR_USER:YOUR_PASSWORD@localhost:3306/shammed_group

# Allowed frontend origin (CORS)
ALLOWED_ORIGINS=http://localhost:5173

# JWT secret — use a long random string in production
TOKEN_SECRET_KEY=change-me-to-a-long-random-secret

# Admin panel password
ADMIN_PASSWORD=your-admin-password

# ── Optional ─────────────────────────────────────────────
TOKEN_EXPIRES_IN=15m
SWAGGER_PATH=docs

# Local file storage path (relative to backend/)
STORAGE_ROOT_PATH=storage
STORAGE_MAX_FILE_BYTES=5242880   # 5 MB

# Email (for contact form)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_SECURE=
SMTP_FROM=
CONTACT_EMAIL=
```

### 2. Frontend — `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_PUBLIC_SITE_URL=http://localhost:5173
```

---

## Running Locally

### Install dependencies (run once from project root)

```bash
pnpm install
```

### Start backend

```bash
pnpm backend
# API available at http://localhost:3000
# Swagger docs at http://localhost:3000/docs
```

### Start frontend

```bash
pnpm frontend
# Public site at http://localhost:5173
# Admin panel at http://localhost:5173/admin
```

Run both together in two separate terminal tabs.

---

## Database

### Create the database

**Local MariaDB:**

```sql
CREATE DATABASE shammed_group CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'shammed'@'localhost' IDENTIFIED BY 'your-password';
GRANT ALL PRIVILEGES ON shammed_group.* TO 'shammed'@'localhost';
FLUSH PRIVILEGES;
```

**Plesk:**

1. Open **Databases** → **Add Database**.
2. Create a MariaDB database and user; grant the user full access to that database.
3. Copy the connection details into `DATABASE_URL`:

   `mysql://DB_USER:DB_PASSWORD@localhost:3306/DB_NAME`

   URL-encode special characters in the password (e.g. `@` → `%40`, `#` → `%23`).

### Run migrations

```bash
pnpm --filter backend prisma migrate deploy
```

This applies all migrations in `backend/prisma/migrations/` in order.

### View / manage schema

Open Prisma Studio (visual database browser):

```bash
pnpm --filter backend prisma studio
```

---

## Seeding and Restoring Data

### Seed only (text data, no media)

```bash
pnpm --filter backend seed
```

This upserts all CMS content: site settings, home page, about page, product categories, partners, services, products, and the headquarters location.

### Full restore — seed + all media (recommended for a fresh server)

```bash
pnpm --filter backend restore
```

This runs the seed **and then** uploads every media file from `backend/tmp/` and attaches them to the correct entities. See [Media Files](#media-files) for what files are needed.

### Restore to a remote server

```bash
API_BASE_URL=https://your-server.com pnpm --filter backend restore
```

---

## Media Files

All media source files live in `backend/tmp/` (not committed to git). You must supply these files before running `pnpm restore`.

### `backend/tmp/brand-assets/`

| File | Used for |
|------|----------|
| `logo.jpg` | Company logo (site-wide header and footer) |
| `favicon-32.png` | Browser tab icon |

### `backend/tmp/content-media/`

| File | Used for |
|------|----------|
| `hero.jpg` | Home page hero background |
| `about-preview.jpg` | Home page "About" preview section |
| `why.jpg` | Home page "Why Shammed Group" section |
| `about-overview.jpg` | About page overview image |
| `service-pharma.jpg` | Service: Pharmaceutical Equipment image |
| `service-supplies.jpg` | Service: Operation Supplies image |
| `partner-storz.png` | STORZ Medical AG logo |
| `partner-technix.webp` | Technix logo |
| `partner-karlstorz.png` | KARL STORZ logo |
| `partner-kls.png` | KLS Martin Group logo |
| `partner-dialife.png` | Dialife Group logo |
| `partner-oes.webp` | OES logo (white on brand navy — generate with `pnpm generate:oes-logo` if missing) |
| `partner-smd-medicare.webp` | SMD Medicare logo |
| `partner-bistos.png` | Bistos Co logo |

> **Product images** are downloaded automatically from source URLs embedded in each product's
> `detailedDescription` field when you run `pnpm restore`. No local product image files are needed.

### Clean up orphaned media

After uploading, you can remove any media records not attached to any entity:

```bash
# Preview what would be deleted (no changes):
node backend/scripts/cleanup-unused-media.mjs --dry-run

# Delete orphaned media:
pnpm --filter backend cleanup:media
```

---

## Admin Panel

Log in at `http://localhost:5173/admin/login` with the password from `ADMIN_PASSWORD` in `backend/.env`.

| Admin section | URL | What you can manage |
|---------------|-----|---------------------|
| Dashboard | `/admin` | Overview |
| Home Page | `/admin/home-page` | Hero, about preview, why section, CTAs |
| About Page | `/admin/about-page` | Overview, vision, mission, values |
| Site Settings | `/admin/settings` | Company name, logo, favicon, contact info |
| Product Categories | `/admin/categories` | Category names and visibility |
| Products | `/admin/products` | Product catalog with images |
| Partners | `/admin/partners` | Partner logos and descriptions |
| Services | `/admin/services` | Service entries with images |
| Locations | `/admin/locations` | Office locations and Google Maps embeds |
| Contact Information | `/admin/contact-information` | Email, phone, WhatsApp, address |
| Social Media | `/admin/social-media` | Platform links (Facebook, Instagram, etc.) |

---

## Public Site Routes

| Route | Page |
|-------|------|
| `/` | Home — hero, services preview, products, partners |
| `/about` | Company overview, vision, mission |
| `/services` | Full services list with images |
| `/products` | Product catalog with category filter |
| `/products/:id` | Product detail page |
| `/partners` | Partner grid |
| `/contact` | Contact form and location map |

---

## Testing

### Backend unit tests

```bash
pnpm backend:test
```

### Frontend unit tests

```bash
pnpm frontend:test
```

### Frontend E2E tests (Playwright)

The backend and frontend must be running first.

```bash
# Install browsers once:
pnpm --filter frontend exec playwright install

# Run E2E tests:
pnpm frontend:test:e2e
```

### All tests

```bash
pnpm backend:test && pnpm frontend:test
```

---

## Deploying to a New Server

### Step-by-step

```bash
# 1. Install dependencies
pnpm install

# 2. Create the MariaDB database (see Database section — Plesk or local SQL)

# 3. Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env — set DATABASE_URL (mysql://…), ADMIN_PASSWORD, TOKEN_SECRET_KEY

cp frontend/.env.example frontend/.env
# Edit frontend/.env — set VITE_API_BASE_URL to your production domain

# 4. Run database migrations
pnpm --filter backend prisma migrate deploy

# 5. Place media files in backend/tmp/ (see Media Files section above)

# 6. Start the backend API, then seed + restore media
pnpm --filter backend seed
API_BASE_URL=https://your-api.com node backend/scripts/restore-all.mjs
# Or locally with backend running on :3000:
pnpm --filter backend restore

# 7. Build for production
pnpm backend:build
pnpm frontend:build
# Built frontend is at frontend/dist/ — serve with nginx/Caddy/etc.
# Backend: node backend/dist/src/main.js
```

### Plesk production checklist

1. Create MariaDB database + user in Plesk; set `DATABASE_URL` in the Node.js app environment.
2. Deploy the app and run `pnpm install` + `pnpm backend:build` (Prisma client generates on postinstall).
3. `pnpm --filter backend prisma migrate deploy` — creates all tables on the empty database.
4. `pnpm --filter backend seed` — loads CMS text data (partners, products, pages, etc.).
5. With the API running: `API_BASE_URL=https://your-domain.com node backend/scripts/restore-all.mjs` — uploads and attaches media.
6. Verify `/health` and admin login.

### Production environment notes

- Set `NODE_ENV=production` in `backend/.env`
- Set `TOKEN_SECRET_KEY` to a long cryptographically random string
- Set `ALLOWED_ORIGINS` to your production frontend URL
- Point `STORAGE_ROOT_PATH` to a persistent volume if using containers
- Configure SMTP settings for the contact form to work
- Serve `frontend/dist/` as a static site with all routes falling back to `index.html`

---

## Useful Commands Reference

```bash
# ── Development ───────────────────────────────────────────
pnpm backend                         # Start backend dev server
pnpm frontend                        # Start frontend dev server

# ── Database ──────────────────────────────────────────────
pnpm --filter backend prisma migrate deploy    # Apply migrations
pnpm --filter backend prisma migrate dev       # Create a new migration
pnpm --filter backend prisma studio            # Open database browser

# ── Data ──────────────────────────────────────────────────
pnpm --filter backend seed                     # Seed text data only
pnpm --filter backend restore                  # Seed + upload all media
API_BASE_URL=https://... pnpm --filter backend restore   # Restore to remote server

# ── Media cleanup ─────────────────────────────────────────
node backend/scripts/cleanup-unused-media.mjs --dry-run  # Preview
pnpm --filter backend cleanup:media                       # Delete orphaned media

# ── Build ─────────────────────────────────────────────────
pnpm backend:build                   # Build backend
pnpm frontend:build                  # Build frontend (output: frontend/dist/)

# ── Tests ─────────────────────────────────────────────────
pnpm backend:test                    # Backend unit tests
pnpm frontend:test                   # Frontend unit tests
pnpm frontend:test:e2e               # E2E tests (needs running servers)

# ── Lint ──────────────────────────────────────────────────
pnpm backend:lint                    # Lint backend
pnpm frontend:lint                   # Lint frontend
```
