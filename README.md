# KOOLA Website

<p align="center">
  <strong>CÔNG TY TNHH GIẢI PHÁP CÔNG NGHỆ QUỐC TẾ KOOLA</strong><br/>
  KOOLA International Technology Solutions Co., Ltd.
</p>

<p align="center">
  <a href="https://koola.vn">koola.vn</a> &nbsp;·&nbsp;
  <a href="mailto:info@koola.vn">info@koola.vn</a> &nbsp;·&nbsp;
  <a href="https://zalo.me/0941508468">Zalo: 0941 508 468</a>
</p>

---

## Tổng quan

Monorepo chứa toàn bộ source code của website **koola.vn** — bao gồm frontend Next.js, backend Fastify API, và cơ sở hạ tầng Docker. Website hỗ trợ **song ngữ** (Tiếng Việt / English), có **admin panel**, **AI chat** tích hợp Google Gemini, và được deploy tự động qua **GitHub Actions CI/CD**.

---

## Tech Stack

| Layer | Công nghệ |
|---|---|
| **Frontend** | Next.js 14 (App Router), Tailwind CSS, TypeScript |
| **Backend** | Fastify 4, TypeScript, Zod validation |
| **Database** | PostgreSQL 16 + pgvector (raw SQL, no ORM) |
| **AI** | Google Gemini API + pgvector embeddings (AI chat) |
| **Auth** | JWT access + refresh token, secure cookie |
| **Infra** | Docker Compose, Nginx reverse proxy, Cloudflare Tunnel |
| **CI/CD** | GitHub Actions → rsync → VPS (koola.vn) |

---

## Cấu trúc dự án

```
koola-website/
├── apps/
│   ├── api/                        # Fastify backend (Node.js + TypeScript)
│   │   └── src/
│   │       ├── controllers/        # Xử lý request/response
│   │       ├── services/           # Business logic
│   │       ├── repositories/       # Data access (raw SQL)
│   │       ├── routes/
│   │       │   ├── public/         # Public API (/v1/...)
│   │       │   └── admin/          # Admin API (/v1/admin/...) — JWT protected
│   │       ├── schemas/            # Zod validation schemas
│   │       ├── sql/                # Câu query SQL thuần
│   │       ├── middleware/         # Auth, error handling
│   │       ├── monitoring/         # Health checks, Prometheus metrics
│   │       └── db/                 # PostgreSQL connection pool
│   │
│   └── web/                        # Next.js frontend
│       ├── app/
│       │   ├── [locale]/           # Public pages (vi / en)
│       │   └── admin/[locale]/     # Admin panel
│       ├── components/             # React components (theo trang/feature)
│       └── src/lib/                # API clients, utilities, i18n
│
├── migrations/                     # SQL migration files (đánh số thứ tự)
├── nginx/                          # Nginx reverse proxy config
├── docs/                           # Tài liệu kỹ thuật
├── db.sql                          # Database schema
├── seed.sql                        # Dữ liệu mẫu
├── docker-compose.yml              # Development environment
├── docker-compose.production.yml   # Production environment
├── Dockerfile                      # API container
├── Dockerfile.web                  # Web container (build artifact)
└── .github/workflows/deploy.yml    # CI/CD pipeline
```

---

## Bắt đầu phát triển (Local với Docker)

> **Yêu cầu:** Docker Desktop, Node.js 20+, Git

### 1. Clone và cài đặt

```bash
git clone https://github.com/PhucVu3008/koola-website.git
cd koola-website
npm install
```

### 2. Khởi động môi trường development

```bash
docker compose up -d
```

Các service sẽ chạy tại:

| Service | URL |
|---|---|
| 🌐 Website | http://localhost:3000 |
| ⚡ API | http://localhost:4000 |
| 📚 API Docs (Swagger) | http://localhost:4000/api-docs |
| 🗄️ PostgreSQL | localhost:5432 |
| 🛠️ pgAdmin | http://localhost:5050 |

pgAdmin credentials: `admin@koola.local` / `admin`

### 3. Chạy migrations

```bash
# Migrations chạy tự động qua CI/CD trên production.
# Để chạy thủ công trên local:
for f in migrations/0*.sql; do
  docker exec koola-postgres psql -U koola_user -d koola_db < "$f"
done
```

### 4. Xem logs

```bash
docker compose logs -f api     # Backend logs
docker compose logs -f web     # Frontend logs
```

---

## Development Workflow

### Chạy lệnh bên trong container (Docker-first)

Mọi lệnh `npm`, build, lint đều chạy **trong container**, không phải trên máy host:

```bash
# Cài package mới cho API
docker compose exec api npm install <package>

# Cài package mới cho Web
docker compose exec web npm install <package>

# Chạy type-check cho API
docker compose exec api npx tsc --noEmit

# Xem DB
docker compose exec db psql -U koola_user -d koola_db
```

### Thêm migration mới

```bash
# Tạo file migration với số thứ tự tiếp theo
# Ví dụ: migrations/036_ten_migration.sql
```

Quy tắc viết migration:
- Dùng `IF NOT EXISTS` / `ON CONFLICT DO NOTHING` để idempotent
- Wrap nhiều bảng trong transaction (`BEGIN ... COMMIT`)
- Tên file: `NNN_mo_ta_ngan.sql` (NNN = số thứ tự 3 chữ số)

---

## Deploy (CI/CD)

> ⚠️ **KHÔNG deploy thủ công lên VPS.** Mọi thay đổi phải qua CI/CD.

### Quy trình tự động

