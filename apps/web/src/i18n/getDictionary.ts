import { DICTIONARIES, type Dictionary, LOCALES, type Locale } from './generated';

export type { Dictionary, Locale };

/**
 * Returns the list of supported locale codes.
 */
export function getSupportedLocales(): Locale[] {
  return [...LOCALES];
}

/**
 * Loads the dictionary for a locale.
 *
 * Notes:
 * - Falls back to English when an unsupported locale is requested.
 */
export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES.en;
}

/**
 * Returns the localized label for a locale code.
 */
export function getLocaleLabel(targetLocale: Locale, labelLocale: Locale): string {
  const dict = getDictionary(labelLocale);
  return ((dict as any).locales?.[targetLocale] as string | undefined) ?? targetLocale.toUpperCase();
}
