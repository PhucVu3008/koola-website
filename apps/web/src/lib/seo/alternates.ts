import { getSupportedLocales } from '../../i18n/getDictionary';

const DEFAULT_LOCALE = 'vi';

/**
 * Generates `alternates` metadata for a page:
 * - `canonical`  → the current locale's URL
 * - `languages`  → one entry per supported locale + `x-default` (default locale)
 *
 * @param locale   Current locale (e.g. "vi", "en")
 * @param pagePath Path after the locale segment, must start with "/" (e.g. "/about", "/blog")
 *                 Use "" or "/" for the locale home page.
 * @param baseUrl  Full origin, e.g. "https://koola.vn"
 */
export function generatePageAlternates(locale: string, pagePath: string, baseUrl: string) {
  const locales = getSupportedLocales();
  const base = baseUrl.replace(/\/$/, '');
  const path = pagePath === '/' ? '' : pagePath.startsWith('/') ? pagePath : `/${pagePath}`;

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${base}/${l}${path}`;
  }
  languages['x-default'] = `${base}/${DEFAULT_LOCALE}${path}`;

  return {
    canonical: `${base}/${locale}${path}`,
    languages,
  };
}
