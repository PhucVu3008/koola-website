# CLAUDE.md — Project Instructions

## Project Overview
KOOLA website — monorepo with Next.js frontend (`apps/web`) and Fastify API (`apps/api`).
- Stack: TypeScript, Next.js App Router, Fastify, PostgreSQL (pgvector), Google Gemini AI
- Deployment: Docker Compose, Cloudflare Tunnel
- Bilingual: Vietnamese (default) and English
- Docker-first workflow — all commands run inside containers, not on host

## Hard Tech Constraints (NON-NEGOTIABLE)

### Frontend
- Framework: Next.js (App Router) — frontend ONLY, no backend logic in API routes
- Prefer SSG/ISR for SEO pages, SSR only when needed
- Prefer Server Components; minimize `"use client"` and client-side fetching for primary content
- Semantic HTML (`main`, `article`, `nav`, `header`, `footer`), exactly one H1 per page

### Backend
- Separate Node.js service in TypeScript — NOT Next.js backend
- Framework: Fastify
- REST JSON API only
- Validate inputs with Zod

### Database
- PostgreSQL with raw SQL only (`pg` driver)
- Parameterized queries (`$1, $2, ...`) — NEVER interpolate user input
- NO ORM (Prisma/TypeORM/Sequelize/Knex prohibited)
- Migrations: plain `.sql` files, numbered sequentially
- Transactions for multi-table writes

### Prohibited Actions
- Do not introduce ORMs
- Do not implement backend via Next.js API routes
- Do not write insecure SQL (no string concatenation)
- Do not change DB schema without migrations and query updates

## Architecture

### Layered Separation
- Backend: Controllers → Services → Repositories → SQL (business logic never in controllers)
- Frontend: UI Components → Hooks/Logic → API integration (business logic never in components)
- SQL queries live in `src/sql/` directory, not inline in services or repositories

### API Response Shape (MUST USE)
```
Success: { "data": <payload>, "meta": { ...optional } }
Error:   { "error": { "code": "VALIDATION_ERROR|NOT_FOUND|...", "message": "...", "details": {} } }
Pagination: { "meta": { "page": 1, "pageSize": 10, "total": 123, "totalPages": 13 } }
```

### Error Handling in Controllers
- Wrap `.parse()` in try-catch, check `error.name === 'ZodError'`
- Return `errorResponse()` with `issues` and `requiredFields`
- Never expose stack traces or secrets in API responses
- User-facing errors: clear and friendly, in user's language
- Developer-facing errors: include sufficient context for debugging

## Code Principles

### No Hardcoding
- Never hardcode: text content, API endpoints, business rules, roles, permissions, config values
- Use environment variables, database settings, or shared constants
- If a value appears in more than one place, extract to a single source of truth
- Never hardcode secrets

### Clean & Professional Code
- Write clean, readable code — meaningful names, no unnecessary abbreviations
- Keep functions small and focused — single responsibility
- Remove dead code, unused imports, and debug console.logs before committing
- Use early returns to reduce nesting
- Prefer `const` over `let`, never use `var`
- Optimize for readability over brevity

### Documentation & Comments
- Use TSDoc/JSDoc (`/** ... */`) for all exported functions, classes, route handlers, schemas
- Include: what it does, inputs, returns, errors, side effects
- Inline comments: explain "why", not "what" — only for non-obvious logic
- SQL queries: brief comment explaining intent, pagination/sorting/filtering rules
- Comments in English (to match identifiers)

### Reusability & DRY
- Extract repeated logic into shared utilities or helper functions
- Use generics and interfaces for type-safe reusable code
- Shared types go in dedicated type files, not inline
- If a pattern appears 3+ times, abstract it
- Avoid god components and god services

### Performance
- Frontend: code splitting, lazy loading, optimize rendering, avoid unnecessary assets
- Backend: avoid redundant/expensive queries, use caching, no heavy sync processing in handlers
- Use database-level filtering (WHERE clauses) instead of fetching all and filtering in JS
- Set timeouts on all external API calls

### Security
- Validate input on both frontend and backend — never trust client-side data
- Parameterized SQL only
- Strict CORS (allow only FE origin)
- Rate limiting on public form endpoints
- Never expose internal errors, stack traces, or system details to clients

### TypeScript
- Strict typing — avoid `any`, use proper interfaces/types
- Export types from dedicated files for reuse
- Use discriminated unions over optional fields when modeling state

### SEO & Accessibility
- Semantic HTML, proper heading hierarchy (h1–h6)
- Meaningful meta titles and descriptions
- Clean, structured URLs
- Keyboard navigation, alt text for images, ARIA attributes where needed

## i18n — Multilingual Content

### Slug Mapping Pattern
- Use `slug_group` column to link content across locales
- English slug = `slug_group` identifier
- Each content type needs a slug-map API endpoint for locale switching
- Applies to: services, posts, pages, jobs

## Project Structure
- `apps/web/` — Next.js frontend (App Router, i18n with `[locale]` prefix)
- `apps/api/` — Fastify backend (controllers → services → repositories → SQL)
- `migrations/` — PostgreSQL migrations (numbered `.sql` files)
- `seed.sql` — Database seed data

## Conventions
- API routes: `/v1/{resource}` prefix
- Components: PascalCase files, one component per file
- SQL: Raw queries in `src/sql/` directory
- i18n: Dictionary files in `src/i18n/dictionaries/{locale}.json`
- Commits: Conventional commits (feat:, fix:, refactor:, docs:, chore:)
- Docker: all run/test/build commands via `docker-compose exec`

## When Making Changes
- Read existing code before modifying — understand the pattern first
- Follow existing project patterns and conventions
- Don't refactor unrelated code in the same change
- Produce complete implementations, not sketches — include imports, types, error handling
- If information is missing, infer conservatively and mark assumptions, or fail fast
- Keep PRs focused — one concern per commit
