import type { MetadataRoute } from 'next';

/**
 * Robots.txt for KOOLA marketing site.
 *
 * Notes:
 * - We keep this indexable by default.
 * - Sitemap URL is derived from `NEXT_PUBLIC_SITE_URL` when present.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl.replace(/\/$/, '')}/sitemap.xml`,
  };
}
