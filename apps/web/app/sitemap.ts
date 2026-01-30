import type { MetadataRoute } from 'next';

import { getServices } from '../src/lib/api/services';
import { getSupportedLocales } from '../src/i18n/getDictionary';

/**
 * Sitemap generator.
 *
 * Notes:
 * - Includes all static pages for each locale
 * - Includes dynamic pages: services, jobs
 * - Base URL is derived from `NEXT_PUBLIC_SITE_URL` (fallback: localhost)
 * 
 * Pages included:
 * - Home, About, Services, Careers, Contact
 * - Service detail pages
 * - Job detail pages
 * - Legal pages (Terms, Privacy, Cookies)
 */

/**
 * Fetch jobs from API
 */
async function getJobs(locale: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  try {
    const res = await fetch(`${baseUrl}/v1/jobs?locale=${locale}&page=1&pageSize=100`, {
      next: { revalidate: 300 },
    });
    
    if (!res.ok) return { items: [] };
    
    const json = await res.json();
    return json.data || { items: [] };
  } catch {
    return { items: [] };
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
  const locales = getSupportedLocales();

  // Fetch data in parallel
  const [servicesPerLocale, jobsPerLocale] = await Promise.all([
    Promise.all(locales.map((locale) => getServices({ locale, page: 1, pageSize: 100, sort: 'order' }))),
    Promise.all(locales.map((locale) => getJobs(locale))),
  ]);

  const now = new Date();

  // Static pages for each locale
  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    { url: `${baseUrl}/${locale}`, lastModified: now, priority: 1.0 },
    { url: `${baseUrl}/${locale}/about`, lastModified: now, priority: 0.8 },
    { url: `${baseUrl}/${locale}/services`, lastModified: now, priority: 0.9 },
    { url: `${baseUrl}/${locale}/careers`, lastModified: now, priority: 0.8 },
    { url: `${baseUrl}/${locale}/contact`, lastModified: now, priority: 0.7 },
    { url: `${baseUrl}/${locale}/terms`, lastModified: now, priority: 0.3 },
    { url: `${baseUrl}/${locale}/privacy`, lastModified: now, priority: 0.3 },
    { url: `${baseUrl}/${locale}/cookies`, lastModified: now, priority: 0.3 },
  ]);

  // Dynamic service pages
  const dynamicServiceEntries: MetadataRoute.Sitemap = servicesPerLocale.flatMap((services, idx) => {
    const locale = locales[idx];
    return services.items.map((s) => ({ 
      url: `${baseUrl}/${locale}/services/${s.slug}`, 
      lastModified: now,
      priority: 0.8,
    }));
  });

  // Dynamic job pages
  const dynamicJobEntries: MetadataRoute.Sitemap = jobsPerLocale.flatMap((jobs, idx) => {
    const locale = locales[idx];
    if (!jobs.items) return [];
    return jobs.items.map((job: any) => ({ 
      url: `${baseUrl}/${locale}/careers/${job.slug}`, 
      lastModified: now,
      priority: 0.7,
    }));
  });

  return [...staticEntries, ...dynamicServiceEntries, ...dynamicJobEntries];
}
