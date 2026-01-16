import { NextResponse, type NextRequest } from 'next/server';

import { isLocale, LOCALES } from './src/i18n/locales';

/**
 * Locale routing middleware.
 *
 * Behavior:
 * - If the URL is missing a locale prefix, redirect to the default locale.
 * - Keeps SEO-friendly, indexable locale paths: `/<locale>`.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore Next internals and static files.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots') ||
    pathname.startsWith('/sitemap') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];

  if (first && isLocale(first)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const defaultLocale = LOCALES[0] ?? 'en';
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next).*)'],
};
