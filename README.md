# KOOLA Website

Monorepo cho website KOOLA — Fastify API + Next.js frontend, deploy qua Docker Compose + Cloudflare Tunnel.

## Tech Stackv 

**Backend** (`apps/api`)
- Fastify 4, TypeScript, PostgreSQL 16 (raw SQL, no ORM)
- Zod validation, JWT auth (access + refresh tokens)
- Swagger/OpenAPI docs tại `/api-docs`
- Monitoring: health checks, Prometheus metrics, DB performance

**Frontend** (`apps/web`)
- Next.js 14 (App Router), Tailwind CSS
- i18n: English + Vietnamese (`/en`, `/vi`)
- SSR (force-dynamic), Server Components
- Admin panel tại `/admin`

**Infrastructure**
- Docker Compose (postgres, api, web, nginx, cloudflared)
- Nginx reverse proxy
- Cloudflare Tunnel (expose ra internet không cần IP tĩnh)

## Quick Start

### Development (Docker)

```bash
docker-compose up -d
```

Services:
- Web: http://localhost:3000
- API: http://localhost:4000
- PostgreSQL: localhost:5432
- pgAdmin: http://localhost:5050 (admin@koola.local / admin)

### Development (Local)

```bash
# Install dependencies
npm install

# Setup database
createdb koola_db
psql -d koola_db -f db.sql
psql -d koola_db -f seed.sql

# Run API
cd apps/api && cp .env.example .env && npm run dev

# Run Web (separate terminal)
cd apps/web && npm run dev
```

### Production

```bash
# Build web trước (Dockerfile.web COPY .next/standalone)
npm run build --workspace=apps/web

# Start production stack
docker compose -f docker-compose.production.yml --env-file .env.production.local up -d --build
```

Production stack: postgres → api → web → nginx → cloudflared → koola.vn

## Project Structure

```
koola-website/
├── apps/
│   ├── api/                    # Fastify API backend
│   │   ├── src/
│   │   │   ├── controllers/    # Request/response handling
│   │   │   ├── services/       # Business logic
│   │   │   ├── repositories/   # Data access
│   │   │   ├── routes/         # Route definitions (public + admin)
│   │   │   ├── schemas/        # Zod validation schemas
│   │   │   ├── sql/            # Raw SQL queries
│   │   │   ├── swagger/        # OpenAPI schema definitions
│   │   │   ├── monitoring/     # Health checks, metrics, tracing
│   │   │   ├── middleware/     # Auth, error handling
│   │   │   └── db/            # Database connection
│   │   └── tests/
│   └── web/                    # Next.js frontend
│       ├── app/
│       │   ├── [locale]/       # Public pages (en/vi)
│       │   └── admin/[locale]/ # Admin panel
│       ├── components/
│       └── src/lib/            # API clients, utilities
├── nginx/                      # Nginx reverse proxy config
├── migrations/                 # SQL migration files
├── db.sql                      # Database schema
├── seed.sql                    # Sample data
├── docker-compose.yml          # Development
├── docker-compose.production.yml # Production
├── Dockerfile                  # API container
└── Dockerfile.web              # Web container
```

## API Endpoints

Base URL: `https://koola.vn/api` (production) | `http://localhost:4000` (dev)

**API Docs**: https://koola.vn/api-docs (Swagger UI)

### Public (`/v1`)
- `GET /v1/services` — List services (paginated, filterable)
- `GET /v1/services/:slug` — Service detail (bundled with deliverables, FAQs, related)
- `GET /v1/posts` — List posts
- `GET /v1/posts/:slug` — Post detail
- `GET /v1/pages/:slug` — CMS page by slug
- `GET /v1/nav` — Navigation items
- `GET /v1/site/settings` — Site settings
- `POST /v1/leads` — Contact form
- `POST /v1/newsletter/subscribe` — Newsletter subscribe
- `GET /v1/jobs` — Job listings
- `GET /v1/jobs/:slug` — Job detail

### Admin (`/v1/admin`) — JWT protected
- Auth: login, refresh, logout
- Full CRUD: services, posts, categories, tags, pages, sections, nav items, site settings, media, jobs, users
- Management: leads, newsletter subscribers

### Monitoring
- `GET /health` — Liveness check
- `GET /health/ready` — Readiness check
- `GET /health/full` — Detailed health report
- `GET /metrics` — Prometheus format
- `GET /metrics/json` — JSON metrics
- `GET /metrics/db` — DB performance

## Authentication

JWT-based với refresh token pattern.

Default admin (seed.sql): `admin@koola.com` / `admin123`

## Environment Variables

Xem `.env.example` (API) và `.env.production.local` (production).

Key variables: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGINS`, `CLOUDFLARE_TUNNEL_TOKEN`

## Resources

- [API Documentation](apps/api/README.md)
- [Web Documentation](apps/web/README.md)
- [Database Schema](db.sql)
- [Cloudflare Tunnel Setup](docs/2026-03-05_CLOUDFLARE_TUNNEL_SETUP.md)
- [Swagger UI](https://koola.vn/api-docs)

