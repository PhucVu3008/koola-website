# KOOLA (AI) – GitHub Copilot Instructions (copilot-instructions.md)

You are GitHub Copilot / an AI coding agent working on the KOOLA project.
These instructions are **hard constraints**. If a request conflicts with them, explain the conflict and propose a compliant alternative.

---

## -1) Output Expectations (MUST)
When generating code or changes, produce **production-ready, copy/paste-able** output.

### What “production-ready” means
- Provide **complete implementations**, not sketches:
  - include imports, types, wiring, error handling, validation, and integration points
  - avoid “TODO” placeholders unless absolutely necessary; if used, explain exactly what is missing and why
- Follow the repository’s existing conventions (naming, folder structure, error handling patterns).
- Keep changes minimal and scoped: do not refactor unrelated code.
- If information is missing (e.g., DB schema fields), **do not guess silently**:
  - either (a) infer conservatively and clearly mark assumptions, or
  - (b) implement in a way that fails fast with explicit errors until the missing pieces are defined.

### How to present changes
- Use clear file paths (e.g., `apps/api/src/routes/v1/posts.ts`).
- For multi-file work, list files touched and what changed.
- When asked to implement a feature, follow the required workflow in Section 11.

---

## -2) Documentation & Code Comments Standard (MUST)
Write code that is easy to read for humans. Comments must help the reader understand **purpose, usage, constraints, and edge cases**.

### Commenting rules
- Use **TSDoc/JSDoc** (`/** ... */`) for all exported/public:
  - functions, classes, route handlers, DB/query functions, shared schemas
- Include in docblocks (as applicable):
  - **What it does** (1–2 lines)
  - **Inputs** (parameters and constraints)
  - **Returns** (shape + important fields)
  - **Errors** (validation errors, auth errors, not found)
  - **Side effects** (DB writes, transactions, cookies)
- Use inline comments sparingly:
  - comment “why”, not “what” (avoid narrating obvious code)
  - add inline comments only for non-obvious logic, tricky SQL, caching decisions, security constraints
- Comments should be **professional and consistent**, default to **English** (to match identifiers and broader dev norms).

### API self-documentation (recommended, not required)
- Prefer including short request/response examples in route docblocks when helpful.
- If the repo has OpenAPI docs, update them; otherwise, keep route docblocks accurate.

### SQL documentation
- For each query, add a brief comment explaining intent and expected behavior:
  - pagination/sorting rules
  - filtering rules
  - which columns are assumed indexed (if relevant)
- Always highlight security constraints: **parameterized SQL only**.

---

## 0) Project Identity (What we’re building)
KOOLA is an **AI-focused product/service marketing website** optimized for SEO, with a **Blog/Resources** content hub and an **Admin panel** to manage content.

Public pages:
- `/` Home
- `/about` About
- `/services` Services listing
- `/services/[slug]` Service Detail (AI services: deliverables, process, FAQ, proof/case studies, strong CTA)
- `/blog` Blog/Resources listing (**if the project uses `/resources`, treat `/blog` as `/resources`**)
- `/blog/[slug]` Blog post detail
- `/careers` Careers listing (optional)
- `/contact` Contact page

Global components (reused across pages):
- Header/footer navigation
- Newsletter form
- Sidebar blocks (categories, tags, read more, ads optional)

Primary goals:
- **SEO**: indexable HTML, correct metadata, structured data, sitemap/robots
- **Performance**: fast pages, minimal client JS, optimized images/fonts
- **Maintainability**: clear modules, stable response shapes, raw SQL kept in one place

---

## 1) Hard Tech Constraints (NON‑NEGOTIABLE)

### Frontend (FE)
- Framework: **Next.js (App Router)**.
- Next.js is **frontend only**: **DO NOT implement backend logic in Next.js API routes**.
- Rendering strategy:
  - Prefer **SSG/ISR** for SEO pages (services/posts) and use SSR only when needed.
  - Core content must be server-rendered (bots must see HTML).
- Use semantic HTML (`main`, `article`, `nav`, `header`, `footer`) and correct headings (**exactly one H1 per page**).
- Prefer **Server Components**; minimize `"use client"` and client-side fetching for primary content.

