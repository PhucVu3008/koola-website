import type { MetadataRoute } from 'next';

/**
 * Robots.txt for KOOLA marketing site.
 *
 * Notes:
 * - We keep this indexable by default.
 * - Sitemap URL is derived from `NEXT_PUBLIC_SITE_URL` when present.
 * - Admin and API routes are disallowed from indexing.
 * - "Content-Signal" directive has been removed — it is not a standard
 *   robots.txt directive and causes validation errors in Google Search Console.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://koola.vn';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Block admin, API, and internal paths from indexing
        disallow: ['/admin/', '/api/', '/_next/'],
      },
    ],
    sitemap: `${baseUrl.replace(/\/$/, '')}/sitemap.xml`,
  };
}