```
git push origin main
    ↓
GitHub Actions (ubuntu-latest runner)
    ↓ build Next.js (.next/standalone)
    ↓ rsync source + artifact lên VPS
    ↓ docker compose build (COPY only, không build trên VPS)
    ↓ docker compose up -d
    ↓ chạy SQL migrations
    ↓
koola.vn (live)
```

**Monitor CI/CD:** https://github.com/PhucVu3008/koola-website/actions

### Build local để kiểm tra trước khi push

```bash
# Build frontend
npm run build --workspace=apps/web

# Build API
npm run build --workspace=apps/api
```

---

## API Reference

**Base URL (production):** `https://koola.vn/api`  
**Base URL (development):** `http://localhost:4000`  
**Swagger UI:** https://koola.vn/api-docs

### Public Endpoints (`/v1`)

| Method | Path | Mô tả |
|---|---|---|
| GET | `/v1/services` | Danh sách dịch vụ (phân trang, filter) |
| GET | `/v1/services/:slug` | Chi tiết dịch vụ + deliverables + FAQs |
| GET | `/v1/services/slug-map` | Map slug giữa các locale (i18n) |
| GET | `/v1/posts` | Danh sách bài viết |
| GET | `/v1/posts/:slug` | Chi tiết bài viết |
| GET | `/v1/pages/:slug` | CMS page theo slug |
| GET | `/v1/nav` | Navigation items |
| GET | `/v1/jobs` | Danh sách việc làm |
| GET | `/v1/jobs/:slug` | Chi tiết việc làm |
| POST | `/v1/leads` | Form liên hệ |
| POST | `/v1/newsletter/subscribe` | Đăng ký newsletter |
| POST | `/v1/chat` | AI chat (Gemini + pgvector RAG) |

### Admin Endpoints (`/v1/admin`) — Yêu cầu JWT

| Nhóm | Mô tả |
|---|---|
| Auth | Login, logout, refresh token |
| Services | CRUD dịch vụ, benefits, FAQs, related |
| Posts | CRUD bài viết, categories, tags |
| Pages & Sections | Quản lý CMS page sections |
| Jobs | CRUD tin tuyển dụng |
| Leads | Xem và quản lý leads từ form liên hệ |
| Newsletter | Danh sách subscribers |
| Media | Upload và quản lý file |
| Users | Quản lý tài khoản admin |
| Site Settings | Cài đặt toàn site |
| Nav | Quản lý menu điều hướng |

### Health & Monitoring

| Path | Mô tả |
|---|---|
| `GET /health` | Liveness check |
| `GET /health/ready` | Readiness check |
| `GET /health/full` | Báo cáo chi tiết (DB, memory, uptime) |
| `GET /metrics` | Prometheus metrics |
| `GET /metrics/db` | DB performance stats |

---

## Tính năng nổi bật

- 🌐 **Song ngữ (i18n)** — Tiếng Việt và English, URL prefix `/vi` / `/en`
- 🤖 **AI Chat** — Tích hợp Google Gemini + pgvector RAG để trả lời câu hỏi về dịch vụ
- 📝 **CMS** — Admin panel quản lý toàn bộ nội dung (pages, services, posts, jobs)
- 🔐 **Auth** — JWT access token + refresh token, admin role management
- ⚡ **SSG/ISR** — Trang SEO được prerender, API revalidate cache 5 phút
- 🔍 **SEO** — Semantic HTML, meta tags, sitemap.xml, robots.txt tự động
- 📧 **Email notifications** — Tự động gửi email khi có lead hoặc job application mới

---

## Authentication

**Mặc định admin (seed.sql):**  
Email: `admin@koola.com`  
Password: `admin123`

> ⚠️ Đổi mật khẩu ngay sau khi deploy lên production.

JWT flow:
1. POST `/v1/admin/auth/login` → nhận `accessToken` + `refreshToken`
2. Gửi `Authorization: Bearer <accessToken>` trong mọi request admin
3. Khi token hết hạn, POST `/v1/admin/auth/refresh` để lấy token mới

---

## Environment Variables

### API (`apps/api/.env`)

```env
DATABASE_URL=postgresql://koola_user:koola_password@localhost:5432/koola_db
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
CORS_ORIGINS=http://localhost:3000
GEMINI_API_KEY=your-gemini-api-key
PORT=4000
```

### Web (`apps/web/.env.local`)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
API_BASE_URL_SERVER=http://api:4000
```

> Xem `.env.example` trong từng app để biết đầy đủ các biến.

---

## Database

- **Engine:** PostgreSQL 16 với extension **pgvector** (cho AI embeddings)
- **Schema:** [`db.sql`](db.sql) — toàn bộ cấu trúc bảng
- **Migrations:** Thư mục [`migrations/`](migrations/) — file SQL đánh số thứ tự
- **Seed data:** [`seed.sql`](seed.sql) — dữ liệu mẫu cho development
- **Nguyên tắc:** Raw SQL thuần (`pg` driver), **không dùng ORM**, parameterized queries bắt buộc

---

## Tài liệu kỹ thuật

- [Cloudflare Tunnel Setup](docs/2026-03-05_CLOUDFLARE_TUNNEL_SETUP.md)
- [cPanel Deploy Guide](docs/2026-03-05_CPANEL_DEPLOY_GUIDE.md)
- [Swagger API Docs](https://koola.vn/api-docs)
- [GitHub Actions](https://github.com/PhucVu3008/koola-website/actions)

---

## Liên hệ

**KOOLA International Technology Solutions Co., Ltd.**  
📧 info@koola.vn  
📞 0941 508 468  
💬 [Zalo](https://zalo.me/0941508468)