### Backend (BE)
- Separate Node.js service written in **TypeScript** (not Next backend).
- Framework: **Fastify** preferred (Express acceptable if explicitly requested).
- REST JSON API only.
- Validate inputs with **Zod** (preferred). Reject invalid inputs with consistent error format.
- Admin auth: **JWT + refresh tokens** (secure cookie for refresh is acceptable). Use `refresh_tokens` table.

### Database
- **PostgreSQL**.
- **RAW SQL ONLY** using `pg` driver.
- Always use parameterized queries: `$1, $2, ...` (never interpolate user input).
- **NO ORM** (Prisma/TypeORM/Sequelize/Knex ORM usage is prohibited).
- Migrations are **plain `.sql` files** (dbmate/Flyway/Liquibase style).
- Use transactions for multi-table writes.

---

## 2) Repository Structure (Recommended)
Monorepo is recommended:

- `apps/web` – Next.js frontend
- `apps/api` – Node.js TypeScript backend
- `packages/shared` – shared types/Zod schemas (optional)

If the repo differs, adapt while preserving all constraints.

---

## 3) Data Model: Source of Truth
Use our DB schema (DBML/DDL) as the single source of truth. Entities include:

Auth/Admin:
- `users`, `roles`, `user_roles`, `refresh_tokens`

Content:
- `services`
- `service_deliverables`, `service_process_steps`, `service_faqs`
- `service_related`, `service_related_posts`
- `posts`
- `post_tags`, `post_categories`, `post_related`
- `categories` (`kind`: `post|service|job`), `tags`
- `pages`, `page_sections` (optional CMS for Home/About/Careers/Contact)
- `nav_items`, `site_settings`

Ops:
- `media_assets`
- `leads`, `newsletter_subscribers`
- `ads` (optional)
- `job_posts`, `job_applications` (optional)

Rules:
- `slug` is unique per `locale` for services/posts/pages/jobs.
- Published content uses `status` + `published_at`.
- Use `timestamptz` for dates.
- Multi-table writes must use transactions.

---

## 4) API Contract (PUBLIC) – Required Endpoints

### Site chrome
- `GET /v1/site/settings?locale=en`
  - returns: site meta, global CTA, social links, and header/footer nav (or references)
- `GET /v1/nav?placement=header|footer&locale=en`

### Pages (optional CMS)
- `GET /v1/pages/:slug?locale=en`
  - returns `{ page, sections[] }` ordered by `sort_order`

### Services
- `GET /v1/services?locale=en&tag=&category=&page=1&pageSize=9&sort=order|newest`
- `GET /v1/services/:slug?locale=en`
  - MUST return a **bundled** payload:
    - `service`
    - `deliverables[]`
    - `process_steps[]`
    - `faqs[]`
    - `related_services[]`
    - `sidebar` (at minimum: `tags[]`, plus `ads[]` if enabled, `read_more_posts[]` optional)

### Blog/Posts
- `GET /v1/posts?locale=en&tag=&category=&page=1&pageSize=10&sort=newest`
- `GET /v1/posts/:slug?locale=en`
  - MUST return a **bundled** payload:
    - `post`
    - `tags[]`
    - `categories[]`
    - `related_posts[]`
    - `sidebar` (categories, tags, ads)

### Careers (optional)
- `GET /v1/jobs?locale=en`
- `GET /v1/jobs/:slug?locale=en` (only if job detail page exists)
- `POST /v1/jobs/:slug/apply` (only if apply form exists)

### Forms
- `POST /v1/leads` (contact submission)
- `POST /v1/newsletter/subscribe`
- `POST /v1/newsletter/unsubscribe` (optional)

---

## 5) API Contract (ADMIN) – Required Endpoints

### Auth
- `POST /v1/admin/auth/login`
- `POST /v1/admin/auth/refresh`
- `POST /v1/admin/auth/logout`

### CRUD
- `/v1/admin/services` (CRUD)
  - nested updates for deliverables/steps/faqs/related/related_posts
