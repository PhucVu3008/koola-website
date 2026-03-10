# KOOLA Web Frontend

Next.js 14 (App Router) frontend cho KOOLA website — i18n, SSR, Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **i18n**: English (`/en`) + Vietnamese (`/vi`)
- **Rendering**: SSR (force-dynamic)
- **Admin**: Full CMS admin panel

## Pages

### Public (`/[locale]/...`)

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/about` | About page (CMS-backed) |
| `/services` | Services listing |
| `/services/[slug]` | Service detail |
| `/careers` | Careers page |
| `/careers/[slug]` | Job detail |
| `/contact` | Contact form |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/cookies` | Cookie policy |

### Admin (`/admin/[locale]/...`)

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard |
| `/admin/login` | Login |
| `/admin/services` | Service CRUD |
| `/admin/posts` | Post CRUD |
| `/admin/categories` | Category management |
| `/admin/tags` | Tag management |
| `/admin/pages` | Page + sections management |
| `/admin/navigation` | Nav items |
| `/admin/settings` | Site settings |
| `/admin/jobs` | Job management |
| `/admin/leads` | Lead management |
| `/admin/newsletter` | Newsletter subscribers |
| `/admin/users` | User management |

## Data Sources

- Server-side API: `API_BASE_URL_SERVER` (Docker: `http://api:4000`)
- Client-side API: `NEXT_PUBLIC_API_BASE_URL` (Production: `https://koola.vn/api`)

## Development

```bash
npm run dev          # Dev server (http://localhost:3000)
npm run build        # Production build
npm start            # Start production server
```

## Middleware

`middleware.ts` handles:
- Locale detection from `Accept-Language` header
- Redirect to locale-prefixed routes (`/` → `/en` or `/vi`)
- Bypass for static assets, `/_next`, `/api-docs`, `/admin`
