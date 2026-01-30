import { NextResponse, type NextRequest } from 'next/server';

import { isLocale, LOCALES } from './src/i18n/locales';

/**
 * Locale routing middleware.
 *
 * Behavior:
 * - Admin routes: /admin → /admin/en (or keep /admin/[locale] as-is)
 * - Public routes: / → /en, /about → /en/about (locale-prefixed)
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

  // Admin routes: handle /admin/[locale] structure
  if (pathname.startsWith('/admin')) {
    const adminMatch = pathname.match(/^\/admin(?:\/([^\/]+))?/);
    if (adminMatch) {
      const locale = adminMatch[1];
      
      // If /admin without locale, redirect to /admin/en
      if (!locale || locale === '') {
        const url = request.nextUrl.clone();
        const defaultLocale = LOCALES[0] ?? 'en';
        url.pathname = `/admin/${defaultLocale}`;
        return NextResponse.redirect(url);
      }
      
      // If /admin/[invalid-locale], redirect to /admin/en
      if (!isLocale(locale)) {
        const url = request.nextUrl.clone();
        const defaultLocale = LOCALES[0] ?? 'en';
        const rest = pathname.replace(/^\/admin\/[^\/]+/, '');
        url.pathname = `/admin/${defaultLocale}${rest}`;
        return NextResponse.redirect(url);
      }
      
      // Valid admin route, continue
      return NextResponse.next();
    }
  }

  // Public routes: existing locale logic
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