- `/v1/admin/posts` (CRUD) + taxonomy + related posts
- `/v1/admin/categories` (CRUD)
- `/v1/admin/tags` (CRUD)
- `/v1/admin/media` (upload/list/delete) + update `alt_text`
- `/v1/admin/pages` and `/v1/admin/pages/:id/sections` (if CMS enabled)
- `/v1/admin/nav-items` (CRUD)
- `/v1/admin/site-settings` (CRUD by key)
- `/v1/admin/leads` (list + patch status)
- `/v1/admin/newsletter-subscribers` (list + patch status)
- `/v1/admin/ads` (if enabled)
- `/v1/admin/jobs` and `/v1/admin/job-applications` (if enabled)
- `/v1/admin/users` + `/v1/admin/roles` (optional; required if multi-admin user management is needed)

Authorization:
- `admin` can do everything
- `editor` can manage posts/services/media but cannot manage users/roles

---

## 6) Response Shape Standard (MUST USE)
All endpoints return one of:

### Success
```json
{ "data": <payload>, "meta": { ...optional } }
```

### Error
```json
{
  "error": {
    "code": "VALIDATION_ERROR|NOT_FOUND|UNAUTHORIZED|FORBIDDEN|INTERNAL",
    "message": "...",
    "details": { ...optional }
  }
}
```

Pagination meta:
```json
{ "meta": { "page": 1, "pageSize": 10, "total": 123, "totalPages": 13 } }
```

---

## 7) SQL & Security Standards (MUST)
- Parameterized SQL only (`$1..$n`); never interpolate raw user input.
- Keep SQL in a dedicated layer:
  - `apps/api/src/db/` (pool, tx helpers)
  - `apps/api/src/sql/` (named query strings or `.sql` files)
- Use transactions for multi-table writes (e.g., create service + deliverables + faqs).
- Use strict CORS (allow only FE origin).
- Add basic rate limiting to public form endpoints (`/leads`, `/newsletter/subscribe`).
- Never expose stack traces or secrets in API responses.

---

## 8) SEO Requirements (Frontend MUST)
For every indexable page:
- Set metadata: `title`, `description`, OpenGraph/Twitter, canonical.
- Implement `app/robots.ts` and `app/sitemap.ts`.
- JSON-LD structured data:
  - Service detail: `Service`/`Product` + `FAQPage` + `BreadcrumbList`
  - Blog post: `Article` + `BreadcrumbList`
- Correct heading hierarchy (one H1; use H2/H3 for sections).
- Avoid client-only rendering for primary content.

Performance:
- Use `next/image` with correct sizes.
- Prefer Server Components, minimize `"use client"`.
- Cache/revalidate content pages via ISR when appropriate.

---

## 9) Content & Admin Editing Rules
- Content is stored as Markdown (`content_md`) unless explicitly changed.
- Sanitize/escape rendered HTML on the FE side if converting Markdown to HTML.
- Require `alt_text` for meaningful images in `media_assets`.
- Slug rules:
  - Slugs are lowercase, URL-safe, hyphenated.
  - Changing a slug must be handled carefully (optional: create a redirect table; not required for MVP).

---

## 10) Environment Variables (Suggested)
### Backend (`apps/api`)
- `DATABASE_URL=postgresql://...`
- `JWT_ACCESS_SECRET=...`
- `JWT_REFRESH_SECRET=...`
- `CORS_ORIGIN=http://localhost:3000`
- `PORT=4000`

### Frontend (`apps/web`)
- `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000`

Never hardcode secrets.

---

## 11) Required Workflow When Generating Work
Whenever asked to implement something:
1) Identify affected pages and endpoints.
2) Identify DB tables/fields required.
3) Provide raw SQL queries (and migrations if needed).
4) Implement BE route/controller with validation + consistent errors.
5) Implement FE page with SSR/SSG/ISR + SEO metadata + JSON-LD.
6) Provide short run/test instructions.

---

## 12) Prohibited Actions (Hard Prohibitions)
- Do not introduce ORMs or schema-first ORM tools.
- Do not implement backend via Next.js API routes.
- Do not write insecure SQL (no string concatenation).
- Do not change DB schema without migrations and query updates.

---

## 13) Routing Note: `/blog` vs `/resources`
If the website uses `/resources` instead of `/blog`, treat them as synonyms:
- FE routes: `/resources` and `/resources/[slug]`
- Public API may remain `/v1/posts` or be renamed consistently; if renamed, update FE and admin routes together.
