# KOOLA API Backend

Fastify API server cho KOOLA website — TypeScript, PostgreSQL, raw SQL.

## Tech Stack

- **Framework**: Fastify 4.x
- **Database**: PostgreSQL 16 (raw SQL only, no ORM)
- **Language**: TypeScript
- **Validation**: Zod → JSON Schema (auto-converted)
- **Authentication**: JWT + Refresh Tokens (bcrypt)
- **API Docs**: Swagger/OpenAPI 3 tại `/api-docs`
- **Monitoring**: Health checks, Prometheus metrics, DB performance tracking

## Architecture (Layered)

```
Request → Routes → Middleware (auth) → Controller → Service → Repository → SQL → PostgreSQL
```

```
src/
├── server.ts                # Fastify setup, plugins, swagger
├── index.ts                 # Entry point
├── routes/
│   ├── public/              # Public API routes (/v1)
│   │   ├── services.ts, posts.ts, pages.ts, jobs.ts
│   │   ├── leads.ts, newsletter.ts, nav.ts, site.ts
│   │   ├── about/, careers/, services/ (aggregated pages)
│   │   └── services-slug-map.ts
│   ├── admin/               # Admin routes (/v1/admin) — JWT protected
│   │   ├── auth.ts, users.ts
│   │   ├── services.ts, posts.ts, categories.ts, tags.ts
│   │   ├── pages.ts, navItems.ts, siteSettings.ts
│   │   ├── media.ts, jobs.ts, leads.ts, newsletterSubscribers.ts
│   │   └── index.ts
│   └── monitoring.ts        # Health checks & metrics
├── controllers/             # Request/response handling
├── services/                # Business logic
├── repositories/            # Data access (SQL execution)
├── schemas/                 # Zod validation schemas
├── swagger/                 # OpenAPI schema definitions (Zod → JSON Schema)
├── sql/                     # Raw SQL queries
│   ├── public/              # Public query files
│   └── admin/               # Admin query files
├── monitoring/              # HealthCheck, MetricsCollector, requestTracing
├── middleware/              # Auth (JWT), error handler
├── db/                      # Database connection pool
└── utils/                   # Helpers
```

## API Endpoints

### Swagger UI

Production: https://koola.vn/api-docs
Local: http://localhost:4000/api-docs

### Public (`/v1`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/services` | List services (paginated, locale, sort) |
| GET | `/v1/services/:slug` | Service detail (deliverables, FAQs, related) |
| GET | `/v1/services/page` | Services page CMS data |
| GET | `/v1/services/slug-map` | Cross-locale slug mapping |
| GET | `/v1/posts` | List posts (paginated, filterable) |
| GET | `/v1/posts/:slug` | Post detail |
| GET | `/v1/pages/:slug` | CMS page by slug |
| GET | `/v1/pages/about/aggregate` | About page aggregate |
| GET | `/v1/pages/careers/aggregate` | Careers page aggregate |
| GET | `/v1/nav` | Navigation items |
| GET | `/v1/site/settings` | Site settings |
| POST | `/v1/leads` | Submit contact form |
| POST | `/v1/newsletter/subscribe` | Newsletter subscribe |
| POST | `/v1/newsletter/unsubscribe` | Newsletter unsubscribe |
| GET | `/v1/jobs` | Job listings |
| GET | `/v1/jobs/:slug` | Job detail |
| GET | `/v1/jobs/slug-map` | Cross-locale job slug mapping |
| POST | `/v1/jobs/:slug/apply` | Job application |
| POST | `/v1/chat` | AI chat (SSE streaming) |

### Admin (`/v1/admin`) — JWT protected

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/admin/auth/login` | Login (returns access + refresh tokens) |
| POST | `/v1/admin/auth/refresh` | Refresh access token |
| POST | `/v1/admin/auth/logout` | Logout (revoke refresh token) |
| CRUD | `/v1/admin/services` | Service management |
| POST | `/v1/admin/services/:id/translate` | Auto-translate service |
| POST | `/v1/admin/services/:id/sync-images` | Sync service images |
| CRUD | `/v1/admin/posts` | Post management |
| CRUD | `/v1/admin/categories` | Category management |
| CRUD | `/v1/admin/tags` | Tag management |
| CRUD | `/v1/admin/pages` | Page management |
| CRUD | `/v1/admin/pages/:id/sections` | Page sections management |
| CRUD | `/v1/admin/nav-items` | Navigation items |
| CRUD | `/v1/admin/site-settings` | Site settings |
| CRUD | `/v1/admin/media` | Media uploads |
| CRUD | `/v1/admin/jobs` | Job management |
| GET | `/v1/admin/jobs/:id/applications` | Job applications list |
| PATCH | `/v1/admin/jobs/:id/applications/:applicationId/status` | Update application status |
| CRUD | `/v1/admin/users` | User management |
| GET | `/v1/admin/users/roles` | List available roles |
| PUT | `/v1/admin/users/:id/password` | Change user password |
| PUT | `/v1/admin/users/:id/toggle-active` | Toggle user active status |
| GET/PATCH | `/v1/admin/leads` | Lead management |
| GET/PATCH | `/v1/admin/newsletter-subscribers` | Newsletter subscriber management |

### Monitoring (no prefix)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Liveness check |
| GET | `/health/ready` | Readiness check (DB connectivity) |
| GET | `/health/full` | Detailed health report |
| GET | `/metrics` | Prometheus text format |
| GET | `/metrics/json` | JSON metrics snapshot |
| GET | `/metrics/db` | DB performance (slow queries, pool stats) |
| GET | `/metrics/timeseries` | Time-series data |
| GET | `/metrics/aggregated` | Aggregated metrics |

## Scripts

```bash
npm run dev          # Development server (hot reload)
npm run build        # Build TypeScript
npm start            # Production server
npm run type-check   # TypeScript type checking
npm run test         # Run tests
npm run lint         # Lint
```

## Environment Variables

```env
NODE_ENV=development
PORT=4000
HOST=0.0.0.0
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_ACCESS_SECRET=your-secret (min 32 chars in production)
JWT_REFRESH_SECRET=your-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGINS=http://localhost:3000
RATE_LIMIT_MAX=100
RATE_LIMIT_TIMEWINDOW=60000
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

## Development Guidelines

1. **Raw SQL only** — no ORM, parameterized queries (`$1, $2, ...`)
2. **Zod validation** cho tất cả inputs
3. **Layered architecture**: Routes → Controllers → Services → Repositories → SQL
4. **Transactions** cho multi-table writes
5. **SQL queries** tập trung trong `src/sql/`

