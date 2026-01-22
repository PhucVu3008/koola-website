'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { getDictionary, getLocaleLabel, getSupportedLocales } from '../src/i18n/getDictionary';
import { isLocale, type Locale } from '../src/i18n/locales';

/**
 * Marketing site header.
 *
 * Highlights the active route (larger + brand color) to match the reference behavior.
 *
 * i18n:
 * - Paths are locale-prefixed: `/<locale>/...`.
 * - Locale switcher is data-driven from dictionaries.
 */
export function SiteHeader({ locale }: { locale: string }) {
  const pathname = usePathname() ?? '/';

  const parts = pathname.split('/').filter(Boolean);
  const fromPath = parts[0];

  const baseLocale: Locale = isLocale(fromPath) ? fromPath : (isLocale(locale) ? locale : 'en');

  const dict = getDictionary(baseLocale);

  const withLocale = (href: string) => {
    const clean = href === '/' ? '' : href;
    return `/${baseLocale}${clean}`;
  };

  const isActive = (href: string) => {
    const target = withLocale(href);
    if (target === `/${baseLocale}`) return pathname === `/${baseLocale}`;
    return pathname === target || pathname.startsWith(`${target}/`);
  };

  const linkClass = (href: string) =>
    isActive(href)
      ? 'text-sm font-semibold text-brand-700'
      : 'text-sm font-medium text-slate-700 hover:text-slate-900';

  const switchTo = async (next: string) => {
    const nextLocale = isLocale(next) ? next : 'en';
    const newParts = pathname.split('/').filter(Boolean);
    
    if (newParts.length === 0) return `/${nextLocale}`;
    
    // Check if we're on a service detail page: /[locale]/services/[slug]
    if (newParts.length >= 3 && newParts[1] === 'services') {
      const currentSlug = newParts[2];
      const currentLocale = isLocale(newParts[0]) ? newParts[0] : baseLocale;
      
      try {
        // Call API to get translated slug
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/v1/services/slug-map?from_slug=${currentSlug}&from_locale=${currentLocale}&to_locale=${nextLocale}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.data?.to_slug) {
            return `/${nextLocale}/services/${data.data.to_slug}`;
          }
        }
      } catch (error) {
        console.error('Failed to map service slug:', error);
      }
    }
    
    // Check if we're on a job detail page: /[locale]/careers/[slug]
    if (newParts.length >= 3 && newParts[1] === 'careers') {
      const currentSlug = newParts[2];
      const currentLocale = isLocale(newParts[0]) ? newParts[0] : baseLocale;
      
      try {
        // Call API to get translated job slug
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/v1/jobs/slug-map?from_slug=${currentSlug}&from_locale=${currentLocale}&to_locale=${nextLocale}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.data?.slug) {
            return `/${nextLocale}/careers/${data.data.slug}`;
          }
        }
      } catch (error) {
        console.error('Failed to map job slug:', error);
      }
    }
    
    // Default behavior: just replace locale
    if (isLocale(newParts[0])) newParts[0] = nextLocale;
    else newParts.unshift(nextLocale);
    return `/${newParts.join('/')}`;
  };

  const supportedLocales = getSupportedLocales();

  return (
    <header className="w-full bg-white">
      <div className="container flex h-16 items-center justify-between">
        <Link href={`/${baseLocale}`} className="text-base font-semibold tracking-tight text-slate-900">
          KOOLA
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-8">
          <Link href={withLocale('/')} className={linkClass('/')}>{dict.nav.home}</Link>
          <Link href={withLocale('/about')} className={linkClass('/about')}>{dict.nav.about}</Link>
          <Link href={withLocale('/services')} className={linkClass('/services')}>{dict.nav.services}</Link>
          <Link href={withLocale('/careers')} className={linkClass('/careers')}>{dict.nav.careers}</Link>
          <Link href={withLocale('/contact')} className={linkClass('/contact')}>{dict.nav.contact}</Link>
        </nav>

        <div className="flex items-center gap-4">
          <label className="sr-only" htmlFor="locale-select">
            Language
          </label>
          <select
            id="locale-select"
            className="h-9 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800"
            value={baseLocale}
            onChange={async (e) => {
              const newUrl = await switchTo(e.target.value);
              window.location.href = newUrl;
            }}
          >
            {supportedLocales.map((l) => (
              <option key={l} value={l}>
                {getLocaleLabel(l, baseLocale)}
              </option>
            ))}
          </select>

          <Link
            href={withLocale('/contact')}
            className="inline-flex h-9 items-center justify-center rounded-full bg-brand-600 px-5 text-xs font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
          >
            {dict.nav.scheduleCall}
          </Link>
        </div>
      </div>
    </header>
  );
}
