import { NextResponse, type NextRequest } from 'next/server';

import { isLocale, LOCALES } from './src/i18n/locales';

const DEFAULT_LOCALE = 'en';

/**
 * Detect preferred locale from Accept-Language header.
 * Returns 'vi' if Vietnamese is preferred, otherwise 'en'.
 */
function detectLocale(request: NextRequest): string {
  const acceptLang = request.headers.get('accept-language');
  if (!acceptLang) return DEFAULT_LOCALE;

  // Parse Accept-Language: e.g. "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7"
  const preferred = acceptLang
    .split(',')
    .map((part) => {
      const [lang, qPart] = part.trim().split(';');
      const q = qPart ? parseFloat(qPart.replace('q=', '')) : 1;
      const code = lang.split('-')[0].toLowerCase();
      return { code, q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { code } of preferred) {
    if (isLocale(code)) return code;
  }

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
