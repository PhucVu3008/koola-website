import { NextResponse, type NextRequest } from 'next/server';

import { isLocale, LOCALES } from './src/i18n/locales';

const DEFAULT_LOCALE = 'vi';

/** Always returns the default locale (vi). */
function detectLocale(_request: NextRequest): string {
  return DEFAULT_LOCALE;
}

/**
 * Locale routing middleware.
 *
 * Behavior:
 * - Detects user's preferred language from browser Accept-Language header
 * - Admin routes: /admin → /admin/{detected}
 * - Public routes: / → /{detected}, /about → /{detected}/about
 * - Keeps SEO-friendly, indexable locale paths: `/<locale>`.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore Next internals and static files.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api-docs') ||
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

      // If /admin without locale, redirect to /admin/{detected}
      if (!locale || locale === '') {
        const url = request.nextUrl.clone();
        url.pathname = `/admin/${detectLocale(request)}`;
        return NextResponse.redirect(url);
      }

      // If /admin/[invalid-locale], redirect to /admin/{detected}
      if (!isLocale(locale)) {
        const url = request.nextUrl.clone();
        const rest = pathname.replace(/^\/admin\/[^\/]+/, '');
        url.pathname = `/admin/${detectLocale(request)}${rest}`;
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
  url.pathname = `/${detectLocale(request)}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/|_vercel/|assets/|uploads/|.*\\..*).*)'],
};
