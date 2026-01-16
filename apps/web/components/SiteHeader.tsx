'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { getDictionary, getLocaleLabel, getSupportedLocales } from '../src/i18n/getDictionary';
import { isLocale, type Locale } from '../src/i18n/locales';
import { Button } from './ui/Button';

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

  const switchTo = (next: string) => {
    const nextLocale = isLocale(next) ? next : 'en';
    const newParts = pathname.split('/').filter(Boolean);
    if (newParts.length === 0) return `/${nextLocale}`;
    if (isLocale(newParts[0])) newParts[0] = nextLocale;
    else newParts.unshift(nextLocale);
    return `/${newParts.join('/')}`;
  };

  const supportedLocales = getSupportedLocales();

  return (
    <header className="bg-white">
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between px-6">
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
            onChange={(e) => {
              window.location.href = switchTo(e.target.value);
            }}
          >
            {supportedLocales.map((l) => (
              <option key={l} value={l}>
                {getLocaleLabel(l, baseLocale)}
              </option>
            ))}
          </select>

          <Button href={withLocale('/contact')} variant="primary" className="h-9 px-5 text-xs">
            {dict.nav.scheduleCall}
          </Button>
        </div>
      </div>
    </header>
  );
}
