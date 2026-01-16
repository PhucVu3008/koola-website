# KOOLA Website 


## 🏗️ Kiến trúc dự án


## 🚀 Tech Stack

### Backend
- **Framework**: Fastify 4.x
- **Database**: PostgreSQL 16 (raw SQL only, NO ORM)
- **Language**: TypeScript
- **Validation**: Zod
- **Auth**: JWT + Refresh Tokens (bcrypt)
- **API**: RESTful JSON

### Frontend (Coming soon)
- **Framework**: Next.js 14+ (App Router)
- **Rendering**: SSG/ISR preferred, SSR when needed
- **Styling**: Tailwind CSS / CSS Modules
- **SEO**: Metadata API, Sitemap, Robots, JSON-LD

## 🐳 Quick Start với Docker

### 1. Clone repository
```bash
git clone <repo-url>
cd koola-website
```

### 2. Start all services
```bash
docker-compose up -d
```

### 3. Seed database (first time only)
```bash
docker exec -i koola-postgres psql -U koola_user -d koola_db < seed.sql
```

### 4. Verify everything is running
```bash
# Check container status
docker-compose ps

# Test API
curl http://localhost:4000/v1/services?locale=en
```

Services sẽ chạy tại:
- **API Backend**: http://localhost:4000
- **PostgreSQL**: localhost:5432
- **PgAdmin**: http://localhost:5050

### 📊 Verification Report

See [BACKEND_VERIFICATION.md](./BACKEND_VERIFICATION.md) for detailed test results and API examples.
- **PostgreSQL**: localhost:5432
- **pgAdmin**: http://localhost:5050 (admin@koola.local / admin)

### 3. Seed database với sample data
```bash
docker exec -i koola-postgres psql -U koola_user -d koola_db < seed.sql
```

### 4. Test API
```bash
# Health check
curl http://localhost:4000/health

# Get services
curl http://localhost:4000/v1/services?locale=en

# Login
curl -X POST http://localhost:4000/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@koola.com", "password": "admin123"}'
```

## 💻 Development (Local - không dùng Docker)

### Prerequisites
- Node.js 18+
- PostgreSQL 16+
- npm/yarn/pnpm

### Setup Backend

1. **Install dependencies**:
```bash
cd apps/api
npm install
```

2. **Setup database**:
```bash
# Tạo database
createdb koola_db

# Import schema
psql -d koola_db -f ../../db.sql

# Import seed data
psql -d koola_db -f ../../seed.sql
```

3. **Configure environment**:
```bash
cd apps/api
cp .env.example .env
# Edit .env với database credentials
```

4. **Run development server**:
```bash
npm run dev
```

## 📡 API Endpoints Overview

Xem chi tiết trong `/apps/api/README.md`

### Public API (`/v1`)
- Services: List & Detail (bundled)
- Posts: List & Detail (bundled)
- Pages: Dynamic pages
- Navigation & Settings
- Forms: Contact & Newsletter
- Jobs: List & Detail

### Admin API (`/v1/admin`)
- Authentication: Login, Refresh, Logout
- CRUD operations (coming soon)

## 🗄️ Database Schema

Database schema được định nghĩa trong `db.sql`:

**Entities**: users, roles, services, posts, pages, categories, tags, deliverables, process_steps, faqs, case_studies, leads, newsletter_subscribers, job_posts, ads, media_assets, nav_items, site_settings

**Key Features**: Multi-language, content status workflow, SEO fields, relationships, timestamps

## 🔐 Authentication

JWT-based với refresh token pattern.

**Default admin** (từ seed.sql):
- Email: `admin@koola.com`
- Password: `admin123`

## 📦 Response Format

**Success**:
```json
{
  "data": { ... },
  "meta": { "page": 1, "pageSize": 10, "total": 100, "totalPages": 10 }
}
```

**Error**:
```json
{
  "error": {
    "code": "VALIDATION_ERROR|NOT_FOUND|UNAUTHORIZED|FORBIDDEN|INTERNAL",
    "message": "Error description",
    "details": { ... }
  }
}
```

## 🎯 Project Status

### ✅ Completed
- [x] Database schema design
- [x] Backend project structure
- [x] Public API endpoints
- [x] Authentication system
- [x] Docker Compose setup
- [x] Seed data for development

### 🚧 TODO
- [ ] Admin CRUD endpoints
- [ ] File upload handling
- [ ] JWT middleware & authorization
- [ ] Role-based access control
- [ ] Frontend (Next.js)
- [ ] Tests
- [ ] API documentation (Swagger)

## 🛠️ Development Guidelines

### Hard Constraints

1. **Database**: RAW SQL ONLY - NO ORM, parameterized queries, transactions
2. **Backend**: Separate Node.js service (không dùng Next.js API routes), Fastify, Zod validation
3. **Frontend**: Next.js App Router, SSG/ISR preferred, Server Components

### Code Organization
- SQL queries: `/apps/api/src/sql/`
- Zod schemas: `/apps/api/src/schemas/`
- Routes: `public/` và `admin/`
- DB helpers: `/apps/api/src/db/`

## 📚 Resources

- [Project Instructions](.github/copilot-instructions.md)
- [API Documentation](apps/api/README.md)
- [Database Schema](db.sql)
- [Sample Data](seed.sql)

---

**Built with ❤️ for KOOLA**
