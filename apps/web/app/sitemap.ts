import type { MetadataRoute } from 'next';

import { getServices } from '../src/lib/api/services';
import { getSupportedLocales } from '../src/i18n/getDictionary';

/**
 * Sitemap generator.
 *
 * Notes:
 * - Includes core static pages for each locale.
 * - Includes service detail pages for each locale using the public API.
 * - Base URL is derived from `NEXT_PUBLIC_SITE_URL` (fallback: localhost).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
  const locales = getSupportedLocales();

  const servicesPerLocale = await Promise.all(
    locales.map((locale) => getServices({ locale, page: 1, pageSize: 100, sort: 'order' }))
  );

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    { url: `${baseUrl}/${locale}`, lastModified: now },
    { url: `${baseUrl}/${locale}/about`, lastModified: now },
    { url: `${baseUrl}/${locale}/services`, lastModified: now },
    { url: `${baseUrl}/${locale}/contact`, lastModified: now },
  ]);

  const dynamicServiceEntries: MetadataRoute.Sitemap = servicesPerLocale.flatMap((services, idx) => {
    const locale = locales[idx];
    return services.items.map((s) => ({ url: `${baseUrl}/${locale}/services/${s.slug}`, lastModified: now }));
  });

  return [...staticEntries, ...dynamicServiceEntries];
}
