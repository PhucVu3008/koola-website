# @koola/web

Next.js (App Router) frontend for KOOLA marketing website.

## Data sources
- Public API base: `NEXT_PUBLIC_API_BASE_URL`
  - Docker Compose sets it to `http://api:4000` for container-to-container calls.

## Local development (Docker-first)
- Start everything:
  - `docker-compose up -d`
- Open:
  - Web: http://localhost:3000
  - API: http://localhost:4000/health

## Notes
- Primary pages:
  - `/` (Home)
  - `/about` (CMS-backed via `GET /v1/pages/about`)
  - `/services`
  - `/services/[slug]`
  - `/contact` (posts to `POST /v1/leads`)
