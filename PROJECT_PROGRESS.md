# KOOLA Website – Tiến độ chung

## 1) Mục tiêu dự án (MVP)
Website marketing cho KOOLA (AI) tối ưu SEO + hiệu năng, có quản trị nội dung qua Admin API.

Phạm vi MVP tập trung:
- Các trang public, indexable:
  - `/` Home
  - `/about` (CMS page: `/v1/pages/about` hoặc page tĩnh tuỳ quyết định FE)
  - `/services` và `/services/[slug]`
  - `/contact` (lead capture)
- Site chrome:
  - Header/Footer nav
  - Global site settings (meta/CTA/social)
- Analytics bắt buộc:
  - GA4 qua GTM
  - Track: `page_view`, CTA clicks (“Contact”, “Get Started”), form submission success

Ghi chú phạm vi:
- Blog/Resources và Careers là **tuỳ chọn** (chỉ làm nếu thật sự cần).

---

## 2) Tiến độ đã hoàn thiện (Done)

### 2.1 Backend (API – Fastify + TypeScript)
- Chuẩn hoá response envelope:
  - Success: `{ data, meta? }`
  - Error: `{ error: { code, message, details? } }`
- Raw SQL + PostgreSQL (parameterized), tách lớp rõ ràng (routes/controllers/services/repositories/sql).
- Public API (đã verify với seed data):
  - `GET /v1/site/settings`
  - `GET /v1/nav`
  - `GET /v1/services` + `GET /v1/services/:slug` (bundled payload)
  - `GET /v1/posts` + `GET /v1/posts/:slug` (bundled payload)
  - `GET /v1/pages/:slug` (đã seed page `about` + sections)
  - `GET /v1/jobs` (nếu bật phần careers)
- Admin API (đã implement + manual test):
  - `/v1/admin/nav-items` CRUD
  - `/v1/admin/site-settings` CRUD (upsert)
  - `/v1/admin/pages` CRUD + `/v1/admin/pages/:id/sections` CRUD
- Auth nền tảng (JWT + roles) theo kiến trúc có sẵn của repo.

### 2.2 Docker-first workflow
- Thiết lập và vận hành theo `docker-compose`.
- Có DB test riêng (`postgres_test`) và runner test (`api-test`).

### 2.3 Automated Integration Tests
- Vitest integration tests chạy bằng Fastify `inject()`.
- Luồng test cơ bản đã green:
  - Health
  - Admin nav-items
  - Admin site-settings
  - Admin pages + sections

### 2.4 Seed dữ liệu & manual verification
- `seed.sql` đã bổ sung page `about` + `page_sections` để public endpoint trả 200 thực tế.
- `apps/api/tests/api.http` có block request kiểm tra contract các endpoint (smoke + edge-cases cơ bản).

---

## 3) Việc đang làm / vừa ổn định (In progress → Stabilized)
- Hardening cho production:
  - CORS allowlist/kiểm soát origin.
  - Error handling: map Zod/AppError/JWT/CORS theo contract; tránh leak lỗi nhạy cảm khi production.
  - Rate limiting cho admin auth endpoints (và định hướng tương tự với form endpoints).
- Đã xử lý regression test liên quan pages sections và ổn định lại suite.

---

## 4) Các bước tiếp theo (Next) – đến khi “hoàn thiện dự án”

### 4.1 Hoàn thiện Backend cho production (ưu tiên cao)
- Chuẩn hoá đầy đủ env requirements cho production:
  - Bắt buộc đủ secrets JWT (access + refresh), cookie flags (nếu dùng refresh cookie).
- Rà soát security tối thiểu:
  - CORS strict theo domain FE.
  - Rate limit cho public form endpoints (leads/newsletter).
  - Không log/không trả về thông tin nhạy cảm.
- Bổ sung vài integration tests quan trọng (nếu cần) cho public endpoints (services/posts/pages/site/nav) để tránh regress.
- Viết “runbook” ngắn:
  - cách start stack docker, seed, migrate (nếu có), run tests.

### 4.2 Frontend (Next.js App Router) – SEO-first
- Tạo layout + pages chính (Home/About/Services/Service detail/Contact).
- Data fetching server-side (SSG/ISR ưu tiên), đảm bảo HTML indexable.
- SEO đầy đủ:
  - Metadata, canonical
  - `sitemap.ts`, `robots.ts`
  - JSON-LD (Service/FAQ/Breadcrumb)
- UI/UX:
  - semantic HTML, đúng heading (1 H1/page), tối ưu performance.

### 4.3 Analytics (GA4 via GTM)
- Tích hợp GTM container (FE).
- Event tracking tối thiểu:
  - page_view
  - CTA click
  - lead submit success

### 4.4 Nội dung & vận hành
- Chuẩn hoá nội dung service detail (deliverables/process/faqs) để FE hiển thị mạnh CTA.
- Nếu không làm blog: ẩn/loại khỏi navigation và sitemap.

---

## 5) Definition of Done (mốc “hoàn thiện”)
Dự án được xem là hoàn thiện khi:
- Backend chạy ổn định trong Docker, có cấu hình production an toàn (CORS, secrets, error handling) và test green.
- Frontend Next.js render SEO đúng chuẩn, có sitemap/robots/metadata/JSON-LD, tải nhanh.
- Contact form hoạt động end-to-end (FE → `/v1/leads`), có basic rate limit.
- Analytics GA4 qua GTM hoạt động và ghi nhận các event tối thiểu.
